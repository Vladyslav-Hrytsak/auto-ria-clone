import { Roles } from "../enums/roles.enum";

export interface RegisterDto {
  email: string;
  password: string;
  role: Roles;
}
