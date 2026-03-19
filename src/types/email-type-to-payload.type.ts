import { EmailTypeEnum } from "../enums/email-type.enum";
import { EmailCombinedPayloadType } from "./email-combined-payload.type";
import { PickRequired } from "./pick-required.type";

export type emailTypeToPayload = {
  [EmailTypeEnum.RESET_PASSWORD]: PickRequired<
    //+
    EmailCombinedPayloadType,
    "name" | "frontUrl" | "actionToken"
  >;
  [EmailTypeEnum.DELETE]: PickRequired<
    //+
    EmailCombinedPayloadType,
    "name" | "frontUrl" | "actionToken"
  >;
  [EmailTypeEnum.OLD_VISIT]: PickRequired<
    //+
    EmailCombinedPayloadType,
    "name" | "frontUrl"
  >;
  [EmailTypeEnum.VERIFIED]: PickRequired<
    //+
    EmailCombinedPayloadType,
    "actionToken" | "frontUrl"
  >;
  [EmailTypeEnum.LISTING_APPROVED]: PickRequired<
    //+
    EmailCombinedPayloadType,
    "carTitle" | "frontUrl"
  >;
  [EmailTypeEnum.LISTING_EDITING]: PickRequired<
    //+
    EmailCombinedPayloadType,
    "carTitle" | "attemptsLeft" | "frontUrl"
  >;
  [EmailTypeEnum.LISTING_INACTIVE]: PickRequired<
    //+
    EmailCombinedPayloadType,
    "carTitle" | "frontUrl"
  >;
  [EmailTypeEnum.CHANGE_ACCOUNT_TYPE]: PickRequired<
    //+
    EmailCombinedPayloadType,
    "accountType" | "frontUrl"
  >;
  [EmailTypeEnum.ACCOUNT_BANNED]: PickRequired<
    //+
    EmailCombinedPayloadType,
    "name" | "banReason"
  >;
  [EmailTypeEnum.WELCOME]: PickRequired<
    //+
    EmailCombinedPayloadType,
    "name" | "frontUrl"
  >;
  [EmailTypeEnum.ACCOUNT_UNBANNED]: PickRequired<
    //+
    EmailCombinedPayloadType,
    "name" | "frontUrl"
  >;
  [EmailTypeEnum.LOGOUT]: PickRequired<EmailCombinedPayloadType, "name">; //+

  [EmailTypeEnum.BRAND_MODEL_REQUEST]: PickRequired<
    //+
    EmailCombinedPayloadType,
    "brandName" | "modelName" | "sellerId" | "message"
  >;

  [EmailTypeEnum.LISTING_DELETED]: PickRequired<
    //+
    EmailCombinedPayloadType,
    "carTitle" | "frontUrl"
  >;
};
