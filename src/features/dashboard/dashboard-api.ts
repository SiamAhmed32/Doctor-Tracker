import { baseApi } from "@/store/base-api";
import type { DashboardOverview } from "./types";

export const dashboardApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDashboard: builder.query<DashboardOverview, { doctorLimit?: number } | void>({
      query: (params) => ({
        url: "/dashboard",
        params: params ?? undefined,
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardQuery } = dashboardApi;
