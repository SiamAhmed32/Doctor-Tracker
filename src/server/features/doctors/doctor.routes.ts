import { Router } from "express";
import { asyncHandler } from "../../shared/middleware/async-handler";
import { validate } from "../../shared/middleware/validate";
import {
  createPatientSchema,
  doctorPatientsQuerySchema,
} from "../patients/patient.validation";
import { doctorController } from "./doctor.controller";
import {
  createDoctorSchema,
  doctorIdParamsSchema,
  doctorListQuerySchema,
  doctorPatientParamsSchema,
  updateDoctorSchema,
} from "./doctor.validation";

const doctorRoutes = Router();

doctorRoutes.post(
  "/",
  validate(createDoctorSchema),
  asyncHandler((req, res) => doctorController.create(req, res)),
);

doctorRoutes.get(
  "/",
  validate(doctorListQuerySchema, "query"),
  asyncHandler((req, res) => doctorController.list(req, res)),
);

doctorRoutes.get(
  "/:id",
  validate(doctorIdParamsSchema, "params"),
  asyncHandler((req, res) => doctorController.getById(req, res)),
);

doctorRoutes.patch(
  "/:id",
  validate(doctorIdParamsSchema, "params"),
  validate(updateDoctorSchema),
  asyncHandler((req, res) => doctorController.update(req, res)),
);

doctorRoutes.get(
  "/:id/patients",
  validate(doctorIdParamsSchema, "params"),
  validate(doctorPatientsQuerySchema, "query"),
  asyncHandler((req, res) => doctorController.listPatients(req, res)),
);

doctorRoutes.post(
  "/:id/patients",
  validate(doctorIdParamsSchema, "params"),
  validate(createPatientSchema),
  asyncHandler((req, res) => doctorController.addPatient(req, res)),
);

doctorRoutes.delete(
  "/:id/patients/:patientId",
  validate(doctorPatientParamsSchema, "params"),
  asyncHandler((req, res) => doctorController.removePatient(req, res)),
);

export { doctorRoutes };
