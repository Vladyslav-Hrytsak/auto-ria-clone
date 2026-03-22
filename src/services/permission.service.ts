import { Types } from "mongoose";

import { IRolePermission } from "../interfaces/rolePermission.interface";
import { permissionRepository } from "../repositories/permission.repository";

class PermissionService {
  public async getPermissionsByRoles(
    roleIds: Types.ObjectId[],
  ): Promise<string[]> {
    const rolePermissions: IRolePermission[] =
      await permissionRepository.findPermissionsByRoles(roleIds);

    return rolePermissions.map((rp): string => {
      const permission = rp.permission as any;
      return permission.name;
    });
  }
}

export const permissionService = new PermissionService();
