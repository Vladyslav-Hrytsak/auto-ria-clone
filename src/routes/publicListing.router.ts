import { Router } from "express";

import { publicListingController } from "../controllers/publicListing.controller";

const router = Router();

router.get("/", publicListingController.getAll);

router.get("/:id", publicListingController.getById);

export const publicListingRouter = router;
