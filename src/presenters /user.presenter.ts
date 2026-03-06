import { IUser, IUserResponse } from "../interfaces/user.interface";

class UserPresenter {
  toPublicResDto(entity: IUser): IUserResponse {
    return {
      _id: entity._id,
      email: entity.email,
      roles: entity.roles,
      accountType: entity.accountType,
      isBanned: entity.isBanned,
    };
  }
}

export const userPresenter = new UserPresenter();
