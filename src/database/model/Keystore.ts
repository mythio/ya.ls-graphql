import { Document, Schema, model } from 'mongoose';

import User from './User';

export const DOCUMENT_NAME = 'Keystore';
export const COLLECTION_NAME = 'keystores';

export default interface Keystore extends Document {
  client: User;
  primaryKey: string;
  secondaryKey: string;
  status?: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

const schema = new Schema(
  {
    client: {
      type: Schema.Types.ObjectId,
      required: true,
      ref: "User",
      index: true
    },
    primaryKey: {
      type: Schema.Types.String,
      required: true,
      index: true
    },
    secondaryKey: {
      type: Schema.Types.String,
      required: true,
      index: true
    },
    createdAt: {
      type: Date,
      required: true,
      select: false
    },
    updatedAt: {
      type: Date,
      required: true,
      select: false
    }
  }
);

export const KeystoreModel = model<Keystore>(DOCUMENT_NAME, schema, COLLECTION_NAME);