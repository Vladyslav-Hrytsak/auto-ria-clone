import { Router } from "express";

import { brandRequestController } from "../controllers/brandRequest.controller";
import { Permissions } from "../enums/permissions.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { banMiddleware } from "../middlewares/ban.middleware";
import { checkPermission } from "../middlewares/checkPermission.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware.checkAccessToken,
  banMiddleware,
  checkPermission([Permissions.BRAND_REQUEST_CREATE]),
  brandRequestController.createRequest,
);

router.get(
  "/",
  authMiddleware.checkAccessToken,
  checkPermission([Permissions.BRAND_REQUEST_MODERATE]),
  brandRequestController.getRequest,
);

export const brandRequestRouter = router;
