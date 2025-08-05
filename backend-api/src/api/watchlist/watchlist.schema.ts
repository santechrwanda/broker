import { extendZodWithOpenApi } from "@asteasolutions/zod-to-openapi"
import { z } from "zod"
import { commonValidations } from "@/common/utils/commonValidation"
import { MarketSchema } from "../market/market.schema" // Import MarketSchema for inclusion

extendZodWithOpenApi(z)

export type Watchlist = z.infer<typeof WatchlistSchema>

// Complete Watchlist schema
export const WatchlistSchema = z
  .object({
    id: z.string().uuid().optional(),
    userId: z.string().uuid("Invalid user ID"),
    marketId: z.string().uuid("Invalid market ID"),
    addedAt: z.date().optional(),
    createdAt: z.date().optional(),
    updatedAt: z.date().optional(),
    // Optionally include the full Market object when fetching
    market: MarketSchema.optional(),
  })
  .openapi("Watchlist")

// Schema for adding a market entry to a user's watchlist
export const AddToWatchlistSchema = z
  .object({
    marketId: z.string().uuid("Invalid market ID"),
  })
  .openapi("AddToWatchlist")

// Schema for removing a market entry from a user's watchlist
export const RemoveFromWatchlistSchema = z
  .object({
    marketId: z.string().uuid("Invalid market ID"),
  })
  .openapi("RemoveFromWatchlist")

// Input Validation for 'GET watchlist/:id' endpoint (if needed for single entry)
export const GetWatchlistEntrySchema = z.object({
  params: z.object({ id: commonValidations.id }),
})
