import { ApiError } from "../errors/api-error";
import { roleRepository } from "../repositories/role.repository";
import { userRepository } from "../repositories/user.repository";
import {RolesEnum} from "../enums/roles.enum";

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
}

export const adminService = new AdminService();
