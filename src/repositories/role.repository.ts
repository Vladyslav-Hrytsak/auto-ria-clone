import { Role } from "../models/role.model";

class RoleRepository {
  public async findByName(name: string) {
    return await Role.findOne({ name });
  }
}

export const roleRepository = new RoleRepository();
