import { OpenApiGeneratorV3, OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import { UserHoldingSchema } from "./holdings.schema"
import { z } from "zod"

export const holdingsRegistry = new OpenAPIRegistry()

holdingsRegistry.registerPath({
    method: "get",
    path: "/api/holdings",
    security: [{ bearerAuth: [] }],
    responses: {
      "200": {
        description: "User holdings retrieved successfully!",
        content: {
          "application/json": {
            schema: z.array(UserHoldingSchema),
          },
        },
      }
    },
    summary: "Get user's stock holdings",
    tags: ["Holdings"],
  })
