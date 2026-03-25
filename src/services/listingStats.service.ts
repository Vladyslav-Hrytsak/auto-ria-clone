import { AccountType } from "../enums/accountType.enum";
import { ApiError } from "../errors/api-error";
import {
  IListingAnalytics,
  IViewsStats,
} from "../interfaces/listing-view.interface";
import { carListingRepository } from "../repositories/carListing.repository";
import { listingViewService } from "./listingView.service";

class ListingStatsService {
  public async getStats(
    user: any,
    listingId: string,
  ): Promise<IListingAnalytics> {
    const listing = await carListingRepository.findById(listingId);

    if (!listing) {
      throw new ApiError("Listing not found", 404);
    }

    /**
     * тільки власник
     */
    if (listing.seller.toString() !== user._id.toString()) {
      throw new ApiError("Forbidden", 403);
    }

    /**
     * тільки PREMIUM аккаунт
     */
    if (user.accountType !== AccountType.PREMIUM) {
      throw new ApiError("Premium account required", 403);
    }

    /**
     * перегляди
     */
    const views: IViewsStats =
      await listingViewService.getViewsStats(listingId);

    /**
     * середня ціна регіон
     */
    const avgRegion = await carListingRepository.getAveragePriceByRegion(
      listing.brand.toString(),
      listing.model.toString(),
      listing.region,
    );

    /**
     * середня ціна країна
     */
    const avgUkraine = await carListingRepository.getAveragePriceUkraine(
      listing.brand.toString(),
      listing.model.toString(),
    );

    return {
      views,
      averagePriceRegion: avgRegion,
      averagePriceUkraine: avgUkraine,
    };
  }
}

export const listingStatsService = new ListingStatsService();
