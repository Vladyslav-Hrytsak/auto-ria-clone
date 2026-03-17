import { config } from "../config/configs";
import { TOKEN_EXPIRATION } from "../constants/constants";
import { AccountType } from "../enums/accountType.enum";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { RolesEnum } from "../enums/roles.enum";
import { SellerTypeEnum } from "../enums/sellerType.enum";
import { TokenTypeEnum } from "../enums/token-type.enum";
import { ApiError } from "../errors/api-error";
import { RegisterDto } from "../interfaces/registerDto.interface";
import { Role } from "../models/role.model";
import { actionTokenRepository } from "../repositories/action-token.repository";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { passwordService } from "./password.service";
import { sendGridService } from "./send-grid.service";
import { tokenService } from "./token.service";

class AuthService {
  public async register(data: RegisterDto) {
    const { email, password, name, phone, sellerType, avatar } = data;

    const normalizedEmail = email.toLowerCase().trim();

    const existingUser = await userRepository.findByEmail(normalizedEmail);

    if (existingUser) {
      throw new ApiError("User already exists", 400);
    }

    const roleEntity = await Role.findOne({ name: "seller" });

    const hashedPassword = await passwordService.hash(password);

    const user = await userRepository.createUser({
      email: normalizedEmail,
      password: hashedPassword,
      name,
      phone: phone ?? null,
      sellerType: sellerType ?? SellerTypeEnum.PRIVATE,
      avatar: avatar ?? null,
      roles: [roleEntity._id],
      accountType: AccountType.BASIC,
    });

    const tokenPair = tokenService.generateTokens({
      userId: user._id.toString(),
      role: user.roles[0].toString() as unknown as RolesEnum,
    });
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION.REFRESH.MS);
    await tokenRepository.create({
      user: user._id,
      refreshToken: tokenPair.refreshToken,
      expiresAt: expiresAt,
    });

    const verifyToken = tokenService.generateResetToken(
      { userId: user._id.toString(), role: roleEntity.name as RolesEnum },
      ActionTokenTypeEnum.VERIFY,
    );
    await actionTokenRepository.create({
      token: verifyToken,
      type: ActionTokenTypeEnum.VERIFY,
      _userId: user._id.toString(),
    });
    await sendGridService.sendByType(user.email, EmailTypeEnum.VERIFIED, {
      frontUrl: config.FRONT_URL,
      actionToken: verifyToken,
    });
    return { user, tokenPair };
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

    const tokenPair = tokenService.generateTokens({
      userId: user._id.toString(),
      role: user.roles[0].toString() as unknown as RolesEnum,
    });
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION.REFRESH.MS);

    await tokenRepository.create({
      user: user._id,
      refreshToken: tokenPair.refreshToken,
      expiresAt: expiresAt,
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

  public async refresh(refreshToken: string) {
    const payload = tokenService.verifyToken(
      refreshToken,
      TokenTypeEnum.REFRESH,
    );
    if (!payload) {
      throw new ApiError("Refresh token is not valid", 404);
    }
    const storedToken = await tokenRepository.findByParams({
      refreshToken,
    });
    if (!storedToken) {
      throw new ApiError("Refresh token not found", 401);
    }

    const user = await userRepository.getByID(payload.userId);
    if (!user) {
      throw new ApiError("User for refresh token not find", 404);
    }
    await tokenRepository.deleteById(storedToken._id.toString());
    const tokenPair = tokenService.generateTokens({
      userId: user._id.toString(),
      role: user.roles[0].toString() as unknown as RolesEnum,
    });
    const expiresAt = new Date(Date.now() + TOKEN_EXPIRATION.REFRESH.MS);

    await tokenRepository.create({
      user: user._id,
      ...tokenPair,
      expiresAt: expiresAt,
    });
    return tokenPair;
  }
  public async logout(refreshToken: string) {
    const payload = tokenService.verifyToken(
      refreshToken,
      TokenTypeEnum.REFRESH,
    );

    if (!payload) {
      throw new ApiError("Refresh token is not valid", 401);
    }
    const storedToken = await tokenRepository.findByParams({
      refreshToken,
    });

    if (!storedToken) {
      throw new ApiError("Refresh token not found", 401);
    }

    await tokenRepository.deleteById(storedToken._id.toString());
  }
  // public async logoutAll(accessToken: string) {
  //   const payload = tokenService.verifyToken(accessToken, TokenTypeEnum.ACCESS);
  //   if (!payload) {
  //     throw new ApiError("Refresh token is not valid", 404);
  //   }
  // }
}

export const authService = new AuthService();
