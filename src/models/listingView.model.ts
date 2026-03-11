import { model, Schema, Types } from "mongoose";

export interface IListingView {
  listing: Types.ObjectId;
  viewedAt: Date;
}

const ListingViewSchema = new Schema<IListingView>({
  listing: {
    type: Schema.Types.ObjectId,
    ref: "CarListing",
    required: true,
    index: true,
  },

  viewedAt: {
    type: Date,
    default: Date.now,
    index: true,
  },
});

export const ListingView = model<IListingView>(
  "ListingView",
  ListingViewSchema,
);
