import crypto from 'crypto';
import { hash } from 'bcrypt';
import _ from 'lodash';


import CustErr from '../core/ApiError';
import User from '../database/model/User';
import UserRepo from '../database/repository/UserRepo';
import { QueryResolvers, MutationResolvers } from '../generated/graphql';
import { createTokens } from './auth/authUtils';

export const queryResolvers: QueryResolvers = {}

export const mutationResolver: MutationResolvers = {
  createUser: async (root, args, context) => {
    const user = await UserRepo.findByEmail(args.emailAddress);

    if (user) throw new Error('BadRequestError: User already registered');

    const accessTokenKey = crypto.randomBytes(64).toString('hex');
    const refreshTokenKey = crypto.randomBytes(64).toString('hex');
    const passwordHash = await hash(args.password, 10);

    const { user: createdUser, keystore } = await UserRepo.create({
      name: args.name,
      emailAddress: args.emailAddress,
      password: passwordHash
    } as User, accessTokenKey, refreshTokenKey);

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
}