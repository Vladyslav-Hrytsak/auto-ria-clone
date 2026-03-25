import express, { NextFunction, Request, Response } from "express";
import fileUpload from "express-fileupload";
import mongoose from "mongoose";

import { config } from "./config/configs";
import { cronRunner } from "./crons";
import { ApiError } from "./errors/api-error";
import { adminRouter } from "./routes/admin.router";
import { authRouter } from "./routes/auth.routes";
import { brandRouter } from "./routes/brand.router";
import { brandRequestRouter } from "./routes/brandRequest.routes";
import { carListingRouter } from "./routes/carListing.router";
import { contactRouter } from "./routes/contact.routes";
import { managerRouter } from "./routes/manager.router";
import { profanityRouter } from "./routes/profanity.router";
import { publicListingRouter } from "./routes/publicListing.router";
import { userRouter } from "./routes/user.router";
import { profanityService } from "./services/profanity.service";

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(
  fileUpload({
    useTempFiles: false,
  }),
);

// routes
app.use("/auth", authRouter);
app.use("/users", userRouter);
app.use("/brands", brandRouter);
app.use("/listings", carListingRouter);
app.use("/brand-requests", brandRequestRouter);
app.use("/admin", adminRouter);
app.use("/contact", contactRouter);
app.use("/manager", managerRouter);
app.use("/profanity", profanityRouter);
app.use("/publicListing", publicListingRouter);

// error handler
app.use((error: ApiError, req: Request, res: Response, next: NextFunction) => {
  res.status(error.status || 500).json({
    message: error.message || "Internal Server Error",
  });
});

process.on("uncaughtException", (err: Error) => {
  console.error("uncaughtException", err.message, err.stack);
  process.exit(1);
});

const start = async () => {
  try {
    await mongoose.connect(config.MONGO_URL);
    cronRunner();
    await profanityService.init();

    console.log("MongoDB connected");

    app.listen(config.PORT, () => {
      console.log(`Server running on http://${config.HOST}:${config.PORT}`);
    });
  } catch (error) {
    console.error("Startup error:", error);
    process.exit(1);
  }
};

start();
