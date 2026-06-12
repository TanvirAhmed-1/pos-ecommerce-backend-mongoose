import dotenv from "dotenv";
import path from "path";

dotenv.config({ path: path.join(process.cwd(), ".env") });

const required = (value: string | undefined, key: string): string => {
  if (!value) {
    throw new Error(` Missing environment variable: ${key}`);
  }
  return value;
};

const config = {
  env: process.env.NODE_ENV || "development",
  port: Number(process.env.PORT) || 5000,
  database: {
    url: required(process.env.DATABASE_URL, "DATABASE_URL"),
  },
  bcrypt: {
    saltRounds: Number(process.env.BCRYPT_SALT_ROUNDS) || 10,
  },
  jwtSecret: required(process.env.JWT_SECRET, "JWT_SECRET"),
  
  // --- bKash Configuration ---
  bkash_app_key: required(process.env.BKASH_APP_KEY, "BKASH_APP_KEY"),
  bkash_app_secret: required(process.env.BKASH_APP_SECRET, "BKASH_APP_SECRET"),
  bkash_username: required(process.env.BKASH_USERNAME, "BKASH_USERNAME"),
  bkash_password: required(process.env.BKASH_PASSWORD, "BKASH_PASSWORD"),
  
  bkash_grant_token_url: required(process.env.BKASH_GRANT_TOKEN_URL, "BKASH_GRANT_TOKEN_URL"),
  bkash_create_payment_url: required(process.env.BKASH_CREATE_PAYMENT_URL, "BKASH_CREATE_PAYMENT_URL"),
  bkash_execute_payment_url: required(process.env.BKASH_EXECUTE_PAYMENT_URL, "BKASH_EXECUTE_PAYMENT_URL"),

  // --- URLs ---
  backend_url: required(process.env.BACKEND_URL, "BACKEND_URL"),
  frontend_url: required(process.env.FRONTEND_URL, "FRONTEND_URL"),

  // --- Cloudinary Configuration ---
  cloudinary: {
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME || "",
    api_key: process.env.CLOUDINARY_API_KEY || "",
    api_secret: process.env.CLOUDINARY_API_SECRET || "",
  },

  // --- Super Admin Config ---
  superAdmin: {
    name: required(process.env.SUPER_ADMIN_NAME, "SUPER_ADMIN_NAME"),
    email: required(process.env.SUPER_ADMIN_EMAIL, "SUPER_ADMIN_EMAIL"),
    password: required(process.env.SUPER_ADMIN_PASSWORD, "SUPER_ADMIN_PASSWORD"),
    phone: required(process.env.SUPER_ADMIN_PHONE, "SUPER_ADMIN_PHONE"),
  },
};

export default config;