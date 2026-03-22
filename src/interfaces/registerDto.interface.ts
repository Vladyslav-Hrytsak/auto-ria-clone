import { SellerTypeEnum } from "../enums/sellerType.enum";

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  phone: string;
  sellerType: SellerTypeEnum;
  avatar?: string | null;
}
