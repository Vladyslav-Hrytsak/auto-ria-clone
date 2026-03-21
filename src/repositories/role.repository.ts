import { IRole } from "../interfaces/role.interface";
import { Role } from "../models/role.model";

class RoleRepository {
  public async findByName(name: string): Promise<IRole | null> {
    return await Role.findOne({ name });
  }
}

export const roleRepository = new RoleRepository();
