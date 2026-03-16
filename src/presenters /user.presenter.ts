import { config } from "../config/configs";
import { IUser, IUserResponse } from "../interfaces/user.interface";

class UserPresenter {
  toPublicResDto(entity: IUser): IUserResponse {
    return {
      _id: entity._id,
      email: entity.email,
      roles: entity.roles,
      avatar: entity.avatar
        ? `${config.AWS_S3_ENDPOINT}/${entity.avatar}`
        : null,
      accountType: entity.accountType,
      isBanned: entity.isBanned,
    };
  }
}

export const userPresenter = new UserPresenter();
