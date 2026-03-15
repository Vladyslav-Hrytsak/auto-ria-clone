import { NextFunction, Request, Response } from "express";

import { publicListingService } from "../services/publicListing.service";

class PublicListingController {
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await publicListingService.getAll(req.query);

      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await publicListingService.getById(req.params.id);

      res.json(result);
    } catch (e) {
      next(e);
    }
  }
}

export const publicListingController = new PublicListingController();
