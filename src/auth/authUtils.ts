import { Types } from "mongoose";

import { tokenConfig } from "../core/config";
import { Tokens } from '../generated/graphql';
import JWT, { JwtPayload } from "../core/JWT";
import User from "../database/model/User";
import Keystore from '../database/model/Keystore';
import UserRepo from '../database/repository/UserRepo';
import KeystoreRepo from '../database/repository/KeystoreRepo';
import { ObjectID } from 'mongodb';

export const getAccessToken = (authorization: string) => {
	if (!authorization) return undefined;
	if (!authorization.startsWith('Bearer ')) throw new Error('Auth Failure: Invalid Authorization');
	return authorization.split(' ')[1];
};

export const validateTokenData = (payload: JwtPayload): boolean => {
	if (!payload || !payload.issuer || !payload.subject || !payload.audience || !payload.param
		|| payload.issuer !== tokenConfig.issuer
		|| payload.audience !== tokenConfig.audience
		|| !Types.ObjectId.isValid(payload.subject))
		throw new Error('Auth Failure: Invalid Access Token');
	return true;
};

export const createTokens = async (user: User, accessTokenKey: string, refreshTokenKey: string): Promise<Tokens> => {
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
	)

	if (!accessToken || !refreshToken) throw new Error()

	return {
		accessToken: accessToken,
		refreshToken: refreshToken
	}
}

export const ruleStrategy = async (
	req: {
		authorization: string;
		user: User;
		keystore: Keystore
	},
	role: string
): Promise<void> => {
	const accessToken = getAccessToken(req.authorization);

	if (!accessToken) {
		throw new Error('');
	}
	try {
		const payload = await JWT.validate(accessToken);
		validateTokenData(payload);

		const user = await UserRepo.findById(new ObjectID(payload.subject));
		if (!user) throw new Error('');

		const userWithRole = user.roles.find((userRole) => userRole.code === role)
		if (!userWithRole) throw new Error('');

		const keystore = await KeystoreRepo.findforKey(user._id, payload.param);
		if (!keystore) throw new Error('');

		delete req.authorization;
		req.user = user;
		req.keystore = keystore;
	} catch (err) {
		throw new Error('');
	}
};