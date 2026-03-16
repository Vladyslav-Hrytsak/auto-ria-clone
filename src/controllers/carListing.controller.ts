import { NextFunction, Response } from "express";

import { ApiError } from "../errors/api-error";
import { carListingRepository } from "../repositories/carListing.repository";
import { carListingService } from "../services/carListing.service";
import { listingStatsService } from "../services/listingStats.service";
import { listingViewService } from "../services/listingView.service";
import { AuthRequest } from "../types/authRequest.interface";

class CarListingController {
  public async createListing(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = req.user;

      const listing = await carListingService.createListing(user, req.body);

      res.status(201).json(listing);
    } catch (error) {
      next(error);
    }
  }
  public async updateListing(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = req.user;

      const listing = await carListingService.updateListing(
        user,
        req.params.id,
        req.body,
      );

      res.json(listing);
    } catch (error) {
      next(error);
    }
  }

  public async uploadPhotos(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const filesRaw = req.files?.photos;

      const files = Array.isArray(filesRaw)
        ? filesRaw
        : filesRaw
          ? [filesRaw]
          : [];

      const listing = await carListingService.uploadPhotos(
        req.user!,
        req.params.id,
        files,
      );

      res.json(listing);
    } catch (e) {
      next(e);
    }
  }

  public async deletePhoto(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ): Promise<void> {
    try {
      const listing = await carListingService.deletePhoto(
        req.user!,
        req.params.id,
        req.body.photoUrl,
      );

      res.json(listing);
    } catch (e) {
      next(e);
    }
  }

  public async getListing(req: AuthRequest, res: Response, next: NextFunction) {
    try {
      const listingId = req.params.id;

      const listing = await carListingRepository.findById(listingId);

      if (!listing) {
        throw new ApiError("Listing not found", 404);
      }

      await listingViewService.addView(listingId);

      res.json(listing);
    } catch (error) {
      next(error);
    }
  }

  public async getListingStats(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const stats = await listingStatsService.getStats(req.user, req.params.id);

      res.json(stats);
    } catch (error) {
      next(error);
    }
  }
}

export const carListingController = new CarListingController();
