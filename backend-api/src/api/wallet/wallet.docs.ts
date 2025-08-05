import { OpenAPIRegistry } from "@asteasolutions/zod-to-openapi"
import { createApiReqestBody, createApiResponse } from "@/api-docs/openAPIResponseBuilders"
import { StatusCodes } from "http-status-codes"
import { WalletSchema, WalletTransactionSchema, FundWalletSchema, WithdrawFundsSchema } from "./wallet.schema"
import { z } from "zod"

export const walletRegistry = new OpenAPIRegistry()

// Fund Wallet
walletRegistry.registerPath({
  method: "post",
  path: "/api/wallet/fund",
  tags: ["Wallet"],
  summary: "Initiate a wallet top-up using Flutterwave checkout",
  security: [{ bearerAuth: [] }],
  request: {
    body: createApiReqestBody(FundWalletSchema),
  },
  responses: createApiResponse(
    z.object({ checkoutUrl: z.string().url() }),
    "Payment initiated successfully, redirect to checkoutUrl",
    StatusCodes.OK,
  ),
})

// Verify Payment (Redirect)
walletRegistry.registerPath({
  method: "get",
  path: "/api/wallet/verify",
  tags: ["Wallet"],
  summary: "Verify Flutterwave payment after redirect",
  parameters: [
    {
      name: "transaction_id",
      in: "query",
      description: "Flutterwave transaction ID",
      required: true,
      schema: { type: "string" },
    },
    {
      name: "tx_ref",
      in: "query",
      description: "Internal transaction reference",
      required: true,
      schema: { type: "string" },
    },
  ],
  responses: createApiResponse(WalletTransactionSchema, "Payment verified and wallet funded", StatusCodes.OK),
})

// Webhook Endpoint
walletRegistry.registerPath({
  method: "post",
  path: "/api/wallet/webhook",
  tags: ["Wallet"],
  summary: "Flutterwave webhook endpoint for transaction notifications",
  description: "Receives and processes Flutterwave webhook events, verifying signature with FLW_HASH.",
  request: {
    body: {
      content: {
        "application/json": {
          schema: z.any(), // Webhook payload can vary, use z.any()
        },
      },
    },
  },
  responses: {
    [StatusCodes.OK]: {
      description: "Webhook processed successfully (or acknowledged if no action taken)",
      content: {
        "application/json": {
          schema: z.object({
            status: z.string(),
            message: z.string(),
          }),
        },
      },
    },
  },
})

// Withdraw Funds
walletRegistry.registerPath({
  method: "post",
  path: "/api/wallet/withdraw",
  tags: ["Wallet"],
  summary: "Withdraw funds from wallet to a mobile money account",
  security: [{ bearerAuth: [] }],
  request: {
    body: createApiReqestBody(WithdrawFundsSchema),
  },
  responses: createApiResponse(WalletTransactionSchema, "Withdrawal initiated/successful", StatusCodes.OK),
})

// Get Wallet Balance
walletRegistry.registerPath({
  method: "get",
  path: "/api/wallet/balance",
  tags: ["Wallet"],
  summary: "Get the current balance of the authenticated user's wallet",
  security: [{ bearerAuth: [] }],
  responses: createApiResponse(WalletSchema, "Wallet balance retrieved successfully", StatusCodes.OK),
})

// Get Wallet Transactions
walletRegistry.registerPath({
  method: "get",
  path: "/api/wallet/transactions",
  tags: ["Wallet"],
  summary: "Get transaction history for the authenticated user's wallet",
  security: [{ bearerAuth: [] }],
  parameters: [
    {
      name: "type",
      in: "query",
      description: "Filter by transaction type (CREDIT or DEBIT)",
      required: false,
      schema: { type: "string", enum: ["CREDIT", "DEBIT"] },
    },
    {
      name: "status",
      in: "query",
      description: "Filter by transaction status (pending, successful, failed, reversed)",
      required: false,
      schema: { type: "string", enum: ["pending", "successful", "failed", "reversed"] },
    },
  ],
  responses: createApiResponse(
    z.array(WalletTransactionSchema),
    "Wallet transactions retrieved successfully",
    StatusCodes.OK,
  ),
})

// Get Single Wallet Transaction by ID
walletRegistry.registerPath({
  method: "get",
  path: "/api/wallet/transactions/{id}",
  tags: ["Wallet"],
  summary: "Get a single wallet transaction by ID for the authenticated user",
  security: [{ bearerAuth: [] }],
  request: {
    params: z.object({ id: z.string().uuid() }),
  },
  responses: createApiResponse(WalletTransactionSchema, "Wallet transaction retrieved successfully", StatusCodes.OK),
})
