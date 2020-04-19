import { Types } from "mongoose";

import User, { UserModel } from '../model/User';
import Keystore from "../model/Keystore";
import KeystoreRepo from './KeystoreRepo';

export default class UserRepo {

  public static findById(id: Types.ObjectId): Promise<User> {
    return UserModel.findById(id)
      .select({ emailAddress: 1 })
      .lean<User>()
      .exec();
  }

  public static findByEmail(emailAddress: string): Promise<User> {
    return UserModel.findOne({ emailAddress })
      .lean<User>()
      .exec();
  }

  public static async create(user: User, accessTokenKey: string, refreshTokenKey: string): Promise<{ user: User, keystore: Keystore }> {
    const now = new Date();
    user.createdAt = user.updatedAt = now;
    const createdUser = await UserModel.create(user);
    const keystore = await KeystoreRepo.create(createdUser._id, accessTokenKey, refreshTokenKey);

    return {
      user: createdUser.toObject(),
      keystore: keystore
    };
  }
}