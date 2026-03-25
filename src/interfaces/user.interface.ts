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
  isVerified: boolean;
  isDeleted: boolean;
  isBanned: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// export type ISignIn = Pick<IUser, "email" | "password">;
export type IResetPasswordSend = Pick<IUser, "email">;
export type IResetPasswordSet = Pick<IUser, "password"> & { token: string };
export type IChangePassword = Pick<IUser, "password"> & { newPassword: string };

export type IUserResponse = Pick<
  IUser,
  "_id" | "email" | "roles" | "accountType" | "isBanned" | "avatar"
>;
