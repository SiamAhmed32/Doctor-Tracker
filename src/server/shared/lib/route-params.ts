import { AppError } from "../errors/app-error";

export function asParam(value: string | string[] | undefined): string {
  if (typeof value !== "string" || !value) {
    throw new AppError("Invalid route parameter", 400);
  }
  return value;
}
