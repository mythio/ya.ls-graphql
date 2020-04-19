import { readFile } from 'fs';
import { promisify } from "util";
import { sign, verify } from "jsonwebtoken";
import logger from "./Logger";

export default class JWT {
  private static readPublicKey(): Promise<string> {
    return promisify(readFile)('keys/public.pem', 'utf8');
  }

  private static readPrivateKey(): Promise<string> {
    return promisify(readFile)('keys/private.pem', 'utf8');
  }

  public static async encode(payload: JwtPayload): Promise<string> {
    const cert = await this.readPrivateKey();
    if (!cert)
      throw new Error('Token generation failed');
    // @ts-ignore
    return promisify(sign)({ ...payload }, cert, { algorithm: 'RS256' });
  }

  public static async validate(token: string): Promise<JwtPayload> {
    const cert = await this.readPublicKey();
    try {
      // @ts-ignore
      return await promisify(verify)(token, cert) as JwtPayload;
    } catch (err) {
      logger.debug(err);
      if (err && err.name === 'TokenExpiredError') throw new Error('token expired');
      throw new Error('bad token');
    }
  }

  public static async decode(token: string): Promise<JwtPayload> {
    const cert = await this.readPublicKey();
    try {
      // @ts-ignore
      return await promisify(verify)(token, cert, { ignoreExpiration: true }) as JwtPayload;
    } catch (e) {
      logger.debug(e);
      throw new Error('bad token');
    }
  }
}

export class JwtPayload {
  audience: string;
  subject: string;
  issuer: string;
  inAt: number;
  expiry: number;
  param: string;

  constructor(issuer: string, audience: string, subject: string, param: string, validity: number) {
    this.issuer = issuer;
    this.audience = audience;
    this.subject = subject;
    this.inAt = Math.floor(Date.now() / 1000);
    this.expiry = this.inAt + (validity * 24 * 60 * 60);
    this.param = param;
  }
}