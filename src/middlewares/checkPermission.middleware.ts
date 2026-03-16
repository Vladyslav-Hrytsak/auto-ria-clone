import "../models/permission.model";

import { NextFunction, Response } from "express";

import { ApiError } from "../errors/api-error";
import { permissionService } from "../services/permission.service";
import { AuthRequest } from "../types/authRequest.interface";

export const checkPermission = (requiredPermissions: string[]) => {
  return async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new ApiError("Unauthorized", 401));
      }

      const permissions = await permissionService.getPermissionsByRoles(
        req.user.roles,
      );

      const hasPermission = requiredPermissions.some((permission) =>
        permissions.includes(permission),
      );

      if (!hasPermission) {
        return next(new ApiError("Forbidden", 403));
      }

      next();
    } catch (e) {
      next(e);
    }
  };
};
