import { Types } from "mongoose";

export interface ICarModel {
  name: string;
  brand: Types.ObjectId;
}

export interface ICarBrand {
  name: string;
}
