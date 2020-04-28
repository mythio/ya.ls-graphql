import _ from "lodash";
import { Types } from "mongoose";

import { InternalError, BadRequestError } from "../../core/ApiError";
import Keystore from "../model/Keystore";
import Role, { RoleModel, RoleCode } from "../model/Role";
import User, { UserModel } from "../model/User";
import KeystoreRepo from "./KeystoreRepo";

export default class UserRepo {
	public static findById(id: Types.ObjectId, populateFields: string[]): Promise<User> {
		const populate = _.join(populateFields, " ");
		return UserModel.findById(id).populate(populate).lean<User>().exec();
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
		if (!role) throw new InternalError("Role must be defined");

		user.roles = [role._id];
		user.createdAt = user.updatedAt = now;
		const createdUser = await UserModel.create(user);
		const keystore = await KeystoreRepo.create(createdUser._id, accessTokenKey, refreshTokenKey);

		return {
			user: createdUser.toObject(),
			keystore: keystore
		};
	}

	public static async elevateRole(userId: Types.ObjectId, roleCode: string): Promise<User> {
		const role = await RoleModel.findOne({ code: roleCode }).lean<Role>().exec();
		if (!role) throw new InternalError("Role must be defined");

		const user = await UserModel.findById(userId);
		const userRoles = user.roles as Types.ObjectId[];
		const isAssigned = userRoles.find((userRole) => _.isEqual(userRole, role._id));

		if (isAssigned) throw new InternalError("Role is already defined");

		userRoles.push(role._id);
		await user.save();
		const updatedUser = await (await user.populate("roles").execPopulate()).toObject();

		return updatedUser as User;
	}
}
