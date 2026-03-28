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
import { IRole } from "../interfaces/role.interface";
import { ITokenPayload } from "../interfaces/token.interface";
import {
  IChangePassword,
  IResetPasswordSend,
  IResetPasswordSet,
} from "../interfaces/user.interface";
import { Role } from "../models/role.model";
import { actionTokenRepository } from "../repositories/action-token.repository";
import { oldPasswordRepository } from "../repositories/old-password.repository";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { passwordService } from "./password.service";
import { sendGridService } from "./send-grid.service";
import { tokenService } from "./token.service";

class AuthService {
  public async register(data: RegisterDto) {
    const { email, password, name, phone, sellerType, avatar } = data;

    const normalizedEmail = email.toLowerCase().trim();

    const existingEmail = await userRepository.findByEmail(normalizedEmail);

    if (existingEmail) {
      throw new ApiError("Email already exists", 400);
    }

    const existingPhone = await userRepository.findByPhone(phone);

    if (existingPhone) {
      throw new ApiError("Phone already exists", 400);
    }

    const buyerRole: IRole = await Role.findOne({ name: "buyer" });

    if (!buyerRole) {
      throw new ApiError("Buyer role not found", 500);
    }
    const hashedPassword = await passwordService.hash(password);

    const user = await userRepository.createUser({
      email: normalizedEmail,
      password: hashedPassword,
      name,
      phone: phone ?? null,
      sellerType: sellerType ?? SellerTypeEnum.PRIVATE,
      avatar: avatar ?? null,
      roles: [buyerRole._id],
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
      { userId: user._id.toString(), role: buyerRole.name as RolesEnum },
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

  public async logoutAll(accessToken): Promise<void> {
    const payload = tokenService.verifyToken(accessToken, TokenTypeEnum.ACCESS);
    if (!payload) {
      throw new ApiError("Refresh token is not valid", 404);
    }
    const user = await userRepository.findById(payload.userId);
    await tokenRepository.deleteManyByParams({ _userId: payload.userId });
    await sendGridService.sendByType(user.email, EmailTypeEnum.LOGOUT, {
      name: user.name,
    });
  }

  public async forgotPasswordSendEmail(dto: IResetPasswordSend): Promise<void> {
    const user = await userRepository.findByEmail(dto.email);
    if (!user) {
      throw new ApiError("User not found", 401);
    }
    const token = tokenService.generateResetToken(
      {
        userId: user._id.toString(),
        role: user.roles[0].toString() as unknown as RolesEnum,
      },
      ActionTokenTypeEnum.FORGOT_PASSWORD,
    );
    await actionTokenRepository.create({
      token,
      type: ActionTokenTypeEnum.FORGOT_PASSWORD,
      _userId: user._id.toString(),
    });
    await sendGridService.sendByType(user.email, EmailTypeEnum.RESET_PASSWORD, {
      name: user.name,
      frontUrl: config.FRONT_URL,
      actionToken: token,
    });
  }

  public async forgotPasswordSet(
    dto: IResetPasswordSet,
    jwtPayload: ITokenPayload,
  ): Promise<void> {
    const user = await userRepository.getByID(jwtPayload.userId);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const isSameAsCurrent = await passwordService.compare(
      dto.password,
      user.password,
    );

    if (isSameAsCurrent) {
      throw new ApiError("New password must differ from current password", 409);
    }

    const oldPasswords = await oldPasswordRepository.getByUserId(
      jwtPayload.userId,
    );

    for (const oldPass of oldPasswords) {
      const isSame = await passwordService.compare(
        dto.password,
        oldPass.password,
      );

      if (isSame) {
        throw new ApiError(
          "You cannot reuse one of your previous passwords",
          409,
        );
      }
    }

    await oldPasswordRepository.create({
      _userId: jwtPayload.userId,
      password: user.password,
    });

    const hashedPassword = await passwordService.hash(dto.password);

    await userRepository.putByID(jwtPayload.userId, {
      password: hashedPassword,
    });

    await actionTokenRepository.deleteManyByParams({
      _userId: jwtPayload.userId,
      type: ActionTokenTypeEnum.FORGOT_PASSWORD,
    });
  }

  public async changePassword(
    jwtPayload: ITokenPayload,
    dto: IChangePassword,
  ): Promise<void> {
    const user = await userRepository.getByID(jwtPayload.userId);
    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const isPasswordCorrect = await passwordService.compare(
      dto.password,
      user.password,
    );

    if (!isPasswordCorrect) {
      throw new ApiError("Invalid previous password", 401);
    }

    const isSameAsCurrent = await passwordService.compare(
      dto.newPassword,
      user.password,
    );

    if (isSameAsCurrent) {
      throw new ApiError("New password must differ from current password", 409);
    }

    const oldPasswords = await oldPasswordRepository.getByUserId(
      jwtPayload.userId,
    );

    for (const oldPass of oldPasswords) {
      const isSame = await passwordService.compare(
        dto.newPassword,
        oldPass.password,
      );

      if (isSame) {
        throw new ApiError(
          "You cannot reuse one of your previous passwords",
          409,
        );
      }
    }

    await oldPasswordRepository.create({
      _userId: jwtPayload.userId,
      password: user.password,
    });

    const hashedPassword = await passwordService.hash(dto.newPassword);

    await userRepository.putByID(jwtPayload.userId, {
      password: hashedPassword,
    });
    await actionTokenRepository.deleteManyByParams({
      _userId: jwtPayload.userId,
    });
  }

  public async verifyUser(jwtPayload: ITokenPayload): Promise<void> {
    const user = await userRepository.findById(jwtPayload.userId);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    if (user.isVerified) {
      throw new ApiError("User already verified", 400);
    }

    await userRepository.verifyUser(jwtPayload.userId);

    await actionTokenRepository.deleteManyByParams({
      _userId: jwtPayload.userId,
      type: ActionTokenTypeEnum.VERIFY,
    });

    await sendGridService.sendByType(user.email, EmailTypeEnum.WELCOME, {
      name: user.name,
      frontUrl: config.FRONT_URL,
    });
  }
}

export const authService = new AuthService();
