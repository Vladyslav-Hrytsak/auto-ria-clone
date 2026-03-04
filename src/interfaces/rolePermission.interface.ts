import { Document, Types } from "mongoose";

export interface IRolePermission extends Document {
  _id: Types.ObjectId;
  role: Types.ObjectId;
  permission: Types.ObjectId;
}
