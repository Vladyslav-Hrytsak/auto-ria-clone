import { Types } from "mongoose";

import { BrandRequestStatus } from "../enums/brandRequestStatus.enum";

export interface IBrandRequest extends Document {
  brandName: string;
  modelName?: string;
  message?: string;
  user: Types.ObjectId;
  moderatedBy?: Types.ObjectId;
  status: BrandRequestStatus;
  createdAt: Date;
  updatedAt: Date;
}
