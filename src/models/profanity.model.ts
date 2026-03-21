import { model, Schema } from "mongoose";

import { IProfanity } from "../interfaces/profanity.interface";

const ProfanitySchema = new Schema(
  {
    word: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Profanity = model<IProfanity>("Profanity", ProfanitySchema);
