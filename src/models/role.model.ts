import mongoose from "mongoose";

const roleSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Role = mongoose.model("Role", roleSchema);
