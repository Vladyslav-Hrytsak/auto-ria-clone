import { model, Schema, Types } from "mongoose";

import { BrandRequestStatus } from "../enums/brandRequestStatus.enum";
import {IBrandRequest} from "../interfaces/brand-request.interface";

const BrandRequestSchema = new Schema(
  {
    brandName: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    modelName: {
      type: String,
      trim: true,
      lowercase: true,
    },

    message: {
      type: String,
    },

    user: {
      type: Types.ObjectId,
      ref: "User",
      required: true,
    },

    moderatedBy: {
      type: Types.ObjectId,
      ref: "User",
    },

    status: {
      type: String,
      enum: Object.values(BrandRequestStatus),
      default: BrandRequestStatus.PENDING,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

BrandRequestSchema.index({
  brandName: 1,
  modelName: 1,
  status: 1,
});


export const BrandRequest = model<IBrandRequest>("BrandRequest", BrandRequestSchema);
