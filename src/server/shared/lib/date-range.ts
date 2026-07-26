import { AppError } from "../errors/app-error";

type DateRange = {
  from?: string;
  to?: string;
};

function parseDateBoundary(value: string, endOfDay: boolean): Date {
  if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const [year, month, day] = value.split("-").map(Number);
    if (endOfDay) {
      return new Date(year, month - 1, day, 23, 59, 59, 999);
    }
    return new Date(year, month - 1, day, 0, 0, 0, 0);
  }

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    throw new AppError(endOfDay ? "Invalid to date" : "Invalid from date", 400);
  }
  return date;
}

export function buildCreatedAtFilter(range: DateRange): {
  createdAt?: { $gte?: Date; $lte?: Date };
} {
  if (!range.from && !range.to) {
    return {};
  }

  const createdAt: { $gte?: Date; $lte?: Date } = {};

  if (range.from) {
    createdAt.$gte = parseDateBoundary(range.from, false);
  }

  if (range.to) {
    createdAt.$lte = parseDateBoundary(range.to, true);
  }

  if (createdAt.$gte && createdAt.$lte && createdAt.$gte > createdAt.$lte) {
    throw new AppError("`from` must be before `to`", 400);
  }

  return { createdAt };
}
