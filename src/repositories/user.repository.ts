import { RolesEnum } from "../enums/roles.enum";
import { IUser } from "../interfaces/user.interface";
import { User } from "../models/user.model";
import { roleRepository } from "./role.repository";
import {Role} from "../models/role.model";
import {ApiError} from "../errors/api-error";

class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async createUser(data: Partial<IUser>): Promise<IUser> {
    return await User.create(data);
  }

  public async getByID(id: string): Promise<IUser | null> {
    return await User.findById(id).select("+password");
  }

  public async deleteById(id: string): Promise<void> {
    await User.deleteOne({ _id: id });
  }

  public async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  public async putByID(id: string, dto: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, dto, { new: true });
  }

  public async verifyUser(id: string): Promise<void> {
    await User.findByIdAndUpdate(id, { isVerified: true });
  }

  public async getInactiveUsers(activeIds: string[]): Promise<IUser[]> {
    return await User.find({
      _id: { $nin: activeIds },
    });
  }

  public async getUsersByRole(role: RolesEnum): Promise<IUser[]> {
    const roleEntity = await roleRepository.findByName(role);

    if (!roleEntity) {
      return [];
    }

    return await User.find({
      roles: roleEntity._id,
      isDeleted: false,
    });
  }

  public async getManagers(): Promise<IUser[]> {
    return await this.getUsersByRole(RolesEnum.MANAGER);
  }

  public async addRole(userId: string, roleName: string) {
    const role = await Role.findOne({ name: roleName });

    if (!role) {
      throw new ApiError("Role not found", 404);
    }

    return await User.findByIdAndUpdate(
      userId,
      {
        $addToSet: { roles: role._id },
      },
      { new: true },
    );
  }
}

export const userRepository = new UserRepository();
