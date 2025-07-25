import { UserShape } from "@/components/pages/users/users-list";
import backendApi from "./backend-api";

// User types
export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
  [key: string]: any;
}

export interface CreateUserRequest {
  name: string;
  email: string;
  phone: string;
  role: string;
  status: string;
}

export interface ImportRequest {
    users: CreateUserRequest[]
}

export interface UpdateUserRequest {
  id: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  status?: string;
}

export interface ChangeUserStatusRequest {
  id: string;
  status: string;
}

export interface DeleteUserRequest {
  id: string;
}

const usersApi = backendApi.injectEndpoints({
  endpoints: (builder) => ({
    getAllUsers: builder.query<UserShape[], void>({
      query: () => ({
        url: "/api/users",
        method: "GET",
        credentials: "include"
      }),
      transformResponse: (response: { result: UserShape[] }) => response.result,
      providesTags: ["Users"],
    }),
    createUser: builder.mutation<User, CreateUserRequest>({
      query: (body) => ({
        url: "/api/users",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Users"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          const { result } = data;
          // Update getAllUsers cache with updated user
          dispatch(
            usersApi.util.updateQueryData("getAllUsers", undefined, (draft: UserShape[] | undefined) => {
              if (!draft) return;
              const idx = draft.findIndex((u) => u.id === result.id);
              if (idx !== -1) draft[idx] = result;
              return draft;
            })
          );
        } catch (err) {
          console.log("Error occurred while updating", err);
        }
      },
    }),
    importUsers: builder.mutation<User, ImportRequest>({
        query: (body) => ({
          url: "/api/users/import",
          method: "POST",
          body,
        }),
        invalidatesTags: ["Users"],
        async onQueryStarted(args, { dispatch, queryFulfilled }) {
          try {
            const { data } = await queryFulfilled;
            const { result } = data;
            // Update getAllUsers cache with updated user
            dispatch(
              usersApi.util.updateQueryData("getAllUsers", undefined, (draft: UserShape[] = []) => [...draft, ...result])
            );
          } catch (err) {
            console.log("Error occurred while updating", err);
          }
        },
      }),
    updateUser: builder.mutation<User, UpdateUserRequest>({
      query: ({ id, ...body }) => ({
        url: `/api/users/${id}`,
        method: "PUT",
        body,
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Update getAllUsers cache with updated user
          dispatch(
            usersApi.util.updateQueryData("getAllUsers", undefined, (draft: UserShape[] | undefined) => {
              if (!draft) return;
              const idx = draft.findIndex((u) => u.id === id);
              if (idx !== -1) draft[idx] = data.result;
            })
          );
        } catch (err) {
          console.log("Error occurred while updating", err);
        }
      },
    }),
    deleteUser: builder.mutation<{ success: boolean; id: string }, DeleteUserRequest>({
      query: ({ id }) => ({
        url: `/api/users/${id}`,
        method: "DELETE",
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;
          // Remove user from getAllUsers cache
          dispatch(
            usersApi.util.updateQueryData("getAllUsers", undefined, (draft: UserShape[] | undefined) => {
              if (!draft) return;
              const idx = draft.findIndex((u) => u.id === id);
              if (idx !== -1) draft.splice(idx, 1);
            })
          );
        } catch (err) {
            console.log("Error occurred while updating", err);
        }
      },
    }),
    changeUserStatus: builder.mutation<User, ChangeUserStatusRequest>({
      query: ({ id, status }) => ({
        url: `/api/users/${id}/status`,
        method: "PATCH",
        body: { status },
      }),
      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          // Update user status in getAllUsers cache
          dispatch(
            usersApi.util.updateQueryData("getAllUsers", undefined, (draft: UserShape[] | undefined) => {
              if (!draft) return;
              const idx = draft.findIndex((u) => u.id === id);
              if (idx !== -1) draft[idx] = data.result;
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
  useGetAllUsersQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useImportUsersMutation,
  useChangeUserStatusMutation,
} = usersApi; 