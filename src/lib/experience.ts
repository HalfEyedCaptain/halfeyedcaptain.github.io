/**
 * Career-length calculation.
 *
 * Employment periods are converted to inclusive month intervals, sorted, and
 * merged so that overlapping or back-to-back roles (e.g. a freelance contract
 * alongside a full-time job) are never double-counted.
 *
 * Pure module — unit tested in experience.test.ts.
 */
import { parsePartialDate } from './dates.ts';

export interface EmploymentPeriod {
  start: string;
  end?: string | undefined;
  current?: boolean | undefined;
}

type Interval = [start: number, end: number];

/** Absolute month index (year * 12 + monthIndex). Year-only dates use January for starts, December for ends. */
function toMonthIndex(value: string, edge: 'start' | 'end'): number | undefined {
  const d = parsePartialDate(value);
  if (!d) return undefined;
  const month = d.month ?? (edge === 'start' ? 1 : 12);
  return d.year * 12 + (month - 1);
}

function nowIndex(now: Date): number {
  return now.getUTCFullYear() * 12 + now.getUTCMonth();
}

/** Converts periods to clamped, valid inclusive month intervals. */
export function toIntervals(periods: EmploymentPeriod[], now: Date = new Date()): Interval[] {
  const today = nowIndex(now);
  const out: Interval[] = [];
  for (const p of periods) {
    const s = toMonthIndex(p.start, 'start');
    if (s === undefined) continue;
    // No end date (or "current") → ongoing until today.
    let e = p.current || !p.end ? today : toMonthIndex(p.end, 'end');
    if (e === undefined) continue;
    if (e > today) e = today; // never count future months
    if (s > today || e < s) continue;
    out.push([s, e]);
  }
  return out;
}

/** Merges overlapping and directly adjacent intervals. */
export function mergeIntervals(intervals: Interval[]): Interval[] {
  const sorted = [...intervals].sort((a, b) => a[0] - b[0] || a[1] - b[1]);
  const merged: Interval[] = [];
  for (const [s, e] of sorted) {
    const last = merged.at(-1);
    if (last && s <= last[1] + 1) {
      last[1] = Math.max(last[1], e);
    } else {
      merged.push([s, e]);
    }
  }
  return merged;
}

/** Total distinct months worked across all periods (inclusive of start and end months). */
export function totalExperienceMonths(periods: EmploymentPeriod[], now: Date = new Date()): number {
  return mergeIntervals(toIntervals(periods, now)).reduce((sum, [s, e]) => sum + (e - s + 1), 0);
}

/** Length of a single role in months (inclusive). */
export function periodMonths(period: EmploymentPeriod, now: Date = new Date()): number {
  return totalExperienceMonths([period], now);
}

/** 40 → "3 yrs 4 mos"; 12 → "1 yr"; 5 → "5 mos". */
export function formatDuration(months: number): string {
  if (months <= 0) return '';
  const y = Math.floor(months / 12);
  const m = months % 12;
  const parts: string[] = [];
  if (y) parts.push(`${y} ${y === 1 ? 'yr' : 'yrs'}`);
  if (m) parts.push(`${m} ${m === 1 ? 'mo' : 'mos'}`);
  return parts.join(' ');
}

/** Whole years for headline statistics: 40 months → 3. */
export function wholeYears(months: number): number {
  return Math.floor(months / 12);
}
