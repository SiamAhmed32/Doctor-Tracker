import { z } from "zod";
import { paginationQuerySchema } from "../../shared/validation/common";

export const createPatientSchema = z.object({
  name: z.string().trim().min(2).max(80),
  age: z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.coerce.number().int().min(0).max(150).optional(),
  ),
  phone: z.string().trim().min(6).max(20),
  email: z.preprocess(
    (value) => (value === "" || value === null ? undefined : value),
    z.string().trim().email().max(120).toLowerCase().optional(),
  ),
  condition: z.string().trim().min(2).max(120),
});

export const doctorPatientsQuerySchema = paginationQuerySchema;

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type DoctorPatientsQuery = z.infer<typeof doctorPatientsQuerySchema>;
