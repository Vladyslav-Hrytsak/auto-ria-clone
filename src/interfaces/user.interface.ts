import { Document, Types } from "mongoose";

import { AccountType } from "../enums/accountType.enum";
import { SellerTypeEnum } from "../enums/sellerType.enum";

export interface IUser extends Document {
  email: string;
  password: string;
  name: string;
  avatar?: string | null;
  phone?: string;
  roles: Types.ObjectId[];
  accountType: AccountType;
  sellerType: SellerTypeEnum;
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export type IUserResponse = Pick<
  IUser,
  "_id" | "email" | "roles" | "accountType" | "isBanned" | "avatar"
>;
