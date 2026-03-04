import mongoose from "mongoose";

import { IRole } from "../interfaces/role.interface";

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

export const Role = mongoose.model<IRole>("Role", roleSchema);
