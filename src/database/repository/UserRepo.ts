import { Types } from "mongoose";

import User, { UserModel } from '../model/User';

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

  public static async createUser(user: User): Promise<User> {
    const now = new Date();
    const createdUser = await UserModel.create(user);
    return createdUser.toObject();
  }
}