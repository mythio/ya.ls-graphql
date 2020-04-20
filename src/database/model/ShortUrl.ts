import { Schema, model, Document } from 'mongoose';
import shortid from 'shortid';
import User from './User';

export const DOCUMENT_NAME = 'ShortUrl';
export const COLLECTION_NAME = 'shortUrls';

export default interface ShortUrl extends Document {
	shortId: string;
	originalUrl: string;
	shareWith: User[];
	createdBy: User;
	createdAt: Date;
};

const schema = new Schema(
	{
		shortId: {
			type: Schema.Types.String,
			required: true,
			unique: true,
			default: shortid.generate,
		},
		originalUrl: {
			type: Schema.Types.String,
			required: true,
		},
		shareWith: [
			{
				type: Schema.Types.ObjectId,
				required: false,
				ref: "User",
			}
		],
		createdBy: {
			type: Schema.Types.ObjectId,
			required: false,
			ref: "User",
		},
		createdAt: {
			type: Date,
			required: true,
		},
	}
);

export const ShortUrlModel = model<ShortUrl>(DOCUMENT_NAME, schema, COLLECTION_NAME);