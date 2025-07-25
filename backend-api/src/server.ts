import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { openAPIRouter } from "@/api-docs/openAPIRouter";
import errorHandler from "@/common/middleware/errorHandler";
import { env } from "@/common/config/envConfig";
import { authRoutes } from "@/api/authentication/auth.routes";
import passport from "passport";
import { googleAuthStrategy, jwtAuthMiddleware } from "@/common/middleware/passport";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import { userRoutes } from "@/api/user/user.routes";

const app: Express = express();
dotenv.config();


// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
// app.use(rateLimiter);
app.use(passport.initialize());

jwtAuthMiddleware(passport); //Set UP strategies
googleAuthStrategy(passport);

// Routes
app.use("/api", authRoutes);
app.use("/api/users", userRoutes);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app };
