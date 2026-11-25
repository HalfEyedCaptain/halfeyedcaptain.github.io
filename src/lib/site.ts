/**
 * URL helpers that respect the configured `base` path, so the site works both
 * at a domain root (user page / custom domain) and in a sub-directory
 * (GitHub project page).
 */

const BASE = import.meta.env.BASE_URL.replace(/\/+$/, ''); // '' or '/repo'

export function isExternal(href: string): boolean {
  return /^(?:[a-z][a-z0-9+.-]*:|\/\/)/i.test(href);
}

/**
 * Turns a site-relative path into a base-aware URL.
 *   url('/work')            → '/repo/work/'
 *   url('/resume.pdf')      → '/repo/resume.pdf'
 *   url('#contact')         → '#contact'
 *   url('https://x.com')    → 'https://x.com'
 */
export function url(path = '/'): string {
  if (!path) return `${BASE}/`;
  if (isExternal(path) || path.startsWith('#') || path.startsWith('?')) return path;
  // Already base-prefixed?
  if (BASE && (path === BASE || path.startsWith(`${BASE}/`))) return path;

  const [pathname = '', hash = ''] = path.split(/(?=[?#])/, 2);
  let p = pathname.startsWith('/') ? pathname : `/${pathname}`;
  const last = p.split('/').pop() ?? '';
  if (!last.includes('.') && !p.endsWith('/')) p += '/';
  return `${BASE}${p}${hash}`;
}

/** Absolute URL for canonical / Open Graph tags. */
export function absoluteUrl(path: string, site: URL | undefined): string {
  if (isExternal(path)) return path;
  const origin = site?.origin ?? '';
  const rel = url(path);
  return `${origin}${rel}`;
}

/** Strips the base path from an incoming pathname, for active-link detection. */
export function withoutBase(pathname: string): string {
  const p = BASE && pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  return p.startsWith('/') ? p : `/${p}`;
}

export function slugify(input: string): string {
  return input
    .normalize('NFKD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}
