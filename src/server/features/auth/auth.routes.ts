import { Router } from "express";
import { asyncHandler } from "../../shared/middleware/async-handler";
import { validate } from "../../shared/middleware/validate";
import { authController } from "./auth.controller";
import { loginSchema, registerSchema } from "./auth.validation";
import { requireAdmin, requireAuth } from "./middleware/require-auth";

const authRoutes = Router();

authRoutes.post(
  "/register",
  validate(registerSchema),
  asyncHandler((req, res) => authController.register(req, res)),
);

authRoutes.post(
  "/login",
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

export { authRoutes };
