import { ITokenPair } from "./token.interface";

export interface IAuthResponse extends ITokenPair {
  user: {
    id: string;
    email: string;
    roles: string[];
    accountType: string;
  };
}
