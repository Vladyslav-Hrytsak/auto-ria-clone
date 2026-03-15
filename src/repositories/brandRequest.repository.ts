import { BrandRequest } from "../models/brandRequest.model";
import {BrandRequestStatus} from "../enums/brandRequestStatus.enum";

class BrandRequestRepository {
  public async create(data: any) {
    return await BrandRequest.create(data);
  }

  public async findById(id: string) {
    return await BrandRequest.findById(id);
  }

  public async findAllPending() {
    return await BrandRequest.find({ status: "pending" });
  }

  public async updateStatus(requestId: string, status: BrandRequestStatus) {
    return await BrandRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true },
    );
  }

  public async deleteById(id: string) {
    return await BrandRequest.findByIdAndDelete(id);
  }
}

export const brandRequestRepository = new BrandRequestRepository();
