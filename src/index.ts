import express, { NextFunction, Request, Response } from "express";
import mongoose from "mongoose";

import { config } from "./config/configs";
import { ApiError } from "./errors/api-error";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

process.on("uncaughtException", (err: Error) => {
  console.error("uncaughtException", err.message, err.stack);
  process.exit(1);
});

const start = async () => {
  try {
    await mongoose.connect(config.MONGO_URL);
    console.log("MongoDB connected");

    app.listen(config.PORT, () => {
      console.log(`Server is running on http://${config.HOST}:${config.PORT}`);
    });
  } catch (error) {
    console.error("Startup error:", error);
    process.exit(1);
  }
};

app.use((error: ApiError, req: Request, res: Response, next: NextFunction) => {
  res.status(error.status || 500).json({
    message: error.message || "Internal Server Error",
  });
});

start();
