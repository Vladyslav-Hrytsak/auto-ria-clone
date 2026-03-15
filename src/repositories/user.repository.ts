import { IUser } from "../interfaces/user.interface";
import { User } from "../models/user.model";

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

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }

  public async putByID(id: string, dto: Partial<IUser>): Promise<IUser | null> {
    return await User.findByIdAndUpdate(id, dto, { new: true });
  }
}

export const userRepository = new UserRepository();
