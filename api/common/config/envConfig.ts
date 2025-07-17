import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

console.log("PORT", process.env.PORT);

const envSchema = z.object({
	NODE_ENV: z.enum(["development", "production", "test"]).default("production"),
	HOST: z.string().min(1).default("localhost"),
	PORT: z.coerce.number().int().positive().default(8080),
	CORS_ORIGIN: z.string().url().default("http://localhost:8080"),
	COMMON_RATE_LIMIT_MAX_REQUESTS: z.coerce.number().int().positive().default(1000),
	COMMON_RATE_LIMIT_WINDOW_MS: z.coerce.number().int().positive().default(1000),
    GMAIL_PASSWORD: z.string(),
    GMAIL_AUTHENTICATION_EMAIL: z.string().email().optional(),
    GMAIL_SENDER_EMAIL: z.string().email(),
    SMTP_HOST: z.string(),
    SMTP_PORT: z.coerce.number().int().positive(),
    SMTP_FROM_NAME: z.string(),
    JWT_SECRET: z.string().min(1),
    JWT_EXPIRES_TIME: z.string().default("1d"),
    GOOGLE_CLIENT_ID: z.string().min(1),
    GOOGLE_CLIENT_SECRET: z.string().min(1),
});

const parsedEnv = envSchema.safeParse(process.env);

if (!parsedEnv.success) {
	console.error("❌ Invalid environment variables:", parsedEnv.error.format());
	throw new Error("Invalid environment variables");
}

export const env = {
	...parsedEnv.data,
	isDevelopment: parsedEnv.data.NODE_ENV === "development",
	isProduction: parsedEnv.data.NODE_ENV === "production",
	isTest: parsedEnv.data.NODE_ENV === "test",
};
