import { NextFunction, Request, Response } from "express";

import { ApiError } from "../errors/api-error";
import { RolePermission } from "../models/rolePermission.model";

export const checkPermission = (requiredPermission: string) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      if (!req.user) {
        return next(new ApiError("Unauthorized", 401));
      }
      const userRoles = req.user.roles;
      const rolePermissions = await RolePermission.find({
        role: { $in: userRoles },
      }).populate("permission");

      const hasPermission = rolePermissions.some(
        (rp: any) => rp.permission.name === requiredPermission,
      );

      if (!hasPermission) {
        return next(new ApiError("Forbidden", 403));
      }

      next();
    } catch (error) {
      next(error);
    }
  };
};
