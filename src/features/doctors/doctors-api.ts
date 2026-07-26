import { baseApi } from "@/store/base-api";
import type { Patient } from "@/features/patients/types";
import type {
  Doctor,
  DoctorInput,
  DoctorListParams,
  Paginated,
} from "./types";

export const doctorsApi = baseApi.injectEndpoints({
  endpoints: (builder) => ({
    getDoctors: builder.query<Paginated<Doctor>, DoctorListParams | void>({
      query: (params) => ({
        url: "/doctors",
        params: params ?? undefined,
      }),
      providesTags: (result) =>
        result
          ? [
              ...result.data.map(({ id }) => ({ type: "Doctor" as const, id })),
              { type: "Doctor", id: "LIST" },
            ]
          : [{ type: "Doctor", id: "LIST" }],
    }),
    getDoctor: builder.query<{ doctor: Doctor }, string>({
      query: (id) => `/doctors/${id}`,
      providesTags: (_result, _error, id) => [{ type: "Doctor", id }],
    }),
    createDoctor: builder.mutation<{ doctor: Doctor }, DoctorInput>({
      query: (body) => ({ url: "/doctors", method: "POST", body }),
      invalidatesTags: [
        { type: "Doctor", id: "LIST" },
        "Dashboard",
      ],
    }),
    updateDoctor: builder.mutation<
      { doctor: Doctor },
      { id: string; body: Partial<DoctorInput> }
    >({
      query: ({ id, body }) => ({
        url: `/doctors/${id}`,
        method: "PATCH",
        body,
      }),
      invalidatesTags: (_result, _error, { id }) => [
        { type: "Doctor", id },
        { type: "Doctor", id: "LIST" },
        "Dashboard",
      ],
    }),
    getDoctorPatients: builder.query<
      Paginated<Patient>,
      { id: string; page?: number; limit?: number }
    >({
      query: ({ id, ...params }) => ({
        url: `/doctors/${id}/patients`,
        params,
      }),
      providesTags: ["Patient"],
    }),
    addDoctorPatient: builder.mutation<
      { patient: Patient },
      {
        id: string;
        body: {
          name: string;
          age?: number;
          phone: string;
          email?: string;
          condition: string;
        };
      }
    >({
      query: ({ id, body }) => ({
        url: `/doctors/${id}/patients`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Patient", "Dashboard", { type: "Doctor", id: "LIST" }],
    }),
  }),
});

export const {
  useGetDoctorsQuery,
  useGetDoctorQuery,
  useCreateDoctorMutation,
  useUpdateDoctorMutation,
  useGetDoctorPatientsQuery,
  useAddDoctorPatientMutation,
} = doctorsApi;
