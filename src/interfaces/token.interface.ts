import { Document, Types } from "mongoose";

import { RolesEnum } from "../enums/roles.enum";

export interface IToken extends Document {
  user: Types.ObjectId;
  accessToken: string;
  refreshToken: string;
  isRevoked: boolean;
  expiresAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ITokenPayload {
  userId: string;
  role: RolesEnum;
}

export interface ITokenPair {
  accessToken: string;
  refreshToken: string;
}
