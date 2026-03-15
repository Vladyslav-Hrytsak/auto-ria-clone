import { CarModel } from "../models/carModel.model";

class ModelRepository {
  public async create(name: string, brandId: string) {
    return await CarModel.create({
      name,
      brand: brandId,
    });
  }
}

export const modelRepository = new ModelRepository();
