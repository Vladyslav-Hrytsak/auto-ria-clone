import { AccountType } from "../enums/accountType.enum";
import { ListingStatus } from "../enums/listingStatus.enum";
import { ApiError } from "../errors/api-error";
import { IUser } from "../interfaces/user.interface";
import { carListingRepository } from "../repositories/carListing.repository";
import { currencyService } from "./currency.service";
import { emailService } from "./email.service";
import { profanityService } from "./profanity.service";

class CarListingService {
  public async checkListingLimit(user: IUser) {
    const listingsCount = await carListingRepository.countUserListings(
      user._id.toString(),
    );

    if (user.accountType === AccountType.BASIC && listingsCount >= 1) {
      throw new ApiError("Basic account can create only one listing", 400);
    }
  }

  public async createListing(user: any, data: any) {
    const { brand, model, year, price, currency, region, description } = data;

    /**
     * 1 Перевірка ліміту оголошень
     */
    await this.checkListingLimit(user);

    /**
     * 2 Конвертація валюти
     */
    const converted = await currencyService.convertPrice(price, currency);

    /**
     * 3 Перевірка profanity
     */
    const profanityCheck = profanityService.checkText(description);

    /**
     * 4 Перевірка статус
     */
    const status = profanityCheck.hasProfanity
      ? ListingStatus.PENDING
      : ListingStatus.ACTIVE;

    /**
     * 5 Створення оголошення
     */
    const listing = await carListingRepository.createListing({
      seller: user._id,
      brand,
      model,
      year,
      price,
      currency,
      region,
      description,

      priceUSD: converted.priceUSD,
      priceEUR: converted.priceEUR,
      priceUAH: converted.priceUAH,

      exchangeRate: converted.exchangeRate,

      status,
    });

    return listing;
  }
  public async updateListing(user: any, listingId: string, data: any) {
    const listing = await carListingRepository.findById(listingId);

    if (!listing) {
      throw new ApiError("Listing not found", 404);
    }

    if (listing.seller.toString() !== user._id.toString()) {
      throw new ApiError("Forbidden", 403);
    }

    /**
     * Перевірка кількості спроб
     */
    if (listing.editAttempts >= 3) {
      throw new ApiError("Edit limit exceeded", 400);
    }

    const { price, currency, description } = data;

    /**
     * Конвертація валюти
     */
    const converted = await currencyService.convertPrice(price, currency);

    /**
     * Перевірка profanity
     */
    const profanityCheck = profanityService.checkText(description);

    let status = ListingStatus.ACTIVE;

    if (profanityCheck.hasProfanity) {
      listing.editAttempts += 1;

      if (listing.editAttempts >= 3) {
        status = ListingStatus.INACTIVE;

        await emailService.sendManagerNotification(listing._id.toString());
      } else {
        status = ListingStatus.PENDING;
      }
    }

    const updated = await carListingRepository.updateListing(listingId, {
      ...data,

      priceUSD: converted.priceUSD,
      priceEUR: converted.priceEUR,
      priceUAH: converted.priceUAH,

      exchangeRate: converted.exchangeRate,

      editAttempts: listing.editAttempts,
      status,
    });

    return updated;
  }
}

export const carListingService = new CarListingService();
