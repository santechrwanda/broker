import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi"
import { z } from "zod"
import { commonValidations } from "@/common/utils/commonValidation"

extendZodWithOpenApi(z)

export type Market = z.infer<typeof MarketSchema>

// Complete Market schema
export const MarketSchema = z
  .object({
    id: z.string().uuid().optional(),
    security: z.string().min(1, "Security is required"),
    closing: z.number().min(0, "Closing price must be non-negative"),
    previous: z.number().min(0, "Previous price must be non-negative"),
    change: z.number(),
    volume: z.number().int().min(0, "Volume must be non-negative integer"),
    value: z.number().int().min(0, "Value must be non-negative integer"),
    scrapedAt: z.date().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
  })
  .openapi("Market")

// Schema for market statistics
export const MarketStatsSchema = z
  .object({
    totalSecurities: z.number(),
    totalVolume: z.number(),
    totalValue: z.number(),
    averageChange: z.number(),
    mostActiveSecurity: z.string().nullable(),
    highestGainer: z.string().nullable(),
    lowestLoser: z.string().nullable(),
  })
  .openapi("MarketStats")

// Input Validation for 'GET market/:id' endpoint
export const GetMarketEntrySchema = z.object({
  params: z.object({ id: commonValidations.id }),
})
