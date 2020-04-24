import _ from 'lodash';
import crypto from 'crypto';
import bcrypt from 'bcrypt';
import { Types } from 'mongoose';

import { IMutationResolvers, IShortUrl } from '../../types/schemaType';
import { createTokens } from '../../auth/authUtils';
import User from '../../database/model/User';
import { RoleCode } from '../../database/model/Role';
import UserRepo from '../../database/repository/UserRepo';
import ShortUrlRepo from '../../database/repository/ShortUrlRepo';
import { BadRequestError } from '../../core/ApiError';

export const mutationResolver: IMutationResolvers = {
  createUser: async (_root, args, _context) => {
    const user = await UserRepo.findByEmail(args.emailAddress);

    if (user) throw new BadRequestError('User already registered');

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');
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
      user: _.pick(createdUser, ['_id', 'name', 'emailAddress']),
      tokens: tokens
    };
  },

  shortenUrl: async (root, args, context) => {
    const userId = context.user ? context.user._id : null;
    const shareWith = args.shareWith ? args.shareWith : [];
    if (!userId && args.shareWith)
      throw new BadRequestError('Sign-in to limit the sharability of the URL');

    const shareWithIds = await Promise.all(
      shareWith.map(async (emailAddress) => (await UserRepo.findByEmail(emailAddress))._id)
    );
    shareWithIds.sort();
    let shortUrl = await ShortUrlRepo.find(args.originalUrl, userId, shareWithIds);
    let sharedWith: Types.ObjectId[];
    if (!shortUrl) {
      shortUrl = await ShortUrlRepo.create(args.originalUrl, userId, shareWithIds);
    } else {
      sharedWith = (shortUrl.shareWith as User[]).map((user) => user._id);
      sharedWith.sort();
      if (!_.isEqual(shareWithIds, sharedWith))
        shortUrl = await ShortUrlRepo.create(args.originalUrl, userId, shareWithIds);
    }

    return _.pick(shortUrl as IShortUrl, ['_id', 'originalUrl', 'shareWith']);
  }
};
