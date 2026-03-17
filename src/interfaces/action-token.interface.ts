import { ActionTokenTypeEnum } from "../enums/action-token-type.enum";

export interface IActionToken {
  _id?: string;
  _userId?: string;
  token: string;
  type: ActionTokenTypeEnum;
  refreshToken: string;
}
