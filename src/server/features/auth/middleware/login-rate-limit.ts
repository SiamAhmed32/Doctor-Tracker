import type { NextFunction, Request, Response } from "express";
import { AppError } from "../../../shared/errors/app-error";

type Attempt = {
  count: number;
  resetAt: number;
};

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 10;
const attempts = new Map<string, Attempt>();

function clientKey(req: Request): string {
  const forwarded = req.headers["x-forwarded-for"];
  const ip =
    typeof forwarded === "string"
      ? forwarded.split(",")[0].trim()
      : req.ip || "unknown";
  const email =
    typeof req.body?.email === "string" ? req.body.email.toLowerCase() : "";
  return `${ip}:${email}`;
}

export function loginRateLimit(
  req: Request,
  _res: Response,
  next: NextFunction,
): void {
  const now = Date.now();
  const key = clientKey(req);
  const current = attempts.get(key);

  if (!current || current.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    next();
    return;
  }

  current.count += 1;

  if (current.count > MAX_ATTEMPTS) {
    const minutes = Math.ceil((current.resetAt - now) / 60000);
    next(
      new AppError(
        `Too many login attempts. Try again in ${minutes} minute(s).`,
        429,
      ),
    );
    return;
  }

  next();
}
