import { Document, Schema } from 'mongoose';

export interface IBaseModel extends Document {
  userId: string;
  createdAt: Date;
  updatedAt: Date;
}

export const baseModelFields = {
  userId: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
};