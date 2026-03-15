import { EmailTypeEnum } from "../enums/email-type.enum";
import { EmailCombinedPayloadType } from "./email-combined-payload.type";
import { PickRequired } from "./pick-required.type";

export type emailTypeToPayload = {
  [EmailTypeEnum.WELCOME]: PickRequired<
    EmailCombinedPayloadType,
    "name" | "frontUrl" | "actionToken"
  >;
  [EmailTypeEnum.DELETE]: PickRequired<
    EmailCombinedPayloadType,
    "frontUrl" | "actionToken"
  >;
  [EmailTypeEnum.RESET_PASSWORD]: PickRequired<
    EmailCombinedPayloadType,
    "name" | "frontUrl" | "actionToken"
  >;
  [EmailTypeEnum.OLD_VISIT]: PickRequired<
    EmailCombinedPayloadType,
    "name" | "frontUrl"
  >;
};
