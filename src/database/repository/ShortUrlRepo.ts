import { Types } from "mongoose";

import ShortUrl, { ShortUrlModel } from '../model/ShortUrl';
import UserRepo from './UserRepo';
import User from "../model/User";

export default class ShortUrlRepo {

  public static findById(id: Types.ObjectId): Promise<ShortUrl> {
    return ShortUrlModel.findById(id)
      .populate('createdBy')
      .lean<ShortUrl>()
      .exec();
  }

  public static find(originalUrl: string, userId?: Types.ObjectId, shareWithIds?: Types.ObjectId[]): Promise<ShortUrl> {
    return ShortUrlModel.findOne({ originalUrl: originalUrl, createdBy: userId, shareWith: shareWithIds })
      .populate('createdBy shareWith')
      .lean<ShortUrl>()
      .exec();
  }

  public static async create(
    originalUrl: string,
    user?: User,
    shareWith?: Array<Types.ObjectId>
  ): Promise<ShortUrl> {
    const createdShortUrl = await ShortUrlModel.create({
      originalUrl: originalUrl,
      createdBy: user._id,
      shareWith: shareWith
    });
    await createdShortUrl.populate({ path: 'shareWith' }).execPopulate();

    return createdShortUrl;
  }

  public static async update(
    _id: string,
    user?: User,
    shareWith?: Array<string>
  ): Promise<ShortUrl> {
    let shortUrl = await ShortUrlModel.findById(_id);
    let sharedWith = shortUrl.shareWith;

    let shareWithId: Array<Types.ObjectId>;
    if (shareWith)
      shareWithId = await Promise.all(shareWith.map(async emailAddress =>
        new Types.ObjectId((await UserRepo.findByEmail(emailAddress))._id))
      );

    let updatedShareWith = [...shareWithId, ...sharedWith as Types.ObjectId[]];

    updatedShareWith = updatedShareWith.filter((item, index) => sharedWith.indexOf(item) == index);

    return shortUrl;
  }
}