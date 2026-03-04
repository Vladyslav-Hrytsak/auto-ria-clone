import { IUser } from "../interfaces/user.interface";
import { User } from "../models/user.model";

class UserRepository {
  async findByEmail(email: string): Promise<IUser | null> {
    return await User.findOne({ email });
  }

  async createUser(data: Partial<IUser>): Promise<IUser> {
    return await User.create(data);
  }

  async findById(id: string): Promise<IUser | null> {
    return await User.findById(id);
  }
}

export const userRepository = new UserRepository();
