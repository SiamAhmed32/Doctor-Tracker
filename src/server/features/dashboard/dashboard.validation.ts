import { z } from "zod";
import { dateFilterSchema } from "../../shared/validation/common";

export const dashboardQuerySchema = dateFilterSchema.extend({
  doctorLimit: z.coerce.number().int().min(1).max(50).default(10),
  interval: z.enum(["day"]).default("day"),
});

export type DashboardQuery = z.infer<typeof dashboardQuerySchema>;
