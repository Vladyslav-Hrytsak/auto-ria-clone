import { Types } from "mongoose";

import { Currency } from "../enums/currency.enum";
import { ListingStatus } from "../enums/listingStatus.enum";

export interface ICarListing {
  seller: Types.ObjectId;
  brand: Types.ObjectId;
  model: Types.ObjectId;

  price: number;
  currency: Currency;

  priceUSD: number;
  priceEUR: number;
  priceUAH: number;

  exchangeRate: number;

  region: string;

  description: string;

  status: ListingStatus;

  views: number;

  editAttempts: number;
}
