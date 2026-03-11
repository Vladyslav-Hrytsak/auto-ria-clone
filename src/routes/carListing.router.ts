import { Router } from "express";

import { carListingController } from "../controllers/carListing.controller";
import { authMiddleware } from "../middlewares/auth.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware.checkAccessToken,
  carListingController.createListing,
);
router.patch(
  "/:id",
  authMiddleware.checkAccessToken,
  carListingController.updateListing,
);
router.get("/:id", carListingController.getListing);
router.get(
  "/stats/:id",
  authMiddleware.checkAccessToken,
  carListingController.getListingStats,
);

export const carListingRouter = router;
