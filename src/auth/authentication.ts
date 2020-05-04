import crypto from "crypto";
import _ from "lodash";

import { AuthFailureError, NotFoundError, TokenExpiredError } from "../core/ApiError";
import JWT, { JwtPayload } from "../core/JWT";
import Keystore from "../database/model/Keystore";
import Role from "../database/model/Role";
import User from "../database/model/User";
import KeystoreRepo from "../database/repository/KeystoreRepo";
import UserRepo from "../database/repository/UserRepo";
import { createTokens, validateTokenData } from "./authUtils";

const allowedRoles = {
	ADMIN: ["ADMIN"],
	USER: ["USER"],
	USER_UNAUTH: ["USER", "USER_UNAUTH"],
	REVIWER: ["USER", "USER_UNAUTH"]
};

export const ruleStrategy = async (
	requestData: {
		req: {
			cookies?: {
				"refresh-token"?: string;
				"access-token"?: string;
			};
		};
		res: {
			cookie: Function;
		};
		user: User;
		keystore: Keystore;
	},
	role: string
): Promise<void> => {
	const accessToken = requestData.req.cookies["access-token"];
	const refreshToken = requestData.req.cookies["refresh-token"];
	if (!accessToken || !refreshToken) throw new AuthFailureError("Not Authorized");

	let accessTokenPayload: JwtPayload;
	let refreshTokenPayload: JwtPayload;
	let keystore: Keystore;

	try {
		accessTokenPayload = await JWT.validate(accessToken);
	} catch (err) {
		console.log(err);
		if (err instanceof TokenExpiredError) {
			accessTokenPayload = await JWT.decode(accessToken);
			refreshTokenPayload = await JWT.validate(refreshToken);
		} else {
			throw new AuthFailureError();
		}
	}

	if (refreshTokenPayload && accessTokenPayload.sub != refreshTokenPayload.sub)
		throw new AuthFailureError();

	validateTokenData(accessTokenPayload);
	const user = await UserRepo.findById(accessTokenPayload.sub, ["roles"]);
	if (!user) throw new NotFoundError("User not found");

	const givenRoles = (user.roles as Role[]).map((role) => role.code);
	const userWithRole = _.intersection(givenRoles, allowedRoles[role]);
	if (!userWithRole.length) throw new AuthFailureError("Role not authorized");

	if (refreshTokenPayload) {
		const refreshTokenTime = new Date(refreshTokenPayload.exp * 1000);
		const userUpdatedTime = new Date(user.updatedAt);
		if (refreshTokenTime.getTime() < userUpdatedTime.getTime()) throw new TokenExpiredError();

		keystore = await KeystoreRepo.find(user._id, accessTokenPayload.prm, refreshTokenPayload.prm);
		if (!keystore) throw new AuthFailureError();

		const accessTokenKey = crypto.randomBytes(64).toString("hex");
		const refreshTokenKey = crypto.randomBytes(64).toString("hex");
		await KeystoreRepo.create(user._id, accessTokenKey, refreshTokenKey);
		const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);
		requestData.res.cookie("refresh-token", tokens.refreshToken, {
			maxAge: accessTokenPayload.exp
		});
		requestData.res.cookie("access-token", tokens.accessToken, {
			maxAge: refreshTokenPayload.exp
		});
	} else {
		keystore = await KeystoreRepo.findForKey(user._id, accessTokenPayload.prm);
		if (!keystore) throw new AuthFailureError("Invalid access token");
	}

	requestData.user = user;
	requestData.keystore = keystore;
};
