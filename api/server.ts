import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";
import { healthCheckRouter } from "@/api/healthCheck/healthCheckRouter";
import { openAPIRouter } from "@/api-docs/openAPIRouter";
import errorHandler from "@/common/middleware/errorHandler";
import rateLimiter from "@/common/middleware/rateLimiter";
import { env } from "@/common/config/envConfig";
import { authRoutes } from "@/api/authentication/auth.routes";
import passport from "passport";
import { googleAuthStrategy, jwtAuthMiddleware } from "@/common/middleware/passport";

const app: Express = express();


// Set the application to trust the reverse proxy
app.set("trust proxy", true);

// Middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }));
app.use(helmet());
app.use(rateLimiter);
app.use(passport.initialize());

jwtAuthMiddleware(passport); //Set UP strategies
googleAuthStrategy(passport);

// Routes
app.use("/api", authRoutes);
app.use("/api/health-check", healthCheckRouter);

// Swagger UI
app.use(openAPIRouter);

// Error handlers
app.use(errorHandler());

export { app };
