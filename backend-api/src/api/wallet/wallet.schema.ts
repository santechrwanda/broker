import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi"
import { z } from "zod"
import { commonValidations } from "@/common/utils/commonValidation"

extendZodWithOpenApi(z)

export type Wallet = z.infer<typeof WalletSchema>
export type WalletTransaction = z.infer<typeof WalletTransactionSchema>

// Wallet Schema
export const WalletSchema = z
  .object({
    id: z.string().uuid().optional(),
    userId: z.string().uuid(),
    balance: z.number().min(0).default(0),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .openapi("Wallet")

// Wallet Transaction Schema
export const WalletTransactionSchema = z
  .object({
    id: z.string().uuid().optional(),
    userId: z.string().uuid(),
    walletId: z.string().uuid(),
    type: z.enum(["CREDIT", "DEBIT"]),
    amount: z.number().min(0.01, "Amount must be greater than 0").default(0.01),
    status: z.enum(["pending", "successful", "failed", "reversed"]).default("pending"),
    flutterwaveRef: z.string().nullable().optional(),
    txRef: z.string().min(1, "Transaction reference is required"),
    paymentMethod: z.string().nullable().optional(),
    notes: z.string().nullable().optional(),
    currency: z.string().nullable().optional(),
    completedAt: z.date().nullable().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .openapi("WalletTransaction")

// Schema for funding a wallet
export const FundWalletSchema = z
  .object({
    amount: z.number().min(100, "Minimum top-up amount is 100").default(100), // Example minimum
    currency: z.string().default("RWF"), // Example default currency
    paymentMethod: z.string().optional(), // e.g., "card", "mobile_money", "bank_transfer"
    phoneNumber: z.string().optional(), // Required for mobile money
    momo_network: z.string().optional(), // Optional, e.g., "MTN", "AIRTEL"
  })
  .openapi("FundWallet")

// Schema for verifying a payment (from redirect or webhook)
export const VerifyPaymentSchema = z
  .object({
    transaction_id: z.string().min(1, "Flutterwave transaction ID is required").default("chg_ADksfkSkRT"),
    tx_ref: z.string().min(1, "Internal transaction reference is required").default("FLW"),
  })
  .openapi("VerifyPayment")

// Schema for withdrawing funds
export const WithdrawFundsSchema = z
  .object({
    amount: z.number().min(100, "Minimum withdrawal amount is 100"), // Example minimum
    currency: z.string().default("RWF"),
    accountBank: z.string().min(1, "Recipient bank/mobile money code is required"), // e.g., "MTN", "AIRTEL"
    accountNumber: z.string().min(1, "Recipient mobile money number is required"),
    narration: z.string().optional(),
  })
  .openapi("WithdrawFunds")

// Input Validation for 'GET wallet/transactions/:id' endpoint
export const GetWalletTransactionSchema = z.object({
  params: z.object({ id: commonValidations.id }),
})
