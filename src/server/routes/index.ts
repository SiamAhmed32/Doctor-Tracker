import { Router } from "express";
import { authRoutes } from "../features/auth/auth.routes";
import {
  requireAdmin,
  requireAuth,
} from "../features/auth/middleware/require-auth";

const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

apiRouter.use("/auth", authRoutes);

// All non-auth feature routes require authentication.
const protectedRouter = Router();
protectedRouter.use(requireAuth, requireAdmin);

protectedRouter.get("/secure-check", (_req, res) => {
  res.status(200).json({ message: "Protected route access granted" });
});

apiRouter.use(protectedRouter);

export { apiRouter };
