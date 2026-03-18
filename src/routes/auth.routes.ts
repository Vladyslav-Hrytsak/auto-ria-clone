import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { commonMiddleware } from "../middlewares/common.middleware";
import { validateMiddleware } from "../middlewares/validate.middelware";
import {
  changePassword,
  loginValidator,
  registerValidator,
} from "../validators/user.validator";

const router = Router();

router.post(
  "/register",
  validateMiddleware.isIdValid(registerValidator),
  authController.register,
);
router.post(
  "/login",
  validateMiddleware.isIdValid(loginValidator),
  authController.login,
);
router.post(
  "/refresh",
  authMiddleware.checkRefreshToken,
  authController.refresh,
);
router.post("/logout", authController.logout);

router.post("/logout-all", authController.logoutAll);

router.post("/forgot-password", authController.forgotPasswordSendEmail);
router.put(
  "/forgot-password",
  authMiddleware.checkActionToken,
  authController.forgotPasswordSet,
);
router.post(
  "/change-password",
  commonMiddleware.isBodyValid(changePassword),
  authMiddleware.checkAccessToken,
  authController.changePassword,
);

router.put(
  "/verify",
  authMiddleware.checkVerifyToken,
  authController.verifyUser,
);

export const authRouter = router;
