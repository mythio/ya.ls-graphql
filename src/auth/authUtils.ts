import _ from "lodash";
import { Types } from "mongoose";

import { AuthFailureError, InternalError } from "../core/ApiError";
import { tokenConfig } from "../core/config";
import JWT, { JwtPayload } from "../core/JWT";
import User from "../database/model/User";
import { ITokens } from "../types/schemaType";

export const validateTokenData = (payload: JwtPayload): boolean => {
	if (
		!payload ||
		!payload.iss ||
		!payload.sub ||
		!payload.aud ||
		!payload.prm ||
		payload.iss !== tokenConfig.issuer ||
		payload.aud !== tokenConfig.audience ||
		!Types.ObjectId.isValid(payload.sub)
	)
		throw new AuthFailureError("Invalid Access Token");
	return true;
};

export const createTokens = async (
	user: User,
	accessTokenKey: string,
	refreshTokenKey: string
): Promise<ITokens> => {
	const accessToken = await JWT.encode(
		new JwtPayload(
			tokenConfig.issuer,
			tokenConfig.audience,
			user._id.toString(),
			accessTokenKey,
			tokenConfig.accessTokenValidityDays
		)
	);

	const refreshToken = await JWT.encode(
		new JwtPayload(
			tokenConfig.issuer,
			tokenConfig.audience,
			user._id.toString(),
			refreshTokenKey,
			tokenConfig.refreshTokenValidityDays
		)
	);

	if (!accessToken || !refreshToken) throw new InternalError();

	return {
		accessToken: accessToken,
		refreshToken: refreshToken
	};
};
