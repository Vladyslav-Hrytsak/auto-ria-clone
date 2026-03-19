import { NextFunction, Response } from "express";

import { adminService } from "../services/admin.service";
import { AuthRequest } from "../types/authRequest.interface";

class AdminController {
  public async assignManager(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;

      const result = await adminService.assignManager(id);

      res.json(result);
    } catch (e) {
      next(e);
    }
  }

  public async deleteManager(
    req: AuthRequest,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { id } = req.params;

      const result = await adminService.deleteManager(id);

      res.json(result);
    } catch (e) {
      next(e);
    }
  }
}

export const adminController = new AdminController();
