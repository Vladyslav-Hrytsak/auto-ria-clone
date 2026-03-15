import { NextFunction, Request, Response } from "express";

import { authService } from "../services/auth.service";
import { getTokenFromHeader } from "../helper/getTokenFromHeader";

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
}

export const authController = new AuthController();
