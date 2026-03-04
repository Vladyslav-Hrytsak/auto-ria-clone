import { Router } from "express";

import { authController } from "../controllers/auth.controller";

const router = Router();

router.post("/register", (req, res, next) =>
  authController.register(req, res, next),
);

export const authRouter = router;
