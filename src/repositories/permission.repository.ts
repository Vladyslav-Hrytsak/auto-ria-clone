import { IRolePermission } from "../interfaces/rolePermission.interface";
import { RolePermission } from "../models/rolePermission.model";

class PermissionRepository {
  public async findPermission(roleIds: string[]): Promise<IRolePermission[]> {
    return await RolePermission.find({
      role: { $in: roleIds },
    }).populate("permission");
  }
}

export const permissionRepository = new PermissionRepository();
