import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import { config } from "./src/config/configs";
import { ApiError } from "./src/errors/api-error";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

process.on("uncaughtException", (err: Error) => {
  console.error("uncaughtException", err.message, err.stack);
  process.exit(1);
});

app.use(
  "*",
  (error: ApiError, req: Request, res: Response, next: NextFunction) => {
    res.status(error.status || 500).send(error.message);
  },
);

app.listen(config.PORT, async () => {
  await mongoose.connect(config.MONGO_URL);
  console.log(`Server is running on http://${config.HOST}:${config.PORT}`);
});
