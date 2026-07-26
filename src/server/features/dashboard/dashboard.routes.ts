import { Router } from "express";
import { asyncHandler } from "../../shared/middleware/async-handler";
import { validate } from "../../shared/middleware/validate";
import { dashboardController } from "./dashboard.controller";
import { dashboardQuerySchema } from "./dashboard.validation";

const dashboardRoutes = Router();

dashboardRoutes.get(
  "/",
  validate(dashboardQuerySchema, "query"),
  asyncHandler((req, res) => dashboardController.overview(req, res)),
);

dashboardRoutes.get(
  "/overview",
  validate(dashboardQuerySchema, "query"),
  asyncHandler((req, res) => dashboardController.overview(req, res)),
);

export { dashboardRoutes };
