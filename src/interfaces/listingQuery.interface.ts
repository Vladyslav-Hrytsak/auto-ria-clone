import { ListingOrderByEnum } from "../enums/listing-list-order-by.enum";
import { OrderEnum } from "../enums/order.enum";

export interface IListingQuery {
  limit: number;
  page: number;

  brand?: string;
  model?: string;
  region?: string;

  priceFrom?: number;
  priceTo?: number;

  order: OrderEnum;
  orderBy: ListingOrderByEnum;
}
