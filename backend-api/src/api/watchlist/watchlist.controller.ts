import Market from "@/common/models/market"
import { ServiceResponse } from "@/common/utils/serviceResponse"
import { asyncCatch, ErrorHandler } from "@/common/middleware/errorHandler"
import type { Request, Response, NextFunction, RequestHandler } from "express"
import type { User as UserShape } from "../user/user.schema"
import Watchlist from "@/common/models/whatchlist"

class WatchlistController {
  public addMarketToWatchlist: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { marketId } = req.body
    const userId = (req.user as UserShape)?.id

    if (!userId) {
      return next(ErrorHandler.Forbidden("User not authenticated."))
    }

    // Check if market entry exists
    const marketEntry = await Market.findByPk(marketId)
    if (!marketEntry) {
      return next(ErrorHandler.NotFound("Market entry not found."))
    }

    // Check if already in watchlist
    const existingEntry = await Watchlist.findOne({ where: { userId, marketId } })
    if (existingEntry) {
      return next(ErrorHandler.BadRequest("Market entry already in watchlist."))
    }

    const { dataValues: watchlistEntry } = await Watchlist.create({
      userId,
      marketId,
    })

    return ServiceResponse.success("Market entry added to watchlist successfully!", watchlistEntry, res)
  })

  public removeMarketFromWatchlist: RequestHandler = asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const { marketId } = req.params // Assuming marketId is passed as a URL parameter
      const userId = (req.user as UserShape)?.id

      if (!userId) {
        return next(ErrorHandler.Forbidden("User not authenticated."))
      }

      const deletedCount = await Watchlist.destroy({ where: { userId, marketId } })

      if (deletedCount === 0) {
        return next(ErrorHandler.NotFound("Market entry not found in watchlist or already removed."))
      }

      return ServiceResponse.success("Market entry removed from watchlist successfully!", null, res)
    },
  )

  public getUserWatchlist: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as UserShape)?.id

    if (!userId) {
      return next(ErrorHandler.Forbidden("User not authenticated."))
    }

    const watchlist = await Watchlist.findAll({
      where: { userId },
      include: [
        {
          model: Market,
          as: "market",
          attributes: ["id", "security", "closing", "previous", "change", "volume", "value", "scrapedAt"],
        },
      ],
      order: [["addedAt", "DESC"]],
    })

    // Optionally, return only the market data if that's the primary interest
    const marketData = watchlist.map((entry) => entry.dataValues.market)

    return ServiceResponse.success("User watchlist retrieved successfully!", marketData, res)
  })
}

export const watchlistController = new WatchlistController()
