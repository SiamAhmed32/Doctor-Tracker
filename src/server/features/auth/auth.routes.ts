import { Router } from "express";
import { asyncHandler } from "../../shared/middleware/async-handler";
import { validate } from "../../shared/middleware/validate";
import { authController } from "./auth.controller";
import { loginSchema } from "./auth.validation";
import { requireAdmin, requireAuth } from "./middleware/require-auth";
import { loginRateLimit } from "./middleware/login-rate-limit";

const authRoutes = Router();

authRoutes.post(
  "/login",
  loginRateLimit,
  validate(loginSchema),
  asyncHandler((req, res) => authController.login(req, res)),
);

authRoutes.post(
  "/logout",
  asyncHandler((req, res) => authController.logout(req, res)),
);

authRoutes.get(
  "/me",
  requireAuth,
  requireAdmin,
  asyncHandler((req, res) => authController.me(req, res)),
);

authRoutes.use((_req, res) => {
  res.status(404).json({ message: "Not found" });
});

export { authRoutes };
