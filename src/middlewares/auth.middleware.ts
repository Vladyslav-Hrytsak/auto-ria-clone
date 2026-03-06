import { NextFunction, Response } from "express";

import { ApiError } from "../errors/api-error";
import { AuthRequest } from "../interfaces/auth-request.interface";
import { IAccessTokenPayload } from "../interfaces/token.interface";
import { userRepository } from "../repositories/user.repository";
import { jwtService } from "../services/jwt.service";

export const authMiddleware = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      throw new ApiError("Unauthorized", 401);
    }

    const token = authHeader.split(" ")[1];

    const decoded = jwtService.verifyAccessToken(token) as IAccessTokenPayload;

    const user = await userRepository.findById(decoded.id);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    req.user = user;

    next();
  } catch (error) {
    next(new ApiError("Unauthorized", 401));
  }
};
