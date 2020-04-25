import { Document, model, Schema, Types } from "mongoose";

import Role from "./Role";
import ShortUrl from "./ShortUrl";

export const DOCUMENT_NAME = `User`;
export const COLLECTION_NAME = `users`;

export default interface User extends Document {
	name: string;
	emailAddress: string;
	password: string;
	roles: Role[] | Types.ObjectId[];
	shortIds: ShortUrl[] | Types.ObjectId[];
	createdAt: Date;
	updatedAt: Date;
}

const schema = new Schema({
	name: {
		type: Schema.Types.String,
		required: true,
		trim: true,
		maxlength: 100
	},
	emailAddress: {
		type: Schema.Types.String,
		required: true,
		unique: true,
		trim: true
	},
	password: {
		type: Schema.Types.String,
		required: true
	},
	roles: {
		type: [
			{
				type: Schema.Types.ObjectId,
				ref: `Role`
			}
		],
		required: true,
		select: false
	},
	shortIds: {
		type: [
			{
				type: Schema.Types.ObjectId,
				ref: `ShortUrl`
			}
		]
	},
	createdAt: {
		type: Date,
		default: Date.now
	},
	updatedAt: {
		type: Date,
		default: Date.now
	}
});

export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);
