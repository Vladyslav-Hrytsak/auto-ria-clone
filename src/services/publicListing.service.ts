import { ListingStatus } from "../enums/listingStatus.enum";
import { ApiError } from "../errors/api-error";
import { IListingQuery } from "../interfaces/listingQuery.interface";
import { carListingRepository } from "../repositories/carListing.repository";
import { listingViewService } from "./listingView.service";

class PublicListingService {
  public async getListings(query: IListingQuery) {
    const [data, total] = await carListingRepository.getActiveListings(query);

    return {
      data,
      total,
      page: query.page,
      limit: query.limit,
      totalPages: Math.ceil(total / query.limit),
    };
  }
  public async getById(id: string) {
    const listing = await carListingRepository.findById(id);

    if (!listing) {
      throw new ApiError("Listing not found", 404);
    }

    if (listing.status !== ListingStatus.ACTIVE) {
      throw new ApiError("Listing not available", 404);
    }

    await listingViewService.addView(id);

    return listing;
  }
}

export const publicListingService = new PublicListingService();
