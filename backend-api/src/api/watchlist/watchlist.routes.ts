import express, { type Router } from "express"
import { watchlistController } from "@/api/watchlist/watchlist.controller"
import passport from "passport"
import { validateRequest } from "@/common/middleware/validation"
import { AddToWatchlistSchema, RemoveFromWatchlistSchema } from "./watchlist.schema"

const watchlistRoutes: Router = express.Router()

// Add market entry to watchlist
watchlistRoutes.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  validateRequest(AddToWatchlistSchema),
  watchlistController.addMarketToWatchlist,
)

// Get user's watchlist
watchlistRoutes.get("/", passport.authenticate("jwt", { session: false }), watchlistController.getUserWatchlist)

// Remove market entry from watchlist
watchlistRoutes.delete(
  "/:marketId", // Use marketId as a parameter for deletion
  passport.authenticate("jwt", { session: false }),
  validateRequest(RemoveFromWatchlistSchema), // Validate the marketId param
  watchlistController.removeMarketFromWatchlist,
)

export { watchlistRoutes }
