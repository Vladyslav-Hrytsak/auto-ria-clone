import { Types } from "mongoose";

export interface IListingView {
  listing: Types.ObjectId;
  viewedAt: Date;
}
