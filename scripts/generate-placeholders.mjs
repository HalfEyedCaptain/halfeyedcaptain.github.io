/**
 * Generates clearly-labelled placeholder images used until the artist
 * supplies original artwork. These are abstract (contour lines and a neutral
 * bust silhouette) and are labelled "PLACEHOLDER" so they can never be mistaken
 * for real artwork.
 *
 * Usage: npm run placeholders
 */
import { mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const out = (p) => join(root, 'src', 'assets', p);

function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 4294967296;
  };
}

function contourPaths(w, h, seed, count = 22) {
  const rand = rng(seed);
  const cx = w * (0.35 + rand() * 0.3);
  const cy = h * (0.35 + rand() * 0.3);
  const harmonics = Array.from({ length: 4 }, (_, i) => ({ k: i + 2, a: 0.04 + rand() * 0.05, p: rand() * Math.PI * 2 }));
  const max = Math.hypot(w, h) * 0.7;
  const paths = [];
  for (let i = 1; i <= count; i++) {
    const R = (max / count) * i;
    let d = '';
    for (let t = 0; t <= 96; t++) {
      const th = (t / 96) * Math.PI * 2;
      let r = R;
      for (const hm of harmonics) r += R * hm.a * Math.sin(hm.k * th + hm.p + i * 0.15);
      const x = cx + r * Math.cos(th);
      const y = cy + r * Math.sin(th) * 0.85;
      d += `${t === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    }
    paths.push(`<path d="${d}Z" />`);
  }
  return paths.join('');
}

function bust(w, h) {
  const cx = w / 2;
  const s = Math.min(w, h);
  const headR = s * 0.13;
  const headY = h * 0.42;
  const shoulderY = headY + headR * 2.1;
  return `
    <g fill="#302b26" stroke="#4a433b" stroke-width="2">
      <path d="M${cx - s * 0.36},${h} C${cx - s * 0.34},${shoulderY + s * 0.04} ${cx - s * 0.2},${shoulderY - s * 0.02} ${cx - headR * 0.55},${shoulderY - s * 0.05}
               L${cx - headR * 0.5},${headY + headR * 0.8} L${cx + headR * 0.5},${headY + headR * 0.8} L${cx + headR * 0.55},${shoulderY - s * 0.05}
               C${cx + s * 0.2},${shoulderY - s * 0.02} ${cx + s * 0.34},${shoulderY + s * 0.04} ${cx + s * 0.36},${h} Z" />
      <ellipse cx="${cx}" cy="${headY}" rx="${headR * 0.86}" ry="${headR * 1.08}" />
    </g>`;
}

function wireframe(w, h, seed) {
  const rand = rng(seed);
  const lines = [];
  const cols = 18;
  const rows = 22;
  const cx = w / 2;
  const cy = h * 0.55;
  const warp = (x, y) => {
    const dx = (x - cx) / w;
    const dy = (y - cy) / h;
    const f = 1 - Math.min(1, Math.hypot(dx, dy) * 1.6);
    return [x + dx * f * w * 0.25, y + dy * f * h * 0.18];
  };
  for (let c = 0; c <= cols; c++) {
    let d = '';
    for (let r = 0; r <= rows * 3; r++) {
      const [x, y] = warp((w / cols) * c, (h / (rows * 3)) * r);
      d += `${r === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    }
    lines.push(`<path d="${d}" />`);
  }
  for (let r = 0; r <= rows; r++) {
    let d = '';
    for (let c = 0; c <= cols * 3; c++) {
      const [x, y] = warp((w / (cols * 3)) * c, (h / rows) * r + (rand() - 0.5) * 2);
      d += `${c === 0 ? 'M' : 'L'}${x.toFixed(1)},${y.toFixed(1)}`;
    }
    lines.push(`<path d="${d}" />`);
  }
  return `<g fill="none" stroke="#c27a4a" stroke-opacity="0.45" stroke-width="1.4">${lines.join('')}</g>`;
}

function swatches(w, h) {
  const tones = ['#8c5a3c', '#b9875f', '#6d6a63', '#d8cfc1', '#3b3631', '#a25a35', '#c9b69a', '#57524b', '#efe7da'];
  const pad = w * 0.08;
  const size = (w - pad * 4) / 3;
  const top = h * 0.14;
  return tones
    .map((t, i) => {
      const x = pad + (i % 3) * (size + pad);
      const y = top + Math.floor(i / 3) * (size * 0.8 + pad * 0.6);
      return `<rect x="${x}" y="${y}" width="${size}" height="${size * 0.8}" fill="${t}" />`;
    })
    .join('');
}

function svg({ w, h, seed, label, detail, variant = 'render', hue = '#1a1816' }) {
  const fs = Math.round(Math.min(w, h) * 0.034);
  const small = Math.round(fs * 0.62);
  const pad = Math.round(Math.min(w, h) * 0.06);
  let body = '';
  if (variant === 'render' || variant === 'sculpt') body = bust(w, h);
  if (variant === 'sculpt') body = body.replace(/#302b26/, '#5b544b').replace(/#4a433b/, '#7a7166');
  if (variant === 'topology') body = bust(w, h) + wireframe(w, h, seed);
  if (variant === 'texture') body = swatches(w, h);
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="40%" r="75%">
      <stop offset="0%" stop-color="#2a2622"/>
      <stop offset="100%" stop-color="${hue}"/>
    </radialGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#bg)"/>
  <g fill="none" stroke="#c27a4a" stroke-opacity="0.16" stroke-width="1.2">${contourPaths(w, h, seed)}</g>
  ${body}
  <rect x="${pad}" y="${h - pad - fs * 3.4}" width="${fs * 0.22}" height="${fs * 2.9}" fill="#c27a4a"/>
  <text x="${pad + fs * 0.7}" y="${h - pad - fs * 1.75}" font-family="Consolas, 'DejaVu Sans Mono', monospace" font-size="${fs}" font-weight="700" letter-spacing="${fs * 0.18}" fill="#ece6dc">PLACEHOLDER</text>
  <text x="${pad + fs * 0.7}" y="${h - pad - fs * 0.55}" font-family="Consolas, 'DejaVu Sans Mono', monospace" font-size="${small}" letter-spacing="${small * 0.12}" fill="#b3aa9c">${label} · ${detail}</text>
  <text x="${w - pad}" y="${pad + small}" text-anchor="end" font-family="Consolas, 'DejaVu Sans Mono', monospace" font-size="${small}" letter-spacing="${small * 0.12}" fill="#8a8276">REPLACE VIA CMS</text>
</svg>`;
}

const jobs = [
  ['images/placeholder-hero.jpg', { w: 2400, h: 1350, seed: 1, label: 'Hero artwork', detail: '16:9' }],
  ['images/placeholder-portrait.jpg', { w: 1200, h: 1500, seed: 2, label: 'Artist photograph', detail: '4:5' }],
  ['artwork/placeholders/render-portrait-a.jpg', { w: 1600, h: 2000, seed: 3, label: 'Final render', detail: '4:5' }],
  ['artwork/placeholders/render-portrait-b.jpg', { w: 1600, h: 2000, seed: 4, label: 'Final render', detail: '4:5', hue: '#15171a' }],
  ['artwork/placeholders/render-landscape.jpg', { w: 2400, h: 1350, seed: 5, label: 'Final render', detail: '16:9' }],
  ['artwork/placeholders/render-square.jpg', { w: 1800, h: 1800, seed: 6, label: 'Final render', detail: '1:1', hue: '#191512' }],
  ['artwork/placeholders/sculpt.jpg', { w: 1600, h: 2000, seed: 7, label: 'High-poly sculpt', detail: 'ZBrush', variant: 'sculpt' }],
  ['artwork/placeholders/topology.jpg', { w: 1600, h: 2000, seed: 8, label: 'Wireframe / topology', detail: 'Low poly', variant: 'topology' }],
  ['artwork/placeholders/textures.jpg', { w: 2000, h: 2000, seed: 9, label: 'Texture breakdown', detail: 'Maps', variant: 'texture' }],
  ['game-covers/placeholder-cover.jpg', { w: 900, h: 1200, seed: 10, label: 'Game cover', detail: '3:4', variant: 'none' }],
];

for (const [path, opts] of jobs) {
  const dest = out(path);
  await mkdir(dirname(dest), { recursive: true });
  await sharp(Buffer.from(svg(opts))).jpeg({ quality: 82, mozjpeg: true }).toFile(dest);
  console.log('âœ“', path);
}
