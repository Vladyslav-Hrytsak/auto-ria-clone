import { Router } from "express";

import { carListingController } from "../controllers/carListing.controller";
import { Permissions } from "../enums/permissions.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { banMiddleware } from "../middlewares/ban.middleware";
import { checkPermission } from "../middlewares/checkPermission.middleware";
import { fileMiddleware } from "../middlewares/file.middleware";
import { validationMiddleware } from "../middlewares/validate.middelware";
import {
  createListingValidator,
  updateListingValidator,
} from "../validators/listing.validator";
import { deletePhotoValidator } from "../validators/user.validator";

const router = Router();

/**
 * CREATE LISTING
 */
router.post(
  "/",
  authMiddleware.checkAccessToken,
  banMiddleware,
  validationMiddleware.validateBody(createListingValidator),
  // checkPermission([Permissions.LISTING_CREATE]),
  carListingController.createListing,
);

/**
 * UPDATE LISTING
 */
router.patch(
  "/:id",
  authMiddleware.checkAccessToken,
  banMiddleware,
  validationMiddleware.isIdValid("id"),
  validationMiddleware.validateBody(updateListingValidator),
  checkPermission([Permissions.LISTING_EDIT_OWN]),
  carListingController.updateListing,
);

/**
 * UPLOAD PHOTOS
 */
router.post(
  "/:id/photos",
  authMiddleware.checkAccessToken,
  banMiddleware,
  validationMiddleware.isIdValid("id"),
  fileMiddleware.validateImages("photos", 10, 10),
  checkPermission([Permissions.LISTING_EDIT_OWN]),
  carListingController.uploadPhotos,
);

/**
 * DELETE PHOTO
 */
router.delete(
  "/:id/photos",
  authMiddleware.checkAccessToken,
  banMiddleware,
  validationMiddleware.isIdValid("id"),
  validationMiddleware.validateBody(deletePhotoValidator),
  checkPermission([Permissions.LISTING_EDIT_OWN]),
  carListingController.deletePhoto,
);

/**
 * GET STATS
 */
router.get(
  "/stats/:id",
  authMiddleware.checkAccessToken,
  banMiddleware,
  validationMiddleware.isIdValid("id"),
  checkPermission([Permissions.STATS_VIEW]),
  carListingController.getListingStats,
);

export const carListingRouter = router;
