import { model, Schema } from "mongoose";

import { ICarModel } from "../interfaces/car.interface";

const CarModelSchema = new Schema<ICarModel>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: Schema.Types.ObjectId,
      ref: "CarBrand",
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

CarModelSchema.index({ name: 1, brand: 1 }, { unique: true });

export const CarModel = model<ICarModel>("CarModel", CarModelSchema);
