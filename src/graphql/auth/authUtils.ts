import { Types } from "mongoose";

import JWT, { JwtPayload } from "../../core/JWT";
import { tokenConfig } from "../../core/config";
import User from "../../database/model/User";
import { Tokens } from '../../generated/graphql';

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
    accessToken: accessTokenKey,
    refreshToken: refreshToken
  }
}
