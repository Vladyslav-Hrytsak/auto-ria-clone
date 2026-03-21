import { Router } from "express";

import { contactController } from "../controllers/contact.controller";
import { Permissions } from "../enums/permissions.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkPermission } from "../middlewares/checkPermission.middleware";

const router = Router();

router.post(
  "/:listingId",
  authMiddleware.checkAccessToken,
  checkPermission([Permissions.USER_CONTACT_SELLER]),
  contactController.contactSeller,
);

export const contactRouter = router;
