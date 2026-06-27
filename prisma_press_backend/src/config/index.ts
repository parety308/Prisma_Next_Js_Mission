import dotenv from "dotenv";
import path from "path";
import jwt from "jsonwebtoken"
dotenv.config({
  path: path.join(process.cwd(), ".env")
});

export const config = {
  port: process.env.PORT || 5000,
  databaseUrl: process.env.DATABASE_URL,
  app_url: process.env.APP_URL,

  bcrypt_salt_rounds: Number(process.env.BCRYPT_SALT_ROUNDS),

  jwt_access_token_secret: process.env.JWT_ACCESS_TOKEN_SECRET!,
  jwt_refresh_secret: process.env.JWT_REFRESH_TOKEN_SECRET!,

  jwt_access_expires_in: process.env.JWT_ACCESS_EXPIRES_IN!,
  jwt_refresh_expires_in: process.env.JWT_REFRESH_EXPIRES_IN!,
};