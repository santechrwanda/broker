import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import { createApiResponse } from "@/api-docs/openAPIResponseBuilders"
import { StatusCodes } from "http-status-codes"
import { MarketSchema, MarketStatsSchema } from "./market.schema"
import { z } from "zod"

export const marketRegistry = new OpenAPIRegistry()

// Get all market data (removed pagination/search)
marketRegistry.registerPath({
  method: "get",
  path: "/api/market",
  tags: ["Market"],
  parameters: [
    {
      name: "date",
      in: "query",
      description: "Filter by date (YYYY-MM-DD)",
      required: false,
      schema: { type: "string", format: "date" },
    },
  ],
  responses: createApiResponse(z.array(MarketSchema), "Market data retrieved successfully", StatusCodes.OK),
})

// Get market data for the current day (latest scraped data)
marketRegistry.registerPath({
  method: "get",
  path: "/api/market/today",
  tags: ["Market"],
  responses: createApiResponse(z.array(MarketSchema), "Market of the day retrieved successfully", StatusCodes.OK),
})

// Get market statistics
marketRegistry.registerPath({
  method: "get",
  path: "/api/market/stats",
  tags: ["Market"],
  responses: createApiResponse(MarketStatsSchema, "Market statistics retrieved successfully", StatusCodes.OK),
})
