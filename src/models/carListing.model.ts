import { model, Schema } from "mongoose";

import { Currency } from "../enums/currency.enum";
import { ListingStatus } from "../enums/listingStatus.enum";
import { ICarListing } from "../interfaces/carListing.interface";

const CarListingSchema = new Schema<ICarListing>(
  {
    seller: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    brand: {
      type: Schema.Types.ObjectId,
      ref: "CarBrand",
      required: true,
    },

    model: {
      type: Schema.Types.ObjectId,
      ref: "CarModel",
      required: true,
    },

    year: {
      type: Number,
      required: true,
      index: true,
    },

    mileage: {
      type: Number,
    },

    images: [
      {
        type: String,
      },
    ],

    price: {
      type: Number,
      required: true,
    },

    currency: {
      type: String,
      enum: Object.values(Currency),
      required: true,
    },

    priceUSD: { type: Number, required: true },
    priceEUR: { type: Number, required: true },
    priceUAH: { type: Number, required: true },

    exchangeRateDate: {
      type: Date,
      required: true,
    },

    region: {
      type: String,
      required: true,
      index: true,
    },

    city: {
      type: String,
    },

    description: {
      type: String,
      required: true,
      maxlength: 5000,
    },

    status: {
      type: String,
      enum: Object.values(ListingStatus),
      default: ListingStatus.PENDING,
      index: true,
    },

    editAttempts: {
      type: Number,
      default: 0,
    },

    viewsCount: {
      type: Number,
      default: 0,
      index: true,
    },
  },
  {
    timestamps: true,
  },
);

export const CarListing = model<ICarListing>("CarListing", CarListingSchema);
