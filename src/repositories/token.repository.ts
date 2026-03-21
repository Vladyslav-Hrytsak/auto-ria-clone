import { QueryFilter, Types } from "mongoose";

import { IToken } from "../interfaces/token.interface";
import { Token } from "../models/token.model";

class TokenRepository {
  public async create(dto: Partial<IToken>): Promise<IToken> {
    return await Token.create(dto);
  }
  public async findByParams(
    params: QueryFilter<IToken>,
  ): Promise<IToken | null> {
    return await Token.findOne(params);
  }
  public async deleteById(id: string): Promise<void> {
    await Token.deleteOne({ _id: id });
  }
  public async deleteManyByUserId(userId: string): Promise<void> {
    await Token.deleteMany({ _userId: userId });
  }
  public async deleteManyByParams(params: QueryFilter<IToken>): Promise<void> {
    await Token.deleteMany(params);
  }
  public async deleteBeforeDate(date: Date): Promise<number> {
    const { deletedCount } = await Token.deleteMany({
      createdAt: { $lt: date },
    });
    return deletedCount;
  }
  public async getActiveUserIds(sinceDate: Date): Promise<string[]> {
    const activeUserIds = await Token.find({
      updatedAt: { $gte: sinceDate },
    }).distinct("_userId");

    return activeUserIds.map((id) => id.toString());
  }
  // public async create(data: {
  //   user: Types.ObjectId;
  //   refreshToken: string;
  //   expiresAt: Date;
  // }): Promise<IToken> {
  //   return await Token.create(data);
  // }
  //
  // public async findByRefreshToken(
  //   refreshToken: string,
  // ): Promise<IToken | null> {
  //   return await Token.findOne({ refreshToken });
  // }

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

  public async deleteOldestToken(userId: Types.ObjectId): Promise<void> {
    const oldestToken = await Token.findOne({ user: userId }).sort({
      createdAt: 1,
    });

    if (oldestToken) {
      await oldestToken.deleteOne();
    }
  }
  public async revokeAllUserTokens(
    userId: string | Types.ObjectId,
  ): Promise<void> {
    await Token.updateMany(
      { user: userId, isRevoked: false },
      { isRevoked: true },
    );
  }
}

export const tokenRepository = new TokenRepository();
