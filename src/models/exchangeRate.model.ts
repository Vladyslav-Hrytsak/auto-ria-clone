import { model, Schema } from "mongoose";

const ExchangeRateSchema = new Schema(
  {
    base: {
      type: String,
      required: true,
      default: "UAH",
    },

    usd: {
      type: Number,
      required: true,
    },

    eur: {
      type: Number,
      required: true,
    },

    source: {
      type: String,
      default: "PrivatBank",
    },

    date: {
      type: Date,
      required: true,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

// ExchangeRateSchema.index({ date: 1 }, { unique: true });

export const ExchangeRate = model("ExchangeRate", ExchangeRateSchema);
