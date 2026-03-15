import { UploadedFile } from "express-fileupload";

import { AccountType } from "../enums/accountType.enum";
import { FileItemTypeEnum } from "../enums/file-item-type.enum";
import { ApiError } from "../errors/api-error";
import { ITokenPayload } from "../interfaces/token.interface";
import { IUser } from "../interfaces/user.interface";
import { userRepository } from "../repositories/user.repository";
import { s3Service } from "./s3.service";

class UserService {
  public async changeAccountType(userId: string, accountType: AccountType) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    user.accountType = accountType;

    await user.save();

    return {
      message: "Account type updated",
      accountType: user.accountType,
    };
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
