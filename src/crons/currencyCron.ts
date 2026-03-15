import { CronJob } from "cron";

import { currencyService } from "../services/currency.service";

const handler = async () => {
  try {
    await currencyService.updateDailyRate();
    console.log("Currency updated");
  } catch (e) {
    console.log("Currency update error", e);
  }
};

export const currencyCronJob = new CronJob(
  "0 6 * * *",
  handler,
  null,
  false,
  "Europe/Kyiv",
);
