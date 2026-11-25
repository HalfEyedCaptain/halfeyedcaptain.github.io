/**
 * Reusable, CMS-tolerant Zod helpers.
 *
 * Git-based CMS editors (Pages CMS) may write empty strings, `null`, or omit keys
 * entirely when the artist leaves a field blank. These helpers normalise all of
 * those cases so that an empty optional field never breaks the build, while
 * genuinely invalid content (e.g. a malformed date) still fails validation with
 * a clear message.
 */
import { z } from 'astro/zod';

/** Optional trimmed string. Empty / null / missing → undefined. */
export const optStr = z
  .string()
  .nullish()
  .transform((v) => (typeof v === 'string' && v.trim() !== '' ? v.trim() : undefined));

/** Required, non-empty trimmed string. */
export const reqStr = (label: string) =>
  z.string({ error: `${label} is required` }).trim().min(1, { error: `${label} is required` });

/** Optional URL. Adds https:// when the artist omits the protocol (e.g. "artstation.com/foo"). */
export const optUrl = optStr.transform((v) => {
  if (!v) return undefined;
  if (/^(https?:|mailto:|tel:|\/)/i.test(v)) return v;
  return `https://${v}`;
});

/** Boolean that defaults to `fallback` when blank. */
export const bool = (fallback = false) =>
  z
    .union([z.boolean(), z.string()])
    .nullish()
    .transform((v) => {
      if (typeof v === 'boolean') return v;
      if (typeof v === 'string') return v.toLowerCase() === 'true';
      return fallback;
    });

/** Number that defaults to `fallback` when blank. */
export const num = (fallback: number) =>
  z
    .union([z.number(), z.string()])
    .nullish()
    .transform((v) => {
      if (typeof v === 'number' && Number.isFinite(v)) return v;
      if (typeof v === 'string' && v.trim() !== '' && Number.isFinite(Number(v))) return Number(v);
      return fallback;
    });

/** List helper: null / missing → []. Blank items are removed. */
export const list = <T extends z.ZodType>(item: T) =>
  z
    .array(item.nullable())
    .nullish()
    .transform((v) => (v ?? []).filter((x) => x !== null && x !== undefined && x !== '') as z.output<T>[]);

/** List of plain strings, trimmed, blanks removed. */
export const strList = list(z.string()).transform((v) => v.map((s) => s.trim()).filter(Boolean));

/**
 * Partial ISO date: "YYYY", "YYYY-MM" or "YYYY-MM-DD".
 * YAML may also parse unquoted dates into Date objects – those are accepted too.
 * Output is always a string in one of those three precisions, or undefined.
 */
export const optDate = z
  .union([z.date(), z.string(), z.number()])
  .nullish()
  .transform((v, ctx) => {
    if (v === null || v === undefined || v === '') return undefined;
    if (v instanceof Date) return v.toISOString().slice(0, 10);
    const s = String(v).trim();
    if (/^\d{4}$/.test(s) || /^\d{4}-\d{2}$/.test(s) || /^\d{4}-\d{2}-\d{2}$/.test(s)) return s;
    const m = /^(\d{4}-\d{2}-\d{2})T/.exec(s);
    if (m?.[1]) return m[1];
    ctx.addIssue({ code: 'custom', message: `"${s}" is not a valid date. Use YYYY-MM-DD.` });
    return z.NEVER;
  });

/**
 * A reference to another entry (category, project, game…).
 * Pages CMS may store a full path ("src/content/categories/stylized.json"),
 * a filename, or a bare id – all are normalised to the bare id ("stylized").
 */
export const refId = optStr.transform((v) => (v ? toRefId(v) : undefined));
export const refList = list(z.string()).transform((v) =>
  v.map((s) => toRefId(s)).filter((s): s is string => Boolean(s)),
);

export function toRefId(value: string): string {
  const last = value.trim().replace(/\\/g, '/').split('/').pop() ?? '';
  return last
    .replace(/\.(md|mdx|json|ya?ml)$/i, '')
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * An image reference. Either a repository image (uploaded via the CMS) or an
 * externally hosted URL. Alt text is strongly encouraged for accessibility.
 */
export const imageRef = z
  .object({
    image: optStr,
    url: optUrl,
    alt: optStr,
    caption: optStr,
  })
  .nullish()
  .transform((v) => {
    const src = v?.image ?? v?.url;
    if (!src) return undefined;
    return { src, alt: v?.alt ?? '', caption: v?.caption };
  });

export type ImageRef = NonNullable<z.output<typeof imageRef>>;

export const imageList = list(z.any())
  .pipe(z.array(imageRef))
  .transform((v) => v.filter((x): x is ImageRef => Boolean(x)));

export const status = z
  .enum(['published', 'draft', 'archived'])
  .nullish()
  .transform((v) => v ?? 'published');
