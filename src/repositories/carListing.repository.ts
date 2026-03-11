import { ICarListing } from "../interfaces/carListing.interface";
import { CarListing } from "../models/carListing.model";

class CarListingRepository {
  public async countUserListings(userId: string): Promise<number> {
    return await CarListing.countDocuments({
      seller: userId,
      status: { $ne: "INACTIVE" },
    });
  }

  public async createListing(data: Partial<ICarListing>): Promise<ICarListing> {
    return await CarListing.create(data);
  }
  public async findById(id: string) {
    return await CarListing.findById(id);
  }

  public async updateListing(id: string, data: any) {
    return await CarListing.findByIdAndUpdate(id, data, { new: true });
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
