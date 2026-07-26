import { toDateKey } from "./date-range";

export type DateCount = {
  date: string;
  count: number;
};

export function fillDailySeries(
  from: Date,
  to: Date,
  points: DateCount[],
): DateCount[] {
  const counts = new Map(points.map((point) => [point.date, point.count]));
  const series: DateCount[] = [];
  const cursor = new Date(from.getFullYear(), from.getMonth(), from.getDate());
  const end = new Date(to.getFullYear(), to.getMonth(), to.getDate());

  while (cursor <= end) {
    const key = toDateKey(cursor);
    series.push({ date: key, count: counts.get(key) ?? 0 });
    cursor.setDate(cursor.getDate() + 1);
  }

  return series;
}
