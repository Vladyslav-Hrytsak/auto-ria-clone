import { OrderEnum } from "../enums/order.enum";
import { RolesEnum } from "../enums/roles.enum";
import { ApiError } from "../errors/api-error";
import { IUser } from "../interfaces/user.interface";
import { IUsersQuery } from "../interfaces/usersQuery.interface";
import { Role } from "../models/role.model";
import { User } from "../models/user.model";
import { roleRepository } from "./role.repository";

class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async findByPhone(phone: string): Promise<IUser | null> {
    return await User.findOne({ phone });
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

  public async getAllUsers(query: IUsersQuery): Promise<[IUser[], number]> {
    const filter: any = {
      isDeleted: false,
    };
    if (query.search) {
      filter.$or = [
        { email: { $regex: query.search, $options: "i" } },
        { name: { $regex: query.search, $options: "i" } },
      ];
    }

    if (query.accountType) filter.accountType = query.accountType;
    if (typeof query.isBanned === "boolean") filter.isBanned = query.isBanned;

    const limit = Number(query.limit) || 10;
    const page = Number(query.page) || 1;
    const skip = limit * (page - 1);

    const sortOrder = query.order === OrderEnum.ASC ? 1 : -1;
    const sortField = query.orderBy || "createdAt";
    const sort = { [sortField]: sortOrder };

    return await Promise.all([
      User.find(filter)
        .select("-password")
        .populate("roles")
        .limit(limit)
        .skip(skip)
        .sort(sort as any)
        .lean(),

      User.countDocuments(filter),
    ]);
  }
}

export const userRepository = new UserRepository();
