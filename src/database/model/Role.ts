import { Schema, model, Document } from 'mongoose';

export const DOCUMENT_NAME = 'Role';
export const COLLECTION_NAME = 'roles';

export const enum RoleCode {
	ADMIN = "ADMIN",
	USER = "USER",
	USER_UNAUTH = "USER_UNAUTH",
	REVIEWER = "REVIEWER",
}

export default interface Role extends Document {
	code: string;
}

const schema = new Schema(
	{
		code: {
			type: Schema.Types.String,
			required: true,
			enum: [
				RoleCode.ADMIN,
				RoleCode.USER,
				RoleCode.USER_UNAUTH,
				RoleCode.REVIEWER,
			]
		},
		createdAt: {
			type: Date,
			default: Date.now
		}
	}
);

export const RoleModel = model<Role>(DOCUMENT_NAME, schema, COLLECTION_NAME);
