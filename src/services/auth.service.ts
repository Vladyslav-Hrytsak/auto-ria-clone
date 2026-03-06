import { config } from "../config/configs";
import { AccountType } from "../enums/accountType.enum";
import { ApiError } from "../errors/api-error";
import { RegisterDto } from "../interfaces/registerDto.interface";
import {
  IRefreshTokenPayload,
  ITokenPair,
} from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { Role } from "../models/role.model";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { jwtService } from "./jwt.service";
import { passwordService } from "./password.service";

class AuthService {
  public async register(data: RegisterDto) {
    const { email, password, role } = data;

    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      throw new ApiError("User already exists", 400);
    }

    const roleEntity = await Role.findOne({ name: role });

    if (!roleEntity) {
      throw new ApiError("Role not found", 404);
    }

    const hashedPassword = await passwordService.hash(password);

    const user = await userRepository.createUser({
      email,
      password: hashedPassword,
      roles: [roleEntity._id],
      accountType: AccountType.BASIC,
    });

    const tokenPair = this.generateTokenPair(user);

    const decoded = jwtService.verifyRefreshToken(
      tokenPair.refreshToken,
    ) as IRefreshTokenPayload;

    await tokenRepository.create({
      user: user._id,
      refreshToken: tokenPair.refreshToken,
      expiresAt: new Date(decoded.exp * 1000),
    });

    return {
      ...tokenPair,
      user: {
        id: user._id,
        email: user.email,
        roles: user.roles,
        accountType: user.accountType,
      },
    };
  }

  private generateTokenPair(user: IUser): ITokenPair {
    return {
      accessToken: jwtService.generateAccessToken(user),
      refreshToken: jwtService.generateRefreshToken(user),
    };
  }

  public async login(email: string, password: string) {
    const user = await userRepository.findByEmail(email);

    if (!user) {
      throw new ApiError("Invalid credentials", 401);
    }

    const isMatch = await passwordService.compare(password, user.password);

    if (!isMatch) {
      throw new ApiError("Invalid credentials", 401);
    }

    const sessions = await tokenRepository.countUserTokens(user._id);

    if (sessions >= Number(config.MAX_SESSIONS)) {
      await tokenRepository.deleteOldestToken(user._id);
    }

    const tokenPair = this.generateTokenPair(user);

    const decoded = jwtService.verifyRefreshToken(
      tokenPair.refreshToken,
    ) as IRefreshTokenPayload;

    await tokenRepository.create({
      user: user._id,
      refreshToken: tokenPair.refreshToken,
      expiresAt: new Date(decoded.exp * 1000),
    });

    return {
      ...tokenPair,
      user: {
        id: user._id,
        email: user.email,
        roles: user.roles,
        accountType: user.accountType,
      },
    };
  }

  public async refresh(refreshToken: string): Promise<ITokenPair> {
    const tokenDoc = await tokenRepository.findByRefreshToken(refreshToken);

    if (!tokenDoc) {
      throw new ApiError("Refresh token not found", 401);
    }

    if (tokenDoc.isRevoked) {
      await tokenRepository.revokeAllUserTokens(tokenDoc.user);
      throw new ApiError("Token reuse detected", 401);
    }

    if (tokenDoc.expiresAt < new Date()) {
      throw new ApiError("Refresh token expired", 401);
    }

    const decoded = jwtService.verifyRefreshToken(
      refreshToken,
    ) as IRefreshTokenPayload;

    const user = await userRepository.findById(decoded.id);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    await tokenRepository.revokeToken(refreshToken);

    const newTokenPair = this.generateTokenPair(user);

    const newDecoded = jwtService.verifyRefreshToken(
      newTokenPair.refreshToken,
    ) as IRefreshTokenPayload;

    await tokenRepository.create({
      user: user._id,
      refreshToken: newTokenPair.refreshToken,
      expiresAt: new Date(newDecoded.exp * 1000),
    });

    return newTokenPair;
  }

  public async logout(refreshToken: string): Promise<void> {
    const tokenDoc = await tokenRepository.findByRefreshToken(refreshToken);

    if (!tokenDoc) {
      throw new ApiError("Refresh token not found", 404);
    }

    await tokenRepository.revokeToken(refreshToken);
  }
}

export const authService = new AuthService();
