import { Types } from "mongoose";

import { IListingView } from "../interfaces/listing-view.interface";
import { ListingView } from "../models/listingView.model";

class ListingViewRepository {
  public async createView(listingId: string): Promise<IListingView> {
    return await ListingView.create({
      listing: listingId,
    });
  }

  public async countViews(listingId: string): Promise<number> {
    return await ListingView.countDocuments({
      listing: new Types.ObjectId(listingId),
    });
  }

  public async countViewsSince(
    listingId: string,
    since: Date,
  ): Promise<number> {
    return await ListingView.countDocuments({
      listing: listingId,
      viewedAt: { $gte: since },
    });
  }
}

export const listingViewRepository = new ListingViewRepository();
