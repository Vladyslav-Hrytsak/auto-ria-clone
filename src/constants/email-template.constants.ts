import { EmailTypeEnum } from "../enums/email-type.enum";

export const emailTemplateConstants = {
  [EmailTypeEnum.WELCOME]: {
    templateId: "d-66cca9c53ee242fbaf5e251b8fef572e",
  },
  [EmailTypeEnum.RESET_PASSWORD]: {
    templateId: "d-babbf8f1f9764c779b4e3c7db21d8259",
  },
  [EmailTypeEnum.DELETE]: {
    templateId: "d-a16f9b5edd95486782d003f75691516a",
  },
  [EmailTypeEnum.OLD_VISIT]: {
    templateId: "d-3424bb3095fa42998149b9072a05e399",
  },
  [EmailTypeEnum.MANAGER_REVIEW]: {
    templateId: "d-41e594ef365a4858a5d5b4653df27291",
  },
  [EmailTypeEnum.VERIFIED]: {
    templateId: "d-f00ba8e4517a498e93655b47e17984dd",
  },
  [EmailTypeEnum.LISTING_APPROVED]: {
    templateId: "d-4b2d185642b24b6b86278221c79b62fc",
  },
  [EmailTypeEnum.LISTING_EDITING]: {
    templateId: "d-8f892748bd0e409aa896f976f37484e9",
  },
  [EmailTypeEnum.PREMIUM_ACTIVATED]: {
    templateId: "d-75edaa4ba74744088cb5a2bb3dc9a1b4",
  },
  [EmailTypeEnum.ACCOUNT_BANNED]: {
    templateId: "d-7cd2b645e6e54622be348961082319a2",
  },
  [EmailTypeEnum.ACCOUNT_UNBANNED]: {
    templateId: "d-5cb901ff64394553985915c7f3919bbf",
  },
};
