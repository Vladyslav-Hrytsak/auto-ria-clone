import { Router } from "express";

import { profanityController } from "../controllers/profanity.controller";
import { Permissions } from "../enums/permissions.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkPermission } from "../middlewares/checkPermission.middleware";

const router = Router();

router.post(
  "/add",
  authMiddleware.checkAccessToken,
  checkPermission([Permissions.PROFANITY_MANAGE]),
  profanityController.addWord,
);

export const profanityRouter = router;
