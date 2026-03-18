import { CronJob } from "cron";

import { timeHelper } from "../helper/time.helper";
import { oldPasswordRepository } from "../repositories/old-password.repository";

const handler = async () => {
  try {
    const date = timeHelper.subtractByParams(180, "day");
    const deleteCount = await oldPasswordRepository.deleteOlderThan(date);
    console.log(`Deleted ${deleteCount} old tokens`);
  } catch (error) {
    console.error(error);
  }
};

export const removeOldPasswordCronJob = new CronJob("0 0 3 * * *", handler);
