import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

const apiBaseUrl = process.env.NEXT_PUBLIC_API_URL || "/api";

export const baseApi = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: apiBaseUrl,
    credentials: "include",
  }),
  tagTypes: ["Auth", "Doctor", "Patient", "Dashboard"],
  endpoints: () => ({}),
});
