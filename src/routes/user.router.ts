import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { Permissions } from "../enums/permissions.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { banMiddleware } from "../middlewares/ban.middleware";
import { checkPermission } from "../middlewares/checkPermission.middleware";
import { fileMiddleware } from "../middlewares/file.middleware";

const router = Router();

router.patch(
  "/me/account-type",
  authMiddleware.checkAccessToken,
  banMiddleware,
  checkPermission([Permissions.USER_UPGRADE_ACCOUNT]),
  userController.changeAccountType,
);

router.post(
  "/me/avatar",
  authMiddleware.checkAccessToken,
  fileMiddleware.validateImages("avatar", 1, 10),
  userController.uploadAvatar,
);

router.put(
  "/me/delete-avatar",
  authMiddleware.checkAccessToken,
  userController.deleteAvatar,
);

router.delete(
  "/me/delete",
  authMiddleware.checkAccessToken,
  userController.deleteAccount,
);

router.delete(
  "/me/delete-listing/:id",
  authMiddleware.checkAccessToken,
  userController.deleteListing,
);

export const userRouter = router;
