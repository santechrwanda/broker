import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import { createApiReqestBody, createApiResponse, createApiFormDataBody } from "@/api-docs/openAPIResponseBuilders"
import { StatusCodes } from "http-status-codes"
import {
  TransactionSchema,
  CreateTransactionSchema,
  UpdateTransactionSchema,
  UpdateTransactionStatusSchema,
  UploadPaymentProofSchema,
} from "./transaction.schema"
import { z } from "zod"

export const transactionRegistry = new OpenAPIRegistry()

// Create transaction (buy/sell request)
transactionRegistry.registerPath({
  method: "post",
  path: "/api/transactions",
  tags: ["Transaction"],
  security: [{ bearerAuth: [] }],
  request: {
    body: createApiReqestBody(CreateTransactionSchema),
  },
  responses: createApiResponse(TransactionSchema, "Transaction initiated successfully", StatusCodes.CREATED),
})

// Get all transactions (removed pagination/search)
transactionRegistry.registerPath({
  method: "get",
  path: "/api/transactions",
  tags: ["Transaction"],
  parameters: [
    {
      name: "status",
      in: "query",
      description: "Filter by transaction status",
      required: false,
      schema: {
        type: "string",
        enum: [
          "pending_broker_approval",
          "pending_payment",
          "payment_confirmed",
          "shares_released",
          "completed",
          "cancelled",
          "rejected",
          "pending_market_listing",
          "listed_on_market",
        ],
      },
    },
    {
      name: "type",
      in: "query",
      description: "Filter by transaction type (buy/sell)",
      required: false,
      schema: { type: "string", enum: ["buy", "sell"] },
    },
    {
      name: "userId",
      in: "query",
      description: "Filter by customer ID",
      required: false,
      schema: { type: "string" },
    },
    {
      name: "brokerId",
      in: "query",
      description: "Filter by broker ID",
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
  responses: createApiResponse(z.array(TransactionSchema), "Transactions retrieved successfully", StatusCodes.OK),
})

// Get transaction by ID
transactionRegistry.registerPath({
  method: "get",
  path: "/api/transactions/{id}",
  tags: ["Transaction"],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: createApiResponse(TransactionSchema, "Transaction retrieved successfully", StatusCodes.OK),
})

// Update transaction details
transactionRegistry.registerPath({
  method: "put",
  path: "/api/transactions/{id}",
  tags: ["Transaction"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
    body: createApiReqestBody(UpdateTransactionSchema),
  },
  responses: createApiResponse(TransactionSchema, "Transaction updated successfully", StatusCodes.OK),
})

// Update transaction status
transactionRegistry.registerPath({
  method: "patch",
  path: "/api/transactions/{id}/status",
  tags: ["Transaction"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
    body: createApiReqestBody(UpdateTransactionStatusSchema),
  },
  responses: createApiResponse(TransactionSchema, "Transaction status updated successfully", StatusCodes.OK),
})

// Upload payment proof for a buy transaction
transactionRegistry.registerPath({
  method: "post",
  path: "/api/transactions/{id}/payment-proof",
  tags: ["Transaction"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
    body: createApiFormDataBody(UploadPaymentProofSchema, ["paymentProof"]), // 'paymentProof' is the file field name
  },
  responses: createApiResponse(TransactionSchema, "Payment proof uploaded and confirmed", StatusCodes.OK),
})

// Delete transaction
transactionRegistry.registerPath({
  method: "delete",
  path: "/api/transactions/{id}",
  tags: ["Transaction"],
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string() }),
  },
  responses: createApiResponse(z.object({}), "Transaction deleted successfully", StatusCodes.OK),
})

// Get my transactions (customer or broker)
transactionRegistry.registerPath({
  method: "get",
  path: "/api/transactions/my/transactions",
  tags: ["Transaction"],
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: "roleType",
      in: "query",
      description: "Filter by role type (customer, broker, or all)",
      required: false,
      schema: { type: "string", enum: ["customer", "broker", "all"], default: "all" },
    },
  ],
  responses: createApiResponse(z.array(TransactionSchema), "Your transactions retrieved successfully", StatusCodes.OK),
})