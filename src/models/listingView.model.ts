import { model, Schema } from "mongoose";

import { IListingView } from "../interfaces/listing-view.interface";

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
