import { Document, model, Schema, Types } from "mongoose";
import shortid from "shortid";

import User from "./User";

export const DOCUMENT_NAME = `ShortUrl`;
export const COLLECTION_NAME = `shortUrls`;

export default interface ShortUrl extends Document {
	originalUrl: string;
	shareWith: User[] | Types.ObjectId[];
	createdBy: User | Types.ObjectId;
	createdAt: Date;
}

const schema = new Schema({
	_id: {
		type: Schema.Types.String,
		default: shortid.generate
	},
	originalUrl: {
		type: Schema.Types.String,
		required: true
	},
	shareWith: {
		type: [
			{
				type: Schema.Types.ObjectId,
				ref: `User`
			}
		]
	},
	createdBy: {
		type: Schema.Types.ObjectId,
		ref: `User`
	},
	createdAt: {
		type: Date,
		default: Date.now
	}
});

export const ShortUrlModel = model<ShortUrl>(DOCUMENT_NAME, schema, COLLECTION_NAME);
