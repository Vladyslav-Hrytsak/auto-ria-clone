import { NextFunction, Response } from "express";

import { ApiError } from "../errors/api-error";
import { AuthRequest } from "../types/authRequest.interface";

export const banMiddleware = (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  if (req.user?.isBanned) {
    return next(new ApiError("User is banned", 403));
  }

  next();
};
