import backendApi from "./backend-api";

// Wallet types
export interface Wallet {
  id: string;
  userId: string;
  balance: number;
  createdAt: string;
  updatedAt: string;
  payment_instructions?: {
      note: string;
  };
  [key: string]: any;
}

export interface WalletResponse {
  result: Wallet;
  message?: string;
  success?: boolean;
}

export interface WalletFundRequest {
  amount: number;
  currency: string;
  paymentMethod: "card" | "mobile_money" | "bank_transfer";
  phoneNumber: string;
  email: string;
  fullName: string;
  momo_network: string;
}

const walletApi = backendApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get wallet balance
    getWalletBalance: builder.query<Wallet, void>({
      query: () => ({
        url: "/api/wallet/balance",
        method: "GET",
        credentials: "include"
      }),
      transformResponse: (response: WalletResponse) => response.result,
      providesTags: ["MyWallet"],
    }),

    // Add funds to wallet
    fundWallet: builder.mutation<Wallet, WalletFundRequest>({
      query: (walletInfo) => ({
        url: "/api/wallet/fund",
        method: "POST",
        credentials: "include",
        body: walletInfo
      }),
      transformResponse: (response: WalletResponse) => response.result,
      invalidatesTags: ["MyWallet"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetWalletBalanceQuery,
  useFundWalletMutation,
} = walletApi;

export default walletApi;