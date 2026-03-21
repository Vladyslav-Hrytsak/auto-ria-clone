import { BrandRequestStatus } from "../enums/brandRequestStatus.enum";
import { IBrandRequest } from "../interfaces/brand-equest.interface";
import { BrandRequest } from "../models/brandRequest.model";

class BrandRequestRepository {
  public async create(data: any): Promise<IBrandRequest> {
    return await BrandRequest.create(data);
  }

  public async findById(id: string): Promise<IBrandRequest> {
    return await BrandRequest.findById(id);
  }

  public async findAllPending(): Promise<IBrandRequest[]> {
    return await BrandRequest.find({ status: "pending" });
  }

  public async updateStatus(
    requestId: string,
    status: BrandRequestStatus,
  ): Promise<IBrandRequest> {
    return await BrandRequest.findByIdAndUpdate(
      requestId,
      { status },
      { new: true },
    );
  }

  public async deleteById(id: string): Promise<IBrandRequest> {
    return await BrandRequest.findByIdAndDelete(id);
  }
}

export const brandRequestRepository = new BrandRequestRepository();
