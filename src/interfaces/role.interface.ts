import { Document, Types } from "mongoose";

export interface IRole extends Document {
  _id: Types.ObjectId;
  name: string;
  createdAt: Date;
  updatedAt: Date;
}
