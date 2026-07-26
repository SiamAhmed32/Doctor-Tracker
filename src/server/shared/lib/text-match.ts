export function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Case-insensitive substring match, for free-text search fields. */
export function containsInsensitive(value: string): RegExp {
  return new RegExp(escapeRegex(value), "i");
}

/** Case-insensitive exact match, for dropdown-style filters. */
export function exactInsensitive(value: string): RegExp {
  return new RegExp(`^${escapeRegex(value)}$`, "i");
}
