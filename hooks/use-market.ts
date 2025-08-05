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
  }),
  overrideExisting: false,
});

export const {
  useGetMarketDataQuery,
  useGetMarketOfTheDayQuery,
  useGetMarketBySecurityQuery,
} = marketApi;

export default marketApi;