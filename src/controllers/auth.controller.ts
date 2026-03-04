import { NextFunction, Request, Response } from "express";

import { authService } from "../services/auth.service";

class AuthController {
  async register(req: Request, res: Response, next: NextFunction) {
    try {
      const user = await authService.register(req.body);

      res.status(201).json({
        id: user._id,
        email: user.email,
        roles: user.roles,
        accountType: user.accountType,
      });
    } catch (error) {
      next(error);
    }
  }
}

export const authController = new AuthController();
