import backendApi from "./backend-api";

// Watchlist types
export interface Watchlist {
  id: string;
  userId: string;
  marketId: string;
  addedAt?: string;
}

export interface WatchlistResponse {
  result: Watchlist[];
  message?: string;
  success?: boolean;
}

export interface WatchlistResponseAdd {
  result: Watchlist;
  message?: string;
  success?: boolean;
}

export interface WatchlistAddRequest {
  id: string;
  userId: string;
  marketId: string;
  addedAt: string;
}

const watchlistApi = backendApi.injectEndpoints({
  endpoints: (builder) => ({
    // Get watchlist
    getWatchlist: builder.query<Watchlist[], void>({
      query: () => ({
        url: "/api/watchlist",
        method: "GET",
        credentials: "include"
      }),
      transformResponse: (response: WatchlistResponse) => response.result,
      providesTags: ["MyWatchlist"],
    }),

    // Add to watchlist
    addToWatchlist: builder.mutation<WatchlistResponseAdd, WatchlistAddRequest>({
      query: (watchlistInfo) => ({
        url: "/api/watchlist",
        method: "POST",
        credentials: "include",
        body: watchlistInfo
      }),
      invalidatesTags: ["MyWatchlist"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success) {
            dispatch(
              watchlistApi.util.updateQueryData("getWatchlist", undefined, (draft) => {
                if (draft) {
                  draft.push(data.result)
                }
              }),
            )
          }
        } catch (err) {
          console.log("Error occurred while updating cache:", err)
        }
      },
    }),

    // Add to watchlist
    deleteFromWatchlist: builder.mutation<WatchlistResponseAdd, string>({
      query: (id) => ({
        url: `/api/watchlist/${id}`,
        method: "DELETE",
        credentials: "include"
      }),
      invalidatesTags: ["MyWatchlist"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.success) {
            dispatch(
              watchlistApi.util.updateQueryData("getWatchlist", undefined, (draft) => {
                if (draft) {
                  draft.filter((item) => item.id !== data.result.id);
                }
              }),
            )
          }
        } catch (err) {
          console.log("Error occurred while updating cache:", err)
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetWatchlistQuery,
  useAddToWatchlistMutation,
  useDeleteFromWatchlistMutation,
} = watchlistApi;

export default watchlistApi;