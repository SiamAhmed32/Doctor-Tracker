import { Router } from "express";
import { asyncHandler } from "../../shared/middleware/async-handler";
import { validate } from "../../shared/middleware/validate";
import { patientController } from "./patient.controller";
import {
  patientIdParamsSchema,
  patientListQuerySchema,
  updatePatientSchema,
} from "./patient.validation";

const patientRoutes = Router();

patientRoutes.get(
  "/",
  validate(patientListQuerySchema, "query"),
  asyncHandler((req, res) => patientController.list(req, res)),
);

patientRoutes.patch(
  "/:id",
  validate(patientIdParamsSchema, "params"),
  validate(updatePatientSchema),
  asyncHandler((req, res) => patientController.update(req, res)),
);

patientRoutes.delete(
  "/:id",
  validate(patientIdParamsSchema, "params"),
  asyncHandler((req, res) => patientController.remove(req, res)),
);

export { patientRoutes };
