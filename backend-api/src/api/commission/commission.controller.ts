import Commission from "@/common/models/commission"
import User from "@/common/models/users"
import Company from "@/common/models/company"
import Market from "@/common/models/market"
import { ServiceResponse } from "@/common/utils/serviceResponse"
import { asyncCatch, ErrorHandler } from "@/common/middleware/errorHandler"
import type { Request, Response, NextFunction, RequestHandler } from "express"
import { Op } from "sequelize"
import sequelize from "@/common/config/database"
import type { User as UserShape } from "../user/user.schema"

class CommissionController {
  // Existing function, renamed for clarity (manual/admin creation)
  public createCommissionManual: RequestHandler = asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const { brokerId, customerId, companyId, numberOfShares, pricePerShare, commissionRate, notes } = req.body

      // Validate broker exists and has correct role
      const broker = await User.findByPk(brokerId)
      if (!broker || !["teller", "agent", "admin", "manager"].includes(broker.dataValues.role)) {
        return next(ErrorHandler.BadRequest("Invalid broker. Must be a teller or agent."))
      }

      // Validate customer exists and has client role
      const customer = await User.findByPk(customerId)
      if (!customer || customer.dataValues.role !== "client") {
        return next(ErrorHandler.BadRequest("Invalid customer. Must be a client."))
      }

      // Validate company exists
      const company = await Company.findByPk(companyId)
      if (!company) {
        return next(ErrorHandler.BadRequest("Invalid company."))
      }

      // Check if company has enough shares (optional for manual creation, but good practice)
      if (company.dataValues.numberOfShares < numberOfShares) {
        return next(ErrorHandler.BadRequest("Not enough shares available in the company."))
      }

      const createdBy = (req.user as UserShape)?.id || null

      // Calculate amounts
      const finalCommissionRate = commissionRate || broker.dataValues.commission || 0
      const totalAmount = numberOfShares * pricePerShare
      const commissionAmount = (totalAmount * finalCommissionRate) / 100

      const { dataValues: commission } = await Commission.create({
        brokerId,
        customerId,
        companyId,
        numberOfShares,
        pricePerShare,
        totalAmount,
        commissionRate: finalCommissionRate,
        commissionAmount,
        notes,
        createdBy,
      })

      return ServiceResponse.success("Commission created successfully!", commission, res)
    },
  )

  // New function: User requests to buy shares, system assigns broker and price
  public requestCommission: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { companyId, numberOfShares, security } = req.body
    const customerId = (req.user as UserShape)?.id

    if (!customerId) {
      return next(ErrorHandler.Forbidden("User not authenticated."))
    }

    // 1. Validate customer (requesting user)
    const customer = await User.findByPk(customerId)
    if (!customer) {
      return next(ErrorHandler.NotFound("Requesting user not found."))
    }

    // 2. Find a teller with the fewest pending commissions
    const tellers = await User.findAll({
      where: { role: "teller" },
      attributes: ["id", "name"],
    })

    if (tellers.length === 0) {
      return next(ErrorHandler.InternalServerError("No tellers available to assign commission."))
    }

    let assignedBrokerId: string | null = null
    let minPendingCommissions = Number.POSITIVE_INFINITY

    for (const teller of tellers) {
      const pendingCount = await Commission.count({
        where: {
          brokerId: teller.dataValues.id,
          status: { [Op.in]: ["pending", "inprogress"] },
        },
      })

      if (pendingCount < minPendingCommissions) {
        minPendingCommissions = pendingCount
        assignedBrokerId = teller.dataValues.id
      }
    }

    if (!assignedBrokerId) {
      return next(ErrorHandler.InternalServerError("Could not assign a broker."))
    }

    // 3. Validate company and get company name
    const company = await Company.findByPk(companyId)
    if (!company) {
      return next(ErrorHandler.BadRequest("Invalid company ID."))
    }

    // 4. Find latest pricePerShare from market table for the given security
    const latestMarketEntry = await Market.findOne({
      where: { security: security },
      order: [["scrapedAt", "DESC"]],
    })

    if (!latestMarketEntry) {
      return next(ErrorHandler.NotFound(`Market data not found for security: ${security}`))
    }
    const pricePerShare = Number(latestMarketEntry.dataValues.closing)

    // 5. Set commissionRate to 0.0 for teller-assigned commissions
    const commissionRate = 0.0

    // 6. Calculate total amount
    const totalAmount = numberOfShares * pricePerShare
    const commissionAmount = (totalAmount * commissionRate) / 100

    // 7. Provide Notes
    const notes = `User requesting to buy shares in ${company.dataValues.companyName} (${security})`

    const { dataValues: commission } = await Commission.create({
      brokerId: assignedBrokerId,
      customerId: customerId,
      companyId,
      numberOfShares,
      pricePerShare,
      totalAmount,
      commissionRate,
      commissionAmount,
      notes,
      createdBy: customerId, // The user who requested it
      status: "pending", // Initial status for requested commissions
    })

    return ServiceResponse.success("Commission request created successfully!", commission, res)
  })

  public getAllCommissions: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { status, brokerId, customerId, companyId } = req.query // Removed search, page, limit

    const whereClause: any = {}

    // Filter by status
    if (status) {
      whereClause.status = status
    }

    // Filter by broker
    if (brokerId) {
      whereClause.brokerId = brokerId
    }

    // Filter by customer
    if (customerId) {
      whereClause.customerId = customerId
    }

    // Filter by company
    if (companyId) {
      whereClause.companyId = companyId
    }

    const commissions = await Commission.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "broker",
          attributes: ["id", "name", "email", "role"],
        },
        {
          model: User,
          as: "customer",
          attributes: ["id", "name", "email", "role"],
        },
        {
          model: Company,
          as: "company",
          attributes: ["id", "companyName", "companyCategory", "security"], // Include security
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
      ],
      order: [["createdAt", "DESC"]],
      // Removed limit and offset
    })

    return ServiceResponse.success("Commissions retrieved successfully!", commissions, res) // Removed pagination meta
  })

  public getCommissionById: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    const commission = await Commission.findByPk(id, {
      include: [
        {
          model: User,
          as: "broker",
          attributes: ["id", "name", "email", "role"],
        },
        {
          model: User,
          as: "customer",
          attributes: ["id", "name", "email", "role"],
        },
        {
          model: Company,
          as: "company",
          attributes: ["id", "companyName", "companyCategory", "numberOfShares", "security"], // Include security
        },
        {
          model: User,
          as: "creator",
          attributes: ["id", "name", "email"],
        },
      ],
    })

    if (!commission) {
      return next(ErrorHandler.NotFound("Commission not found"))
    }

    return ServiceResponse.success("Commission retrieved successfully!", commission, res)
  })

  public updateCommission: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const updates = { ...req.body }

    const commission = await Commission.findByPk(id)
    if (!commission) {
      return next(ErrorHandler.NotFound("Commission not found"))
    }

    // Prevent updating completed or cancelled commissions
    if (["completed", "cancelled"].includes(commission.dataValues.status || "")) {
      return next(ErrorHandler.BadRequest("Cannot update completed or cancelled commissions"))
    }

    // Validate broker if being updated
    if (updates.brokerId) {
      const broker = await User.findByPk(updates.brokerId)
      if (!broker || !["teller", "agent"].includes(broker.dataValues.role)) {
        return next(ErrorHandler.BadRequest("Invalid broker. Must be a teller or agent."))
      }
    }

    // Validate customer if being updated
    if (updates.customerId) {
      const customer = await User.findByPk(updates.customerId)
      if (!customer || customer.dataValues.role !== "client") {
        return next(ErrorHandler.BadRequest("Invalid customer. Must be a client."))
      }
    }

    // Validate company if being updated
    if (updates.companyId) {
      const company = await Company.findByPk(updates.companyId)
      if (!company) {
        return next(ErrorHandler.BadRequest("Invalid company."))
      }
    }

    await commission.update(updates)
    return ServiceResponse.success("Commission updated successfully!", commission, res)
  })

  public updateCommissionStatus: RequestHandler = asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params
      const { status, notes } = req.body

      const commission = await Commission.findByPk(id, {
        include: [
          {
            model: Company,
            as: "company",
          },
        ],
      })

      if (!commission) {
        return next(ErrorHandler.NotFound("Commission not found"))
      }

      // If completing the commission, check if company has enough shares
      if (status === "completed") {
        const company = commission.dataValues.company
        if (company.numberOfShares < commission.dataValues.numberOfShares) {
          return next(ErrorHandler.BadRequest("Not enough shares available in the company."))
        }

        // Reduce company shares
        await company.update({
          numberOfShares: company.numberOfShares - commission.dataValues.numberOfShares,
        })
      }

      await commission.update({ status, notes, processedAt: status === "completed" ? new Date() : null })
      return ServiceResponse.success("Commission status updated successfully!", commission, res)
    },
  )

  public deleteCommission: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    const commission = await Commission.findByPk(id)
    if (!commission) {
      return next(ErrorHandler.NotFound("Commission not found"))
    }

    // Prevent deleting completed commissions
    if (commission.dataValues.status === "completed") {
      return next(ErrorHandler.BadRequest("Cannot delete completed commissions"))
    }

    await commission.destroy()
    return ServiceResponse.success("Commission deleted successfully!", null, res)
  })

  public getMyCommissions: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as UserShape)?.id
    const { type = "all" } = req.query // 'broker', 'customer', or 'all'

    if (!userId) {
      return next(ErrorHandler.Forbidden("User not authenticated"))
    }

    const whereClause: any = {}

    if (type === "broker") {
      whereClause.brokerId = userId
    } else if (type === "customer") {
      whereClause.customerId = userId
    } else {
      whereClause[Op.or] = [{ brokerId: userId }, { customerId: userId }]
    }

    const commissions = await Commission.findAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: "broker",
          attributes: ["id", "name", "email", "role"],
        },
        {
          model: User,
          as: "customer",
          attributes: ["id", "name", "email", "role"],
        },
        {
          model: Company,
          as: "company",
          attributes: ["id", "companyName", "companyCategory", "security"], // Include security
        },
      ],
      order: [["createdAt", "DESC"]],
    })

    return ServiceResponse.success("Your commissions retrieved successfully!", commissions, res)
  })

  public getCommissionStats: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { brokerId, period = "all" } = req.query

    const whereClause: any = {}

    if (brokerId) {
      whereClause.brokerId = brokerId
    }

    // Add date filtering based on period
    if (period !== "all") {
      const now = new Date()
      let startDate: Date

      switch (period) {
        case "today":
          startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate())
          break
        case "week":
          startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          break
        case "month":
          startDate = new Date(now.getFullYear(), now.getMonth(), 1)
          break
        case "year":
          startDate = new Date(now.getFullYear(), 0, 1)
          break
        default:
          startDate = new Date(0)
      }

      whereClause.createdAt = {
        [Op.gte]: startDate,
      }
    }

    const [totalCommissions, completedCommissions, pendingCommissions, totalStats] = await Promise.all([
      Commission.count({ where: whereClause }),
      Commission.count({ where: { ...whereClause, status: "completed" } }),
      Commission.count({ where: { ...whereClause, status: "pending" } }),
      Commission.findAll({
        where: { ...whereClause, status: "completed" },
        attributes: [
          [sequelize.fn("SUM", sequelize.col("commissionAmount")), "totalCommissionAmount"],
          [sequelize.fn("SUM", sequelize.col("totalAmount")), "totalTransactionValue"],
        ],
        raw: true,
      }),
    ])

    const stats = {
      totalCommissions,
      completedCommissions,
      pendingCommissions,
      totalCommissionAmount: Number(totalStats[0].commissionAmount || 0),
      totalTransactionValue: Number(totalStats[0].commissionAmount || 0),
    }

    return ServiceResponse.success("Commission statistics retrieved successfully!", stats, res)
  })
}

export const commissionController = new CommissionController()
