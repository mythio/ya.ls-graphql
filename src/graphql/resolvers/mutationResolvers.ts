import _ from 'lodash';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

import { MutationResolvers } from '../schemaType';
import User from '../../database/model/User';
import { RoleCode } from '../../database/model/Role';
import UserRepo from '../../database/repository/UserRepo';
import { createTokens } from '../../auth/authUtils';
import { BadRequestError } from '../../core/ApiError';

export const mutationResolver: MutationResolvers = {
  createUser: async (_root, args, _context) => {
    const user = await UserRepo.findByEmail(args.emailAddress);

    if (user) throw new BadRequestError('BadRequestError: User already registered');

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');
    const passwordHash = await bcrypt.hash(args.password, 10);

    const { user: createdUser, keystore } = await UserRepo.create({
      name: args.name,
      emailAddress: args.emailAddress,
      password: passwordHash
    } as User, accessTokenKey, refreshTokenKey, RoleCode.REVIEWER);

    const tokens = await createTokens(
      createdUser,
      keystore.primaryKey,
      keystore.secondaryKey
    );

    return {
      user: _.pick(createdUser, ['_id', 'name', 'emailAddress']),
      tokens: tokens
    }
  }
};