import { model, Schema } from "mongoose";

import { ICarBrand } from "../interfaces/car.interface";

const CarBrandSchema = new Schema<ICarBrand>(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
  },
  {
    timestamps: true,
  },
);

export const CarBrand = model<ICarBrand>("CarBrand", CarBrandSchema);
