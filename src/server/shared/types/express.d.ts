import type { JwtPayload } from "../lib/jwt";

declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
      validated?: {
        query?: unknown;
        params?: unknown;
      };
    }
  }
}

export {};
