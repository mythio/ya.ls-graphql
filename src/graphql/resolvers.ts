import crypto from 'crypto';
import bcrypt from 'bcrypt';
import _ from 'lodash';


import CustErr from '../core/ApiError';
import { createTokens } from './auth/authUtils';
import User from '../database/model/User';
import UserRepo from '../database/repository/UserRepo';
import KeystoreRepo from '../database/repository/KeystoreRepo';
import { QueryResolvers, MutationResolvers } from '../generated/graphql';

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
  }
}

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