import { Router } from "express";
import { authRoutes } from "../features/auth/auth.routes";
import { dashboardRoutes } from "../features/dashboard/dashboard.routes";
import { doctorRoutes } from "../features/doctors/doctor.routes";
import { patientRoutes } from "../features/patients/patient.routes";
import {
  requireAdmin,
  requireAuth,
} from "../features/auth/middleware/require-auth";

const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

apiRouter.use("/auth", authRoutes);

const protectedRouter = Router();
protectedRouter.use(requireAuth, requireAdmin);
protectedRouter.use("/doctors", doctorRoutes);
protectedRouter.use("/patients", patientRoutes);
protectedRouter.use("/dashboard", dashboardRoutes);

apiRouter.use(protectedRouter);

export { apiRouter };
