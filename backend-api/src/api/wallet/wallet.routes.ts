import express, { type Router } from "express"
import { walletController } from "@/api/wallet/wallet.controller"
import passport from "passport"
import { validateRequest } from "@/common/middleware/validation"
import { FundWalletSchema, VerifyPaymentSchema, WithdrawFundsSchema, GetWalletTransactionSchema } from "./wallet.schema"

const walletRoutes: Router = express.Router()

// Fund wallet (requires authentication)
walletRoutes.post(
  "/fund",
  passport.authenticate("jwt", { session: false }),
  validateRequest(FundWalletSchema),
  walletController.fundWallet,
)

// Verify payment (public endpoint, Flutterwave redirects here)
walletRoutes.get("/verify", validateRequest(VerifyPaymentSchema), walletController.verifyPayment)

// Webhook endpoint (public, Flutterwave sends notifications here)
walletRoutes.post("/webhook", walletController.handleWebhook)

// Withdraw funds (requires authentication)
walletRoutes.post(
  "/withdraw",
  passport.authenticate("jwt", { session: false }),
  validateRequest(WithdrawFundsSchema),
  walletController.withdrawFunds,
)

// Get wallet balance (requires authentication)
walletRoutes.get("/balance", passport.authenticate("jwt", { session: false }), walletController.getWalletBalance)

// Get wallet transactions (requires authentication)
walletRoutes.get(
  "/transactions",
  passport.authenticate("jwt", { session: false }),
  walletController.getWalletTransactions,
)

// Get single wallet transaction by ID (requires authentication)
walletRoutes.get(
  "/transactions/:id",
  passport.authenticate("jwt", { session: false }),
  validateRequest(GetWalletTransactionSchema),
  walletController.getWalletTransactionById,
)

export { walletRoutes }
