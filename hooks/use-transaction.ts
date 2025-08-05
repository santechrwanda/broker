import backendApi from "./backend-api";

// Transaction types
export interface Transaction {
  id: string;
  type: "buy" | "sell";
  userId: string;
  brokerId: string;
  companyId: string;
  marketPriceAtTransaction?: number;
  requestedShares: number;
  agreedPricePerShare: number;
  totalTransactionValue: number;
  status: "pending_broker_approval" | "pending_payment" | "payment_confirmed" | "shares_released" | "completed" | "cancelled" | "rejected" | "pending_market_listing" | "listed_on_market";
  paymentProofUrl?: string;
  notes?: string;
  completedAt?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  // Relations (if populated)
  user?: any;
  broker?: any;
  company?: any;
  [key: string]: any;
}

export interface TransactionWallet {
  id: string;
  userId: string;
  walletId: string;
  type: "CREDIT" | "DEBIT";
  amount: string;
  status: "pending" | "successful" | "failed" | "reversed" | string;
  flutterwaveRef?: string;
  symbol?: string;
  from?: string;
  to?: string;
  shares?: number;
  txRef?: string;
  paymentMethod?: string;
  notes?: string;
  currency: string;
  completedAt?: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTransactionRequest {
  type: "buy" | "sell";
  brokerId: string;
  companyId: string;
  requestedShares: number;
  agreedPricePerShare: number;
  notes?: string;
}

export interface UpdateTransactionRequest {
  id: string;
  type?: "buy" | "sell";
  brokerId?: string;
  companyId?: string;
  requestedShares?: number;
  agreedPricePerShare?: number;
  notes?: string;
}

export interface UpdateTransactionStatusRequest {
  id: string;
  status: Transaction["status"];
  notes?: string;
}

export interface TransactionResponse {
  result: Transaction[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface SingleTransactionResponse {
  result: Transaction;
}

export interface TransactionQueryParams {
  page?: number;
  limit?: number;
  type?: "buy" | "sell";
  status?: Transaction["status"];
  userId?: string;
  brokerId?: string;
  companyId?: string;
  startDate?: string;
  endDate?: string;
}

// Payment proof upload types
export interface UploadPaymentProofRequest {
  id: string;
  file: File;
}

const transactionApi = backendApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all transactions (public with optional filters)
    getAllTransactions: builder.query<Transaction[], TransactionQueryParams>({
      query: (params = {}) => ({
        url: "/api/transaction",
        method: "GET",
        params,
        credentials: "include"
      }),
      transformResponse: (response: TransactionResponse) => response.result,
      providesTags: ["Transactions"],
    }),

    // Get transaction by ID (public)
    getTransactionById: builder.query<Transaction, string>({
      query: (id) => ({
        url: `/api/transaction/${id}`,
        method: "GET",
        credentials: "include"
      }),
      transformResponse: (response: SingleTransactionResponse) => response.result,
      providesTags: (result, error, id) => [{ type: "Transactions", id }],
    }),

    // Get my transactions (protected)
    getMyTransactions: builder.query<TransactionWallet[], { type?: string, status?: string }>({
      query: (params = {}) => ({
        url: "/api/wallet/transactions",
        method: "GET",
        params,
        credentials: "include"
      }),
      transformResponse: (response: { result: TransactionWallet[] }) => response.result,
      providesTags: ["MyWallet", "Transactions"],
    }),

    // Create transaction (protected)
    createTransaction: builder.mutation<Transaction, CreateTransactionRequest>({
      query: (body) => ({
        url: "/api/transaction",
        method: "POST",
        body,
        credentials: "include"
      }),
      transformResponse: (response: SingleTransactionResponse) => response.result,
      invalidatesTags: ["Transactions", "MyTransactions"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data: newTransaction } = await queryFulfilled;
          
          // Update getAllTransactions cache
          dispatch(
            transactionApi.util.updateQueryData("getAllTransactions", {}, (draft: Transaction[] | undefined) => {
              if (!draft) return [newTransaction];
              draft.unshift(newTransaction);
              return draft;
            })
          );

          // Update getMyTransactions cache
          // dispatch(
          //   transactionApi.util.updateQueryData("getMyTransactions", {}, (draft: TransactionWallet[] | undefined) => {
          //     if (!draft) return [newTransaction];
          //     draft.unshift(newTransaction);
          //     return draft;
          //   })
          // );
        } catch (err) {
          console.log("Error occurred while updating transaction cache", err);
        }
      },
    }),

    // Delete transaction (protected)
    deleteTransaction: builder.mutation<{ success: boolean; id: string }, string>({
      query: (id) => ({
        url: `/api/transaction/${id}`,
        method: "DELETE",
        credentials: "include"
      }),
      invalidatesTags: (result, error, id) => [
        { type: "Transactions", id },
        "Transactions",
        "MyTransactions"
      ],
      async onQueryStarted(id, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          
          // Remove transaction from getAllTransactions cache
          dispatch(
            transactionApi.util.updateQueryData("getAllTransactions", {}, (draft: Transaction[] | undefined) => {
              if (!draft) return;
              const idx = draft.findIndex((t) => t.id === id);
              if (idx !== -1) draft.splice(idx, 1);
              return draft;
            })
          );

          // Remove transaction from getMyTransactions cache
          // dispatch(
          //   transactionApi.util.updateQueryData("getMyTransactions", {}, (draft: Transaction[] | undefined) => {
          //     if (!draft) return;
          //     const idx = draft.findIndex((t) => t.id === id);
          //     if (idx !== -1) draft.splice(idx, 1);
          //     return draft;
          //   })
          // );
        } catch (err) {
          console.log("Error occurred while deleting transaction", err);
        }
      },
    }),

    // Additional utility queries
    getTransactionsByCompany: builder.query<Transaction[], { companyId: string } & TransactionQueryParams>({
      query: ({ companyId, ...params }) => ({
        url: "/api/transaction",
        method: "GET",
        params: { companyId, ...params },
        credentials: "include"
      }),
      transformResponse: (response: TransactionResponse) => response.result,
      providesTags: (result, error, { companyId }) => [
        { type: "Transactions", id: `company-${companyId}` },
        "Transactions"
      ],
    }),

    getTransactionsByBroker: builder.query<Transaction[], { brokerId: string } & TransactionQueryParams>({
      query: ({ brokerId, ...params }) => ({
        url: "/api/transaction",
        method: "GET",
        params: { brokerId, ...params },
        credentials: "include"
      }),
      transformResponse: (response: TransactionResponse) => response.result,
      providesTags: (result, error, { brokerId }) => [
        { type: "Transactions", id: `broker-${brokerId}` },
        "Transactions"
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  // Query hooks
  useGetAllTransactionsQuery,
  useGetTransactionByIdQuery,
  useGetMyTransactionsQuery,
  useGetTransactionsByCompanyQuery,
  useGetTransactionsByBrokerQuery,

  // Mutation hooks
  useCreateTransactionMutation,
  useDeleteTransactionMutation,
} = transactionApi;

export default transactionApi;