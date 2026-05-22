import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

export default {
  env: process.env.NODE_ENV || "development",
  port: process.env.PORT || 5000,
  database_url: process.env.DATABASE_URL,
  token_secret_key: process.env.TOKEN_SECRET_KEY,
  refreshtoken_secret_key: process.env.REFRESHTOKEN_SECRET_KEY,
  super_admin_email: process.env.SUPER_ADMIN_EMAIL || "tanvir@ahmed.com",
  super_admin_password: process.env.SUPER_ADMIN_PASSWORD || "1234567890",
};
