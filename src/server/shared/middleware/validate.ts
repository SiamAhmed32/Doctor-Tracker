import type { NextFunction, Request, Response } from "express";
import type { ZodType } from "zod";

type RequestPart = "body" | "query" | "params";

export function validate(schema: ZodType, part: RequestPart = "body") {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const parsed = schema.parse(req[part]);

    if (part === "body") {
      req.body = parsed;
    } else {
      req.validated = {
        ...req.validated,
        [part]: parsed,
      };
    }

    next();
  };
}
