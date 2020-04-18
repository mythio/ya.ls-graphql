import { Types } from "mongoose";

import { JwtPayload } from "../../core/JWT";
import { tokenInfo } from "../../core/config";

export const getAccessToken = (authorization: string) => {
  console.log(authorization);
  if (!authorization) return undefined;
  if (!authorization.startsWith('Bearer ')) throw new Error('Auth Failure: Invalid Authorization');
  return authorization.split(' ')[1];
};

export const validateTokenData = (payload: JwtPayload): boolean => {
  if (!payload || !payload.issuer || !payload.subject || !payload.audience || !payload.param
    || payload.issuer !== tokenInfo.issuer
    || payload.audience !== tokenInfo.audience
    || !Types.ObjectId.isValid(payload.subject))
    throw new Error('Auth Failure: Invalid Access Token');
  return true;
};
