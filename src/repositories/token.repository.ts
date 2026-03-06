import { Types } from "mongoose";

import { IToken } from "../interfaces/token.interface";
import { Token } from "../models/token.model";

class TokenRepository {
  public async create(data: {
    user: Types.ObjectId;
    refreshToken: string;
    expiresAt: Date;
  }): Promise<IToken> {
    return await Token.create(data);
  }

  public async findByRefreshToken(
    refreshToken: string,
  ): Promise<IToken | null> {
    return await Token.findOne({ refreshToken });
  }

  public async revokeToken(refreshToken: string): Promise<IToken | null> {
    return await Token.findOneAndUpdate(
      { refreshToken },
      { isRevoked: true },
      { new: true },
    );
  }

  public async deleteUserTokens(userId: Types.ObjectId): Promise<void> {
    await Token.deleteMany({ user: userId });
  }

  public async countUserTokens(userId: Types.ObjectId): Promise<number> {
    return await Token.countDocuments({ user: userId, isRevoked: false });
  }

  public async deleteOldestToken(userId: Types.ObjectId) {
    const oldestToken = await Token.findOne({ user: userId }).sort({
      createdAt: 1,
    });

    if (oldestToken) {
      await oldestToken.deleteOne();
    }
  }
  public async revokeAllUserTokens(userId: string | Types.ObjectId) {
    return await Token.updateMany(
      { user: userId, isRevoked: false },
      { isRevoked: true },
    );
  }
}

export const tokenRepository = new TokenRepository();
