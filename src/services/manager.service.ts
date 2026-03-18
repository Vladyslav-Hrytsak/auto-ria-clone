import { BrandRequestStatus } from "../enums/brandRequestStatus.enum";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { ListingStatus } from "../enums/listingStatus.enum";
import { ApiError } from "../errors/api-error";
import { brandRepository } from "../repositories/brand.repository";
import { brandRequestRepository } from "../repositories/brandRequest.repository";
import { carListingRepository } from "../repositories/carListing.repository";
import { modelRepository } from "../repositories/model.repository";
import { userRepository } from "../repositories/user.repository";
import { sendGridService } from "./send-grid.service";

class ManagerService {
  public async deleteListing(listingId: string) {
    const listing = await carListingRepository.findById(listingId);

    if (!listing) {
      throw new ApiError("Listing not found", 404);
    }

    const updated = await carListingRepository.softDelete(listingId);

    return {
      message: "Listing soft deleted",
      data: updated,
    };
  }

  public async banUser(userId: string, banReason: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    user.isBanned = true;

    await user.save();

    await sendGridService.sendByType(user.email, EmailTypeEnum.ACCOUNT_BANNED, {
      name: user.name,
      banReason: banReason,
    });

    return {
      message: "User banned",
    };
  }

  public async unbanUser(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    user.isBanned = false;

    await user.save();

    await sendGridService.sendByType(
      user.email,
      EmailTypeEnum.ACCOUNT_UNBANNED,
      {
        name: user.name,
        frontUrl: process.env.FRONT_URL,
      },
    );

    return {
      message: "User unbanned",
    };
  }

  public async moderateBrandRequest(
    requestId: string,
    status: BrandRequestStatus,
  ) {
    const request = await brandRequestRepository.findById(requestId);

    if (!request) {
      throw new ApiError("Request not found", 404);
    }

    let brand = null;
    let carModel = null;

    if (status === BrandRequestStatus.APPROVED) {
      brand = await brandRepository.create(request.brandName);

      if (request.modelName) {
        carModel = await modelRepository.create(
          request.modelName,
          brand._id.toString(),
        );
      }
    }

    const updated = await brandRequestRepository.updateStatus(
      requestId,
      status,
    );

    return {
      message: "Brand request moderated",
      brand,
      carModel,
      data: updated,
    };
  }

  public async getPendingListings() {
    return await carListingRepository.findPending();
  }

  public async changeListingStatus(listingId: string, status: ListingStatus) {
    const listing = await carListingRepository.findById(listingId);

    if (!listing) {
      throw new ApiError("Listing not found", 404);
    }

    const updated = await carListingRepository.updateStatus(listingId, status);

    return {
      message: "Listing status updated",
      data: updated,
    };
  }
}

export const managerService = new ManagerService();
