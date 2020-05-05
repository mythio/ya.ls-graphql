import { readFile } from "fs";
import { sign, verify } from "jsonwebtoken";
import { promisify } from "util";

import { BadTokenError, InternalError, TokenExpiredError } from "./ApiError";
import { tokenConfig } from "./config";

export default class JWT {
	private static readPublicKey(): Promise<string> {
		return promisify(readFile)("keys/jwtRS256.key.pub", "utf8");
	}

	private static readPrivateKey(): Promise<string> {
		return promisify(readFile)("keys/jwtRS256.key", "utf8");
	}

	public static async encode(payload: JwtPayload): Promise<string> {
		const cert = await this.readPrivateKey();
		if (!cert) throw new InternalError("Token generation failed");
		return new Promise((resolve, reject) => {
			try {
				const res = sign({ ...payload }, cert, { algorithm: "RS256" });
				resolve(res);
			} catch (err) {
				reject(err);
			}
		});
	}

	public static async validate(token: string): Promise<JwtPayload> {
		const cert = await this.readPublicKey();
		return new Promise(async (resolve, reject) => {
			try {
				const res = verify(token, cert) as JwtPayload;
				resolve(res);
			} catch (err) {
				if (err && err.name === "TokenExpiredError") throw new TokenExpiredError();
				reject(new BadTokenError());
			}
		});
	}

	public static async decode(token: string): Promise<JwtPayload> {
		const cert = await this.readPublicKey();

		return new Promise(async (resolve, reject) => {
			try {
				const res = verify(token, cert, { ignoreExpiration: true }) as JwtPayload;
				resolve(res);
			} catch (err) {
				reject(new BadTokenError());
			}
		});
	}
}

export class JwtPayload {
	aud: string;
	sub: string;
	iss: string;
	iat: number;
	exp: number;
	prm: string;

	constructor(issuer: string, audience: string, subject: string, param: string, validity: number) {
		this.iss = issuer;
		this.aud = audience;
		this.sub = subject;
		this.iat = Math.floor(Date.now() / 1000);
		this.exp = this.iat + validity * 24 * 60 * 60;
		this.prm = param;
	}
}
