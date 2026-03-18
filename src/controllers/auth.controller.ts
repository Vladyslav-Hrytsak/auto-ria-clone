import { NextFunction, Request, Response } from "express";

import { getTokenFromHeader } from "../helper/getTokenFromHeader";
import { ITokenPayload } from "../interfaces/token.interface";
import {
  IChangePassword,
  IResetPasswordSend,
  IResetPasswordSet,
} from "../interfaces/user.interface";
import { authService } from "../services/auth.service";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const data = await authService.register(req.body);
      res.status(201).json(data);
    } catch (error) {
      next(error);
    }
  }

  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;

      const data = await authService.login(email, password);

      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async refresh(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = getTokenFromHeader(req.headers.authorization);

      const data = await authService.refresh(refreshToken);

      res.json(data);
    } catch (error) {
      next(error);
    }
  }

  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      const refreshToken = getTokenFromHeader(req.headers.authorization);

      await authService.logout(refreshToken);

      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }

  public async logoutAll(req: Request, res: Response, next: NextFunction) {
    try {
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        throw new Error("No token provided");
      }
      const accessToken = authHeader.split(" ")[1];
      await authService.logoutAll(accessToken);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }

  public async forgotPasswordSendEmail(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const dto = req.body as IResetPasswordSend;
      await authService.forgotPasswordSendEmail(dto);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
  public async forgotPasswordSet(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
      const dto = req.body as IResetPasswordSet;
      await authService.forgotPasswordSet(dto, jwtPayload);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
  public async changePassword(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
      const dto = req.body as IChangePassword;
      await authService.changePassword(jwtPayload, dto);
      res.status(204).send();
    } catch (error) {
      next(error);
    }
  }
  public async verifyUser(req: Request, res: Response, next: NextFunction) {
    try {
      const jwtPayload = req.res.locals.jwtPayload as ITokenPayload;
      await authService.verifyUser(jwtPayload);
      res.status(204).send();
    } catch (err) {
      next(err);
    }
  }
}

export const authController = new AuthController();
