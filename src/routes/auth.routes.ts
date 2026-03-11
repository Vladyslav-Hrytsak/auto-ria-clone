import { Router } from "express";

import { authController } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/auth.middleware";
import { validateMiddleware } from "../middlewares/validate.middelware";
import {
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

export const authRouter = router;
