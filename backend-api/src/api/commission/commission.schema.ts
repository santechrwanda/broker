import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi"
import { z } from "zod"
import { commonValidations } from "@/common/utils/commonValidation"

extendZodWithOpenApi(z)

export type Commission = z.infer<typeof CommissionSchema>

// Complete Commission schema
export const CommissionSchema = z
  .object({
    id: z.string().uuid().optional(),
    brokerId: z.string().uuid("Invalid broker ID"),
    customerId: z.string().uuid("Invalid customer ID"),
    companyId: z.string().uuid("Invalid company ID"),
    numberOfShares: z.number().int().min(1, "Number of shares must be at least 1"),
    pricePerShare: z.number().min(0.01, "Price per share must be greater than 0"),
    totalAmount: z.number().min(0).optional(),
    commissionRate: z.number().min(0).max(100, "Commission rate must be between 0 and 100").default(0),
    commissionAmount: z.number().min(0).optional(),
    status: z.enum(["pending", "inprogress", "completed", "cancelled", "rejected"]).default("pending"),
    notes: z.string().optional(),
    processedAt: z.date().optional(),
    createdBy: z.string().uuid().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .openapi("Commission")

// Schema for creating a commission (manual/admin)
export const CreateCommissionManualSchema = z
  .object({
    brokerId: z.string().uuid("Invalid broker ID"),
    customerId: z.string().uuid("Invalid customer ID"),
    companyId: z.string().uuid("Invalid company ID"),
    numberOfShares: z.number().int().min(1, "Number of shares must be at least 1"),
    pricePerShare: z.number().min(0.01, "Price per share must be greater than 0"),
    commissionRate: z.number().min(0).max(100, "Commission rate must be between 0 and 100").default(0),
    notes: z.string().optional(),
  })
  .openapi("CreateCommissionManual")

// Schema for user requesting a commission
export const RequestCommissionSchema = z
  .object({
    companyId: z.string().uuid("Invalid company ID"),
    numberOfShares: z.number().int().min(1, "Number of shares must be at least 1"),
    security: z.string().min(1, "Security symbol is required"),
  })
  .openapi("RequestCommission")

// Schema for updating a commission
export const UpdateCommissionSchema = z
  .object({
    brokerId: z.string().uuid("Invalid broker ID").optional(),
    customerId: z.string().uuid("Invalid customer ID").optional(),
    companyId: z.string().uuid("Invalid company ID").optional(),
    numberOfShares: z.number().int().min(1, "Number of shares must be at least 1").optional(),
    pricePerShare: z.number().min(0.01, "Price per share must be greater than 0").optional(),
    commissionRate: z.number().min(0).max(100, "Commission rate must be between 0 and 100").optional(),
    notes: z.string().optional(),
  })
  .openapi("UpdateCommission")

// Schema for updating commission status
export const CommissionStatusSchema = z
  .object({
    status: z.enum(["pending", "inprogress", "completed", "cancelled", "rejected"]),
    notes: z.string().optional(),
  })
  .openapi("CommissionStatus")

// Input Validation for 'GET commissions/:id' endpoint
export const GetCommissionSchema = z.object({
  params: z.object({ id: commonValidations.id }),
})

// Schema for commission statistics
export const CommissionStatsSchema = z
  .object({
    totalCommissions: z.number(),
    completedCommissions: z.number(),
    pendingCommissions: z.number(),
    totalCommissionAmount: z.number(),
    totalTransactionValue: z.number(),
  })
  .openapi("CommissionStats")
