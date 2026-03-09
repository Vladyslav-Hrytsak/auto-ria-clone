import { brandRepository } from "../repositories/brand.repository";

class BrandService {
  public async getAllBrands() {
    return await brandRepository.getAllBrands();
  }

  public async getModelsByBrand(brandId: string) {
    return await brandRepository.getModelsByBrand(brandId);
  }
}

export const brandService = new BrandService();
