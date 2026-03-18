import { NextFunction, Response } from "express";

import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api-error";
import { AuthRequest } from "../interfaces/auth-request.interface";
import { IResetPasswordSet } from "../interfaces/user.interface";
import { actionTokenRepository } from "../repositories/action-token.repository";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { tokenService } from "../services/token.service";
// import { IAccessTokenPayload } from "../interfaces/token.interface";
// import { userRepository } from "../repositories/user.repository";
// import { jwtService } from "../services/jwt.service";

class AuthMiddleware {
  public async checkAccessToken(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const header = req.headers.authorization;
      if (!header) {
        throw new ApiError("Token is not provided", 401);
      }

      const accessToken = header.split("Bearer ")[1];
      const payload = tokenService.verifyToken(
        accessToken,
        TokenTypeEnum.ACCESS,
      );

      const user = await userRepository.getByID(payload.userId);

      if (!user) {
        throw new ApiError("User not found", 401);
      }

      req.user = user;

      next();
    } catch (e) {
      next(e);
    }
  }

  public async checkRefreshToken(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const header = req.headers.authorization;
      if (!header) {
        throw new ApiError("Token is not provided", 401);
      }

      const refreshToken = header.split("Bearer ")[1];

      const payload = tokenService.verifyToken(
        refreshToken,
        TokenTypeEnum.REFRESH,
      );

      const pair = await tokenRepository.findByParams({ refreshToken });

      if (!pair) {
        throw new ApiError("Token is not valid", 401);
      }

      req.res.locals.jwtPayload = payload;
      req.res.locals.refreshToken = refreshToken;
      next();
    } catch (e) {
      next(e);
    }
  }

  public async checkActionToken(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { token } = req.body as IResetPasswordSet;

      const payload = tokenService.verifyActionToken(
        token,
        ActionTokenTypeEnum.FORGOT_PASSWORD,
      );

      const tokenEntity = await actionTokenRepository.getByToken(token);
      if (!tokenEntity) {
        throw new ApiError("Token is not valid", 401);
      }
      req.res.locals.jwtPayload = payload;
      next();
    } catch (e) {
      next(e);
    }
  }
  public async checkVerifyToken(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { token } = req.body as IResetPasswordSet;

      const payload = tokenService.verifyActionToken(
        token,
        ActionTokenTypeEnum.VERIFY,
      );

      const tokenEntity = await actionTokenRepository.getByToken(token);
      if (!tokenEntity) {
        throw new ApiError("Token is not valid", 401);
      }
      req.res.locals.jwtPayload = payload;
      next();
    } catch (e) {
      next(e);
    }
  }
}

export const authMiddleware = new AuthMiddleware();

// export const authMiddleware = async (
//   req: AuthRequest,
//   res: Response,
//   next: NextFunction,
// ) => {
//   try {
//     const authHeader = req.headers.authorization;
//
//     if (!authHeader || !authHeader.startsWith("Bearer ")) {
//       return next(new ApiError("Unauthorized", 401));
//     }
//
//     const token = authHeader.split(" ")[1];
//
//     const decoded = jwtService.verifyAccessToken(token) as IAccessTokenPayload;
//
//     const user = await userRepository.findById(decoded.id);
//
//     if (!user) {
//       return next(new ApiError("User not found", 404));
//     }
//
//     req.user = user;
//
//     next();
//   } catch (error) {
//     next(error);
//   }
// };
