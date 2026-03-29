import { Router } from "express";

import { adminController } from "../controllers/admin.controller";
import { Permissions } from "../enums/permissions.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkPermission } from "../middlewares/checkPermission.middleware";
import { validationMiddleware } from "../middlewares/validate.middelware";
import { userQueryValidator } from "../validators/user.validator";

const router = Router();

router.patch(
  "/:id/assign-manager",
  authMiddleware.checkAccessToken,
  checkPermission([Permissions.ROLE_MANAGE]),
  adminController.assignManager,
);

router.patch(
  "/:id/delete-manager",
  authMiddleware.checkAccessToken,
  checkPermission([Permissions.ROLE_MANAGE]),
  adminController.deleteManager,
);

router.patch(
  "/:id/change-account-type",
  authMiddleware.checkAccessToken,
  checkPermission([Permissions.USER_CHANGE_ACCOUNT_TYPE_ANY]),
  adminController.changeAccountType,
);

router.get(
  "/get-users",
  authMiddleware.checkAccessToken,
  checkPermission([Permissions.ROLE_MANAGE]),
  validationMiddleware.validateQuery(userQueryValidator),
  adminController.getAllUsers,
);

export const adminRouter = router;
