import cors from "cors"
import express, { type Express } from "express"
import helmet from "helmet"
import path from "path"
import { openAPIRouter } from "@/api-docs/openAPIRouter"
import errorHandler from "@/common/middleware/errorHandler"
import { env } from "@/common/config/envConfig"
import { authRoutes } from "@/api/authentication/auth.routes"
import passport from "passport"
import { googleAuthStrategy, jwtAuthMiddleware } from "@/common/middleware/passport"
import dotenv from "dotenv"
import cookieParser from "cookie-parser"
import { userRoutes } from "@/api/user/user.routes"
import { companyRoutes } from "@/api/company/company.routes"
import { commissionRoutes } from "@/api/commission/commission.routes"
import { marketRoutes } from "@/api/market/market.routes"
import { transactionRoutes } from "@/api/transaction/transaction.routes"

const app: Express = express()
dotenv.config()

// Set the application to trust the reverse proxy
app.set("trust proxy", true)

// Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(express.urlencoded({ extended: true }))
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
app.use(helmet())

// Serve static files from assets directory
app.use("/assets", express.static(path.join(process.cwd(), "assets")))

// app.use(rateLimiter); // Re-enable if needed
app.use(passport.initialize())

jwtAuthMiddleware(passport) //Set UP strategies
googleAuthStrategy(passport)

// Routes
app.use("/api", authRoutes)
app.use("/api/users", userRoutes)
app.use("/api/companies", companyRoutes)
app.use("/api/commissions", commissionRoutes)
app.use("/api/market", marketRoutes)
app.use("/api/transactions", transactionRoutes)

// Swagger UI
app.use(openAPIRouter)

// Error handlers
app.use(errorHandler())

export { app }
