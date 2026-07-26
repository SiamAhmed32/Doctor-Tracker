/** Converts values like 7d, 24h, 30m, 60s into milliseconds. */
export function expiresInToMs(value: string, fallbackMs: number): number {
  const match = /^(\d+)([smhd])$/i.exec(value.trim());
  if (!match) {
    return fallbackMs;
  }

  const amount = Number(match[1]);
  const unit = match[2].toLowerCase();
  const multipliers: Record<string, number> = {
    s: 1000,
    m: 60 * 1000,
    h: 60 * 60 * 1000,
    d: 24 * 60 * 60 * 1000,
  };

  return amount * multipliers[unit];
}
