import { baseApi } from "@/store/base-api";
import type { Paginated } from "@/features/doctors/types";
import type { Patient, PatientInput, PatientListParams } from "./types";

export const patientsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getPatients: builder.query<Paginated<Patient>, PatientListParams | void>({
      query: (params) => ({
        url: "/patients",
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({
                type: "Patient" as const,
                id,
              })),
              { type: "Patient", id: "LIST" },
            ]
          : [{ type: "Patient", id: "LIST" }],
    }),
    updatePatient: builder.mutation<
      { patient: Patient },
      { id: string; body: Partial<PatientInput> }
    >({
      query: ({ id, body }) => ({
        url: `/patients/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Patient", id },
        { type: "Patient", id: "LIST" },
        "Dashboard",
      ],
    }),
    deletePatient: builder.mutation<{ id: string }, string>({
      query: (id) => ({
        url: `/patients/${id}`,
        method: "DELETE",
      }),
      invalidatesTags: [
        { type: "Patient", id: "LIST" },
        "Dashboard",
        { type: "Doctor", id: "LIST" },
      ],
    }),
  }),
});

export const {
  useGetPatientsQuery,
  useUpdatePatientMutation,
  useDeletePatientMutation,
} = patientsApi;
