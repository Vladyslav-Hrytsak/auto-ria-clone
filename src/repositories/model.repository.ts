import { ICarModel } from "../interfaces/car.interface";
import { CarModel } from "../models/carModel.model";

class ModelRepository {
  public async create(name: string, brandId: string): Promise<ICarModel> {
    return await CarModel.create({
      name,
      brand: brandId,
    });
  }
}

export const modelRepository = new ModelRepository();
