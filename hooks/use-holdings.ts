import backendApi from "./backend-api";

// Watchlist types
export interface Holdings {
  id: string;
  userId: string;
  marketId: string;
  security: string;
  sharesOwned: number;
  averagePurchasePrice: number;
}

export interface HoldingsResponse {
  result: Holdings[];
  message?: string;
  success?: boolean;
}

const holdingsApi = backendApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get holdings
    getHoldings: builder.query<Holdings[], void>({
      query: () => ({
        url: "/api/holdings",
        method: "GET",
        credentials: "include"
      }),
      transformResponse: (response: HoldingsResponse) => response.result,
      providesTags: ["MyHoldings"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetHoldingsQuery
} = holdingsApi;

export default holdingsApi;