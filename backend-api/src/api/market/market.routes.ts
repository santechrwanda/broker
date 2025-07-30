import express, { type Router } from "express"
import { marketController } from "@/api/market/market.controller"

const marketRoutes: Router = express.Router()

marketRoutes.get("/", marketController.getMarketData)
marketRoutes.get("/today", marketController.getMarketOfTheDay)
marketRoutes.get("/stats", marketController.getMarketStatistics)

export { marketRoutes }
