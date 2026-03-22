import { ICarBrand, ICarModel } from "../interfaces/car.interface";
import { brandRepository } from "../repositories/brand.repository";

class BrandService {
  public async getAllBrands(): Promise<ICarBrand[]> {
    return await brandRepository.getAllBrands();
  }

  public async getModelsByBrand(brandId: string): Promise<ICarModel[]> {
    return await brandRepository.getModelsByBrand(brandId);
  }
}

export const brandService = new BrandService();
