import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/api-error";
import { permissionService } from "../services/permission.service";

export const checkPermission = (requiredPermissions: string[]) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        throw new ApiError("Unauthorized", 401);
      }

      const permissions = await permissionService.getPermissionsByRoles(
        req.user.roles,
      );

      const hasPermission = requiredPermissions.every((permission) =>
        permissions.includes(permission),
      );

      if (!hasPermission) {
        throw new ApiError("Forbidden", 403);
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
