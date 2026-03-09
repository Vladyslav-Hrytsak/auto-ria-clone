import { ICarBrand, ICarModel } from "../interfaces/car.interface";
import { CarBrand } from "../models/carBrand.model";
import { CarModel } from "../models/carModel";

class BrandRepository {
  public async getAllBrands(): Promise<ICarBrand[]> {
    return await CarBrand.find().sort({ name: 1 });
  }

  public async getModelsByBrand(brandId: string): Promise<ICarModel[]> {
    return await CarModel.find({ brand: brandId }).sort({ name: 1 });
  }
}

export const brandRepository = new BrandRepository();
