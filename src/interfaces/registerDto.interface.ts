import { Roles } from "../enums/roles.enum";
import { SellerTypeEnum } from "../enums/sellerType.enum";

export interface RegisterDto {
  email: string;
  password: string;
  name: string;
  phone: string;
  sellerType: SellerTypeEnum;
  role: Roles;
  avatar?: string | null;
}
