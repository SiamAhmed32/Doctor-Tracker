import type { NextFunction, Request, Response } from "express";
import { ZodError } from "zod";
import { AppError } from "../errors/app-error";

type MongoLikeError = {
  code?: number;
  name?: string;
};

export function errorHandler(
  err: unknown,
  _req: Request,
  res: Response,
  _next: NextFunction,
): void {
  if (err instanceof ZodError) {
    res.status(400).json({
      message: "Validation failed",
      errors: err.issues.map((issue) => ({
        path: issue.path.join("."),
        message: issue.message,
      })),
    });
    return;
  }

  if (err instanceof SyntaxError) {
    res.status(400).json({ message: "Invalid JSON body" });
    return;
  }

  const mongoErr = err as MongoLikeError;
  if (mongoErr?.code === 11000) {
    res.status(409).json({ message: "Duplicate entry" });
    return;
  }

  if (mongoErr?.name === "CastError") {
    res.status(400).json({ message: "Invalid id" });
    return;
  }

  if (err instanceof AppError) {
    res.status(err.statusCode).json({ message: err.message });
    return;
  }

  console.error(err);
  res.status(500).json({ message: "Internal server error" });
}
