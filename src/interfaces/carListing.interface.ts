import { Types } from "mongoose";

import { Currency } from "../enums/currency.enum";
import { ListingStatus } from "../enums/listingStatus.enum";

export interface ICarListing {
  title: string;
  seller: Types.ObjectId;
  brand: Types.ObjectId;
  model: Types.ObjectId;
  year: number;
  mileage?: number;
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
  photos?: string;
  editAttempts: number;
  createdAt: Date;
  updatedAt: Date;
  viewsCount: number;
}

export interface CreateListingDto {
  title: string;
  brand: string;
  model: string;
  year: number;
  price: number;
  currency: string;
  region: string;
  city?: string;
  description: string;
}
