import { NextFunction, Request, Response } from "express";

import { IListingQuery } from "../interfaces/listingQuery.interface";
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


      res.json(result);
    } catch (e) {
      next(e);
    }
  }
}

export const publicListingController = new PublicListingController();
