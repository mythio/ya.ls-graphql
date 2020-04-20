import _ from 'lodash';
import crypto from 'crypto';
import bcrypt from 'bcrypt';

import User from '../../database/model/User';
import { RoleCode } from '../../database/model/Role';
import { createTokens } from '../../auth/authUtils';
import UserRepo from '../../database/repository/UserRepo';
import { MutationResolvers } from '../schemaType';

export const mutationResolver: MutationResolvers = {
  createUser: async (root, args, context) => {
    const user = await UserRepo.findByEmail(args.emailAddress);

    if (user) throw new Error('BadRequestError: User already registered');

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