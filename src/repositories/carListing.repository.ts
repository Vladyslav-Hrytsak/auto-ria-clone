import { Types } from "mongoose";

import { ListingStatus } from "../enums/listingStatus.enum";
import { OrderEnum } from "../enums/order.enum";
import { ICarListing } from "../interfaces/carListing.interface";
import { IListingQuery } from "../interfaces/listingQuery.interface";
import { CarListing } from "../models/carListing.model";

interface IPriceAggregation {
  _id: null;
  avgPrice: number;
}

class CarListingRepository {
  public async countUserListings(userId: string): Promise<number> {
    return await CarListing.countDocuments({
      seller: userId,
      status: { $ne: "INACTIVE" },
    });
  }

  public async deleteById(id: string): Promise<ICarListing> {
    return await CarListing.findByIdAndDelete(id);
  }

  public async createListing(data: Partial<ICarListing>): Promise<ICarListing> {
    return await CarListing.create(data);
  }
  public async findByIdForMassage(listingId: string): Promise<ICarListing> {
    return await CarListing.findById(listingId).populate("seller");
  }

  public async findById(listingId: string): Promise<ICarListing> {
    return await CarListing.findById(listingId);
  }

  public async getActiveListings(
    query: IListingQuery,
  ): Promise<[ICarListing[], number]> {
    const filter: any = {
      status: ListingStatus.ACTIVE,
    };

    if (query.brand) filter.brand = query.brand;
    if (query.model) filter.model = query.model;
    if (query.region) filter.region = query.region;

    if (query.priceFrom || query.priceTo) {
      filter.priceUSD = {};

      if (query.priceFrom) filter.priceUSD.$gte = query.priceFrom;
      if (query.priceTo) filter.priceUSD.$lte = query.priceTo;
    }

    const limit = query.limit;
    const page = query.page;
    const skip = limit * (page - 1);

    const sortOrder = query.order === OrderEnum.ASC ? 1 : -1;
    const sortField = query.orderBy;

    const sort = { [sortField]: sortOrder };

    return await Promise.all([
      CarListing.find(filter)
        .populate("brand")
        .populate("model")
        .limit(limit)
        .skip(skip)
        .sort(sort as any)
        .lean(),

      CarListing.countDocuments(filter),
    ]);
  }

  public async getPendingListings(
    query: IListingQuery,
  ): Promise<[ICarListing[], number]> {
    const filter: any = {
      status: ListingStatus.PENDING,
    };

    if (query.brand) filter.brand = query.brand;
    if (query.model) filter.model = query.model;
    if (query.region) filter.region = query.region;

    if (query.priceFrom || query.priceTo) {
      filter.priceUSD = {};
      if (query.priceFrom) filter.priceUSD.$gte = query.priceFrom;
      if (query.priceTo) filter.priceUSD.$lte = query.priceTo;
    }

    const limit = query.limit || 10;
    const page = query.page || 1;
    const skip = limit * (page - 1);

    const sortOrder = query.order === OrderEnum.ASC ? 1 : -1;
    const sortField = query.orderBy || "createdAt";
    const sort = { [sortField]: sortOrder };

    return await Promise.all([
      CarListing.find(filter)
        .populate("brand")
        .populate("model")
        .limit(limit)
        .skip(skip)
        .sort(sort as any)
        .lean(),

      CarListing.countDocuments(filter),
    ]);
  }

  public getById(id: string): Promise<ICarListing> {
    return CarListing.findById(id).populate("brand").populate("model");
  }

  public addPhotos(id: string, photos): Promise<ICarListing> {
    return CarListing.findByIdAndUpdate(
      id,
      { $push: { photos: { $each: photos } } },
      { new: true },
    );
  }

  public removePhoto(id, url) {
    return CarListing.findByIdAndUpdate(
      id,
      { $pull: { photos: { url } } },
      { new: true },
    );
  }

  public async softDelete(id: string): Promise<ICarListing> {
    return await CarListing.findByIdAndUpdate(
      id,
      { status: ListingStatus.DELETED },
      { new: true },
    );
  }

  public async updateListing(id: string, data: any): Promise<ICarListing> {
    return await CarListing.findByIdAndUpdate(id, data, { new: true });
  }

  public async updateStatus(
    id: string,
    status: ListingStatus,
  ): Promise<ICarListing> {
    return await CarListing.findByIdAndUpdate(id, { status }, { new: true });
  }

  public async getAveragePriceByRegion(
    brand: string,
    model: string,
    region: string,
  ): Promise<number> {
    const result = await CarListing.aggregate<IPriceAggregation>([
      {
        $match: {
          brand: new Types.ObjectId(brand),
          model: new Types.ObjectId(model),
          region,
          status: ListingStatus.ACTIVE,
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
          brand: new Types.ObjectId(brand),
          model: new Types.ObjectId(model),
          status: ListingStatus.ACTIVE,
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
