import { config } from "../config/configs";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { ApiError } from "../errors/api-error";
import { IUser } from "../interfaces/user.interface";
import { carListingRepository } from "../repositories/carListing.repository";
import { userRepository } from "../repositories/user.repository";
import { sendGridService } from "./send-grid.service";

class ContactService {
  public async contactSeller(
    user: IUser,
    listingId: string,
    dto: { message: string; phone: string },
  ) {
    const listing = await carListingRepository.findByIdForMassage(listingId);

    if (!listing) {
      throw new ApiError("Listing not found", 404);
    }
    const sellerId = listing.seller.toString();
    const seller = await userRepository.findById(sellerId);

    if (!seller) {
      throw new ApiError("Seller not found", 404);
    }

    if (listing.seller.toString() === user._id.toString()) {
      throw new ApiError("You cannot contact yourself", 400);
    }

    if (!dto.message || dto.message.length < 5) {
      throw new ApiError("Message is too short", 400);
    }
    await sendGridService.sendByType(
      seller.email,
      EmailTypeEnum.CONTACT_SELLER,
      {
        carTitle: `${listing.brand} ${listing.model}`,
        message: dto.message,
        buyerPhone: dto.phone || "Not provided",
        frontUrl: config.FRONT_URL,
      },
    );

    return {
      message: "Message sent to seller",
    };
  }
}

export const contactService = new ContactService();
