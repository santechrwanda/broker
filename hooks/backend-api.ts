import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const backendApi = createApi({
  reducerPath: "backendApi",
  tagTypes: ["LoggedUser", "Users", "Companies", "MyCompanies"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
    credentials: "include",
    prepareHeaders: (headers, { getState }) => {
      // Get token from localStorage if available
      if (typeof window !== "undefined") {
        const token = localStorage.getItem("token") || sessionStorage.getItem("token")
        if (token) {
          headers.set("authorization", `Bearer ${token}`)
        }
      }
      return headers
    },
  }),
  endpoints: (builder) => ({}), // eslint-disable-line @typescript-eslint/no-unused-vars
})

export default backendApi
