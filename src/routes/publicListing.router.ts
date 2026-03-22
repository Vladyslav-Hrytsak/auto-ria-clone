import { Router } from "express";

import { publicListingController } from "../controllers/publicListing.controller";
import { validationMiddleware } from "../middlewares/validate.middelware";
import { listingQueryValidator } from "../validators/listing.validator";

const router = Router();

/**
 * GET ALL LISTINGS
 */
router.get(
  "/",
  validationMiddleware.validateQuery(listingQueryValidator),
  publicListingController.getAll,
);

/**
 * GET BY ID
 */
router.get(
  "/:id",
  validationMiddleware.isIdValid("id"),
  publicListingController.getById,
);

export const publicListingRouter = router;
