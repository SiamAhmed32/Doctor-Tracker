import { z } from "zod";

export const objectIdSchema = z
  .string()
  .trim()
  .regex(/^[a-fA-F0-9]{24}$/, "Invalid id");

export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export const dateFilterSchema = z.object({
  from: z.string().trim().optional(),
  to: z.string().trim().optional(),
});

/** Treats "" as undefined after trim. */
export function optionalText(max: number) {
  return z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((value) => (value ? value : undefined));
}
