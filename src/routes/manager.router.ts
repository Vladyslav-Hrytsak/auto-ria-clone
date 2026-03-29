import { Router } from "express";

import { adminController } from "../controllers/admin.controller";
import { managerController } from "../controllers/manager.controller";
import { Permissions } from "../enums/permissions.enum";
import { authMiddleware } from "../middlewares/auth.middleware";
import { checkPermission } from "../middlewares/checkPermission.middleware";
import { validationMiddleware } from "../middlewares/validate.middelware";
import { userQueryValidator } from "../validators/user.validator";

const router = Router();

router.delete(
  "/soft/listings/:id",
  authMiddleware.checkAccessToken,
  checkPermission([Permissions.LISTING_DELETE_ANY]),
  managerController.softDeleteListing,
);

router.delete(
  "/listings/:id",
  authMiddleware.checkAccessToken,
  checkPermission([Permissions.LISTING_DELETE_ANY]),
  managerController.deleteListing,
);

router.patch(
  "/users/:id/ban",
  authMiddleware.checkAccessToken,
  checkPermission([Permissions.USER_BAN]),
  managerController.banUser,
);

router.patch(
  "/users/:id/unban",
  authMiddleware.checkAccessToken,
  checkPermission([Permissions.USER_BAN]),
  managerController.unbanUser,
);

router.patch(
  "/brand-requests/:id",
  authMiddleware.checkAccessToken,
  checkPermission([Permissions.BRAND_REQUEST_MODERATE]),
  managerController.moderateBrandRequest,
);

router.get(
  "/listings/pending",
  authMiddleware.checkAccessToken,
  checkPermission([Permissions.LISTING_VIEW_PENDING]),
  managerController.getPendingListings,
);

router.patch(
  "/listings/:id/status",
  authMiddleware.checkAccessToken,
  checkPermission([Permissions.LISTING_MODERATE]),
  managerController.changeListingStatus,
);

router.get(
  "/get-users",
  authMiddleware.checkAccessToken,
  checkPermission([Permissions.VIEW_ALL_USERS]),
  validationMiddleware.validateQuery(userQueryValidator),
  adminController.getAllUsers,
);

export const managerRouter = router;
