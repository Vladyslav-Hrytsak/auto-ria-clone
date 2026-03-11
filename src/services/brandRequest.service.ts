import { BrandRequest } from "../models/brandRequest.model";
import { emailService } from "./email.service";

class BrandRequestService {
  public async createBrandRequest(
    brandName: string,
    modelName: string,
    message: string,
    userId: string,
  ) {
    const request = await BrandRequest.create({
      brandName,
      modelName,
      message,
      user: userId,
    });

    await emailService.sendBrandRequestNotification(
      brandName,
      modelName,
      message,
      userId,
    );

    return request;
  }
}

export const brandRequestService = new BrandRequestService();
