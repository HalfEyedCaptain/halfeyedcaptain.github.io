// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';

/**
 * Site URL and base path.
 *
 * - In GitHub Actions these are provided automatically by `actions/configure-pages`
 *   (see .github/workflows/deploy.yml), so the same code works for:
 *     • a project page   → https://<user>.github.io/<repo>/      (base = /<repo>)
 *     • a user page      → https://<user>.github.io/             (base = /)
 *     • a custom domain  → https://www.example.com/              (base = /)
 * - Locally you can override them with environment variables, e.g.
 *     SITE_URL=https://example.com BASE_PATH=/ npm run build
 */
const DEFAULT_SITE = 'https://halfeyedcaptain.github.io';
const DEFAULT_BASE = '/parthdhulia.github.io';

const site = (process.env.SITE_URL || DEFAULT_SITE).replace(/\/+$/, '');
const rawBase = process.env.BASE_PATH ?? DEFAULT_BASE;
const base = rawBase === '' || rawBase === '/' ? '/' : `/${rawBase.replace(/^\/+|\/+$/g, '')}`;

export default defineConfig({
  site,
  base,
  trailingSlash: 'ignore',
  // Keep classic whitespace handling (Astro 7 defaults to 'jsx', which strips spaces between inline elements).
  compressHTML: true,
  build: {
    format: 'directory',
    assets: '_assets',
  },
  image: {
    // Allow remote artwork from common hosts when the artist chooses external hosting.
    // Remote images are displayed as-is (not optimised) unless listed here.
    domains: [],
    responsiveStyles: false,
  },
  integrations: [
    sitemap({
      filter: (page) => !page.includes('/admin'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    build: {
      // @google/model-viewer (~1 MB) is split into its own chunk and only
      // downloaded when a visitor clicks "Load 3D model".
      chunkSizeWarningLimit: 1500,
    },
  },
  devToolbar: { enabled: false },
});
