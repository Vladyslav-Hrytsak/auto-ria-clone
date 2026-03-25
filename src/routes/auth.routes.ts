import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validationMiddleware } from "../middlewares/validate.middelware";
import {
  changePassword,
  changePasswordFromUser,
  forgotPasswordValidator,
  loginValidator,
  registerValidator,
} from "../validators/user.validator";

const router = Router();

/**
 * REGISTER
 */
router.post(
  "/register",
  validationMiddleware.validateBody(registerValidator),
  authController.register,
);

/**
 * LOGIN
 */
router.post(
  "/login",
  validationMiddleware.validateBody(loginValidator),
  authController.login,
);

/**
 * REFRESH
 */
router.post(
  "/refresh",
  authMiddleware.checkRefreshToken,
  authController.refresh,
);

/**
 * LOGOUT
 */
router.post("/logout", authMiddleware.checkRefreshToken, authController.logout);

/**
 * LOGOUT ALL
 */
router.post(
  "/logout-all",
  authMiddleware.checkAccessToken,
  authController.logoutAll,
);

/**
 * FORGOT PASSWORD (SEND EMAIL)
 */
router.post(
  "/forgot-password",
  validationMiddleware.validateBody(forgotPasswordValidator),
  authController.forgotPasswordSendEmail,
);

/**
 * SET NEW PASSWORD
 */
router.put(
  "/forgot-password",
  authMiddleware.checkActionToken,
  validationMiddleware.validateBody(changePassword),
  authController.forgotPasswordSet,
);

/**
 * CHANGE PASSWORD
 */
router.post(
  "/change-password",
  authMiddleware.checkAccessToken,
  validationMiddleware.validateBody(changePasswordFromUser),
  authController.changePassword,
);

/**
 * VERIFY EMAIL
 */
router.put(
  "/verify",
  authMiddleware.checkVerifyToken,
  authController.verifyUser,
);

export const authRouter = router;
