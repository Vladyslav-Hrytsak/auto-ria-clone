import { model, Schema } from "mongoose";

import { IToken } from "../interfaces/token.interface";

const tokenSchema = new Schema<IToken>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    refreshToken: {
      type: String,
      required: true,
      unique: true,
    },

    isRevoked: {
      type: Boolean,
      default: false,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // Mongo auto delete
    },
  },
  {
    timestamps: true,
  },
);

export const Token = model<IToken>("Token", tokenSchema);
