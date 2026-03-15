import { ICarBrand, ICarModel } from "../interfaces/car.interface";
import { Brand } from "../models/brand.model";
import { CarBrand } from "../models/carBrand.model";
import { CarModel } from "../models/carModel.model";

class BrandRepository {
  public async getAllBrands(): Promise<ICarBrand[]> {
    return await CarBrand.find().sort({ name: 1 });
  }

  public async getModelsByBrand(brandId: string): Promise<ICarModel[]> {
    return await CarModel.find({ brand: brandId }).sort({ name: 1 });
  }

  public async create(name: string) {
    return await Brand.create({ name });
  }
}

export const brandRepository = new BrandRepository();
