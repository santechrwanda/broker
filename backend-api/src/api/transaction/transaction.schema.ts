import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi"
import { z } from "zod"
import { commonValidations } from "@/common/utils/commonValidation"

extendZodWithOpenApi(z)

export type Transaction = z.infer<typeof TransactionSchema>

// Complete Transaction schema
export const TransactionSchema = z
  .object({
    id: z.string().uuid().optional(),
    type: z.enum(["buy", "sell"]),
    userId: z.string().uuid("Invalid user ID"),
    brokerId: z.string().uuid("Invalid broker ID"),
    companyId: z.string().uuid("Invalid company ID"),
    marketPriceAtTransaction: z.number().min(0).nullable().optional(),
    requestedShares: z.number().int().min(1, "Number of shares must be at least 1"),
    agreedPricePerShare: z.number().min(0.01, "Agreed price per share must be greater than 0"),
    totalTransactionValue: z.number().min(0).optional(),
    status: z
      .enum([
        "pending_broker_approval",
        "pending_payment",
        "payment_confirmed",
        "shares_released",
        "completed",
        "cancelled",
        "rejected",
        "pending_market_listing",
        "listed_on_market",
      ])
      .default("pending_broker_approval"),
    paymentProofUrl: z.string().url().nullable().optional(),
    notes: z.string().nullable().optional(),
    completedAt: z.date().nullable().optional(),
    createdBy: z.string().uuid().nullable().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .openapi("Transaction")

// Schema for initiating a buy/sell transaction
export const CreateTransactionSchema = z
  .object({
    type: z.enum(["buy", "sell"]),
    brokerId: z.string().uuid("Invalid broker ID"),
    companyId: z.string().uuid("Invalid company ID"),
    requestedShares: z.number().int().min(1, "Number of shares must be at least 1"),
    agreedPricePerShare: z.number().min(0.01, "Agreed price per share must be greater than 0"),
    notes: z.string().nullable().optional(),
  })
  .openapi("CreateTransaction")

// Schema for updating a transaction (e.g., by broker)
export const UpdateTransactionSchema = z
  .object({
    brokerId: z.string().uuid("Invalid broker ID").optional(),
    companyId: z.string().uuid("Invalid company ID").optional(),
    requestedShares: z.number().int().min(1, "Number of shares must be at least 1").optional(),
    agreedPricePerShare: z.number().min(0.01, "Agreed price per share must be greater than 0").optional(),
    notes: z.string().nullable().optional(),
  })
  .openapi("UpdateTransaction")

// Schema for updating transaction status
export const UpdateTransactionStatusSchema = z
  .object({
    status: z
      .enum([
        "pending_broker_approval",
        "pending_payment",
        "payment_confirmed",
        "shares_released",
        "completed",
        "cancelled",
        "rejected",
        "pending_market_listing",
        "listed_on_market",
      ])
      .default("pending_broker_approval"),
    notes: z.string().nullable().optional(),
  })
  .openapi("UpdateTransactionStatus")

// Schema for payment proof upload
export const UploadPaymentProofSchema = z
  .object({
    paymentProofUrl: z.string().url("Invalid URL format for payment proof").optional(),
  })
  .openapi("UploadPaymentProof")

// Input Validation for 'GET transactions/:id' endpoint
export const GetTransactionSchema = z.object({
  params: z.object({ id: commonValidations.id }),
})
