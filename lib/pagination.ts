export type KeysetCursor = string | null; // ISO date string for created_at

export function parseLimit(input: string | null, def = 20, max = 100) {
  const n = Number(input || def);
  if (!Number.isFinite(n) || n <= 0) return def;
  return Math.min(Math.floor(n), max);
}

export function encodeCursor(d: string | Date | null | undefined): KeysetCursor {
  if (!d) return null;
  const iso = typeof d === "string" ? d : d.toISOString();
  return iso;
}

