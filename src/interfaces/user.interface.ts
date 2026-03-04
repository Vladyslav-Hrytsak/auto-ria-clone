import { Document, Types } from "mongoose";

import { AccountType } from "../enums/accountType.enum";

export interface IUser extends Document {
  _id: Types.ObjectId;

  email: string;
  password: string;

  roles: Types.ObjectId[];

  accountType: AccountType;

  isBanned: boolean;

  createdAt: Date;
  updatedAt: Date;
}
