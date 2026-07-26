/** Normalize dropdown-style filters so equality can use indexes. */
export function normalizeFilterValue(value: string): string {
  return value.trim().toLowerCase();
}
