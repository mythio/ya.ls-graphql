import _ from 'lodash';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

import Role from '../../database/model/Role';
import { createTokens } from '../../auth/authUtils';
import UserRepo from '../../database/repository/UserRepo';
import KeystoreRepo from '../../database/repository/KeystoreRepo';
import { QueryResolvers } from '../schemaType';

export const queryResolvers: QueryResolvers = {
	login: async (root, args, context) => {
		const user = await UserRepo.findByEmail(args.emailAddress);

		if (!user) throw new Error('BadRequestError: User not registered');

		const match = await bcrypt.compare(args.password, user.password);

		if (!match) throw new Error('AuthFailureError: Authentication failure');

		const accessTokenKey = crypto.randomBytes(64).toString('hex');
		const refreshTokenKey = crypto.randomBytes(64).toString('hex');

		await KeystoreRepo.create(user._id, accessTokenKey, refreshTokenKey);
		const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);

		return {
			user: _.pick(user, ['_id', 'name', 'emailAddress']),
			tokens: tokens
		}
	},
	me: async (root, args, context) => {
		const user = context.user;
		let roles = user.roles;
		roles = roles.map((role: Role): string => role.code);
		user.roles = roles;

		return {
			user: _.pick(user, ['_id', 'name', 'emailAddress', 'shortIds', 'roles'])
		};
	}
};
