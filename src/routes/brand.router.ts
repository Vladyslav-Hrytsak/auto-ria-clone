import { Router } from "express";

import { brandController } from "../controllers/brand.controller";

const router = Router();

router.get("/", brandController.getAllBrands);

router.get("/models/:brandId", brandController.getModelsByBrand);

export const brandRouter = router;
