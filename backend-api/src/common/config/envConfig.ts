import dotenv from "dotenv";
import { cleanEnv, str, port, num, email } from "envalid";

dotenv.config({ path: ".env" });

export const env = cleanEnv(process.env, {
    NODE_ENV: str({ choices: ["development", "production", "test"], default: "development" }),
    HOST: str({ default: "localhost" }),
    PORT: port({ default: 8080 }),
    CORS_ORIGIN: str({ default: "http://localhost:8080" }),
    COMMON_RATE_LIMIT_MAX_REQUESTS: num({ default: 1000 }),
    COMMON_RATE_LIMIT_WINDOW_MS: num({ default: 1000 }),
    GMAIL_PASSWORD: str(),
    GMAIL_AUTHENTICATION_EMAIL: email({ default: "" }),
    GMAIL_SENDER_EMAIL: email(),
    SMTP_HOST: str(),
    SMTP_PORT: port(),
    SMTP_FROM_NAME: str(),
    JWT_SECRET: str(),
    JWT_EXPIRES_TIME: str({ default: "1d" }),
    GOOGLE_CLIENT_ID: str(),
    GOOGLE_CLIENT_SECRET: str(),
});

export const envConfig = {
    ...env,
    isDevelopment: env.NODE_ENV === "development",
    isProduction: env.NODE_ENV === "production",
    isTest: env.NODE_ENV === "test",
};
