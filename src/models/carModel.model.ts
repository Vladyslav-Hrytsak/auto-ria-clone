import { model, Schema, Types } from "mongoose";

const CarModelSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
      lowercase: true,
    },

    brand: {
      type: Types.ObjectId,
      ref: "Brand",
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

CarModelSchema.index({ name: 1, brand: 1 }, { unique: true });

export const CarModel = model("CarModel", CarModelSchema);
