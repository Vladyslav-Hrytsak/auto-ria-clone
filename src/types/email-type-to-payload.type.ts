import { EmailTypeEnum } from "../enums/email-type.enum";
import { EmailCombinedPayloadType } from "./email-combined-payload.type";
import { PickRequired } from "./pick-required.type";

export type emailTypeToPayload = {
  [EmailTypeEnum.RESET_PASSWORD]: PickRequired<
    EmailCombinedPayloadType,
    "name" | "frontUrl" | "actionToken"
  >;
  [EmailTypeEnum.DELETE]: PickRequired<
    EmailCombinedPayloadType,
    "name" | "frontUrl" | "actionToken"
  >;
  [EmailTypeEnum.OLD_VISIT]: PickRequired<
    EmailCombinedPayloadType,
    "name" | "frontUrl"
  >;
  [EmailTypeEnum.MANAGER_REVIEW]: PickRequired<
    EmailCombinedPayloadType,
    "name" | "frontUrl" | "sellerName" | "sellerId" | "listingId"
  >;
  [EmailTypeEnum.VERIFIED]: PickRequired<
    EmailCombinedPayloadType,
    "actionToken" | "frontUrl"
  >;
  [EmailTypeEnum.LISTING_APPROVED]: PickRequired<
    EmailCombinedPayloadType,
    "carTitle" | "frontUrl" | "listingId"
  >;
  [EmailTypeEnum.LISTING_EDITING]: PickRequired<
    EmailCombinedPayloadType,
    "carTitle" | "attemptsLeft" | "frontUrl"
  >;
  [EmailTypeEnum.PREMIUM_ACTIVATED]: PickRequired<
    EmailCombinedPayloadType,
    "expireDate" | "frontUrl"
  >;
  [EmailTypeEnum.ACCOUNT_BANNED]: PickRequired<
    EmailCombinedPayloadType,
    "name" | "banReason"
  >;
  [EmailTypeEnum.WELCOME]: PickRequired<
    EmailCombinedPayloadType,
    "name" | "frontUrl"
  >;
  [EmailTypeEnum.ACCOUNT_UNBANNED]: PickRequired<
    EmailCombinedPayloadType,
    "name" | "frontUrl"
  >;
};
