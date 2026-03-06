import { permissionRepository } from "../repositories/permission.repository";

class PermissionService {
  public async getPermissionsByRoles(roleIds: string[]) {
    const rolePermissions = await permissionRepository.findPermission(roleIds);

    return rolePermissions.map((rp: any) => rp.permission.name);
  }
}

export const permissionService = new PermissionService();
