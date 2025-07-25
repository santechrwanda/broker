import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';

const backendApi = createApi({
  reducerPath: 'backendApi',
  tagTypes: ["LoggedUser", "Users"],
  baseQuery: fetchBaseQuery({ baseUrl: `${process.env.NEXT_PUBLIC_API_URL}` }), // Set your API base URL
  endpoints: (builder) => ({}) // eslint-disable-line @typescript-eslint/no-unused-vars
});

export default backendApi;