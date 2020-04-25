import _ from "lodash";
import crypto from "crypto";
import bcrypt from "bcrypt";

import { IQueryResolvers } from "../../types/schemaType";
import { createTokens } from "../../auth/authUtils";
import Role from "../../database/model/Role";
import UserRepo from "../../database/repository/UserRepo";
import KeystoreRepo from "../../database/repository/KeystoreRepo";
import { BadRequestError, AuthFailureError } from "../../core/ApiError";

export const queryResolvers: IQueryResolvers = {
	login: async (_root, args, context) => {
		const user = await UserRepo.findByEmail(args.emailAddress);

		if (!user) throw new BadRequestError(`User not registered`);

		const match = await bcrypt.compare(args.password, user.password);

		if (!match) throw new AuthFailureError();

		const accessTokenKey = crypto.randomBytes(64).toString(`hex`);
		const refreshTokenKey = crypto.randomBytes(64).toString(`hex`);

		await KeystoreRepo.create(user._id, accessTokenKey, refreshTokenKey);
		const tokens = await createTokens(user, accessTokenKey, refreshTokenKey);

		context.res.cookie(`refresh-token`, tokens.refreshToken, {
			maxAge: 7 * 24 * 60 * 60 * 1000
		});
		context.res.cookie(`access-token`, tokens.accessToken, {
			maxAge: 30 * 24 * 60 * 60 * 1000
		});

		return {
			user: _.pick(user, [`_id`, `name`, `emailAddress`]),
			tokens: tokens
		};
	},
	me: async (_root, _args, context) => {
		const user = context.user;
		let roles = user.roles;
		roles = roles.map((role: Role): string => role.code);
		user.roles = roles;

		return {
			user: _.pick(user, [`_id`, `name`, `emailAddress`, `shortIds`, `roles`])
		};
	}
};
