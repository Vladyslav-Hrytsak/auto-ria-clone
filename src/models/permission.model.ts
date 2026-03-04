import mongoose from "mongoose";

import { IPermission } from "../interfaces/permission.interface";

const permissionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
    },
  },
  { timestamps: true, versionKey: false },
);

export const Permission = mongoose.model<IPermission>(
  "Permission",
  permissionSchema,
);
