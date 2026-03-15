import { ListingSort } from "../enums/listingSort.enum";
import { ListingStatus } from "../enums/listingStatus.enum";
import { ICarListing } from "../interfaces/carListing.interface";
import { CarListing } from "../models/carListing.model";

class CarListingRepository {
  public async countUserListings(userId: string): Promise<number> {
    return await CarListing.countDocuments({
      seller: userId,
      status: { $ne: "INACTIVE" },
    });
  }

  public async deleteById(id: string) {
    return await CarListing.findByIdAndDelete(id);
  }

  public async createListing(data: Partial<ICarListing>): Promise<ICarListing> {
    return await CarListing.create(data);
  }
  public async findById(id: string) {
    return await CarListing.findById(id);
  }

  public async getActiveListings(query: any) {
    const filter: any = {
      status: ListingStatus.ACTIVE,
    };

    if (query.brand) filter.brand = query.brand;
    if (query.model) filter.model = query.model;
    if (query.region) filter.region = query.region;

    if (query.priceFrom || query.priceTo) {
      filter.priceUSD = {};

      if (query.priceFrom) filter.priceUSD.$gte = Number(query.priceFrom);

      if (query.priceTo) filter.priceUSD.$lte = Number(query.priceTo);
    }

    const page = Number(query.page) || 1;
    const limit = Number(query.limit) || 10;

    let sort: any = { createdAt: -1 };

    switch (query.sort) {
      case ListingSort.OLDEST:
        sort = { createdAt: 1 };
        break;

      case ListingSort.PRICE_ASC:
        sort = { priceUSD: 1 };
        break;

      case ListingSort.PRICE_DESC:
        sort = { priceUSD: -1 };
        break;

      case ListingSort.VIEWS:
        sort = { viewsCount: -1 };
        break;
    }

    return await CarListing.find(filter)
      .populate("brand")
      .populate("model")
      .sort(sort)
      .skip((page - 1) * limit)
      .limit(limit);
  }

  public async softDelete(id: string) {
    return await CarListing.findByIdAndUpdate(
      id,
      { status: ListingStatus.DELETED },
      { new: true },
    );
  }

  public async updateListing(id: string, data: any) {
    return await CarListing.findByIdAndUpdate(id, data, { new: true });
  }

  public async findPending() {
    return await CarListing.find({ status: ListingStatus.PENDING });
  }

  public async updateStatus(id: string, status: ListingStatus) {
    return await CarListing.findByIdAndUpdate(id, { status }, { new: true });
  }

  public async getAveragePriceByRegion(
    brand: string,
    model: string,
    region: string,
  ) {
    const result = await CarListing.aggregate([
      {
        $match: {
          brand,
          model,
          region,
          status: "ACTIVE",
        },
      },
      {
        $group: {
          _id: null,
          avgPrice: { $avg: "$priceUSD" },
        },
      },
    ]);

    return result[0]?.avgPrice || 0;
  }

  public async getAveragePriceUkraine(brand: string, model: string) {
    const result = await CarListing.aggregate([
      {
        $match: {
          brand,
          model,
          status: "ACTIVE",
        },
      },
      {
        $group: {
          _id: null,
          avgPrice: { $avg: "$priceUSD" },
        },
      },
    ]);

    return result[0]?.avgPrice || 0;
  }
}

export const carListingRepository = new CarListingRepository();
