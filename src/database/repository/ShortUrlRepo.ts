import _ from "lodash";
import { Types } from "mongoose";

import ShortUrl, { ShortUrlModel } from "../model/ShortUrl";
import User, { UserModel } from "../model/User";
import UserRepo from "./UserRepo";

export default class ShortUrlRepo {
	public static findById(id: string, populateFields: string[] = []): Promise<ShortUrl> {
		const populate = _.join(populateFields, " ");
		return ShortUrlModel.findById(id).populate(populate).lean<ShortUrl>().exec();
	}

	public static find(
		originalUrl: string,
		userId?: Types.ObjectId,
		shareWithIds?: Types.ObjectId[],
		populateFields: string[] = []
	): Promise<ShortUrl> {
		const populate = _.join(populateFields, " ");
		return ShortUrlModel.findOne({
			originalUrl: originalUrl,
			createdBy: userId,
			shareWith: shareWithIds
		})
			.populate(populate)
			.lean<ShortUrl>()
			.exec();
	}

	public static async create(
		originalUrl: string,
		userId?: Types.ObjectId,
		shareWith?: Types.ObjectId[],
		populateFields: string[] = []
	): Promise<ShortUrl> {
		const populate = _.join(populateFields, " ");

		const createdShortUrl = await ShortUrlModel.create({
			originalUrl: originalUrl,
			createdBy: userId,
			shareWith: shareWith
		});
		await createdShortUrl.populate(populate).execPopulate();

		if (userId) {
			const user = await UserModel.findById(userId);
			const userShortIds = [...user.shortIds];
			userShortIds.push(createdShortUrl._id);
			user.shortIds = userShortIds as string[];
			await user.save();
		}

		return createdShortUrl;
	}

	public static async update(_id: string, user?: User, shareWith?: string[]): Promise<ShortUrl> {
		const shortUrl = await ShortUrlModel.findById(_id);
		const sharedWith = shortUrl.shareWith;

		let shareWithId: Types.ObjectId[];
		if (shareWith)
			shareWithId = await Promise.all(
				shareWith.map(
					async (emailAddress) => new Types.ObjectId((await UserRepo.findByEmail(emailAddress))._id)
				)
			);

		const updatedShareWith = [...shareWithId, ...(sharedWith as Types.ObjectId[])];
		console.log(updatedShareWith);

		// updatedShareWith = updatedShareWith.filter((item, index) => sharedWith.indexOf(item) == index);

		return shortUrl;
	}
}
