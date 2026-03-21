import { model, Schema } from "mongoose";

import { ICarBrand } from "../interfaces/car.interface";

const BrandSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
  },
  {
    timestamps: true,
  },
);

export const Brand = model<ICarBrand>("Brand", BrandSchema);
