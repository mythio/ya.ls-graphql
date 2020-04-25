import { Types } from "mongoose";

import { InternalError } from "../../core/ApiError";
import Keystore from "../model/Keystore";
import Role, { RoleModel } from "../model/Role";
import User, { UserModel } from "../model/User";
import KeystoreRepo from "./KeystoreRepo";

export default class UserRepo {
	public static findById(id: Types.ObjectId): Promise<User> {
		return UserModel.findById(id).populate(`roles`).lean<User>().exec();
	}

	public static findByEmail(emailAddress: string): Promise<User> {
		return UserModel.findOne({ emailAddress }).lean<User>().exec();
	}

	public static async create(
		user: User,
		accessTokenKey: string,
		refreshTokenKey: string,
		roleCode: string
	): Promise<{ user: User; keystore: Keystore }> {
		const now = new Date();

		const role = await RoleModel.findOne({ code: roleCode }).lean<Role>().exec();
		if (!role) throw new InternalError(`Role must be defined`);

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
