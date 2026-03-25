import { UploadedFile } from "express-fileupload";

import { AccountType } from "../enums/accountType.enum";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { FileItemTypeEnum } from "../enums/file-item-type.enum";
import { ListingStatus } from "../enums/listingStatus.enum";
import { ApiError } from "../errors/api-error";
import { ICarListing } from "../interfaces/carListing.interface";
import { IUser } from "../interfaces/user.interface";
import { carListingRepository } from "../repositories/carListing.repository";
import { roleRepository } from "../repositories/role.repository";
import { userRepository } from "../repositories/user.repository";
import { currencyService } from "./currency.service";
import { profanityService } from "./profanity.service";
import { s3Service } from "./s3.service";
import { sendGridService } from "./send-grid.service";

class CarListingService {
  public async checkListingLimit(user: IUser) {
    const listingsCount = await carListingRepository.countUserListings(
      user._id.toString(),
    );

    if (user.accountType === AccountType.BASIC && listingsCount >= 1) {
      throw new ApiError("Basic account can create only one listing", 400);
    }
  }

  public async createListing(user: IUser, data: any): Promise<ICarListing> {
    await this.checkListingLimit(user);

    const { brand, model, region, description, title, price, currency } = data;

    const profanityCheck = profanityService.checkTexts([
      brand,
      model,
      region,
      description,
      title,
    ]);

    if (profanityCheck.hasProfanity) {
      throw new ApiError(
        `Оголошення містить нецензурні слова: ${profanityCheck.words.join(", ")}. Будь ласка, відредагуйте текст.`,
        400,
      );
    }

    const converted = await currencyService.convertPrice(price, currency);

    const listing = await carListingRepository.createListing({
      ...data,
      seller: user._id,

      priceUSD: converted.priceUSD,
      priceEUR: converted.priceEUR,
      priceUAH: converted.priceUAH,
      exchangeRateDate: converted.exchangeRateDate,

      status: ListingStatus.ACTIVE,
      editAttempts: 0,
    });

    await sendGridService.sendByType(
      user.email,
      EmailTypeEnum.LISTING_APPROVED,
      {
        carTitle: listing.title,
        frontUrl: process.env.FRONT_URL,
      },
    );

    const sellerRole = await roleRepository.findByName("seller");

    const hasSellerRole = user.roles.some(
      (r) => r.toString() === sellerRole._id.toString(),
    );

    if (!hasSellerRole) {
      await userRepository.addRole(user._id.toString(), "seller");
    }

    return listing;
  }

  public async updateListing(user: IUser, listingId: string, data: any) {
    const listing = await carListingRepository.findById(listingId);

    if (!listing) throw new ApiError("Listing not found", 404);

    if (listing.seller.toString() !== user._id.toString()) {
      throw new ApiError("Forbidden", 403);
    }

    if (listing.editAttempts >= 3) {
      throw new ApiError("Edit limit exceeded", 400);
    }

    const { brand, model, region, description, title, price, currency } = data;
    const textsToCheck = [brand, model, region, description, title].filter(
      (text) => typeof text === "string",
    );

    const profanityCheck = profanityService.checkTexts(textsToCheck);

    let status = ListingStatus.ACTIVE;
    let attempts = listing.editAttempts;

    if (profanityCheck.hasProfanity) {
      attempts += 1;
      await sendGridService.sendByType(
        user.email,
        EmailTypeEnum.LISTING_EDITING,
        {
          carTitle: listing.title,
          attemptsLeft: 3 - attempts,
          frontUrl: process.env.FRONT_URL,
        },
      );

      if (attempts >= 3) {
        status = ListingStatus.INACTIVE;

        await sendGridService.sendByType(
          user.email,
          EmailTypeEnum.LISTING_INACTIVE,
          {
            carTitle: listing.title,
            frontUrl: process.env.FRONT_URL,
          },
        );
      } else {
        status = ListingStatus.PENDING;
      }
    }

    const converted = await currencyService.convertPrice(price, currency);

    const updated = await carListingRepository.updateListing(listingId, {
      ...data,
      priceUSD: converted.priceUSD,
      priceEUR: converted.priceEUR,
      priceUAH: converted.priceUAH,
      exchangeRateDate: converted.exchangeRateDate,
      editAttempts: attempts,
      status,
    });

    return updated;
  }

  public async uploadPhotos(
    user: IUser,
    listingId: string,
    files: UploadedFile[],
  ): Promise<ICarListing> {
    const listing = await carListingRepository.getById(listingId);

    if (!listing) throw new ApiError("Listing not found", 404);
    if (listing.status === ListingStatus.INACTIVE) {
      throw new ApiError("Listing inactive", 400);
    }

    if (listing.seller.toString() !== user._id.toString()) {
      throw new ApiError("Forbidden", 403);
    }

    const uploaded = [];

    for (const file of files) {
      const path = await s3Service.uploadFile(
        file,
        FileItemTypeEnum.LISTING,
        listingId,
      );

      uploaded.push({
        url: path,
        order: listing.photos.length + uploaded.length,
      });
    }

    return await carListingRepository.addPhotos(listingId, uploaded);
  }

  public async deletePhoto(
    user: IUser,
    listingId: string,
    url: string,
  ): Promise<ICarListing> {
    const listing = await carListingRepository.getById(listingId);

    if (!listing) throw new ApiError("Listing not found", 404);

    if (listing.seller.toString() !== user._id.toString()) {
      throw new ApiError("Forbidden", 403);
    }

    await s3Service.deleteFile(url);

    return await carListingRepository.removePhoto(listingId, url);
  }

  public async deleteListing(user: IUser, listingId: string) {
    const listing = await carListingRepository.findById(listingId);

    if (!listing) throw new ApiError("Listing not found", 404);

    if (listing.seller.toString() !== user._id.toString()) {
      throw new ApiError("Forbidden", 403);
    }

    await carListingRepository.deleteById(listingId);

    await sendGridService.sendByType(
      user.email,
      EmailTypeEnum.LISTING_DELETED,
      {
        carTitle: listing.title,
        frontUrl: process.env.FRONT_URL,
      },
    );
  }
}

export const carListingService = new CarListingService();
