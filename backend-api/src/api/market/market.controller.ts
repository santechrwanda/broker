import Market from "@/common/models/market"
import { ServiceResponse } from "@/common/utils/serviceResponse"
import { asyncCatch, ErrorHandler } from "@/common/middleware/errorHandler"
import type { Request, Response, NextFunction, RequestHandler } from "express"
import { Op } from "sequelize"
import sequelize from "@/common/config/database"

class MarketController {
  public getMarketData: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { date } = req.query // Removed search, page, limit

    const whereClause: any = {}

    if (date) {
      // Assuming date is in YYYY-MM-DD format
      const startOfDay = new Date(String(date))
      const endOfDay = new Date(String(date))
      endOfDay.setDate(endOfDay.getDate() + 1) // Next day to cover the whole day

      whereClause.scrapedAt = {
        [Op.gte]: startOfDay,
        [Op.lt]: endOfDay,
      }
    }

    const marketEntries = await Market.findAll({
      where: whereClause,
      order: [
        ["scrapedAt", "DESC"],
        ["security", "ASC"],
      ],
      // Removed limit and offset
    })

    return ServiceResponse.success("Market data retrieved successfully!", marketEntries, res) // Removed pagination meta
  })

  public getMarketOfTheDay: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    // Get the latest scraped data for each security
    const latestScrapedData = await Market.findAll({
      attributes: ["security", [sequelize.fn("MAX", sequelize.col("scrapedAt")), "latestScrapedAt"]],
      group: ["security"],
      raw: true,
    })

    const latestEntries = []
    for (const data of latestScrapedData) {
      const entry = await Market.findOne({
        where: {
          security: data.security,
          scrapedAt: data.scrapedAt,
        },
      })
      if (entry) {
        latestEntries.push(entry)
      }
    }

    if (latestEntries.length === 0) {
      return next(ErrorHandler.NotFound("No market data available for today."))
    }

    return ServiceResponse.success("Market of the day retrieved successfully!", latestEntries, res)
  })

  public getMarketStatistics: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    // For simplicity, let's calculate stats based on the latest scraped data
    const latestScrapedData = await Market.findAll({
      attributes: [
        "security",
        "closing",
        "change",
        "volume",
        "value",
        [sequelize.fn("MAX", sequelize.col("scrapedAt")), "latestScrapedAt"],
      ],
      group: ["security"],
      raw: true,
    })

    if (latestScrapedData.length === 0) {
      return ServiceResponse.success("No market data available for statistics.", null, res)
    }

    const totalSecurities = latestScrapedData.length
    const totalVolume = latestScrapedData.reduce((sum, entry) => sum + Number(entry.volume), 0)
    const totalValue = latestScrapedData.reduce((sum, entry) => sum + Number(entry.value), 0)
    const averageChange = latestScrapedData.reduce((sum, entry) => sum + Number(entry.change), 0) / totalSecurities

    let mostActiveSecurity: string | null = null
    let maxVolume = -1
    let highestGainer: string | null = null
    let maxChange = Number.NEGATIVE_INFINITY
    let lowestLoser: string | null = null
    let minChange = Number.POSITIVE_INFINITY

    latestScrapedData.forEach((entry) => {
      if (Number(entry.volume) > maxVolume) {
        maxVolume = Number(entry.volume)
        mostActiveSecurity = entry.security
      }
      if (Number(entry.change) > maxChange) {
        maxChange = Number(entry.change)
        highestGainer = entry.security
      }
      if (Number(entry.change) < minChange) {
        minChange = Number(entry.change)
        lowestLoser = entry.security
      }
    })

    const stats = {
      totalSecurities,
      totalVolume,
      totalValue,
      averageChange: Number.parseFloat(averageChange.toFixed(2)),
      mostActiveSecurity,
      highestGainer,
      lowestLoser,
    }

    return ServiceResponse.success("Market statistics retrieved successfully!", stats, res)
  })
}

export const marketController = new MarketController()
