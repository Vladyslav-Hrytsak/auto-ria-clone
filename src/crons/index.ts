import { currencyCronJob } from "./currencyCron";
import { removeOldPasswordCronJob } from "./remove-old-password.cron";
import { removeOldTokenCronJob } from "./remove-old-token.cron";
import { sendEmailOldVisitCronJob } from "./send-old-visit.cron";

export const cronRunner = () => {
  currencyCronJob.start();
  removeOldTokenCronJob.start();
  removeOldPasswordCronJob.start();
  sendEmailOldVisitCronJob.start();
};
