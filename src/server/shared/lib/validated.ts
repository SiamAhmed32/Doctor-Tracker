import type { Request } from "express";
import { AppError } from "../errors/app-error";

export function getValidatedQuery<T>(req: Request): T {
  if (!req.validated?.query) {
    throw new AppError("Missing validated query", 500);
  }
  return req.validated.query as T;
}

export function getValidatedParams<T>(req: Request): T {
  if (!req.validated?.params) {
    throw new AppError("Missing validated params", 500);
  }
  return req.validated.params as T;
}
