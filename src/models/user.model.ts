import mongoose from "mongoose";

import { AccountType } from "../enums/accountType.enum";
import { IUser } from "../interfaces/user.interface";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    roles: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Role",
        required: true,
      },
    ],

    accountType: {
      type: String,
      enum: Object.values(AccountType),
      default: AccountType.BASIC,
    },

    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false },
);

export const User = mongoose.model<IUser>("User", userSchema);
