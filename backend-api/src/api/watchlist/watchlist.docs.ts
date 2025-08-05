import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import { createApiReqestBody, createApiResponse } from "@/api-docs/openAPIResponseBuilders"
import { StatusCodes } from "http-status-codes"
import { WatchlistSchema, AddToWatchlistSchema } from "./watchlist.schema"
import { z } from "zod"
import { MarketSchema } from "../market/market.schema" // Import MarketSchema for the response

export const watchlistRegistry = new OpenAPIRegistry()

// Add market entry to watchlist
watchlistRegistry.registerPath({
  method: "post",
  path: "/api/watchlist",
  tags: ["Watchlist"],
  summary: "Add a market security to the authenticated user's watchlist",
  security: [{ bearerAuth: [] }],
  request: {
    body: createApiReqestBody(AddToWatchlistSchema),
  },
  responses: createApiResponse(WatchlistSchema, "Market entry added to watchlist successfully", StatusCodes.CREATED),
})

// Get user's watchlist
watchlistRegistry.registerPath({
  method: "get",
  path: "/api/watchlist",
  tags: ["Watchlist"],
  summary: "Retrieve all market securities in the authenticated user's watchlist",
  security: [{ bearerAuth: [] }],
  responses: createApiResponse(z.array(MarketSchema), "User watchlist retrieved successfully", StatusCodes.OK),
})

// Remove market entry from watchlist
watchlistRegistry.registerPath({
  method: "delete",
  path: "/api/watchlist/{marketId}",
  tags: ["Watchlist"],
  summary: "Remove a market security from the authenticated user's watchlist",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ marketId: z.string().uuid("Invalid market ID") }),
  },
  responses: createApiResponse(z.object({}), "Market entry removed from watchlist successfully", StatusCodes.OK),
})
