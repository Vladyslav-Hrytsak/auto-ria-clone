import { currencyCronJob } from "./currencyCron";

export const cronRunner = () => {
  currencyCronJob.start();
};
