import Transaction from "@/common/models/transaction"
import User from "@/common/models/users"
import Company from "@/common/models/company"
import UserShare from "@/common/models/userShare"
import Market from "@/common/models/market"
import { ServiceResponse } from "@/common/utils/serviceResponse"
import { asyncCatch, ErrorHandler } from "@/common/middleware/errorHandler"
import type { Request, Response, NextFunction, RequestHandler } from "express"
import { Op } from "sequelize"
import sequelize from "@/common/config/database"
import type { User as UserShape } from "../user/user.schema"
// import { createPaginationMeta } from "@/common/utils/pagination" // Removed pagination utility

class TransactionController {
  public createTransaction: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { type, brokerId, companyId, requestedShares, agreedPricePerShare, notes } = req.body
    const userId = (req.user as UserShape)?.id

    if (!userId) {
      return next(ErrorHandler.Forbidden("User not authenticated."))
    }

    // Validate customer (initiator)
    const customer = await User.findByPk(userId)
    if (!customer || customer.dataValues.role !== "client") {
      return next(ErrorHandler.Forbidden("Only clients can initiate transactions."))
    }

    // Validate broker
    const broker = await User.findByPk(brokerId)
    if (!broker || !["teller", "agent"].includes(broker.dataValues.role)) {
      return next(ErrorHandler.BadRequest("Invalid broker. Must be a teller or agent."))
    }

    // Validate company
    const company = await Company.findByPk(companyId)
    if (!company) {
      return next(ErrorHandler.BadRequest("Invalid company."))
    }

    // Get current market price for reference
    const latestMarketEntry = await Market.findOne({
      where: { security: company.dataValues.security }, // Use company's security field
      order: [["scrapedAt", "DESC"]],
    })
    const marketPriceAtTransaction = latestMarketEntry?.dataValues.closing || null

    const totalTransactionValue = requestedShares * agreedPricePerShare

    const { dataValues: transaction } = await Transaction.create({
      type,
      userId,
      brokerId,
      companyId,
      marketPriceAtTransaction,
      requestedShares,
      agreedPricePerShare,
      totalTransactionValue,
      notes,
      createdBy: userId,
      status: "pending_broker_approval", // Initial status
    })

    return ServiceResponse.success("Transaction initiated successfully!", transaction, res)
  })

  public getAllTransactions: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { status, type, userId, brokerId, companyId } = req.query // Removed search, page, limit

    const whereClause: any = {}

    if (status) whereClause.status = status
    if (type) whereClause.type = type
    if (userId) whereClause.userId = userId
    if (brokerId) whereClause.brokerId = brokerId
    if (companyId) whereClause.companyId = companyId

    const transactions = await Transaction.findAll({
      where: whereClause,
      include: [
        { model: User, as: "customer", attributes: ["id", "name", "email", "role"] },
        { model: User, as: "broker", attributes: ["id", "name", "email", "role"] },
        { model: Company, as: "company", attributes: ["id", "companyName", "companyCategory", "security"] }, // Include security
      ],
      order: [["createdAt", "DESC"]],
      // Removed limit and offset
    })

    return ServiceResponse.success("Transactions retrieved successfully!", transactions, res) // Removed pagination meta
  })

  public getTransactionById: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    const transaction = await Transaction.findByPk(id, {
      include: [
        { model: User, as: "customer", attributes: ["id", "name", "email", "role"] },
        { model: User, as: "broker", attributes: ["id", "name", "email", "role"] },
        {
          model: Company,
          as: "company",
          attributes: ["id", "companyName", "companyCategory", "numberOfShares", "security"],
        }, // Include security
        { model: User, as: "creator", attributes: ["id", "name", "email"] },
      ],
    })

    if (!transaction) {
      return next(ErrorHandler.NotFound("Transaction not found"))
    }

    return ServiceResponse.success("Transaction retrieved successfully!", transaction, res)
  })

  public updateTransaction: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const updates = { ...req.body }

    const transaction = await Transaction.findByPk(id)
    if (!transaction) {
      return next(ErrorHandler.NotFound("Transaction not found"))
    }

    // Only allow updates if transaction is in a modifiable state
    if (["completed", "cancelled", "rejected"].includes(transaction.dataValues.status as string)) {
      return next(ErrorHandler.BadRequest("Cannot modify a completed, cancelled, or rejected transaction."))
    }

    await transaction.update(updates)
    return ServiceResponse.success("Transaction updated successfully!", transaction, res)
  })

  public updateTransactionStatus: RequestHandler = asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params
      const { status, notes } = req.body
      const currentUser = req.user as UserShape

      const transaction = await Transaction.findByPk(id, {
        include: [
          { model: Company, as: "company" },
          { model: User, as: "customer" },
        ],
      })

      if (!transaction) {
        return next(ErrorHandler.NotFound("Transaction not found"))
      }

      // Role-based access for status changes
      if (
        currentUser.role !== "admin" &&
        currentUser.id !== transaction.dataValues.brokerId &&
        currentUser.id !== transaction.dataValues.userId
      ) {
        return next(ErrorHandler.Forbidden("You are not authorized to change this transaction's status."))
      }

      // State machine for buy transactions
      if (transaction.dataValues.type === "buy") {
        switch (status) {
          case "pending_broker_approval":
            // Can only go back to this if it was pending_payment or payment_confirmed (broker can revert)
            if (
              transaction.dataValues.status !== "pending_payment" &&
              transaction.dataValues.status !== "payment_confirmed"
            ) {
              return next(ErrorHandler.BadRequest("Invalid status transition for buy transaction."))
            }
            break
          case "pending_payment":
            if (transaction.dataValues.status !== "pending_broker_approval") {
              return next(ErrorHandler.BadRequest("Invalid status transition for buy transaction."))
            }
            // Broker approves, moves to payment stage
            if (currentUser.id !== transaction.dataValues.brokerId && currentUser.role !== "admin") {
              return next(ErrorHandler.Forbidden("Only broker or admin can approve buy request."))
            }
            break
          case "payment_confirmed":
            if (transaction.dataValues.status !== "pending_payment") {
              return next(ErrorHandler.BadRequest("Invalid status transition for buy transaction."))
            }
            // Broker confirms payment
            if (currentUser.id !== transaction.dataValues.brokerId && currentUser.role !== "admin") {
              return next(ErrorHandler.Forbidden("Only broker or admin can confirm payment."))
            }
            break
          case "shares_released":
            if (transaction.dataValues.status !== "payment_confirmed") {
              return next(ErrorHandler.BadRequest("Invalid status transition for buy transaction."))
            }
            // Broker releases shares, updates user's shares and company's shares
            if (currentUser.id !== transaction.dataValues.brokerId && currentUser.role !== "admin") {
              return next(ErrorHandler.Forbidden("Only broker or admin can release shares."))
            }

            await sequelize.transaction(async (t) => {
              const company = transaction.dataValues.company
              if (company.numberOfShares < transaction.dataValues.requestedShares) {
                throw ErrorHandler.BadRequest("Not enough shares available in the company.")
              }

              // Reduce company shares
              await company.update(
                {
                  numberOfShares: company.numberOfShares - transaction.dataValues.requestedShares,
                },
                { transaction: t },
              )

              // Update user's shares (upsert)
              const [userShare, created] = await UserShare.findOrCreate({
                where: { userId: transaction.dataValues.userId, companyId: transaction.dataValues.companyId },
                defaults: {
                  userId: transaction.dataValues.userId,
                  companyId: transaction.dataValues.companyId,
                  sharesOwned: 0,
                  averagePurchasePrice: 0,
                },
                transaction: t,
              })

              const currentTotalShares = userShare.dataValues.sharesOwned
              const currentTotalCost = currentTotalShares * userShare.dataValues.averagePurchasePrice
              const newTotalShares = currentTotalShares + transaction.dataValues.requestedShares
              const newTotalCost = currentTotalCost + Number(transaction.dataValues.totalTransactionValue)

              await userShare.update(
                {
                  sharesOwned: newTotalShares,
                  averagePurchasePrice: newTotalShares > 0 ? newTotalCost / newTotalShares : 0,
                },
                { transaction: t },
              )

              // Mark transaction as completed
              await transaction.update({ status: "completed", completedAt: new Date() }, { transaction: t })
            })
            break
          case "completed":
            // This status should primarily be set by the 'shares_released' step for buy transactions
            // Or by 'listed_on_market' for sell transactions.
            // Direct transition to 'completed' is generally not allowed unless it's an admin override.
            if (currentUser.role !== "admin") {
              return next(ErrorHandler.Forbidden("Only admin can directly set status to completed."))
            }
            break
          case "cancelled":
          case "rejected":
            // Can be cancelled/rejected from any pending state by broker/admin
            if (
              currentUser.id !== transaction.dataValues.brokerId &&
              currentUser.id !== transaction.dataValues.userId &&
              currentUser.role !== "admin"
            ) {
              return next(ErrorHandler.Forbidden("Only broker, customer, or admin can cancel/reject."))
            }
            break
          default:
            return next(ErrorHandler.BadRequest("Invalid status transition for buy transaction."))
        }
      } else if (transaction.dataValues.type === "sell") {
        // State machine for sell transactions
        switch (status) {
          case "pending_broker_approval":
            // Can only go back to this if it was pending_market_listing (broker can revert)
            if (transaction.dataValues.status !== "pending_market_listing") {
              return next(ErrorHandler.BadRequest("Invalid status transition for sell transaction."))
            }
            break
          case "pending_market_listing":
            if (transaction.dataValues.status !== "pending_broker_approval") {
              return next(ErrorHandler.BadRequest("Invalid status transition for sell transaction."))
            }
            // Broker approves sell request
            if (currentUser.id !== transaction.dataValues.brokerId && currentUser.role !== "admin") {
              return next(ErrorHandler.Forbidden("Only broker or admin can approve sell request."))
            }
            // Check if user owns enough shares
            const userShare = await UserShare.findOne({
              where: { userId: transaction.dataValues.userId, companyId: transaction.dataValues.companyId },
            })
            if (!userShare || userShare.dataValues.sharesOwned < transaction.dataValues.requestedShares) {
              return next(ErrorHandler.BadRequest("Customer does not own enough shares to sell."))
            }
            break
          case "listed_on_market":
            if (transaction.dataValues.status !== "pending_market_listing") {
              return next(ErrorHandler.BadRequest("Invalid status transition for sell transaction."))
            }
            // Broker lists shares on market, reduces user's shares
            if (currentUser.id !== transaction.dataValues.brokerId && currentUser.role !== "admin") {
              return next(ErrorHandler.Forbidden("Only broker or admin can list shares on market."))
            }

            await sequelize.transaction(async (t) => {
              const userShare = await UserShare.findOne({
                where: { userId: transaction.dataValues.userId, companyId: transaction.dataValues.companyId },
                transaction: t,
              })

              if (!userShare || userShare.dataValues.sharesOwned < transaction.dataValues.requestedShares) {
                throw ErrorHandler.BadRequest("Customer does not own enough shares to sell.")
              }

              await userShare.update(
                {
                  sharesOwned: userShare.dataValues.sharesOwned - transaction.dataValues.requestedShares,
                },
                { transaction: t },
              )

              // Mark transaction as completed
              await transaction.update({ status: "completed", completedAt: new Date() }, { transaction: t })
            })
            break
          case "completed":
            // This status should primarily be set by the 'listed_on_market' step for sell transactions
            if (currentUser.role !== "admin") {
              return next(ErrorHandler.Forbidden("Only admin can directly set status to completed."))
            }
            break
          case "cancelled":
          case "rejected":
            // Can be cancelled/rejected from any pending state by broker/admin
            if (
              currentUser.id !== transaction.dataValues.brokerId &&
              currentUser.id !== transaction.dataValues.userId &&
              currentUser.role !== "admin"
            ) {
              return next(ErrorHandler.Forbidden("Only broker, customer, or admin can cancel/reject."))
            }
            break
          default:
            return next(ErrorHandler.BadRequest("Invalid status transition for sell transaction."))
        }
      }

      // If the transaction was completed by shares_released or listed_on_market,
      // the status is already set to 'completed' within the transaction.
      // Otherwise, update the status here.
      if (status !== "shares_released" && status !== "listed_on_market") {
        await transaction.update({ status, notes, completedAt: status === "completed" ? new Date() : null })
      }

      return ServiceResponse.success("Transaction status updated successfully!", transaction, res)
    },
  )

  public uploadPaymentProof: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params
    const currentUser = req.user as UserShape

    const transaction = await Transaction.findByPk(id)
    if (!transaction) {
      return next(ErrorHandler.NotFound("Transaction not found"))
    }

    if (transaction.dataValues.type !== "buy" || transaction.dataValues.status !== "pending_payment") {
      return next(ErrorHandler.BadRequest("Payment proof can only be uploaded for pending buy transactions."))
    }

    if (currentUser.id !== transaction.dataValues.userId && currentUser.role !== "admin") {
      return next(ErrorHandler.Forbidden("Only the customer or admin can upload payment proof."))
    }

    if (!req.file) {
      return next(ErrorHandler.BadRequest("No payment proof file provided."))
    }

    const paymentProofUrl = `${req.protocol}://${req.get("host")}/assets/${req.file.filename}`

    await transaction.update({ paymentProofUrl, status: "payment_confirmed" }) // Auto-confirm payment upon upload

    return ServiceResponse.success("Payment proof uploaded and payment confirmed!", transaction, res)
  })

  public deleteTransaction: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params

    const transaction = await Transaction.findByPk(id)
    if (!transaction) {
      return next(ErrorHandler.NotFound("Transaction not found"))
    }

    // Prevent deleting completed or in-progress transactions unless admin
    if (
      ["completed", "shares_released", "listed_on_market", "payment_confirmed"].includes(
        transaction.dataValues.status as string,
      ) &&
      (req.user as UserShape).role !== "admin"
    ) {
      return next(ErrorHandler.BadRequest("Cannot delete a completed or advanced-stage transaction."))
    }

    await transaction.destroy()
    return ServiceResponse.success("Transaction deleted successfully!", null, res)
  })

  public getMyTransactions: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as UserShape)?.id
    const { roleType = "all" } = req.query // 'customer', 'broker', or 'all'

    if (!userId) {
      return next(ErrorHandler.Forbidden("User not authenticated"))
    }

    const whereClause: any = {}

    if (roleType === "customer") {
      whereClause.userId = userId
    } else if (roleType === "broker") {
      whereClause.brokerId = userId
    } else {
      whereClause[Op.or] = [{ userId: userId }, { brokerId: userId }]
    }

    const transactions = await Transaction.findAll({
      where: whereClause,
      include: [
        { model: User, as: "customer", attributes: ["id", "name", "email", "role"] },
        { model: User, as: "broker", attributes: ["id", "name", "email", "role"] },
        { model: Company, as: "company", attributes: ["id", "companyName", "companyCategory", "security"] }, // Include security
      ],
      order: [["createdAt", "DESC"]],
    })

    return ServiceResponse.success("Your transactions retrieved successfully!", transactions, res)
  })
}

export const transactionController = new TransactionController()