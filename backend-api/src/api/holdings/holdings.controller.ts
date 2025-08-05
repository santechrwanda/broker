import type { Request, Response, NextFunction, RequestHandler } from "express"
import { asyncCatch, ErrorHandler } from "@/common/middleware/errorHandler"
import { ServiceResponse } from "@/common/utils/serviceResponse"
import UserShare from "@/common/models/userShare"
import Market from "@/common/models/market"
import type { User as UserShape } from "../user/user.schema"
import { Op } from "sequelize"

class HoldingsController {
  public getUserHoldings: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as UserShape)?.id

    // Find all shares owned by the user
    const userShares = await UserShare.findAll({
      where: { userId },
    })

    const holdings = await Promise.all(
      userShares.map(async (userShare) => {
        const security = userShare.dataValues.security

        // Find the latest market data for the security
        const latestMarketEntry = await Market.findOne({
          where: { security: { [Op.iLike]: security } },
          order: [["scrapedAt", "DESC"]],
        })

        const currentMarketPrice = latestMarketEntry ? Number(latestMarketEntry.dataValues.closing) : null
        const currentValue = currentMarketPrice ? Number(userShare.dataValues.sharesOwned) * currentMarketPrice : null
        const profitOrLoss =
          currentMarketPrice && userShare.dataValues.averagePurchasePrice
            ? (currentMarketPrice - Number(userShare.dataValues.averagePurchasePrice)) *
              Number(userShare.dataValues.sharesOwned)
            : null

        return {
          id: userShare.dataValues.id,
          userId: userShare.dataValues.userId,
          security: userShare.dataValues.security,
          sharesOwned: Number(userShare.dataValues.sharesOwned),
          averagePurchasePrice: Number(userShare.dataValues.averagePurchasePrice),
          currentMarketPrice,
          currentValue,
          profitOrLoss,
          createdAt: userShare.dataValues.createdAt,
          updatedAt: userShare.dataValues.updatedAt,
        }
      }),
    )

    // Filter out any null entries if market data wasn't found (though it should return null for price/value)
    const filteredHoldings = holdings.filter(Boolean)

    return ServiceResponse.success("User holdings retrieved successfully!", filteredHoldings, res)
  })
}

export const holdingsController = new HoldingsController()
