/**
 * Renders the built résumé page (dist/resume/index.html) to an A4 PDF using a
 * headless Chromium browser. Runs after `astro build`, both in CI and locally.
 *
 *   npm run build && npm run pdf
 *
 * The output file name comes from src/data/settings.json → resume.pdfFileName.
 * Nothing is generated when resume.pdfEnabled is false or a custom PDF is set.
 *
 * Browser lookup order: Playwright's bundled Chromium → Google Chrome →
 * Microsoft Edge. GitHub's ubuntu-latest runners ship with Chrome, so no extra
 * download is normally needed. Locally, Chrome or Edge is used if installed;
 * otherwise run `npx playwright-core install chromium` once.
 */
import { createReadStream, existsSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, join, normalize, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { chromium } from 'playwright-core';

const root = join(dirname(fileURLToPath(import.meta.url)), '..');
const dist = join(root, 'dist');
const settings = JSON.parse(await readFile(join(root, 'src/data/settings.json'), 'utf8'));
const resume = settings.resume ?? {};

if (resume.pdfEnabled === false) {
  console.log('[pdf] Résumé PDF generation disabled in settings — skipping.');
  process.exit(0);
}
if (resume.customPdf) {
  console.log('[pdf] A custom résumé PDF is configured — skipping generation.');
  process.exit(0);
}

const fileName = String(resume.pdfFileName || 'resume.pdf').replace(/[^a-zA-Z0-9._-]/g, '-');
const rawBase = process.env.BASE_PATH ?? '/parthdhulia.github.io';
const base = rawBase === '' || rawBase === '/' ? '' : `/${rawBase.replace(/^\/+|\/+$/g, '')}`;

if (!existsSync(join(dist, 'resume', 'index.html'))) {
  console.error('[pdf] dist/resume/index.html not found. Run `npm run build` first.');
  process.exit(1);
}

/* ---------- Minimal static server that mirrors GitHub Pages paths ---------- */
const TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css',
  '.js': 'text/javascript',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.json': 'application/json',
  '.xml': 'application/xml',
};

const server = createServer((req, res) => {
  let p = decodeURIComponent(new URL(req.url ?? '/', 'http://x').pathname);
  if (base && p.startsWith(base)) p = p.slice(base.length) || '/';
  let file = normalize(join(dist, p));
  if (!file.startsWith(dist)) {
    res.writeHead(403).end();
    return;
  }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, 'index.html');
  if (!existsSync(file)) {
    res.writeHead(404).end();
    return;
  }
  res.writeHead(200, { 'Content-Type': TYPES[extname(file)] ?? 'application/octet-stream' });
  createReadStream(file).pipe(res);
});
await new Promise((r) => server.listen(0, '127.0.0.1', r));
const { port } = /** @type {import('node:net').AddressInfo} */ (server.address());

/* ---------------------------- Launch a browser ---------------------------- */
async function launch() {
  const attempts = [{}, { channel: 'chrome' }, { channel: 'msedge' }];
  for (const opts of attempts) {
    try {
      return await chromium.launch({ ...opts, headless: true });
    } catch {
      /* try next */
    }
  }
  throw new Error('No Chromium-based browser found. Run `npx playwright-core install chromium` and try again.');
}

let browser;
try {
  browser = await launch();
  const page = await browser.newPage();
  const target = `http://127.0.0.1:${port}${base}/resume/`;
  await page.goto(target, { waitUntil: 'networkidle' });
  await page.emulateMedia({ media: 'print' });
  await page.evaluate(() => document.fonts.ready);
  const out = join(dist, fileName);
  await page.pdf({
    path: out,
    format: 'A4',
    printBackground: true,
    preferCSSPageSize: true,
    displayHeaderFooter: true,
    headerTemplate: '<span></span>',
    footerTemplate:
      '<div style="width:100%;font-size:7px;color:#8a8276;padding:0 16mm;display:flex;justify-content:flex-end;font-family:sans-serif"><span class="pageNumber"></span>&nbsp;/&nbsp;<span class="totalPages"></span></div>',
  });
  console.log(`[pdf] ✓ Résumé PDF written to dist/${fileName}`);
} finally {
  await browser?.close();
  server.close();
}
