import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi"
import { z } from "zod"

extendZodWithOpenApi(z)

export type UserHolding = z.infer<typeof UserHoldingSchema>

export const UserHoldingSchema = z
  .object({
    id: z.string().uuid().optional(), // UserShare ID
    userId: z.string().uuid(),
    security: z.string(), // Changed from companyId and companyName
    sharesOwned: z.number().int().min(0),
    averagePurchasePrice: z.number(),
    currentMarketPrice: z.number().nullable(), // Can be null if no market data
    currentValue: z.number().nullable(), // Calculated: sharesOwned * currentMarketPrice
    profitOrLoss: z.number().nullable(), // Calculated: (currentMarketPrice - averagePurchasePrice) * sharesOwned
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .openapi("UserHolding")
