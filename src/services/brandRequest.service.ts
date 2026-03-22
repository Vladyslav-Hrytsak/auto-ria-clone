import { EmailTypeEnum } from "../enums/email-type.enum";
import { IBrandRequest } from "../interfaces/brand-request.interface";
import { BrandRequest } from "../models/brandRequest.model";
import { userRepository } from "../repositories/user.repository";
import { sendGridService } from "./send-grid.service";

class BrandRequestService {
  public async createBrandRequest(
    brandName: string,
    modelName: string,
    message: string,
    userId: string,
  ): Promise<IBrandRequest> {
    const request = await BrandRequest.create({
      brandName,
      modelName,
      message,
      user: userId,
    });

    const managers = await userRepository.getManagers();

    if (!managers.length) {
      return request;
    }

    const managerEmails = managers.map((m) => m.email).filter(Boolean);

    await Promise.all(
      managerEmails.map((email) =>
        sendGridService.sendByType(email, EmailTypeEnum.BRAND_MODEL_REQUEST, {
          brandName,
          modelName,
          sellerId: userId,
          message,
        }),
      ),
    );

    return request;
  }
}

export const brandRequestService = new BrandRequestService();
