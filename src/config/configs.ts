import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || "localhost",
  MONGO_URL: process.env.MONGO_URL || "",

  JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET,
  JWT_ACCESS_EXPIRATION: process.env.JWT_ACCESS_EXPIRATION || 1,
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || "refresh_secret",
  JWT_REFRESH_EXPIRATION: process.env.JWT_REFRESH_EXPIRATION || 1,

  MAX_SESSIONS: process.env.MAX_SESSIONS || 5,
};
