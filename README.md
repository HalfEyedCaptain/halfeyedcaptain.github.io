# Parth Dhulia — Portfolio & Résumé

Static portfolio and online résumé for **Parth Dhulia**, Character Artist & ZBrush Digital Sculptor.
Built with Astro, deployed to GitHub Pages and edited by the artist through **Pages CMS**. There is no server, no database and no hosting cost.

- **Artists / editors:** read [ARTIST_GUIDE.md](ARTIST_GUIDE.md).
- **Design & theming:** read [DESIGN_SYSTEM.md](DESIGN_SYSTEM.md).

---

## Contents

1. [Architecture](#architecture)
2. [Requirements & installation](#requirements--installation)
3. [Local development](#local-development)
4. [Content structure](#content-structure)
5. [Images & assets](#images--assets)
6. [Résumé & PDF generation](#résumé--pdf-generation)
7. [Deployment (GitHub Pages)](#deployment-github-pages)
8. [CMS setup (Pages CMS)](#cms-setup-pages-cms)
9. [Custom domains](#custom-domains)
10. [GitHub limits](#github-limits)
11. [Troubleshooting](#troubleshooting)

---

## Architecture

| Concern | Choice | Why |
| --- | --- | --- |
| Framework | **Astro 7** (static output) | Zero-JS by default, content collections, built-in image optimisation |
| Language | **TypeScript** (strict) | Type-safe content and components |
| Styling | **Tailwind CSS 4** via `@tailwindcss/vite` | Design tokens live in one CSS `@theme` block |
| Content | **Astro content collections** + Zod schemas | Every content file is validated at build time |
| CMS | **Pages CMS** (`.pages.yml`) | Git-based, GitHub sign-in, free, no backend |
| Images | `astro:assets` + sharp | Responsive WebP, intrinsic sizes, lazy loading |
| 3D | `@google/model-viewer` | Loaded only when a visitor clicks "Load 3D model" |
| Résumé PDF | `playwright-core` + system Chrome | Same HTML as the online résumé, so there's a single source of truth |
| Hosting | **GitHub Pages** via GitHub Actions | Free; builds on every push to `main` |

```
                Pages CMS (browser)                     Developer (git)
                        │ commits                              │ push
                        ▼                                      ▼
                ┌──────────────────── GitHub repo (main) ────────────────────┐
                │  src/content/**  src/data/*.json  src/assets/**  public/**  │
                └──────────────────────────────┬──────────────────────────────┘
                                               │ triggers
                                               ▼
              GitHub Actions: npm ci → astro check → tests → astro build → résumé PDF
                                               │
                                               ▼
                                  GitHub Pages (static files)
```

### Project layout

```
.
├── .github/workflows/deploy.yml   CI: validate, build, PDF, deploy
├── .pages.yml                     Pages CMS configuration (mirrors the schemas)
├── astro.config.mjs               Site URL / base path, integrations
├── scripts/
│   ├── generate-resume-pdf.mjs    Renders /resume/ to an A4 PDF after build
│   └── generate-placeholders.mjs  Re-creates the labelled placeholder images
├── public/
│   ├── favicon.svg
│   ├── models/                    GLB/glTF files (served as-is)
│   └── files/                     Optional downloadable documents
└── src/
    ├── content.config.ts          Collection schemas (single source of truth)
    ├── content/
    │   ├── projects/*.md          Portfolio projects (front-matter + Markdown body)
    │   ├── categories/*.json      Editable portfolio categories
    │   ├── experience/*.md        Employment history
    │   ├── games/*.md             Shipped game credits
    │   ├── education/*.md
    │   └── recognition/*.md       Awards, certifications, publications, features
    ├── data/
    │   ├── profile.json           Name, title, bio, contact, socials, languages
    │   ├── about.json             About-page content
    │   ├── skills.json            Skill groups (no fake percentages)
    │   ├── home.json              Hero + homepage sections
    │   ├── navigation.json        Menu items
    │   └── settings.json          SEO, résumé PDF, CMS link, placeholder switch
    ├── assets/
    │   ├── artwork/               Artwork uploaded via the CMS (optimised at build)
    │   ├── game-covers/
    │   └── images/                Hero, portrait, social-share images
    ├── components/                Reusable UI (see DESIGN_SYSTEM.md)
    ├── layouts/BaseLayout.astro
    ├── lib/                       Content queries, image resolver, dates, experience maths
    ├── pages/                     Routes
    └── styles/                    global.css (design tokens), print.css (A4 résumé)
```

### Routes

| URL | Source |
| --- | --- |
| `/` | `pages/index.astro` |
| `/portfolio/` | Filterable, sortable gallery with fullscreen preview |
| `/portfolio/<slug>/` | Generated for every visible project |
| `/resume/` | Online résumé + print stylesheet |
| `/<pdfFileName>` | Résumé PDF (generated in CI) |
| `/about/`, `/games/`, `/contact/` | Static pages driven by data files |
| `/admin/` | Link to Pages CMS (no auth on this site) |
| `/sitemap-index.xml`, `/robots.txt` | SEO |

### Key design decisions

- **Visibility rules live in one place:** [src/lib/content.ts](src/lib/content.ts). `draft` content shows only in `npm run dev`, `archived` content never shows, and `placeholder: true` content shows with a yellow "Placeholder" badge. Ticking **Settings → Hide all placeholder content** hides placeholder content everywhere.
- **Career statistics are computed, never typed in.** Years of experience come from the experience entries via an interval merge, so overlapping roles are never double-counted (tested in [src/lib/experience.test.ts](src/lib/experience.test.ts)). Because "today" is the build date, CI rebuilds monthly.
- **Single source of truth for the résumé.** The homepage timeline, the `/resume/` page, the print view and the PDF all read the same collections.
- **No contact form.** GitHub Pages has no backend, so visitors are directed to email and professional networks.

---

## Requirements & installation

- **Node.js ≥ 22.23** (CI uses the version in `.nvmrc`, currently 24)
- npm 10+

```bash
npm install          # first time only
```

> **Do I need Node locally?** Only to preview the site on your own machine. Production builds run entirely in GitHub Actions: they install dependencies from `package-lock.json`, compile Tailwind as part of the Astro build, validate content, generate the PDF and deploy. The artist never needs Node.

---

## Local development

| Task | Command |
| --- | --- |
| Install dependencies | `npm install` |
| Start dev server (hot reload) | `npm run dev` → http://localhost:4321/parthdhulia.github.io/ |
| Validate content + type-check + unit tests | `npm run validate` |
| Type-check only | `npm run check` |
| Unit tests only | `npm test` |
| Production build | `npm run build` → `dist/` |
| Build + résumé PDF | `npm run build:full` |
| Preview the production build | `npm run preview` |
| Regenerate placeholder images | `npm run placeholders` |

The dev server URL includes the base path because the site is configured as a GitHub *project* page. To develop at the root, run:

```bash
BASE_PATH=/ npm run dev                 # macOS / Linux
$env:BASE_PATH='/'; npm run dev         # Windows PowerShell
```

Drafts (`status: draft`) are visible in `npm run dev` with a "Draft" badge, and hidden in production builds.

---

## Content structure

All content schemas are defined in [src/content.config.ts](src/content.config.ts) and mirrored in [.pages.yml](.pages.yml). **If you add a field, add it in both places.**

The schemas are deliberately tolerant of how CMS editors save data:

- empty strings and `null` become "not set";
- `artstation.com/x` becomes `https://artstation.com/x`;
- references stored as paths (`src/content/games/foo.md`) become the bare id (`foo`).

Invalid content, such as a malformed date or a missing title, **fails the build** with the file and field named in the log, so broken content is never deployed.

### Projects (`src/content/projects/*.md`)

Front-matter fields: `title`, `slug`, `status` (published | draft | archived), `featured`, `order`, `placeholder`, `summary`, `category` (→ categories), `classification` (personal | professional), `studio`, `completed`, `tags[]`, `software[]`, `responsibilities[]`, `thumbnail`, `hero`, `renders[]`, `gallery[]`, `sculpts[]`, `topology[]`, `textures[]`, `videos[]`, `model`, `artstation`, `credits[]`, `copyright`, `relatedGame` (→ games). The Markdown body is the detailed description.

Image fields are objects: `{ image: "/src/assets/artwork/x.jpg", url: "", alt: "", caption: "" }`. Set either `image` (a repository file) or `url` (an external host). Sections with no images are not rendered.

### Categories (`src/content/categories/*.json`)

The file name is the id (`stylized-characters.json` → `?category=stylized-characters`). Only categories used by at least one visible project appear as filters.

### Résumé collections

`experience`, `games`, `education` and `recognition` (type: award | certification | publication | feature | exhibition | speaking | other). The résumé groups recognition into *Certifications*, *Awards* and *Publications & recognition*.

---

## Images & assets

- **Artwork** uploaded via the CMS is stored in `src/assets/**`. Astro then generates responsive **WebP** versions (for example 400–1600 px for grid thumbnails and up to 2400 px for the lightbox), with width/height attributes and lazy loading. Grid thumbnails never download the full-resolution original.
- **Originals** are only published for images that appear in project galleries, and they're opened from the lightbox's **"Full resolution"** link.
- **External images:** set `url` instead of `image`. They are displayed as-is (not optimised).
- **Missing images** render a labelled empty frame instead of a broken icon, and the build logs a warning.
- **3D models** live in `public/models/` (served untouched) or on an external host.
- **Placeholders:** `src/assets/artwork/placeholders/` and `src/assets/images/placeholder-*.jpg` are abstract, clearly labelled images. They are **not** artwork by the artist. No artwork has been copied from ArtStation; add real artwork only with the artist's authorisation.

**Why `src/assets` rather than `public/artwork`?** Files in `public/` are copied verbatim and can't be optimised. Keeping artwork in `src/assets` lets Astro resize and compress it, while the CMS still stores simple paths.

---

## Résumé & PDF generation

- `/resume/` is the online résumé. The **Print / Save as PDF** button uses [src/styles/print.css](src/styles/print.css): a single-column A4 layout on a white background, with navigation, artwork and decoration removed, real bullet characters and minimal letter-spacing so applicant-tracking systems can read it.
- In CI, `npm run pdf` serves `dist/`, opens `/resume/` in headless Chrome, and writes `dist/<settings.resume.pdfFileName>`, which is linked from every **Download CV** button.
- The PDF generator uses Playwright's bundled Chromium, Google Chrome or Microsoft Edge, whichever is available. GitHub's `ubuntu-latest` image includes Chrome. If none is found, CI installs Chromium automatically. To install it locally: `npx playwright-core install chromium`.
- To use a hand-made PDF instead, upload it in **Settings → Résumé PDF → Use my own PDF**. Generation is then skipped and the button points to that file.

---

## Deployment (GitHub Pages)

### One-time setup

1. On GitHub, open **Settings → Pages**.
2. Under **Build and deployment → Source**, choose **GitHub Actions**.
3. Push to `main`, or run the workflow manually from **Actions → Build & deploy → Run workflow**.

### What the workflow does ([.github/workflows/deploy.yml](.github/workflows/deploy.yml))

1. `npm ci` (installs from the lockfile)
2. `astro check` (validates content schemas and type-checks)
3. `npm test` (runs the experience-calculation unit tests)
4. `astro build` with `SITE_URL`/`BASE_PATH` from `actions/configure-pages`
5. Generates the résumé PDF
6. Uploads the build and deploys to Pages

Triggers: pushes to `main` (including Pages CMS commits), pull requests (build only), manual dispatch, and a monthly schedule that keeps "years of experience" current.

### Site URL and base path

`actions/configure-pages` reports the real URL, so **no code change is needed** for any of these setups:

| Setup | Example URL | Base path |
| --- | --- | --- |
| Project page (current repo) | `https://halfeyedcaptain.github.io/parthdhulia.github.io/` | `/parthdhulia.github.io` |
| User page (repo named `<user>.github.io`) | `https://<user>.github.io/` | `/` |
| Custom domain | `https://www.example.com/` | `/` |

Local defaults are set in [astro.config.mjs](astro.config.mjs) (`DEFAULT_SITE`, `DEFAULT_BASE`) and can be overridden with the `SITE_URL` / `BASE_PATH` environment variables. All internal links go through `url()` in [src/lib/site.ts](src/lib/site.ts), so they work under any base path.

> **Note on the repo name.** This repository is `HalfEyedCaptain/parthdhulia.github.io`. Because the name doesn't match the owner (`halfeyedcaptain.github.io`), GitHub serves it as a **project page** under `/parthdhulia.github.io/`. To serve it at a domain root instead, either rename the repository to `halfeyedcaptain.github.io` or add a custom domain.

---

## CMS setup (Pages CMS)

**Why Pages CMS:** it is Git-based (content stays in this repo), uses GitHub sign-in, needs no backend, supports collections, repeatable fields, references and image uploads, has a friendly UI, and is free.

**Alternative considered: Decap CMS.** Its GitHub backend needs an OAuth proxy server when the site isn't hosted on Netlify. That means a separate service to deploy, secure and maintain. Pages CMS avoids this.

### Setup

1. The repository owner opens **https://app.pagescms.org** and signs in with GitHub.
2. Install the **Pages CMS GitHub App** when prompted, and grant it access to **this repository only**.
3. Open the repository in Pages CMS. It reads `.pages.yml` automatically.
4. Optional: set the deep link in **Settings → Editor link** (currently `https://app.pagescms.org/HalfEyedCaptain/parthdhulia.github.io/main`). The footer's **Edit website** link points to `/admin/`, which links there.

### Limitations

- Pages CMS is a **third-party hosted service** (open source, MIT licensed, and self-hostable if needed). Editors sign in on pagescms.org, not on this website.
- **The website itself provides no authentication.** `/admin/` is just a link, and no tokens or secrets exist in client code. Only GitHub users with write access to the repo can save changes.
- Every **Save** is a git commit to `main`, which triggers a deploy, usually live in 1–3 minutes. Use `status: draft` to work on something without publishing it.
- Media uploads go through the GitHub API, so keep individual files reasonably small (see below).

---

## Custom domains

1. In **Settings → Pages → Custom domain**, enter the domain (e.g. `www.parthdhulia.com`) and save. GitHub stores it with the Pages configuration. With Actions deployments, no `CNAME` file is required.
2. At the DNS provider:
   - `www` subdomain: add a **CNAME** record → `halfeyedcaptain.github.io`
   - Apex domain: add **A** records → `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153` (and optionally AAAA `2606:50c0:8000::153` … `8003::153`)
3. Tick **Enforce HTTPS** once the certificate is issued.
4. Re-run the workflow. `configure-pages` picks up the new origin, and the base path becomes `/`.

---

## GitHub limits

| Limit | Value | Guidance |
| --- | --- | --- |
| Single file pushed to GitHub | Warning at 50 MB, **blocked at 100 MB** | Export web artwork at 2000–3000 px JPEG/WebP (usually < 2 MB) |
| Repository size | Recommended < 1 GB (strongly < 5 GB) | Don't commit RAW/PSD/ZTL sources; host big originals externally |
| Published Pages site | ≤ 1 GB | Each image produces several optimised variants, so budget for that |
| Pages bandwidth | Soft limit 100 GB / month | Ample for a portfolio |
| Deployment timeout | 10 minutes | Thousands of very large images slow builds; pre-resize them |

**Large 3D models and high-resolution originals:** use the `url` fields to point at external storage (e.g. Sketchfab, Cloudflare R2, Backblaze B2, a GitHub Release asset, or Google Drive direct links) rather than growing the repository.

---

## Troubleshooting

| Symptom | Fix |
| --- | --- |
| **Build fails with a content error** | The log names the file and field (e.g. `experience/foo.md → start: Start date is required`). Fix it in the CMS and save again. |
| **"Image not found" warning / empty frame** | The path in the content file doesn't match a file in `src/assets`. Re-select the image in the CMS. |
| **CSS/links broken on the live site** | Make sure Pages **Source = GitHub Actions** (not "Deploy from a branch") so the base path is injected. |
| **404 on every page except home** | Same as above, or the repository was renamed: re-run the workflow. |
| **Résumé PDF step fails** | The workflow retries after installing Chromium. Locally, run `npx playwright-core install chromium`. |
| **Changes saved in the CMS don't appear** | Check the **Actions** tab. Changes take 1–3 minutes, and drafts never appear in production. |
| **Experience years look stale** | They're calculated at build time; the monthly scheduled build refreshes them, or run the workflow manually. |
| **Category filter missing** | Categories appear only when at least one published project uses them. |
| **Windows: `npm test` finds no tests** | Use Node ≥ 22. The script quotes the glob so Node expands it. |

---

© Parth Dhulia. Artwork is © the artist unless otherwise stated; game titles and related artwork are property of their respective owners.
