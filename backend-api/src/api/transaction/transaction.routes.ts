import express, { type Router } from "express"
import { transactionController } from "@/api/transaction/transaction.controller"
import passport from "passport"
import { uploadProfileImage } from "@/common/middleware/multer" // Re-using multer middleware

const transactionRoutes: Router = express.Router()

// Public routes (e.g., for general viewing if allowed, though most will be protected)
transactionRoutes.get("/", transactionController.getAllTransactions)
transactionRoutes.get("/:id", transactionController.getTransactionById)

// Protected routes (require authentication)
transactionRoutes.post("/", passport.authenticate("jwt", { session: false }), transactionController.createTransaction)

transactionRoutes.get(
  "/my/transactions",
  passport.authenticate("jwt", { session: false }),
  transactionController.getMyTransactions,
)

transactionRoutes.put("/:id", passport.authenticate("jwt", { session: false }), transactionController.updateTransaction)

transactionRoutes.patch(
  "/:id/status",
  passport.authenticate("jwt", { session: false }),
  transactionController.updateTransactionStatus,
)

transactionRoutes.post(
  "/:id/payment-proof",
  passport.authenticate("jwt", { session: false }),
  uploadProfileImage, // Use the existing multer middleware for file upload
  transactionController.uploadPaymentProof,
)

transactionRoutes.delete(
  "/:id",
  passport.authenticate("jwt", { session: false }),
  transactionController.deleteTransaction,
)

export { transactionRoutes }