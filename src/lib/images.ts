/**
 * Resolves image paths written by the CMS into something we can render.
 *
 * Artwork uploaded through Pages CMS is stored in `src/assets/**` and the CMS
 * writes paths like "/src/assets/artwork/dragon.jpg" into the content files.
 * Because those files live in `src/`, Astro can optimise them (WebP, responsive
 * sizes, correct dimensions). External URLs are supported too and rendered
 * as-is.
 */
import type { ImageMetadata } from 'astro';

const modules = import.meta.glob<ImageMetadata>(
  '/src/assets/**/*.{jpg,jpeg,png,webp,avif,gif,tif,tiff,JPG,JPEG,PNG,WEBP,AVIF,GIF,TIF,TIFF}',
  { eager: true, import: 'default' },
);

const byLowerKey = new Map(Object.entries(modules).map(([k, v]) => [k.toLowerCase(), v] as const));

export type ResolvedImage =
  | { kind: 'local'; meta: ImageMetadata; path: string }
  | { kind: 'remote'; src: string }
  | { kind: 'missing'; src: string };

const warned = new Set<string>();

function normalise(src: string): string {
  let p = src.trim().replace(/\\/g, '/');
  try {
    p = decodeURI(p);
  } catch {
    /* keep as-is */
  }
  p = p.replace(/^\.\//, '');
  if (!p.startsWith('/')) p = `/${p}`;
  if (!p.startsWith('/src/')) p = `/src/assets${p}`;
  return p;
}

export function resolveImage(src: string | undefined | null): ResolvedImage | undefined {
  if (!src) return undefined;
  if (/^(https?:)?\/\//i.test(src)) return { kind: 'remote', src };
  const path = normalise(src);
  const meta = modules[path] ?? byLowerKey.get(path.toLowerCase());
  if (meta) return { kind: 'local', meta, path };
  if (!warned.has(path)) {
    warned.add(path);
    console.warn(`[images] Image not found: "${src}" (looked for ${path}). A placeholder will be shown.`);
  }
  return { kind: 'missing', src };
}

/** Returns local image metadata or undefined (helper for OG images etc.). */
export function localImage(src: string | undefined | null): ImageMetadata | undefined {
  const r = resolveImage(src);
  return r?.kind === 'local' ? r.meta : undefined;
}

/** Aspect ratio as a CSS value, falling back when dimensions are unknown. */
export function aspectOf(r: ResolvedImage | undefined, fallback = '4 / 5'): string {
  return r?.kind === 'local' ? `${r.meta.width} / ${r.meta.height}` : fallback;
}
