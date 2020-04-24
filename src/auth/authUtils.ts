import { Types } from "mongoose";
import { ObjectID } from 'mongodb';
import crypto from "crypto";

import { tokenConfig } from '../core/config';
import { ITokens } from '../graphql/schemaType';
import JWT, { JwtPayload } from "../core/JWT";
import User from "../database/model/User";
import Keystore from '../database/model/Keystore';
import UserRepo from '../database/repository/UserRepo';
import KeystoreRepo from '../database/repository/KeystoreRepo';
import logger from "../core/Logger";
import { AuthFailureError, InternalError, NotFoundError, TokenExpiredError } from "../core/ApiError";
import Role from '../database/model/Role';
import _ from "lodash";

const allowedRoles = {
	ADMIN: ['ADMIN'],
	USER: ['USER'],
	USER_UNAUTH: ['USER', 'USER_UNAUTH'],
	REVIWER: ['USER', 'USER_UNAUTH']
}

export const getAccessToken = (authorization: string) => {
	if (!authorization) return undefined;
	if (!authorization.startsWith('Bearer ')) throw new AuthFailureError('Invalid authorization');
	return authorization.split(' ')[1];
};

export const createTokens = async (user: User, accessTokenKey: string, refreshTokenKey: string): Promise<ITokens> => {
	const accessToken = await JWT.encode(
		new JwtPayload(
			tokenConfig.issuer,
			tokenConfig.audience,
			user._id.toString(),
			accessTokenKey,
			tokenConfig.accessTokenValidityDays,
		)
	);

	const refreshToken = await JWT.encode(
		new JwtPayload(
			tokenConfig.issuer,
			tokenConfig.audience,
			user._id.toString(),
			refreshTokenKey,
			tokenConfig.refreshTokenValidityDays,
		)
	)

	if (!accessToken || !refreshToken) throw new InternalError()

	return {
		accessToken: accessToken,
		refreshToken: refreshToken
	}
}

export const ruleStrategy = async (
	requestData: {
		req: {
			cookies: {
				'refresh-token': string;
				'access-token': string;
			};
		}
		res: any;
		user: User;
		keystore: Keystore;
	},
	role: string
): Promise<void> => {
	const accessToken = requestData.req.cookies['access-token'];
	const refreshToken = requestData.req.cookies['refresh-token'];

	if (!accessToken || !refreshToken)
		throw new AuthFailureError('Not Authorized');

	let accessTokenPayload: JwtPayload;
	let refreshTokenPayload: JwtPayload;
	let keystore: Keystore;

	try {
		accessTokenPayload = await JWT.validate(accessToken);
	} catch (err) {
		logger.info(err);
		if (err instanceof TokenExpiredError) {
			accessTokenPayload = await JWT.decode(accessToken);
			refreshTokenPayload = await JWT.validate(refreshToken);
		}
	}

	if (refreshTokenPayload && accessTokenPayload.sub !== refreshTokenPayload.sub)
		throw new AuthFailureError('Invalid access token');

	validateTokenData(accessTokenPayload);

	const user = await UserRepo.findById(new ObjectID(accessTokenPayload.sub));
	if (!user) throw new NotFoundError('user not found');

	const givenRoles = (user.roles as Role[]).map(role => role.code);

	const userWithRole = _.intersection(givenRoles, allowedRoles[role]);
	if (!userWithRole) throw new AuthFailureError('Role not authorized');

	if (refreshTokenPayload) {
		const refreshTokenTime = new Date(refreshTokenPayload.exp * 1000);
		const userUpdatedTime = new Date(user.updatedAt)

		if (refreshTokenTime.getTime() < userUpdatedTime.getTime())
			throw new TokenExpiredError();

		keystore = await KeystoreRepo.find(
			user._id,
			accessTokenPayload.prm,
			refreshTokenPayload.prm
		);

		if (!keystore) throw new AuthFailureError('Invalid access token');

		const accessTokenKey = crypto.randomBytes(64).toString('hex');
		const refreshTokenKey = crypto.randomBytes(64).toString('hex');

		await KeystoreRepo.create(user._id, accessTokenKey, refreshTokenKey);
		const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);

		requestData.res.cookie('refresh-token', tokens.refreshToken, { maxAge: accessTokenPayload.exp });
		requestData.res.cookie('access-token', tokens.accessToken, { maxAge: refreshTokenPayload.exp });
	} else {
		keystore = await KeystoreRepo.findforKey(user._id, accessTokenPayload.prm);

		if (!keystore) throw new AuthFailureError('Invalid access token');
	}

	requestData.user = user;
	requestData.keystore = keystore;
};

export const validateTokenData = (payload: JwtPayload): boolean => {
	if (!payload || !payload.iss || !payload.sub || !payload.aud || !payload.prm
		|| payload.iss !== tokenConfig.issuer
		|| payload.aud !== tokenConfig.audience
		|| !Types.ObjectId.isValid(payload.sub))
		throw new AuthFailureError('Invalid Access Token');
	return true;
};
