import dotenv from "dotenv";

dotenv.config();

export const config = {
  PORT: process.env.PORT || 3000,
  HOST: process.env.HOST || "localhost",
  MONGO_URL: process.env.MONGO_URL || "",
};
