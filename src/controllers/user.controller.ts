import { NextFunction, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { ApiError } from "../errors/api-error";
import { userPresenter } from "../presenters /user.presenter";
import { carListingService } from "../services/carListing.service";
import { userService } from "../services/user.service";
import { AuthRequest } from "../types/authRequest.interface";

class UserController {
  public async changeAccountType(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const result = await userService.changeAccountType(
        req.user._id.toString(),
      );

      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public async deleteAccount(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const userId = req.user._id.toString();
      const user = await userService.deleteAccount(userId);
      const result = userPresenter.toPublicResDto(user);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  public async uploadAvatar(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const jwtPayload = req.user._id.toString();
      // const jwtPayload = res.locals.jwtPayload as ITokenPayload;
      const avatar = req.files.avatar as UploadedFile;
      const user = await userService.uploadAvatar(jwtPayload, avatar);
      const result = userPresenter.toPublicResDto(user);
      res.status(201).json(result);
    } catch (err) {
      next(err);
    }
  }

  public async deleteAvatar(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      if (!req.user) {
        throw new ApiError("Unauthorized", 401);
      }

      const userId = req.user._id.toString();

      const user = await userService.deleteAvatar(userId);
      const result = userPresenter.toPublicResDto(user);
      res.status(200).json(result);
    } catch (err) {
      next(err);
    }
  }

  public async deleteListing(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const user = req.user;

      const listing = await carListingService.deleteListing(
        user,
        req.params.id,
      );

      res.json(listing);
    } catch (error) {
      next(error);
    }
  }
}

export const userController = new UserController();
