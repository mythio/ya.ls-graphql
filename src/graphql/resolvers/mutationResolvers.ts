import bcrypt from "bcrypt";
import crypto from "crypto";
import _ from "lodash";

import { createTokens } from "../../auth/authUtils";
import { BadRequestError } from "../../core/ApiError";
import { RoleCode } from "../../database/model/Role";
import ShortUrlRepo from "../../database/repository/ShortUrlRepo";
import UserRepo from "../../database/repository/UserRepo";
import { IMutationResolvers, IShortUrl } from "../../types/schemaType";

import type { Types } from "mongoose";

import type User from "../../database/model/User";
export const mutationResolver: IMutationResolvers = {
	createUser: async (_root, args, _context) => {
		const user = await UserRepo.findByEmail(args.emailAddress);

		if (user) throw new BadRequestError("User already registered");

		const accessTokenKey = crypto.randomBytes(64).toString("hex");
		const refreshTokenKey = crypto.randomBytes(64).toString("hex");
		const passwordHash = await bcrypt.hash(args.password, 10);

		const { user: createdUser, keystore } = await UserRepo.create(
			{
				name: args.name,
				emailAddress: args.emailAddress,
				password: passwordHash
			} as User,
			accessTokenKey,
			refreshTokenKey,
			RoleCode.USER_UNAUTH
		);

		const tokens = await createTokens(createdUser, keystore.primaryKey, keystore.secondaryKey);

		return {
			user: _.pick(createdUser, ["_id", "name", "emailAddress"]),
			tokens: tokens
		};
	},

	shortenUrl: async (_root, args, context) => {
		const userId = context.user ? context.user._id : undefined;
		const shareWith: string[] = args.shareWith ? args.shareWith : [];
		if (!userId && args.shareWith)
			throw new BadRequestError("Sign-in to limit the sharability of the URL");

		const shareWithIds = await Promise.all(
			shareWith.map(async (emailAddress) => {
				const userFound = await UserRepo.findByEmail(emailAddress);
				if (!userFound) {
					throw new BadRequestError("Bad mail ID");
				}
				return userFound._id;
			})
		);
		shareWithIds.sort();
		let shortUrl = await ShortUrlRepo.find(args.originalUrl, userId, shareWithIds, ["shareWith"]);
		let sharedWith: Types.ObjectId[];
		if (!shortUrl) {
			shortUrl = await ShortUrlRepo.create(args.originalUrl, userId, shareWithIds, ["shareWith"]);
		} else {
			sharedWith = (shortUrl.shareWith as User[]).map((user) => user._id);
			sharedWith.sort();
			if (!_.isEqual(shareWithIds, sharedWith))
				shortUrl = await ShortUrlRepo.create(args.originalUrl, userId, shareWithIds, ["shareWith"]);
		}

		console.log(shortUrl);

		return _.pick(shortUrl as IShortUrl, ["_id", "originalUrl", "shareWith"]);
	}
};
