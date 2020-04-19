import { Types } from "mongoose";

import User, { UserModel } from '../model/User';
import Keystore from "../model/Keystore";
import KeystoreRepo from './KeystoreRepo';
import Role, { RoleModel } from '../model/Role';

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

  public static async create(
    user: User,
    accessTokenKey: string,
    refreshTokenKey: string,
    roleCode: string
  ): Promise<{ user: User, keystore: Keystore }> {
    const now = new Date();

    const role = await RoleModel.findOne({ code: roleCode }).lean<Role>().exec();
    if (!role) throw new Error('Internal Error: Role must be defined');

    user.roles = [role._id];
    user.createdAt = user.updatedAt = now;
    const createdUser = await UserModel.create(user);
    const keystore = await KeystoreRepo.create(createdUser._id, accessTokenKey, refreshTokenKey);

    return {
      user: createdUser.toObject(),
      keystore: keystore
    };
  }
}