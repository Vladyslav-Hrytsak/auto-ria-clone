import mongoose from "mongoose";

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

export const Permission = mongoose.model("Permission", permissionSchema);
