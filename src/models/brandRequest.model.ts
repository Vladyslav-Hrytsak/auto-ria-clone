import { model, Schema, Types } from "mongoose";

const BrandRequestSchema = new Schema(
  {
    brandName: {
      type: String,
      required: true,
      trim: true,
    },

    modelName: {
      type: String,
      required: false,
      trim: true,
    },

    message: {
      type: String,
      required: false,
    },

    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    status: {
      type: String,
      enum: ["PENDING", "APPROVED", "REJECTED"],
      default: "PENDING",
    },
  },
  {
    timestamps: true,
  },
);

export const BrandRequest = model("BrandRequest", BrandRequestSchema);
