import { Types } from "mongoose";

import { IRolePermission } from "../interfaces/rolePermission.interface";
import { RolePermission } from "../models/rolePermission.model";

class PermissionRepository {
  public async findPermissionsByRoles(
    roleIds: Types.ObjectId[],
  ): Promise<IRolePermission[]> {
    return await RolePermission.find({
      role: { $in: roleIds },
    }).populate("permission");
  }
}

export const permissionRepository = new PermissionRepository();
