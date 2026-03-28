import { Router } from "express";

import { contactController } from "../controllers/contact.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/:listingId",
  authMiddleware.checkAccessToken,
  contactController.contactSeller,
);

export const contactRouter = router;
