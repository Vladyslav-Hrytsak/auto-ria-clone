import { CronJob } from "cron";

import { config } from "../config/configs";
import { timeHelper } from "../helper/time.helper";
import { tokenRepository } from "../repositories/token.repository";

const handler = async () => {
  try {
    const { value, unit } = timeHelper.parseConfigString(
      config.JWT_REFRESH_EXPIRATION,
    );

    const date = timeHelper.subtractByParams(value, unit);
    const deleteCount = await tokenRepository.deleteBeforeDate(date);
    console.log(`Deleted ${deleteCount} old tokens`);
  } catch (error) {
    console.error(error);
  }
};

export const removeOldTokenCronJob = new CronJob("* 2 * * *", handler);
