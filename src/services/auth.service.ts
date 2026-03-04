import { AccountType } from "../enums/accountType.enum";
import { ApiError } from "../errors/api-error";
import { RegisterDto } from "../interfaces/registerDto.interface";
import { IUser } from "../interfaces/user.interface";
import { Role } from "../models/role.model";
import { userRepository } from "../repositories/user.repository";
import { passwordService } from "./password.service";

class AuthService {
  async register(data: RegisterDto): Promise<IUser> {
    const { email, password, role } = data;

    const existingUser = await userRepository.findByEmail(email);

    if (existingUser) {
      throw new ApiError("User already exists", 400);
    }

    const roleEntity = await Role.findOne({ name: role });

    if (!roleEntity) {
      throw new ApiError("Role not found", 404);
    }

    const hashedPassword = await passwordService.hash(password);

    const user = await userRepository.createUser({
      email,
      password: hashedPassword,
      roles: [roleEntity._id],
      accountType: AccountType.BASIC,
    });

    return user;
  }
}

export const authService = new AuthService();
