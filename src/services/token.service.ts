import * as jsonwebtoken from "jsonwebtoken";
import { SignOptions } from "jsonwebtoken";

import { config } from "../config/configs";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api-error";
import { ITokenPair, ITokenPayload } from "../interfaces/token.interface";

class TokenService {
  public generateTokens(payload: ITokenPayload): ITokenPair {
    const accessToken = jsonwebtoken.sign(payload, config.JWT_ACCESS_SECRET, {
      expiresIn: config.JWT_ACCESS_EXPIRATION as any,
    });
    const refreshToken = jsonwebtoken.sign(payload, config.JWT_REFRESH_SECRET, {
      expiresIn: config.JWT_REFRESH_EXPIRATION as any,
    });
    return { accessToken, refreshToken };
  }

  public verifyToken(token: string, type: TokenTypeEnum): ITokenPayload {
    try {
      let secret: string;
      switch (type) {
        case TokenTypeEnum.ACCESS:
          secret = config.JWT_ACCESS_SECRET;
          break;
        case TokenTypeEnum.REFRESH:
          secret = config.JWT_REFRESH_SECRET;
      }
      return jsonwebtoken.verify(token, secret) as ITokenPayload;
    } catch (err) {
      throw new ApiError("Unable to verify token", 401);
      console.log(err);
    }
  }

  public generateResetToken(
    payload: ITokenPayload,
    tokenType: ActionTokenTypeEnum,
  ): string {
    let secret: string;
    let expiration: string;

    switch (tokenType) {
      case ActionTokenTypeEnum.FORGOT_PASSWORD:
        secret = config.ACTION_FORGOT_PASSWORD_SECRET;
        expiration = config.ACTION_FORGOT_PASSWORD_EXPIRATION;
        break;
      case ActionTokenTypeEnum.VERIFY:
        secret = config.ACTION_VERIFY_SECRET;
        expiration = config.ACTION_VERIFY_EXPIRATION;
        break;
      case ActionTokenTypeEnum.DELETE:
        secret = config.ACTION_DELETE_SECRET;
        expiration = config.ACTION_DELETE_EXPIRATION;
        break;
      default:
        throw new ApiError("Invalid token type", 400);
    }

    return jsonwebtoken.sign(payload, secret, {
      expiresIn: expiration as SignOptions["expiresIn"],
    });
  }

  public verifyActionToken(
    token: string,
    type: ActionTokenTypeEnum,
  ): ITokenPayload {
    let secret: string;

    switch (type) {
      case ActionTokenTypeEnum.FORGOT_PASSWORD:
        secret = config.ACTION_FORGOT_PASSWORD_SECRET;
        break;
      case ActionTokenTypeEnum.VERIFY:
        secret = config.ACTION_VERIFY_SECRET;
        break;
      case ActionTokenTypeEnum.DELETE:
        secret = config.ACTION_DELETE_SECRET;
        break;
      default:
        throw new ApiError("Invalid token type", 400);
    }

    try {
      return jsonwebtoken.verify(token, secret) as ITokenPayload;
    } catch (err) {
      console.error("Token verification error:", err);
      throw new ApiError("Unable to verify token", 401);
    }
  }
}

export const tokenService = new TokenService();
