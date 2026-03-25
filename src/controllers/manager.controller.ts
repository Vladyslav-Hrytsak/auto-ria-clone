import { NextFunction, Response } from "express";

import { IListingQuery } from "../interfaces/listingQuery.interface";
import { managerService } from "../services/manager.service";
import { AuthRequest } from "../types/authRequest.interface";

class ManagerController {
  public async softDeleteListing(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;

      const result = await managerService.softDeleteListing(id);

      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public async deleteListing(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;

      const result = await managerService.deleteListing(id);

      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public async banUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;
      const { banReason } = req.body;

      const result = await managerService.banUser(id, banReason);

      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public async unbanUser(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const { id } = req.params;

      const result = await managerService.unbanUser(id);

      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public async moderateBrandRequest(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { status } = req.body;

      const result = await managerService.moderateBrandRequest(
        req.params.id,
        status,
      );

      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public async getPendingListings(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const query = req.query as unknown as IListingQuery;

      const result = await managerService.getPendingListings(query);

      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public async changeListingStatus(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const result = await managerService.changeListingStatus(id, status);

      res.json(result);
    } catch (e) {
      next(e);
    }
  }
}

export const managerController = new ManagerController();
