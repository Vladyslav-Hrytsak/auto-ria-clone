import { Router } from "express";

import { userController } from "../controllers/user.controller";
import { Permissions } from "../enums/permissions.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { banMiddleware } from "../middlewares/ban.middleware";
import { checkPermission } from "../middlewares/checkPermission.middleware";
import { fileMiddleware } from "../middlewares/file.middleware";

const router = Router();

router.patch(
  "/account-type",
  authMiddleware.checkAccessToken,
  banMiddleware,
  checkPermission([Permissions.USER_UPGRADE_ACCOUNT]),
  userController.changeAccountType,
);

router.post(
  "/me/avatar",
  authMiddleware.checkAccessToken,
  fileMiddleware.isFileValid(10),
  userController.uploadAvatar,
);

router.put(
  "/me/delete-avatar",
  authMiddleware.checkAccessToken,
  userController.deleteAvatar,
);


export const userRouter = router;
