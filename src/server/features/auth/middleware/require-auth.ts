import type { NextFunction, Request, Response } from "express";
import { env } from "../../../config/env";
import { AppError } from "../../../shared/errors/app-error";
import { verifyToken } from "../../../shared/lib/jwt";
import { userRepository } from "../../users/user.repository";

export async function requireAuth(
  req: Request,
  _res: Response,
  next: NextFunction,
): Promise<void> {
  const token = req.cookies?.[env.cookieName] as string | undefined;

  if (!token) {
    next(new AppError("Authentication required", 401));
    return;
  }

  try {
    const payload = verifyToken(token);
    const user = await userRepository.findById(payload.sub);

    if (!user) {
      next(new AppError("Authentication required", 401));
      return;
    }

    req.user = {
      sub: user._id.toString(),
      email: user.email,
      role: user.role,
    };
    next();
  } catch (error) {
    if (error instanceof AppError) {
      next(error);
      return;
    }
    next(new AppError("Invalid or expired token", 401));
  }
}

export function requireAdmin(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  if (!req.user) {
    next(new AppError("Authentication required", 401));
    return;
  }

  if (req.user.role !== "admin") {
    next(new AppError("Forbidden", 403));
    return;
  }

  next();
}
