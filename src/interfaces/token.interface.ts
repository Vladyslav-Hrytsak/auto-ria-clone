import { Document, Types } from "mongoose";

export interface IToken extends Document {
  user: Types.ObjectId;
  refreshToken: string;
  isRevoked: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAccessTokenPayload {
  id: string;
  roles: string[];
  iat: number;
  exp: number;
}

export interface IRefreshTokenPayload {
  id: string;
  iat: number;
  exp: number;
}

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}
