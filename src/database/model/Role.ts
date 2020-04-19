import { Schema, model, Document } from 'mongoose';

export const DOCUMENT_NAME = 'Role';
export const COLLECTION_NAME = 'roles';

export const enum RoleCode {
  REVIEWER = 'REVIEWER',
  USER = 'USER',
  ADMIN = 'ADMIN',
}

export default interface Role extends Document {
  code: string;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema(
  {
    code: {
      type: Schema.Types.String,
      required: true,
      enum: [
        RoleCode.REVIEWER,
        RoleCode.USER,
        RoleCode.ADMIN,
      ]
    },
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
      select: false
    }
  },
  {
    versionKey: false
  });

export const RoleModel = model<Role>(DOCUMENT_NAME, schema, COLLECTION_NAME);