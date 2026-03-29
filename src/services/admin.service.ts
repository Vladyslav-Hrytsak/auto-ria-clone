import { config } from "../config/configs";
import { AccountType } from "../enums/accountType.enum";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { RolesEnum } from "../enums/roles.enum";
import { ApiError } from "../errors/api-error";
import { IUsersQuery } from "../interfaces/usersQuery.interface";
import { roleRepository } from "../repositories/role.repository";
import { userRepository } from "../repositories/user.repository";
import { sendGridService } from "./send-grid.service";

class AdminService {
  public async assignManager(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const managerRole = await roleRepository.findByName(RolesEnum.MANAGER);

    if (!managerRole) {
      throw new ApiError("Manager role not found", 404);
    }

    user.roles = [managerRole._id];

    await user.save();

    return {
      message: "Manager role assigned",
    };
  }

  public async deleteManager(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const managerRole = await roleRepository.findByName(RolesEnum.SELLER);

    if (!managerRole) {
      throw new ApiError("Role not found", 404);
    }

    user.roles = [managerRole._id];

    await user.save();

    return {
      message: "Manager role delete",
    };
  }

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

  public async getAllUsers(query: IUsersQuery) {
    const [data, total] = await userRepository.getAllUsers(query);

    return {
      data,
      total,
      page: Number(query.page),
      limit: Number(query.limit),
      totalPages: Math.ceil(total / query.limit),
    };
  }
}

export const adminService = new AdminService();
