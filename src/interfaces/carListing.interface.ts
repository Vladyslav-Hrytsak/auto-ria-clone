import { Types } from "mongoose";

import { Currency } from "../enums/currency.enum";
import { ListingStatus } from "../enums/listingStatus.enum";

export interface ICarListing {
  seller: Types.ObjectId;
  brand: Types.ObjectId;
  model: Types.ObjectId;
  year: number;
  mileage?: number;
  images: string[];
  price: number;
  currency: Currency;
  priceUSD: number;
  priceEUR: number;
  priceUAH: number;
  exchangeRateDate: Date;
  region: string;
  city?: string;
  description: string;
  status: ListingStatus;
  editAttempts: number;
  createdAt: Date;
  updatedAt: Date;
  viewsCount: number;
}
