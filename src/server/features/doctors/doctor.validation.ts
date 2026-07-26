import { z } from "zod";
import {
  dateFilterSchema,
  objectIdSchema,
  optionalText,
  paginationQuerySchema,
} from "../../shared/validation/common";

export const createDoctorSchema = z.object({
  name: z.string().trim().min(2).max(80),
  specialization: z.string().trim().min(2).max(80),
  hospital: z.string().trim().min(2).max(120),
  phone: z.string().trim().min(6).max(20),
  email: z.string().trim().email().max(120).toLowerCase(),
});

export const doctorIdParamsSchema = z.object({
  id: objectIdSchema,
});

export const doctorPatientParamsSchema = z.object({
  id: objectIdSchema,
  patientId: objectIdSchema,
});

export const doctorListQuerySchema = paginationQuerySchema
  .merge(dateFilterSchema)
  .extend({
    search: optionalText(80),
    specialization: optionalText(80),
    hospital: optionalText(120),
  });

export type CreateDoctorInput = z.infer<typeof createDoctorSchema>;
export type DoctorListQuery = z.infer<typeof doctorListQuerySchema>;
