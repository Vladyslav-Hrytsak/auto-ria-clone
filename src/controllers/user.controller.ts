import { NextFunction, Response } from "express";
import { UploadedFile } from "express-fileupload";

import { ITokenPayload } from "../interfaces/token.interface";
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
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
      const user = await userService.deleteAccount(jwtPayload);
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
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
      const user = await userService.deleteAvatar(jwtPayload);
      const result = userPresenter.toPublicResDto(user);
      res.status(201).json(result);
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
