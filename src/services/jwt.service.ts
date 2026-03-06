import jwt, { SignOptions } from "jsonwebtoken";

import { config } from "../config/configs";
import {
  IAccessTokenPayload,
  IRefreshTokenPayload,
} from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";

class JwtService {
  generateAccessToken(user: IUser) {
    return jwt.sign(
      {
        id: user._id,
        roles: user.roles,
      },
      config.JWT_ACCESS_SECRET,
      { expiresIn: config.JWT_ACCESS_EXPIRATION as SignOptions["expiresIn"] },
    );
  }

  generateRefreshToken(user: IUser) {
    return jwt.sign(
      {
        id: user._id,
      },
      config.JWT_REFRESH_SECRET,
      { expiresIn: config.JWT_REFRESH_EXPIRATION as SignOptions["expiresIn"] },
    );
  }

  verifyAccessToken(token: string): IAccessTokenPayload {
    return jwt.verify(token, config.JWT_ACCESS_SECRET) as IAccessTokenPayload;
  }

  verifyRefreshToken(token: string): IRefreshTokenPayload {
    return jwt.verify(token, config.JWT_REFRESH_SECRET) as IRefreshTokenPayload;
  }
}

export const jwtService = new JwtService();
