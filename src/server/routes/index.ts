import { Router } from "express";
import { authRoutes } from "../features/auth/auth.routes";
import { doctorRoutes } from "../features/doctors/doctor.routes";
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

apiRouter.use(protectedRouter);

export { apiRouter };
