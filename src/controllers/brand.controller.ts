import { NextFunction, Request, Response } from "express";

import { brandService } from "../services/brand.service";

class BrandController {
  public async getAllBrands(req: Request, res: Response, next: NextFunction) {
    try {
      const brands = await brandService.getAllBrands();

      res.json(brands);
    } catch (error) {
      next(error);
    }
  }

  public async getModelsByBrand(
    req: Request,
    res: Response,
    next: NextFunction,
  ) {
    try {
      const { brandId } = req.params;

      const models = await brandService.getModelsByBrand(brandId);

      res.json(models);
    } catch (error) {
      next(error);
    }
  }
}

export const brandController = new BrandController();
