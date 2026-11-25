/**
 * Date helpers for partial ISO dates ("YYYY", "YYYY-MM", "YYYY-MM-DD").
 * Pure functions — no Astro imports — so they can be unit-tested with node:test.
 */

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

export interface YearMonth {
  year: number;
  /** 1–12; undefined when only a year was given. */
  month: number | undefined;
}

export function parsePartialDate(value: string | undefined | null): YearMonth | undefined {
  if (!value) return undefined;
  const m = /^(\d{4})(?:-(\d{2}))?/.exec(value.trim());
  if (!m) return undefined;
  const year = Number(m[1]);
  const month = m[2] ? Number(m[2]) : undefined;
  if (month !== undefined && (month < 1 || month > 12)) return undefined;
  return { year, month };
}

/** "2023-04-01" → "Apr 2023"; "2023" → "2023". */
export function formatMonthYear(value: string | undefined | null): string {
  const d = parsePartialDate(value);
  if (!d) return '';
  return d.month ? `${MONTHS[d.month - 1]} ${d.year}` : String(d.year);
}

export function formatYear(value: string | undefined | null): string {
  return parsePartialDate(value)?.year.toString() ?? '';
}

/** "Apr 2021 – Present" / "2019 – 2021". */
export function formatRange(
  start: string | undefined,
  end: string | undefined,
  current = false,
  opts: { yearOnly?: boolean; presentLabel?: string } = {},
): string {
  const f = opts.yearOnly ? formatYear : formatMonthYear;
  const s = f(start);
  const e = current ? (opts.presentLabel ?? 'Present') : f(end);
  if (s && e && s !== e) return `${s} – ${e}`;
  return s || e;
}

/** Sortable numeric key; missing dates sort last when descending. */
export function dateSortKey(value: string | undefined | null): number {
  const d = parsePartialDate(value);
  if (!d) return -Infinity;
  return d.year * 100 + (d.month ?? 0);
}
