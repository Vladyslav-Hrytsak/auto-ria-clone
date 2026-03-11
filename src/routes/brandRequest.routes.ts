import { Router } from "express";

import { brandRequestController } from "../controllers/brandRequest.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/brands-request",
  authMiddleware.checkAccessToken,
  brandRequestController.createRequest,
);

export const brandRequestRouter = router;
