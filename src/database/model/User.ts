import { Schema, model, Document } from "mongoose";
import ShortUrl from './ShortUrl';

export const DOCUMENT_NAME = 'User';
export const COLLECTION_NAME = 'users';

export default interface User extends Document {
  name: string;
  emailAddress: string;
  password: string;
  verified: boolean;
  isAdmin: boolean;
  shortIds: ShortUrl[];
  createdAt: Date;
  updatedAt: Date;
};

const schema = new Schema(
  {
    name: {
      type: Schema.Types.String,
      required: true,
      trim: true,
      maxlength: 100,
    },
    emailAddress: {
      type: Schema.Types.String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: Schema.Types.String,
      required: true,
    },
    verified: {
      type: Schema.Types.Boolean,
      default: false,
    },
    isAdmin: {
      type: Schema.Types.Boolean,
      default: false,
    },
    shortIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'ShortUrl',
      }
    ],
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    updatedAt: {
      type: Date,
      default: Date.now(),
    },
  }
);

export const UserModel = model<User>(DOCUMENT_NAME, schema, COLLECTION_NAME);