import { z } from "zod";
import {
  dateFilterSchema,
  objectIdSchema,
  optionalText,
  paginationQuerySchema,
} from "../../shared/validation/common";

const optionalTrimmed = (value: unknown) =>
  value === "" || value === null ? undefined : value;

export const createPatientSchema = z.object({
  name: z.string().trim().min(2).max(80),
  age: z.preprocess(
    optionalTrimmed,
    z.coerce.number().int().min(0).max(150).optional(),
  ),
  phone: z.string().trim().min(6).max(20),
  email: z.preprocess(
    optionalTrimmed,
    z.string().trim().email().max(120).toLowerCase().optional(),
  ),
  condition: z.string().trim().min(2).max(120),
});

export const updatePatientSchema = z
  .object({
    name: z.string().trim().min(2).max(80).optional(),
    age: z.preprocess(
      optionalTrimmed,
      z.coerce.number().int().min(0).max(150).optional(),
    ),
    phone: z.string().trim().min(6).max(20).optional(),
    email: z.preprocess(
      optionalTrimmed,
      z.string().trim().email().max(120).toLowerCase().optional(),
    ),
    condition: z.string().trim().min(2).max(120).optional(),
    doctorId: objectIdSchema.optional(),
  })
  .refine((data) => Object.keys(data).length > 0, {
    message: "At least one field is required",
  });

export const patientIdParamsSchema = z.object({
  id: objectIdSchema,
});

export const doctorPatientsQuerySchema = paginationQuerySchema;

export const patientListQuerySchema = paginationQuerySchema
  .merge(dateFilterSchema)
  .extend({
    search: optionalText(80),
    condition: optionalText(120),
    doctorId: z.preprocess(optionalTrimmed, objectIdSchema.optional()),
  });

export type CreatePatientInput = z.infer<typeof createPatientSchema>;
export type UpdatePatientInput = z.infer<typeof updatePatientSchema>;
export type DoctorPatientsQuery = z.infer<typeof doctorPatientsQuerySchema>;
export type PatientListQuery = z.infer<typeof patientListQuerySchema>;
