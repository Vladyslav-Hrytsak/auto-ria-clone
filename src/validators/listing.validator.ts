import Joi from "joi";

import { Currency } from "../enums/currency.enum";
import { ListingOrderByEnum } from "../enums/listing-list-order-by.enum";
import { OrderEnum } from "../enums/order.enum";

export const listingQueryValidator = Joi.object({
  limit: Joi.number().min(1).max(50).default(10),
  page: Joi.number().min(1).default(1),

  brand: Joi.string(),
  model: Joi.string(),
  region: Joi.string(),

  priceFrom: Joi.number().min(0),
  priceTo: Joi.number().min(0),

  order: Joi.string()
    .valid(...Object.values(OrderEnum))
    .default(OrderEnum.DESC),
  orderBy: Joi.string()
    .valid(...Object.values(ListingOrderByEnum))
    .default(ListingOrderByEnum.CREATED_AT),
});

export const createListingValidator = Joi.object({
  brand: Joi.string().required(),
  model: Joi.string().required(),
  year: Joi.number().min(1900).max(new Date().getFullYear()).required(),

  price: Joi.number().positive().required(),
  currency: Joi.string()
    .valid(...Object.values(Currency))
    .required(),

  region: Joi.string().required(),
  city: Joi.string().optional(),

  title: Joi.string().min(3).max(100).required(),
  description: Joi.string().min(10).max(5000).required(),

  mileage: Joi.number().min(0).optional(),
});

export const updateListingValidator = Joi.object({
  brand: Joi.string(),
  model: Joi.string(),
  year: Joi.number().min(1900).max(new Date().getFullYear()),

  price: Joi.number().positive(),
  currency: Joi.string().valid(...Object.values(Currency)),

  region: Joi.string(),
  city: Joi.string(),

  title: Joi.string().min(3).max(100),
  description: Joi.string().min(10).max(5000),

  mileage: Joi.number().min(0),
});
