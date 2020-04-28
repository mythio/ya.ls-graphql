import bcrypt from "bcrypt";
import crypto from "crypto";
import _ from "lodash";

import { createTokens } from "../../auth/authUtils";
import { AuthFailureError, BadRequestError, NotFoundError } from "../../core/ApiError";
import Role from "../../database/model/Role";
import KeystoreRepo from "../../database/repository/KeystoreRepo";
import UserRepo from "../../database/repository/UserRepo";
import { IQueryResolvers, IShortUrlDetail, IUserDetail } from "../../types/schemaType";
import ShortUrlRepo from "../../database/repository/ShortUrlRepo";
import User from "../../database/model/User";

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
		const user = await UserRepo.findById(context.user._id, ["roles"]);
		let roles = user.roles;

		roles = (roles as Role[]).map((role: Role): string => role.code);
		user.roles = roles;
		return {
			user: _.pick(user as IUserDetail, [`_id`, `name`, `emailAddress`, `shortIds`, `roles`])
		};
	},

	expandUrl: async (_root, args, context) => {
		const user = context.user;
		const shortUrlId = args._id;
		const shortUrl = await ShortUrlRepo.findById(shortUrlId, ["createdBy", "shareWith"]);

		if (!shortUrl) throw new NotFoundError();

		if (shortUrl.shareWith.length > 0 && !user) throw new NotFoundError();
		else if (shortUrl.shareWith.length > 0) {
			const isSharedWithUser = (shortUrl.shareWith as User[]).find((sharedWithUser) => {
				return _.isEqual(sharedWithUser._id, user._id);
			});

			if (!isSharedWithUser && !_.isEqual(user._id, (shortUrl.createdBy as User)._id))
				throw new NotFoundError();
		}

		return _.pick(shortUrl as IShortUrlDetail, [`_id`, `originalUrl`, `shareWith`, `createdBy`]);
	}
};
