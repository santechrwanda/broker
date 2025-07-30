import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

const backendApi = createApi({
  reducerPath: "backendApi",
  tagTypes: ["LoggedUser",
    "Users",
    "Companies",
    "MyCompanies",
    "Commissions",
    "CommissionStats",
    "MyCommissions",
    "Market",
    "MarketToday",
    "MarketStats",
    "Transactions",
    "MyTransactions"],
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}`,
    credentials: "include",
  }),
  endpoints: (builder) => ({}), // eslint-disable-line @typescript-eslint/no-unused-vars
})

export default backendApi
