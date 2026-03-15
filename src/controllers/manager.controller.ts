import { NextFunction, Response } from "express";

import { managerService } from "../services/manager.service";
import { AuthRequest } from "../types/authRequest.interface";

class ManagerController {
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

      const result = await managerService.banUser(id);

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
      const listings = await managerService.getPendingListings();

      res.json(listings);
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
