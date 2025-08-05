import type { Request, Response, NextFunction, RequestHandler } from "express"
import { asyncCatch, ErrorHandler } from "@/common/middleware/errorHandler"
import { ServiceResponse } from "@/common/utils/serviceResponse"
import Wallet from "@/common/models/wallet"
import WalletTransaction from "@/common/models/walletTransaction"
import User from "@/common/models/users"
import { env } from "@/common/config/envConfig"
import crypto from "crypto"
import sequelize from "@/common/config/database"
import logger from "@/common/config/logger"
import type { User as UserShape } from "../user/user.schema"
import flutterwavedoc from '@api/flutterwavedoc';
import { getFlutterwaveToken } from "@/common/utils/flatterwave"
import Market from "@/common/models/market"
import Company from "@/common/models/company"

// Initialize Flutterwave v4
(async () => {
  const access_token = await getFlutterwaveToken();
  flutterwavedoc.auth(access_token);
})();

// Helper function to call Flutterwave API with fallback methods
async function callFlutterwaveAPI(methodName: string, endpoint: string, payload?: any) {
  // First try the specific method if it exists
  if (typeof (flutterwavedoc as any)[methodName] === 'function') {
    return await (flutterwavedoc as any)[methodName](payload);
  }

  // Fallback to generic HTTP methods if available
  const httpMethod = methodName.split('_').pop(); // Get last part (get, post, etc.)
  if (httpMethod && typeof (flutterwavedoc as any)[httpMethod] === 'function') {
    return await (flutterwavedoc as any)[httpMethod](endpoint, payload);
  }

  throw new Error(`Method ${methodName} not found in Flutterwave SDK`);
}

class WalletController {
  // Helper to get or create a user's wallet
  private async getOrCreateWallet(userId: string, t: any) {
    let wallet = await Wallet.findOne({ where: { userId }, transaction: t })
    if (!wallet) {
      wallet = await Wallet.create({ userId, balance: 0 }, { transaction: t })
    }
    return wallet
  }

  public fundWallet: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { amount, currency, paymentMethod, phoneNumber, momo_network } = req.body

    const userId = (req.user as UserShape)?.id
    if (!userId) {
      return next(ErrorHandler.Forbidden("User not authenticated."))
    }

    const user = req.user as UserShape;

    const txRef = `FLWTOPUP${Date.now()}${crypto.randomBytes(4).toString("hex")}`

    await sequelize.transaction(async (t) => {
      const wallet = await this.getOrCreateWallet(userId, t)

      // Create a pending transaction record
      const fullName = user.name;
      await WalletTransaction.create(
        {
          userId,
          walletId: wallet.dataValues.id as string,
          type: "CREDIT",
          currency,
          amount,
          status: "pending",
          txRef,
          paymentMethod: paymentMethod || "unknown",
          notes: `Wallet top-up initiated for ${amount} ${currency}`,
          from: fullName || "User",
          to: "Wallet"
        },
        { transaction: t },
      )

      try {
        let response;
        const email = user.email;
        const fullName = user.name;

        if (paymentMethod === "mobile_money") {
          // Use direct order for mobile money
          response = await flutterwavedoc.orchestration_direct_charge_post({
            currency: currency,
            customer: {
              name: {
                first: fullName?.split(' ')[0] || user.name?.split(' ')[0] || 'Customer',
                last: fullName?.split(' ').slice(1).join(' ') || user.name?.split(' ').slice(1).join(' ') || 'Name'
              },
              email
            },
            payment_method: {
              card: { cof: { enabled: true } },
              type: 'mobile_money',
              mobile_money: {
                network: momo_network, // You might want to detect this from phone number
                country_code: phoneNumber?.substring(0, 3) || '250',
                phone_number: phoneNumber?.substring(3) || user.phone?.substring(3)
              },
              customer_id: userId
            },
            amount: amount,
            reference: txRef
          }, {
            'X-Scenario-Key': 'scenario:auth_redirect'
          });

        } else {
          // For card and other payment methods, use standard payment link
          response = await flutterwavedoc.payment_methods_post({
            amount: amount,
            currency: currency,
            title: "Wallet Top-up",
            description: `Fund wallet for ${user.name}`,
            customer: {
              name: fullName || user.name,
              email: email || user.email,
              phone: phoneNumber || user.phone
            },
            redirect_url: `${env.FRONTEND_REDIRECT}/wallet/verify?tx_ref=${txRef}`,
            tx_ref: txRef,
            ...(paymentMethod && { payment_options: paymentMethod === "card" ? "card" : paymentMethod === "bank_transfer" ? "banktransfer" : "card,mobilemoney,banktransfer" })
          });
        }

        if (response.data?.status === "success") {
          const chargeData = response.data.data;

          if (chargeData) {
            // Update the transaction with the Flutterwave reference
            await WalletTransaction.update(
              {
                flutterwaveRef: chargeData.id as string,
                notes: `Charge created. Status: ${chargeData.status}. Flutterware ID: ${chargeData.id}`
              },
              { where: { txRef }, transaction: t },
            );

            if (chargeData.status === "succeeded") {
              // Immediate success - update wallet balance
              const wallet = await this.getOrCreateWallet(userId, t);
              const newBalance = Number(wallet.dataValues.balance) + Number(chargeData.amount);
              await wallet.update({ balance: newBalance }, { transaction: t });

              await WalletTransaction.update(
                {
                  status: "successful",
                  completedAt: new Date(),
                  notes: `Payment successful. Flutterwave ID: ${chargeData.id}`
                },
                { where: { txRef }, transaction: t },
              );

              return ServiceResponse.success("Payment completed successfully!", {
                status: "completed",
                flw_ref: chargeData.id,
                amount: chargeData.amount,
                currency: chargeData.currency,
                next_action: chargeData.next_action,
              }, res);

            } else if (chargeData.status === "pending") {
              // Payment is pending - check for next_action instructions
              const nextAction = chargeData.next_action as any;
              let instructions = null;

              if (nextAction?.type === "payment_instruction" && nextAction.payment_instruction) {
                instructions = nextAction.payment_instruction;
              }

              return ServiceResponse.success("Payment initiated successfully! Please complete the payment.", {
                status: "pending",
                flw_ref: chargeData.id,
                amount: chargeData.amount,
                currency: chargeData.currency,
                payment_instructions: instructions,
                message: "Please follow the payment instructions sent to your mobile device"
              }, res);

            } else if (chargeData.status === "failed") {
              // Payment failed
              await WalletTransaction.update(
                {
                  status: "failed",
                  notes: `Payment failed. Flutterwave ID: ${chargeData.id}. Processor response: ${JSON.stringify(chargeData.processor_response)}`
                },
                { where: { txRef }, transaction: t },
              );

              return next(ErrorHandler.BadRequest(`Payment failed: ${(chargeData.processor_response as any)?.message || 'Unknown error'}`));
            }
          }

          // Fallback for other payment methods that might return a link
          const checkoutUrl = response.data?.link ||
            response.data?.data?.link ||
            response.data?.payment_link ||
            response.data?.hosted_link;

          if (checkoutUrl) {
            return ServiceResponse.success("Payment initiated successfully!", { checkoutUrl }, res);
          }

          // If we get here, log the response for debugging
          logger.warn("Unexpected response structure:", JSON.stringify(response.data, null, 2));
          return ServiceResponse.success("Payment initiated successfully!", {
            status: "initiated",
            message: "Payment request processed successfully",
            flw_ref: chargeData?.id
          }, res);

        } else {
          logger.error("Flutterwave initiation failed:", response)
          // Update transaction to failed if initiation fails
          await WalletTransaction.update(
            { status: "failed", notes: `Flutterwave initiation failed: ${response.data?.message || 'Unknown error'}` },
            { where: { txRef }, transaction: t },
          )
          console.log("Flutterwave initiation failed:", response.data);
          return next(ErrorHandler.InternalServerError(response.data?.message || "Failed to initiate payment."))
        }
      } catch (error) {
        logger.error("Flutterwave API error:", error)
        await WalletTransaction.update(
          { status: "failed", notes: `API error: ${(error as Error).message}` },
          { where: { txRef }, transaction: t },
        )
        return next(ErrorHandler.InternalServerError("Failed to initiate payment."))
      }
    })
  })

  public verifyPayment: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { transaction_id, tx_ref } = req.query as { transaction_id: string; tx_ref: string }

    if (!transaction_id || !tx_ref) {
      return next(ErrorHandler.BadRequest("Missing transaction_id or tx_ref in query parameters."))
    }

    // Use a transaction for atomicity
    await sequelize.transaction(async (t) => {
      const existingTransaction = await WalletTransaction.findOne({ where: { txRef: tx_ref }, transaction: t })

      if (!existingTransaction) {
        logger.warn(`Verification: Transaction with txRef ${tx_ref} not found in DB.`)
        return next(ErrorHandler.NotFound("Transaction not found in our records."))
      }

      // Idempotency check: If already successful, no need to re-process
      if (existingTransaction.dataValues.status === "successful") {
        logger.info(`Verification: Transaction ${tx_ref} already successful. Skipping re-processing.`)
        return ServiceResponse.success("Payment already verified and processed.", existingTransaction, res)
      }

      try {
        const response = await flutterwavedoc.charges_get({ id: transaction_id });

        if (response.data?.status === "success" && response.data?.data) {
          const transactionData = response.data.data
          const expectedAmount = Number(existingTransaction.dataValues.amount);

          if (
            transactionData?.amount &&
            transactionData.status === "succeeded" &&
            transactionData?.amount >= expectedAmount &&
            transactionData.currency === existingTransaction.dataValues.currency
          ) {
            const wallet = await this.getOrCreateWallet(existingTransaction.dataValues.userId, t)

            // Update wallet balance
            const newBalance = Number(wallet.dataValues.balance) + Number(transactionData.amount)
            await wallet.update({ balance: newBalance }, { transaction: t })

            // Update transaction record
            await existingTransaction.update(
              {
                status: "successful",
                flutterwaveRef: transactionData.flw_ref as string,
                completedAt: new Date(),
                notes: `Wallet top-up successful. Flutterwave Ref: ${transactionData.flw_ref}`,
              },
              { transaction: t },
            )

            logger.info(`Verification: Transaction ${tx_ref} successful. Wallet updated.`)
            return ServiceResponse.success("Payment verified and wallet funded successfully!", existingTransaction, res)
          } else {
            // Payment not successful or amount mismatch
            await existingTransaction.update(
              {
                status: "failed",
                flutterwaveRef: transactionData.flw_ref as string,
                notes: `Payment verification failed: ${transactionData.status}. Amount: ${transactionData.amount}`,
              },
              { transaction: t },
            )
            logger.warn(`Verification: Transaction ${tx_ref} failed or amount mismatch.`)
            return next(ErrorHandler.BadRequest("Payment verification failed or amount mismatch."))
          }
        } else {
          // Flutterwave verification failed
          await WalletTransaction.update(
            {
              status: "failed",
              notes: `Flutterwave verification failed: ${response.data?.message || 'Unknown error'}`,
            },
            { where: { txRef: tx_ref }, transaction: t },
          )
          logger.error(`Verification: Flutterwave API call failed for ${tx_ref}: ${response.data?.message}`)
          return next(ErrorHandler.InternalServerError(response.data?.message || "Failed to verify payment with Flutterwave."))
        }
      } catch (error) {
        logger.error("Flutterwave verification error:", error);
        await WalletTransaction.update(
          {
            status: "failed",
            notes: `Verification API error: ${(error as Error).message}`,
          },
          { where: { txRef: tx_ref }, transaction: t },
        )
        return next(ErrorHandler.InternalServerError("Failed to verify payment with Flutterwave."))
      }
    })
  })

  public handleWebhook: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const secretHash = env.FLW_HASH
    const signature = req.headers["verif-hash"]

    if (!signature || typeof signature !== "string" || signature !== secretHash) {
      logger.warn("Webhook received with invalid or missing signature.")
      // Respond 200 OK to Flutterwave even if verification fails, to prevent retries
      return res.status(200).json({ status: "error", message: "Invalid webhook signature." })
    }

    const payload = req.body
    logger.info("Webhook received:", payload)

    // Check if it's a successful payment event
    if (payload.event === "charge.completed" && payload.data?.status === "successful") {
      const transactionData = payload.data
      const txRef = transactionData.tx_ref
      const flutterwaveRef = transactionData.flw_ref
      const amount = transactionData.amount
      const currency = transactionData.currency
      const customerEmail = transactionData.customer?.email

      if (!txRef || !flutterwaveRef || !amount || !currency) {
        logger.warn("Webhook payload missing essential data.", payload)
        return res.status(200).json({ status: "error", message: "Missing essential data in webhook payload." })
      }

      await sequelize.transaction(async (t) => {
        const existingTransaction = await WalletTransaction.findOne({ where: { txRef }, transaction: t })

        if (!existingTransaction) {
          logger.warn(`Webhook: Transaction with txRef ${txRef} not found in DB.`)
          // If transaction not found, try to find user by email and create a new one
          const user = await User.findOne({ where: { email: customerEmail }, transaction: t })
          if (!user) {
            logger.error(`Webhook: User not found for email ${customerEmail}. Cannot process transaction.`)
            return res.status(200).json({ status: "error", message: "User not found for this transaction." })
          }
          const wallet = await this.getOrCreateWallet(user.dataValues.id, t)
          await WalletTransaction.create(
            {
              userId: user.dataValues.id,
              walletId: wallet.dataValues.id as string,
              type: "CREDIT",
              amount,
              status: "successful",
              flutterwaveRef,
              currency,
              txRef,
              paymentMethod: transactionData.payment_type || "webhook",
              notes: `Wallet top-up via webhook. Flutterwave Ref: ${flutterwaveRef}`,
              completedAt: new Date(),
            },
            { transaction: t },
          )
          const newBalance = Number(wallet.dataValues.balance) + Number(amount)
          await wallet.update({ balance: newBalance }, { transaction: t })
          logger.info(`Webhook: New transaction ${txRef} created and wallet funded.`)
          return res.status(200).json({ status: "success", message: "Webhook processed successfully." })
        }

        // Idempotency check: If already successful, no need to re-process
        if (existingTransaction.dataValues.status === "successful") {
          logger.info(`Webhook: Transaction ${txRef} already successful. Skipping re-processing.`)
          return res.status(200).json({ status: "success", message: "Webhook processed successfully (idempotent)." })
        }

        // Verify amount and currency
        if (
          Number(amount) >= existingTransaction.dataValues.amount &&
          currency === existingTransaction.dataValues.currency
        ) {
          const wallet = await this.getOrCreateWallet(existingTransaction.dataValues.userId, t)

          // Update wallet balance
          const newBalance = Number(wallet.dataValues.balance) + Number(amount)
          await wallet.update({ balance: newBalance }, { transaction: t })

          // Update transaction record
          await existingTransaction.update(
            {
              status: "successful",
              flutterwaveRef,
              completedAt: new Date(),
              notes: `Wallet top-up successful via webhook. Flutterwave Ref: ${flutterwaveRef}`,
            },
            { transaction: t },
          )
          logger.info(`Webhook: Transaction ${txRef} successful. Wallet updated.`)
          return res.status(200).json({ status: "success", message: "Webhook processed successfully." })
        } else {
          // Amount mismatch or other issue
          await existingTransaction.update(
            {
              status: "failed",
              flutterwaveRef,
              notes: `Webhook processing failed: Amount mismatch or other issue.`,
            },
            { transaction: t },
          )
          logger.warn(`Webhook: Transaction ${txRef} failed due to amount mismatch or other issue.`)
          return res.status(200).json({ status: "error", message: "Amount mismatch or other issue." })
        }
      })
    } else if (payload.event === "charge.completed" && payload.data?.status === "failed") {
      // Handle failed charges from webhook
      const txRef = payload.data.tx_ref
      const flutterwaveRef = payload.data.flw_ref
      await sequelize.transaction(async (t) => {
        const existingTransaction = await WalletTransaction.findOne({ where: { txRef }, transaction: t })
        if (existingTransaction && existingTransaction.dataValues.status === "pending") {
          await existingTransaction.update(
            {
              status: "failed",
              flutterwaveRef,
              notes: `Payment failed via webhook: ${payload.data.processor_response || payload.data.narration}`,
              completedAt: new Date(),
            },
            { transaction: t },
          )
          logger.info(`Webhook: Transaction ${txRef} marked as failed.`)
        }
      })
      return res.status(200).json({ status: "success", message: "Failed charge webhook processed." })
    }

    // For other events or unhandled statuses, just acknowledge
    return res.status(200).json({ status: "success", message: "Webhook received, no action taken." })
  })

  public withdrawFunds: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { amount, currency, accountBank, accountNumber, narration } = req.body
    const userId = (req.user as UserShape)?.id
    const user = req.user as UserShape;

    if (!userId) {
      return next(ErrorHandler.Forbidden("User not authenticated."))
    }

    await sequelize.transaction(async (t) => {
      const wallet = await this.getOrCreateWallet(userId, t)

      if (Number(wallet.dataValues.balance) < amount) {
        return next(ErrorHandler.BadRequest("Insufficient wallet balance."))
      }

      const txRef = `FLW_WITHDRAW_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`

      // Create a pending DEBIT transaction record
      const pendingTransaction = await WalletTransaction.create(
        {
          userId,
          walletId: wallet.dataValues.id as string,
          type: "DEBIT",
          amount,
          status: "pending",
          txRef,
          paymentMethod: "mobile_money",
          notes: narration || `Wallet withdrawal initiated for ${amount} ${currency} to ${accountNumber}`,
          currency,
          from: "Wallet",
          to: user.name ? user.name : "User"
        },
        { transaction: t },
      )

      try {
        const response = await callFlutterwaveAPI('transfers_post', '/transfers', {
          account_bank: accountBank,
          account_number: accountNumber,
          amount: amount,
          narration: narration || `Withdrawal from wallet by ${userId}`,
          currency: currency,
          reference: txRef,
          debit_currency: currency,
        });

        if (response.data?.status === "success" && response.data?.data) {
          // Transfer initiated successfully, update transaction status
          await pendingTransaction.update(
            {
              status: response.data.data.status === "SUCCESSFUL" ? "successful" : "pending",
              flutterwaveRef: response.data.data.flw_ref as string,
              notes: `Withdrawal initiated. Status: ${response.data.data.status}. Ref: ${response.data.data.flw_ref}`,
              completedAt: response.data.data.status === "SUCCESSFUL" ? new Date() : null,
            },
            { transaction: t },
          )

          if (response.data.data.status === "SUCCESSFUL") {
            // Deduct from wallet immediately if successful
            const newBalance = Number(wallet.dataValues.balance) - amount
            await wallet.update({ balance: newBalance }, { transaction: t })
            return ServiceResponse.success("Withdrawal successful!", pendingTransaction, res)
          } else {
            // If pending, still deduct from balance to reflect pending state
            const newBalance = Number(wallet.dataValues.balance) - amount
            await wallet.update({ balance: newBalance }, { transaction: t })
            return ServiceResponse.success("Withdrawal initiated, pending completion.", pendingTransaction, res)
          }
        } else {
          // Flutterwave transfer initiation failed
          await pendingTransaction.update(
            {
              status: "failed",
              notes: `Flutterwave transfer initiation failed: ${response.data?.message || 'Unknown error'}`,
              completedAt: new Date(),
            },
            { transaction: t },
          )
          return next(ErrorHandler.InternalServerError(response.data?.message || "Failed to initiate withdrawal."))
        }
      } catch (error) {
        // Catch any network or unexpected errors from Flutterwave API
        await pendingTransaction.update(
          {
            status: "failed",
            notes: `Withdrawal failed due to API error: ${(error as Error).message}`,
            completedAt: new Date(),
          },
          { transaction: t },
        )
        logger.error(`Flutterwave withdrawal API error: ${(error as Error).message}`)
        return next(ErrorHandler.InternalServerError("An error occurred during withdrawal initiation."))
      }
    })
  })

  public buyShares: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const { security, numberOfShares } = req.body
    const userId = (req.user as UserShape)?.id as string;

    // 1. Find latest market data for the given security
    const latestMarketEntry = await Market.findOne({
      where: { security },
      order: [["scrapedAt", "DESC"]],
    })

    if (!latestMarketEntry) {
      return next(ErrorHandler.NotFound(`Market data not found for security: ${security}`))
    }
    const closingPrice = Number(latestMarketEntry.dataValues.closing)

    // 2. Check if the market has enough shares available
    if (latestMarketEntry.dataValues.volume < numberOfShares) {
      return next(
        ErrorHandler.BadRequest(
          `Not enough shares available for ${security}. Available: ${latestMarketEntry.dataValues.volume}`,
        ),
      )
    }

    // 3. Calculate total amount
    const totalAmount = numberOfShares * closingPrice

    // 4. Get user's wallet
    const wallet = await Wallet.findOne({ where: { userId } })
    if (!wallet) {
      return next(ErrorHandler.NotFound("User wallet not found."))
    }

    // 5. Check if user has sufficient balance
    if (Number(wallet.dataValues.balance) < totalAmount) {
      return next(ErrorHandler.BadRequest("Insufficient wallet balance to buy shares."))
    }

    // Use a transaction for atomicity
    await sequelize.transaction(async (t) => {
      // 6. Deduct amount from wallet
      const newWalletBalance = Number(wallet.dataValues.balance) - totalAmount
      await wallet.update({ balance: newWalletBalance }, { transaction: t })

      // 7. Record wallet transaction (DEBIT)
      const txRef = `SHARE_BUY_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`
      await WalletTransaction.create(
        {
          userId,
          walletId: wallet.dataValues.id as string,
          type: "DEBIT",
          currency: "RWF",
          amount: totalAmount,
          status: "successful",
          txRef,
          paymentMethod: "wallet_balance",
          notes: `Bought ${numberOfShares} shares of ${security} at ${closingPrice} each.`,
          completedAt: new Date(),
        },
        { transaction: t },
      )
    })

    return ServiceResponse.success(
      `Successfully bought ${numberOfShares} shares of ${security} for ${totalAmount} RWF.`,
      { security, numberOfShares, totalAmount, closingPrice },
      res,
    )
  })

  public getWalletBalance: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as UserShape)?.id

    const wallet = await Wallet.findOne({ where: { userId } })

    if (!wallet) {
      // If no wallet exists, return 0 balance
      return ServiceResponse.success("Wallet balance retrieved successfully!", { balance: 0 }, res)
    }

    return ServiceResponse.success("Wallet balance retrieved successfully!", wallet.dataValues, res)
  })

  public getWalletTransactions: RequestHandler = asyncCatch(async (req: Request, res: Response, next: NextFunction) => {
    const userId = (req.user as UserShape)?.id
    const { type, status } = req.query

    if (!userId) {
      return next(ErrorHandler.Forbidden("User not authenticated."))
    }

    const whereClause: any = { userId }
    if (type) whereClause.type = type
    if (status) whereClause.status = status

    const transactions = await WalletTransaction.findAll({
      where: whereClause,
      order: [["createdAt", "DESC"]],
    })

    return ServiceResponse.success("Wallet transactions retrieved successfully!", transactions, res)
  })

  public getWalletTransactionById: RequestHandler = asyncCatch(
    async (req: Request, res: Response, next: NextFunction) => {
      const { id } = req.params
      const userId = (req.user as UserShape)?.id

      if (!userId) {
        return next(ErrorHandler.Forbidden("User not authenticated."))
      }

      const transaction = await WalletTransaction.findOne({
        where: { id, userId }, // Ensure user can only access their own transactions
      })

      if (!transaction) {
        return next(ErrorHandler.NotFound("Wallet transaction not found or you do not have access."))
      }

      return ServiceResponse.success("Wallet transaction retrieved successfully!", transaction, res)
    },
  )
}

export const walletController = new WalletController()