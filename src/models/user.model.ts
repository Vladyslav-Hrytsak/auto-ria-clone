import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },

    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },

    accountType: {
      type: String,
      enum: ["basic", "premium"],
      default: "basic",
    },

    isBanned: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true, versionKey: false },
);

export const User = mongoose.model("User", userSchema);
