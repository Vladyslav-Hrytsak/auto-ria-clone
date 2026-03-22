import mongoose from "mongoose";

import { AccountType } from "../enums/accountType.enum";
import { SellerTypeEnum } from "../enums/sellerType.enum";
import { IUser } from "../interfaces/user.interface";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },

    password: { type: String, required: true },

    name: {
      type: String,
      required: true,
    },

    avatar: {
      type: String,
      default: null,
    },

    phone: {
      type: String,
    },

    roles: {
      type: [
        {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Role",
        },
      ],
      default: [],
    },

    accountType: {
      type: String,
      enum: Object.values(AccountType),
      default: AccountType.BASIC,
    },

    sellerType: {
      type: String,
      enum: SellerTypeEnum,
      default: "private",
    },

    isVerified: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },

    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false },
);

export const User = mongoose.model<IUser>("User", userSchema);
