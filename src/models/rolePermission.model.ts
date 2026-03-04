import mongoose from "mongoose";

import { IRolePermission } from "../interfaces/rolePermission.interface";

const rolePermissionSchema = new mongoose.Schema(
  {
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Role",
      required: true,
    },
    permission: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Permission",
      required: true,
    },
  },
  { versionKey: false },
);

export const RolePermission = mongoose.model<IRolePermission>(
  "RolePermission",
  rolePermissionSchema,
);
