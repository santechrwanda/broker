import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import { createApiReqestBody, createApiResponse } from "@/api-docs/openAPIResponseBuilders"
import { StatusCodes } from "http-status-codes"
import {
  CommissionSchema,
  CreateCommissionManualSchema,
  RequestCommissionSchema,
  UpdateCommissionSchema,
  CommissionStatusSchema,
  CommissionStatsSchema,
} from "./commission.schema"
import { z } from "zod"

export const commissionRegistry = new OpenAPIRegistry()

// Create commission (manual/admin)
commissionRegistry.registerPath({
  method: "post",
  path: "/api/commissions",
  tags: ["Commission"],
  security: [{ bearerAuth: [] }],
  request: {
    body: createApiReqestBody(CreateCommissionManualSchema),
  },
  responses: createApiResponse(CommissionSchema, "Commission created successfully", StatusCodes.CREATED),
})

// Request commission (user-initiated)
commissionRegistry.registerPath({
  method: "post",
  path: "/api/commissions/request",
  tags: ["Commission"],
  security: [{ bearerAuth: [] }],
  request: {
    body: createApiReqestBody(RequestCommissionSchema),
  },
  responses: createApiResponse(CommissionSchema, "Commission request created successfully", StatusCodes.CREATED),
})

// Get all commissions (removed pagination/search)
commissionRegistry.registerPath({
  method: "get",
  path: "/api/commissions",
  tags: ["Commission"],
  parameters: [
    {
      name: "status",
      in: "query",
      description: "Filter by commission status",
      required: false,
      schema: {
        type: "string",
        enum: ["pending", "inprogress", "completed", "cancelled", "rejected"],
      },
    },
    {
      name: "brokerId",
      in: "query",
      description: "Filter by broker ID",
      required: false,
      schema: { type: "string" },
    },
    {
      name: "customerId",
      in: "query",
      description: "Filter by customer ID",
      required: false,
      schema: { type: "string" },
    },
    {
      name: "companyId",
      in: "query",
      description: "Filter by company ID",
      required: false,
      schema: { type: "string" },
    },
  ],
  responses: createApiResponse(z.array(CommissionSchema), "Commissions retrieved successfully", StatusCodes.OK),
})

// Get commission by ID
commissionRegistry.registerPath({
  method: "get",
  path: "/api/commissions/{id}",
  tags: ["Commission"],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: createApiResponse(CommissionSchema, "Commission retrieved successfully", StatusCodes.OK),
})

// Update commission
commissionRegistry.registerPath({
  method: "put",
  path: "/api/commissions/{id}",
  tags: ["Commission"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
    body: createApiReqestBody(UpdateCommissionSchema),
  },
  responses: createApiResponse(CommissionSchema, "Commission updated successfully", StatusCodes.OK),
})

// Update commission status
commissionRegistry.registerPath({
  method: "patch",
  path: "/api/commissions/{id}/status",
  tags: ["Commission"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
    body: createApiReqestBody(CommissionStatusSchema),
  },
  responses: createApiResponse(CommissionSchema, "Commission status updated successfully", StatusCodes.OK),
})

// Delete commission
commissionRegistry.registerPath({
  method: "delete",
  path: "/api/commissions/{id}",
  tags: ["Commission"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: createApiResponse(z.object({}), "Commission deleted successfully", StatusCodes.OK),
})

// Get my commissions
commissionRegistry.registerPath({
  method: "get",
  path: "/api/commissions/my/commissions",
  tags: ["Commission"],
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: "type",
      in: "query",
      description: "Type of commissions to retrieve",
      required: false,
      schema: { type: "string", enum: ["broker", "customer", "all"], default: "all" },
    },
  ],
  responses: createApiResponse(z.array(CommissionSchema), "Your commissions retrieved successfully", StatusCodes.OK),
})

// Get commission statistics
commissionRegistry.registerPath({
  method: "get",
  path: "/api/commissions/stats",
  tags: ["Commission"],
  parameters: [
    {
      name: "brokerId",
      in: "query",
      description: "Filter stats by broker ID",
      required: false,
      schema: { type: "string" },
    },
    {
      name: "period",
      in: "query",
      description: "Time period for statistics",
      required: false,
      schema: {
        type: "string",
        enum: ["today", "week", "month", "year", "all"],
        default: "all",
      },
    },
  ],
  responses: createApiResponse(CommissionStatsSchema, "Commission statistics retrieved successfully", StatusCodes.OK),
})