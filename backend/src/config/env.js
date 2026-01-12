import { configDotenv } from "dotenv";

configDotenv({quite:true})

export const ENV = {
  PORT: process.env.PORT,
  MONGO_DB:process.env.MONGO_DB,
  JWT_SECRET: process.env.JWT_SECRET,
  FRONTEND_URL: process.env.FRONTEND_URL,
};
