import { Router } from "express";

import { adminController } from "../controllers/admin.controller";
import { Permissions } from "../enums/permissions.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkPermission } from "../middlewares/checkPermission.middleware";

const router = Router();

router.patch(
  "/users/:id/assign-manager",
  authMiddleware.checkAccessToken,
  checkPermission([Permissions.ROLE_MANAGE]),
  adminController.assignManager,
);

export const adminRouter = router;
