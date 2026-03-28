import { NextFunction, Request, Response } from "express";

import { IListingQuery } from "../interfaces/listingQuery.interface";
import { listingViewRepository } from "../repositories/listingView.repository";
import { listingViewService } from "../services/listingView.service";
import { publicListingService } from "../services/publicListing.service";

class PublicListingController {
  public async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const query = req.query as unknown as IListingQuery;

      const result = await publicListingService.getListings(query);

      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public async getById(req: Request, res: Response, next: NextFunction) {
    try {
      const result = await publicListingService.getById(req.params.id);
      await listingViewService.addView(req.params.id);
      await listingViewRepository.createView(req.params.id);

      res.json(result);
    } catch (e) {
      next(e);
    }
  }
}

export const publicListingController = new PublicListingController();
