import { Router } from "express";

import { carListingController } from "../controllers/carListing.controller";
import { Permissions } from "../enums/permissions.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { banMiddleware } from "../middlewares/ban.middleware";
import { checkPermission } from "../middlewares/checkPermission.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware.checkAccessToken,
  banMiddleware,
  checkPermission([Permissions.LISTING_CREATE]),
  carListingController.createListing,
);
router.patch(
  "/:id",
  authMiddleware.checkAccessToken,
  banMiddleware,
  checkPermission([Permissions.LISTING_EDIT_OWN]),
  carListingController.updateListing,
);

router.get(
  "/stats/:id",
  authMiddleware.checkAccessToken,
  banMiddleware,
  checkPermission([Permissions.STATS_VIEW]),
  carListingController.getListingStats,
);

// router.get(
//     "/:id",
//     checkPermission([Permissions.LISTING_VIEW]),
//     carListingController.getListing,
// );

export const carListingRouter = router;
