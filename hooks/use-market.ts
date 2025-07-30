import backendApi from "./backend-api";

// Market types
export interface Market {
  id: string;
  security: string;
  closing: number;
  previous: number;
  change: number;
  volume: number;
  value: number;
  scrapedAt: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface MarketStatistics {
  totalSecurities: number;
  totalVolume: number;
  totalValue: number;
  averageChange: number;
  positiveChanges: number;
  negativeChanges: number;
  lastUpdated: string;
  [key: string]: any;
}

export interface MarketResponse {
  result: Market[];
  total?: number;
  page?: number;
  limit?: number;
}

export interface MarketTodayResponse {
  result: Market[];
  date: string;
  total: number;
}

export interface MarketStatsResponse {
  result: MarketStatistics;
}

const marketApi = backendApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get all market data with optional pagination/filtering
    getMarketData: builder.query<Market[], { page?: number; limit?: number; security?: string }>({
      query: (params = {}) => ({
        url: "/api/market",
        method: "GET",
        params,
        credentials: "include"
      }),
      transformResponse: (response: MarketResponse) => response.result || [],
      providesTags: ["Market"],
    }),

    // Get today's market data
    getMarketOfTheDay: builder.query<Market[], void>({
      query: () => ({
        url: "/api/market/today",
        method: "GET",
        credentials: "include"
      }),
      transformResponse: (response: MarketTodayResponse) => response.result,
      providesTags: ["MarketToday"],
    }),

    // Get market statistics
    getMarketStatistics: builder.query<MarketStatistics, void>({
      query: () => ({
        url: "/api/market/stats",
        method: "GET",
        credentials: "include"
      }),
      transformResponse: (response: MarketStatsResponse) => response.result,
      providesTags: ["MarketStats"],
    }),

    // Optional: Get market data by security symbol
    getMarketBySecurity: builder.query<Market[], { security: string; limit?: number }>({
      query: ({ security, limit = 50 }) => ({
        url: "/api/market",
        method: "GET",
        params: { security, limit },
        credentials: "include"
      }),
      transformResponse: (response: MarketResponse) => response.result || [],
      providesTags: (result, error, { security }) => [
        { type: "Market", id: security },
        "Market"
      ],
    }),

    // Optional: Get historical market data for a specific security
    getMarketHistory: builder.query<Market[], { 
      security: string; 
      startDate?: string; 
      endDate?: string; 
      limit?: number 
    }>({
      query: ({ security, startDate, endDate, limit = 100 }) => ({
        url: "/api/market",
        method: "GET",
        params: { 
          security, 
          startDate, 
          endDate, 
          limit,
          sort: 'scrapedAt:desc' 
        },
        credentials: "include"
      }),
      transformResponse: (response: MarketResponse) => response.result || [],
      providesTags: (result, error, { security }) => [
        { type: "Market", id: `${security}-history` },
        "Market"
      ],
    }),

    // Optional: Refresh market data (trigger scraping)
    refreshMarketData: builder.mutation<{ success: boolean; message: string }, void>({
      query: () => ({
        url: "/api/market/refresh",
        method: "POST",
        credentials: "include"
      }),
      invalidatesTags: ["Market", "MarketToday", "MarketStats"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Refetch market data after successful refresh
          dispatch(marketApi.util.invalidateTags(["Market", "MarketToday", "MarketStats"]));
        } catch (err) {
          console.log("Error occurred while refreshing market data", err);
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetMarketDataQuery,
  useGetMarketOfTheDayQuery,
  useGetMarketStatisticsQuery,
  useGetMarketBySecurityQuery,
  useGetMarketHistoryQuery,
  useRefreshMarketDataMutation,
  
  // Lazy query hooks for conditional fetching
  useLazyGetMarketDataQuery,
  useLazyGetMarketOfTheDayQuery,
  useLazyGetMarketStatisticsQuery,
  useLazyGetMarketBySecurityQuery,
  useLazyGetMarketHistoryQuery,
} = marketApi;

export default marketApi;