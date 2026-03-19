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
  [EmailTypeEnum.VERIFIED]: {
    templateId: "d-f00ba8e4517a498e93655b47e17984dd",
  },
  [EmailTypeEnum.LISTING_APPROVED]: {
    templateId: "d-4b2d185642b24b6b86278221c79b62fc",
  },
  [EmailTypeEnum.LISTING_EDITING]: {
    templateId: "d-8f892748bd0e409aa896f976f37484e9",
  },
  [EmailTypeEnum.CHANGE_ACCOUNT_TYPE]: {
    templateId: "d-75edaa4ba74744088cb5a2bb3dc9a1b4",
  },
  [EmailTypeEnum.ACCOUNT_BANNED]: {
    templateId: "d-7cd2b645e6e54622be348961082319a2",
  },
  [EmailTypeEnum.ACCOUNT_UNBANNED]: {
    templateId: "d-5cb901ff64394553985915c7f3919bbf",
  },
  [EmailTypeEnum.LOGOUT]: {
    templateId: "d-e5827d738f4348debd5e8a0f5091415f",
  },
  [EmailTypeEnum.BRAND_MODEL_REQUEST]: {
    templateId: "d-00ae8c9997b040e391b7162ea15d3a90",
  },

  [EmailTypeEnum.LISTING_INACTIVE]: {
    templateId: "d-aa478e50b07e4fa0a1a6dd7aab3ddec1",
  },
  [EmailTypeEnum.LISTING_DELETED]: {
    templateId: "d-7ea40f4cb17c4c86908c7c7aae7c1531",
  },
};
