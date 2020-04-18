import { UserModel } from '../../../database/model/User';
import { getAccessToken, validateTokenData } from '../authUtils';
import JWT from '../../../core/JWT';

export const adminRule = async req => {
  const accessToken = getAccessToken(req.authorization);
  if (!accessToken) {
    return false;
  }

  try {
    const payload = await JWT.validate(accessToken);
    validateTokenData(payload);

    const user = await UserModel.findById(payload.subject);
    if (!user) {
      throw new Error('Auth Failure: User not registerd');
    }
    if (!user || !user.isAdmin) return false;
    req.user = user;
  } catch (err) {
    return false;
  }
  return true;
};
