import { UploadedFile } from "express-fileupload";

import { config } from "../config/configs";
import { AccountType } from "../enums/accountType.enum";
import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { FileItemTypeEnum } from "../enums/file-item-type.enum";
import { RolesEnum } from "../enums/roles.enum";
import { ApiError } from "../errors/api-error";
import { ITokenPayload } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { actionTokenRepository } from "../repositories/action-token.repository";
import { userRepository } from "../repositories/user.repository";
import { s3Service } from "./s3.service";
import { sendGridService } from "./send-grid.service";
import { tokenService } from "./token.service";

class UserService {
  public async changeAccountType(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new ApiError("User not found", 404);
    }
    const newType =
      user.accountType === AccountType.PREMIUM
        ? AccountType.BASIC
        : AccountType.PREMIUM;

    if (!Object.values(AccountType).includes(newType)) {
      throw new ApiError("Incorrect account type in database", 400);
    }
    user.accountType = newType;
    await user.save();

    await sendGridService.sendByType(
      user.email,
      EmailTypeEnum.CHANGE_ACCOUNT_TYPE,
      {
        frontUrl: config.FRONT_URL,
        accountType: newType,
      },
    );

    return {
      message: "Account type updated",
      accountType: user.accountType,
    };
  }

  public async deleteAccount(jwtPayload: ITokenPayload): Promise<IUser> {
    const user = await userRepository.getByID(jwtPayload.userId);
    if (user) {
      await userRepository.deleteById(user._id.toString());
      const deleteToken = tokenService.generateResetToken(
        {
          userId: user._id.toString(),
          role: user.roles[0].toString() as unknown as RolesEnum,
        },
        ActionTokenTypeEnum.DELETE,
      );
      await actionTokenRepository.create({
        token: deleteToken,
        type: ActionTokenTypeEnum.DELETE,
        _userId: user._id.toString(),
      });
      await sendGridService.sendByType(user.email, EmailTypeEnum.DELETE, {
        name: user.name,
        frontUrl: process.env.FRONT_URL,
        actionToken: deleteToken,
      });
    }
    return user;
  }

  public async uploadAvatar(jwtPayload, file: UploadedFile): Promise<IUser> {
    const user = await userRepository.getByID(jwtPayload);
    const avatar = await s3Service.uploadFile(
      file,
      FileItemTypeEnum.USER,
      user._id.toString(),
    );
    const updateUser = await userRepository.putByID(user._id.toString(), {
      avatar,
    });
    if (user.avatar) {
      await s3Service.deleteFile(user.avatar);
    }
    return updateUser;
  }

  public async deleteAvatar(jwtPayload: ITokenPayload): Promise<IUser> {
    const user = await userRepository.getByID(jwtPayload.userId);
    if (user.avatar) {
      await s3Service.deleteFile(user.avatar);
      return await userRepository.putByID(user._id.toString(), {
        avatar: null,
      });
    }
    return user;
  }
}

export const userService = new UserService();
