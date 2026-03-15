import { ApiError } from "../errors/api-error";
import { roleRepository } from "../repositories/role.repository";
import { userRepository } from "../repositories/user.repository";

class AdminService {
  public async assignManager(userId: string) {
    const user = await userRepository.findById(userId);

    if (!user) {
      throw new ApiError("User not found", 404);
    }

    const managerRole = await roleRepository.findByName("manager");

    if (!managerRole) {
      throw new ApiError("Manager role not found", 404);
    }

    user.roles = [managerRole._id];

    await user.save();

    return {
      message: "Manager role assigned",
    };
  }
}

export const adminService = new AdminService();
