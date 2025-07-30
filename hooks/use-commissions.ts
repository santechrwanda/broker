import backendApi from "./backend-api";

// Commission types
export interface Commission {
  id: string;
  brokerId: string;
  customerId: string;
  companyId: string;
  numberOfShares: number;
  pricePerShare: number;
  totalAmount: number;
  commissionRate: number;
  commissionAmount: number;
  status: "pending" | "inprogress" | "completed" | "cancelled" | "rejected";
  notes?: string;
  processedAt?: string;
  createdBy?: string;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

export interface CreateCommissionRequest {
  brokerId: string;
  customerId: string;
  companyId: string;
  numberOfShares: number;
  pricePerShare: number;
  commissionRate: number;
  notes?: string;
}

export interface UpdateCommissionRequest {
  id: string;
  brokerId?: string;
  customerId?: string;
  companyId?: string;
  numberOfShares?: number;
  pricePerShare?: number;
  commissionRate?: number;
  notes?: string;
}

export interface ChangeCommissionStatusRequest {
  id: string;
  status: "pending" | "inprogress" | "completed" | "cancelled" | "rejected";
}

export interface DeleteCommissionRequest {
  id: string;
}

export interface CommissionStats {
  [key: string]: any;
}

const commissionsApi = backendApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllCommissions: builder.query<Commission[], void>({
      query: () => ({
        url: "/api/commissions",
        method: "GET",
        credentials: "include"
      }),
      transformResponse: (response: { result:Commission[] }) => response.result || [],
      providesTags: ["Commissions"],
    }),
    getCommissionStats: builder.query<CommissionStats, void>({
      query: () => ({
        url: "/api/commissions/stats",
        method: "GET",
        credentials: "include"
      }),
      transformResponse: (response: { result: CommissionStats }) => response.result || {},
      providesTags: ["CommissionStats"],
    }),
    getCommissionById: builder.query<Commission, string>({
      query: (id) => ({
        url: `/api/commissions/${id}`,
        method: "GET",
        credentials: "include"
      }),
      transformResponse: (response: { result: Commission }) => response.result || null,
      providesTags: (result, error, id) => [{ type: "Commissions", id }],
    }),
    getMyCommissions: builder.query<Commission[], void>({
      query: () => ({
        url: "/api/commissions/my/commissions",
        method: "GET",
        credentials: "include"
      }),
      transformResponse: (response: { result: Commission[] }) => response.result || [],
      providesTags: ["MyCommissions"],
    }),
    createCommission: builder.mutation<{ result: Commission }, CreateCommissionRequest>({
      query: (body) => ({
        url: "/api/commissions",
        method: "POST",
        body,
        credentials: "include"
      }),
      invalidatesTags: ["Commissions", "CommissionStats", "MyCommissions"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { result } = data;
          // Update getAllCommissions cache with new commission
          dispatch(
            commissionsApi.util.updateQueryData("getAllCommissions", undefined, (draft: Commission[] | undefined) => {
              if (!draft) return;
              draft.unshift(result);
              return draft;
            })
          );
        } catch (err) {
          console.log("Error occurred while updating", err);
        }
      },
    }),
    createCommissionRequest: builder.mutation<{ result: Commission }, CreateCommissionRequest>({
      query: (body) => ({
        url: "/api/commissions/request",
        method: "POST",
        body,
        credentials: "include"
      }),
      invalidatesTags: ["Commissions", "CommissionStats", "MyCommissions"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { result } = data;
          // Update getAllCommissions cache with new commission
          dispatch(
            commissionsApi.util.updateQueryData("getAllCommissions", undefined, (draft: Commission[] | undefined) => {
              if (!draft) return;
              draft.unshift(result);
              return draft;
            })
          );
        } catch (err) {
          console.log("Error occurred while updating", err);
        }
      },
    }),
    updateCommission: builder.mutation<{ result: Commission }, { id: string; data: UpdateCommissionRequest }>({
      query: ({ id, data }) => ({
        url: `/api/commissions/${id}`,
        method: "PUT",
        body: data,
        credentials: "include"
      }),
      invalidatesTags: ["Commissions", "CommissionStats", "MyCommissions"],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Update getAllCommissions cache with updated commission
          dispatch(
            commissionsApi.util.updateQueryData("getAllCommissions", undefined, (draft: Commission[] | undefined) => {
              if (!draft) return;
              const idx = draft.findIndex((c) => c.id === id);
              if (idx !== -1) draft[idx] = data.result;
              return draft;
            })
          );
          // Update getCommissionById cache
          dispatch(
            commissionsApi.util.updateQueryData("getCommissionById", id, (draft) => {
              return data.result;
            })
          );
        } catch (err) {
          console.log("Error occurred while updating", err);
        }
      },
    }),
    updateCommissionStatus: builder.mutation<{ result: Commission }, ChangeCommissionStatusRequest>({
      query: ({ id, status }) => ({
        url: `/api/commissions/${id}/status`,
        method: "PATCH",
        body: { status },
        credentials: "include"
      }),
      invalidatesTags: ["Commissions", "CommissionStats", "MyCommissions"],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Update commission status in getAllCommissions cache
          dispatch(
            commissionsApi.util.updateQueryData("getAllCommissions", undefined, (draft: Commission[] | undefined) => {
              if (!draft) return;
              const idx = draft.findIndex((c) => c.id === id);
              if (idx !== -1) draft[idx] = data.result;
              return draft;
            })
          );
          // Update getCommissionById cache
          dispatch(
            commissionsApi.util.updateQueryData("getCommissionById", id, (draft) => {
              return data.result;
            })
          );
        } catch (err) {
          console.log("Error occurred while updating", err);
        }
      },
    }),
    deleteCommission: builder.mutation<{ success: boolean; id: string }, DeleteCommissionRequest>({
      query: ({ id }) => ({
        url: `/api/commissions/${id}`,
        method: "DELETE",
        credentials: "include"
      }),
      invalidatesTags: ["Commissions", "CommissionStats", "MyCommissions"],
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Remove commission from getAllCommissions cache
          dispatch(
            commissionsApi.util.updateQueryData("getAllCommissions", undefined, (draft: Commission[] | undefined) => {
              if (!draft) return;
              const idx = draft.findIndex((c) => c.id === id);
              if (idx !== -1) draft.splice(idx, 1);
              return draft;
            })
          );
        } catch (err) {
          console.log("Error occurred while updating", err);
        }
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  // Queries
  useGetAllCommissionsQuery,
  useGetCommissionStatsQuery,
  useGetCommissionByIdQuery,
  useGetMyCommissionsQuery,

  // Mutations
  useCreateCommissionRequestMutation,
  useCreateCommissionMutation,
  useUpdateCommissionMutation,
  useUpdateCommissionStatusMutation,
  useDeleteCommissionMutation,
} = commissionsApi;