import { CronJob } from "cron";

import { config } from "../config/configs";
import { EmailTypeEnum } from "../enums/email-type.enum";
import { timeHelper } from "../helper/time.helper";
import { tokenRepository } from "../repositories/token.repository";
import { userRepository } from "../repositories/user.repository";
import { sendGridService } from "../services/send-grid.service";

const handler = async () => {
  try {
    const date = timeHelper.subtractByParams(7, "day");

    const activeUserIds = await tokenRepository.getActiveUserIds(date);

    const inactiveUsers = await userRepository.getInactiveUsers(activeUserIds);

    if (inactiveUsers.length === 0) return;
    for (const user of inactiveUsers) {
      await sendGridService.sendByType(user.email, EmailTypeEnum.OLD_VISIT, {
        name: user.name,
        frontUrl: config.FRONT_URL_OLD_VISIT,
      });
      console.log(`Sending reminder to: ${user.email}`);
    }
  } catch (error) {
    console.error("Cron Error:", error);
  }
};

export const sendEmailOldVisitCronJob = new CronJob("0 0 12 * * *", handler);
