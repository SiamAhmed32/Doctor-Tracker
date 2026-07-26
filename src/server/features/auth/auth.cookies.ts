import type { CookieOptions, Response } from "express";
import { env } from "../../config/env";
import { expiresInToMs } from "../../shared/lib/cookie-max-age";

const SEVEN_DAYS_MS = 7 * 24 * 60 * 60 * 1000;

function cookieOptions(): CookieOptions {
  return {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? "none" : "lax",
    maxAge: expiresInToMs(env.jwtExpiresIn, SEVEN_DAYS_MS),
    path: "/",
  };
}

export function setAuthCookie(res: Response, token: string): void {
  res.cookie(env.cookieName, token, cookieOptions());
}

export function clearAuthCookie(res: Response): void {
  res.clearCookie(env.cookieName, {
    httpOnly: true,
    secure: env.isProd,
    sameSite: env.isProd ? "none" : "lax",
    path: "/",
  });
}
