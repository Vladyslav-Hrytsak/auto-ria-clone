import { ListingView } from "../models/listingView.model";

class ListingViewRepository {
  public async createView(listingId: string) {
    return await ListingView.create({
      listing: listingId,
    });
  }

  public async countViews(listingId: string) {
    return await ListingView.countDocuments({ listing: listingId });
  }

  public async countViewsSince(listingId: string, since: Date) {
    return await ListingView.countDocuments({
      listing: listingId,
      viewedAt: { $gte: since },
    });
  }
}

export const listingViewRepository = new ListingViewRepository();
