import { UserShape } from "@/components/pages/users/users-list";
import backendApi from "./backend-api";

// Define types for request bodies
export interface RegisterUserRequest {
  email: string;
  password: string;
  name?: string;
}

export interface LoginUserRequest {
  email: string;
  password: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  resetCode: string;
  password: string;
}

// Define types for responses (customize as needed)
export interface AuthResponse {
  success: boolean;
  message: string;
  token?: string;
  user?: {
    id: string;
    email: string;
    name?: string;
  };
}

const authenticationApi = backendApi.injectEndpoints({
  endpoints: (builder) => ({
    registerUser: builder.mutation<AuthResponse, RegisterUserRequest>({
      query: (body) => ({
        url: "/api/register",
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["LoggedUser"],
    }),
    loginUser: builder.mutation<UserShape, LoginUserRequest>({
      query: (body) => ({
        url: "/api/credentials-login",
        method: "POST",
        body,
        credentials: "include",
      }),
      transformResponse: (response: { result: UserShape }) => response.result,
      invalidatesTags: ["LoggedUser"],
    }),
    forgotPassword: builder.mutation<AuthResponse, ForgotPasswordRequest>({
      query: (body) => ({
        url: "/api/forgot-password",
        method: "POST",
        body,
        credentials: "include"
      }),
    }),
    resetPassword: builder.mutation<AuthResponse, ResetPasswordRequest>({
      query: ({ resetCode, password }) => ({
        url: `/api/reset-password/${resetCode}`,
        method: "POST",
        body: { password },
        credentials: "include",
      }),
    }),
    logoutUser: builder.mutation<AuthResponse, void>({
      query: () => ({
        url: "/api/logout",
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["LoggedUser"],
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          await queryFulfilled;

          // Clear the getLoggedUser cache to reflect logout
          dispatch(
            authenticationApi.util.updateQueryData(
              "getLoggedUser",
              undefined,
              () => null as unknown as UserShape // forcefully clear the state
            )
          );
        } catch (error) {
          console.error("Logout failed:", error);
        }
      },
    }),

    getLoggedUser: builder.query<UserShape, void>({
      query: () => ({
        url: "/api/me",
        method: "GET",
        credentials: "include",
      }),
      transformResponse: (response: { result: UserShape }) => response.result,
      providesTags: ["LoggedUser"],
    }),
  }),
  overrideExisting: false,
});

export const {
  useRegisterUserMutation,
  useLoginUserMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
  useLogoutUserMutation,
  useGetLoggedUserQuery,
} = authenticationApi;
