import { Response } from "express";

import { brandRequestService } from "../services/brandRequest.service";
import { AuthRequest } from "../types/authRequest.interface";

class BrandRequestController {
  public async createRequest(req: AuthRequest, res: Response) {
    const { brand, model, message } = req.body;

    const request = await brandRequestService.createBrandRequest(
      brand,
      model,
      message,
      req.user._id.toString(),
    );
    res.status(201).json({
      message: "Request sent to manager",
      data: request,
    });
  }

  public async getRequest(req: AuthRequest, res: Response) {
    const requests = await brandRequestService.getBrandRequest();
    res.status(201).json(requests);
  }
}

export const brandRequestController = new BrandRequestController();
