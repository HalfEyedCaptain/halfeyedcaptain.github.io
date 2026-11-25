# Design System

A light, gallery-white character-art portfolio. **The artwork is always the hero.** The UI pairs neutral off-white surfaces with one electric-blue accent and pixel display type (Silkscreen). Pill-shaped navigation and buttons, rounded cards and monospaced technical labels complete the look.

> **Source:** the visual direction follows the supplied mockups `introduction_landing_page.html` (home) and `about_me_intro.html` (About). Everything visual is token-driven, so a redesign is mostly a matter of editing **one file**. See [Changing the design](#changing-the-design).

---

## Changing the design

| To change… | Edit | Notes |
| --- | --- | --- |
| **Fonts** | `src/styles/global.css`: the `@import '@fontsource…'` lines, plus `--font-display`, `--font-sans` and `--font-mono` in `@theme` | Install with `npm i @fontsource/<name>` or `@fontsource-variable/<name>`, which self-hosts the font with no Google Fonts request. Remove unused font packages. |
| **Colours** | The semantic `@theme` colour tokens in `global.css` (`--color-surface*`, `--color-fg*`, `--color-primary*`, …) | Components use only these names, so changing a hex value restyles the whole site. |
| **Type scale** | `--text-display-*`, `--text-headline-md`, `--text-title-*`, `--text-body-*`, `--text-label-*` | Display sizes are fluid `clamp()` values. |
| **Radius / spacing / motion** | `--radius-*`, `--spacing-gutter-*`, `--spacing-section*`, `--ease-*` | Used as `rounded-md`, `p-gutter-lg`, `mt-section-lg`, `ease-(--ease-standard)`. |
| **Buttons, chips, prose, labels** | `@layer components` and `@utility` blocks in `global.css` | `.btn*`, `.chip`, `.prose-art`, `.label`, `.display`, `.art-well`, `.placeholder-badge` |
| **Print résumé** | `src/styles/print.css` | Independent of the screen theme, so it always stays black-on-white. |
| **Placeholder image look** | `scripts/generate-placeholders.mjs` → `npm run placeholders` | |
| **Favicon** | `public/favicon.svg` | |
| **Browser UI colour** | `theme-color` in `src/layouts/BaseLayout.astro` | |

Content, schemas and the CMS are completely separate from styling. A redesign never requires content changes.

---

## Principles

1. **Art first.** Artwork sits in rounded, bordered frames. The only overlays on art are legibility scrims and small caption pills.
2. **Calm, technical, playful.** Pixel display type is used for headings only, with Geist for reading and DM Mono for labels.
3. **Restraint.** One accent colour. Motion is used only to carry meaning (reveal, hover feedback, page cross-fade), and all of it is disabled under `prefers-reduced-motion`.
4. **Honesty.** No fake skill percentages and no invented credits. Placeholder content is always visibly badged.

---

## Colour

| Token | Hex | Use |
| --- | --- | --- |
| `surface` | `#faf9f9` | Page background |
| `surface-lowest` | `#ffffff` | Elevated cards, pill nav, outline buttons |
| `surface-low` | `#f4f3f3` | Hover fills |
| `surface-container` | `#eeeeee` | Image wells / loading state |
| `surface-high` | `#e8e8e8` | Well grid lines |
| `line` | `#c5c5da` | Hairlines, dividers, chip borders |
| `line-strong` | `#757589` | Strong borders, dashed empty states |
| `fg` | `#1a1c1c` | Headings, body, dark pills, card frames |
| `fg-muted` | `#444557` | Secondary text |
| `fg-subtle` | `#5d5f5e` | Meta / labels |
| `primary` | `#0012c9` | Links, hover text, focus ring |
| `primary-bright` / `accent` | `#1528ff` | Accent CTAs ("View portfolio", "Inspect"), LinkedIn-style card |
| `on-primary` | `#ffffff` | Text on dark or blue fills |
| `inverse` / `on-inverse` | `#2f3131` / `#f1f1f0` | Dark cards (portrait, specialisation band, caption pills) |
| `scrim` / `on-scrim` | `#1a1c1c` / `#ffffff` | Gradients and text over artwork |

**Contrast (WCAG 2.x, on `surface`):**

| Pairing | Ratio |
| --- | --- |
| `fg` | ≈ 16.6:1 |
| `fg-muted` | ≈ 9.5:1 |
| `fg-subtle` | ≈ 6.2:1 |
| `primary` | ≈ 11:1 |
| White on `primary-bright` | ≈ 7.6:1 |

All pass AA for normal text.

---

## Typography

| Role | Family | Token | Usage |
| --- | --- | --- | --- |
| Display / headline | Silkscreen (pixel) | `--font-display`, `.display` | Names, page and section titles, showcase titles |
| Title / body | Geist Variable | `--font-sans` | Paragraphs, card titles (`text-title-lg font-semibold`) |
| Label | DM Mono, 12–14 px | `--font-mono`, `.label` | Nav tabs, buttons, chips, metadata, eyebrows |

| Class | Size | Use |
| --- | --- | --- |
| `text-display-xl` | 36 → 64 px | 404 / oversized titles |
| `text-display-lg` | 32 → 56 px | Page titles, home intro name |
| `text-display-md` | 28 → 40 px | Section headings, showcase / portrait titles |
| `text-display-sm` | 24 → 32 px | Sub-sections ("Introduction", "Get In Touch") |
| `text-headline-md` | 24 px | Mobile menu |
| `text-title-lg` / `text-title-md` | 20 / 16 px | Card titles |
| `text-body-lg` / `text-body-md` | 16 / 14 px | Body copy |
| `text-label-lg` / `text-label-md` | 14 / 12 px | Mono labels |

---

## Spacing, shape & layout

- **Container:** `.container-page`, max 90 rem, with a fluid gutter `--gutter`.
- **Gutters:** `gutter-xs` 4, `sm` 8, `md` 16, `lg` 24, `xl` 32 px. **Sections:** `section` 48 px and `section-lg` 64 px.
- **Radius:** `sm` 4, default 8, `md` 12 (cards, thumbnails), `lg` 16 px (showcase, portrait); buttons, chips and tabs are full pills.
- **Header:** fixed and solid (`surface/90` with blur and a hairline), `--header-h: 4.5rem`.
- **Home / About intros:** a 12-column grid with a 5 / 7 split.
- **Breakpoints:** Tailwind defaults (`sm` 640, `md` 768, `lg` 1024, `xl` 1280).

---

## Components

| Component | File | Notes |
| --- | --- | --- |
| Navigation | `Header.astro` | Pill-tab nav (active tab = dark pill, `aria-current`), "Download CV" pill, and a mobile disclosure menu that Esc closes |
| Footer | `Footer.astro` | Links, socials, rights notice, "Edit website" |
| Home intro | `Hero.astro` | Selected-work rail (scroll buttons), intro + `#skill` chips, showcase of the top three projects with 01/02/03 `aria-pressed` switches. Without JS, project 01 shows. |
| About intro | `pages/about.astro` | Greyscale portrait card with "Hello, my name is…", Introduction card, and Get In Touch cards built only from links that exist. Both sections have JS-enhanced `aria-expanded` disclosure toggles. |
| Work gallery | `pages/work/index.astro` | Design: `work.html`. Large preview box (category // year pill, software specs, "Inspect breakdown", wireframe toggle when topology images exist) above a 2/3/6-column grid of square tiles. Hover/focus previews, click opens the project. Category filter deep-links via `?category=`. |
| Section heading | `SectionHeading.astro` | Mono index label + display title + optional link |
| Artwork image | `ArtImage.astro` | Optimised WebP + srcset, aspect-ratio reservation, missing-image state |
| Project card | `ProjectCard.astro` | Rounded 4:5 crop, hover zoom, metadata, optional fullscreen button |
| Project gallery | `ProjectGallery.astro` | `stack` or `grid` (masonry breakdowns) |
| Image lightbox | `Lightbox.astro` | Native `<dialog>` on a light backdrop; arrows/Esc/swipe; focus restore |
| Experience timeline | `ExperienceTimeline.astro` | `full` / `compact`, per-role durations |
| Career stats | `CareerStats.astro` | Computed figures; zero values hidden |
| Game credit card | `GameCreditCard.astro` | 3:4 cover, `full` / `compact` |
| Skill group | `SkillGroup.astro` | Bordered tags, no ratings |
| Recognition card | `RecognitionCard.astro` | Type label + date + link |
| Social links | `SocialLinks.astro` | `icons` / `list` variants |
| Contact block | `ContactBlock.astro` | Availability, email/ArtStation CTA, links. No form. |
| Résumé dossier | `pages/resume.astro` | Screen-only three columns: Experience cards / Expertise, Hardskill, Softskill / Education cards (design: `resume.html`). The full document below it, plus `.print-only` sections, drives print and the PDF. |
| Disclosure heading | `DisclosureHeading.astro` | Display heading + round `aria-expanded` toggle; the panel is open without JS |
| Résumé section | `resume/ResumeSection.astro` | Two-column on screen, single column in print |
| 3D model viewer | `ModelViewer.astro` | Click-to-load `<model-viewer>` |
| Video embed | `VideoEmbed.astro` | youtube-nocookie / Vimeo `dnt` |
| Placeholder badge | `PlaceholderBadge.astro` | Yellow pill marking unreplaced content |
| Topology | `Topology.astro` | Decorative SVG mesh, `aria-hidden` |
| Icons | `Icon.astro` | Inline SVG set |

### Buttons

| Class | Look | Use |
| --- | --- | --- |
| `.btn-primary` | Dark pill → blue on hover | Header CTA, solid actions |
| `.btn-accent` | Electric-blue pill | The main call to action in a view |
| `.btn-outline` | White pill, hairline border | Secondary actions |
| `.btn-ghost` | Text only | Tertiary / inline actions |

All buttons use DM Mono at 14 px and have a minimum height of 44 px for touch.

---

## Artwork presentation standards

- **Never crop on project pages.** Natural aspect ratio, `object-fit: contain`.
- **Crop only in grids and intros:** project thumbnails 4:5, game covers 3:4. The home showcase and About portrait use cover crops with scrims.
- **The About portrait** is shown in greyscale, following the mockup. Supply the real artist photograph via the CMS.
- **Image wells** (`.art-well`) show a faint 24 px grid while loading.
- **Alt text** falls back to the project title rather than staying empty.
- **No AI-generated or stock imagery.** The mockups' sample images were not used. Only CMS artwork and labelled placeholders appear.

---

## Motion

| Token | Value | Use |
| --- | --- | --- |
| `--ease-standard` | 120 ms, `cubic-bezier(0.2,0,0,1)` | Hover / state changes |
| `--ease-enter` | 220 ms, `cubic-bezier(0.16,1,0.3,1)` | Lightbox, showcase switch, page enter |
| `--ease-exit` | 150 ms, `cubic-bezier(0.4,0,1,1)` | Page exit |

Section reveal is a 12 px rise plus fade (`[data-reveal]`). Under `prefers-reduced-motion: reduce`, all motion is effectively disabled. Without JavaScript, all content is visible.

---

## Accessibility checklist

- Skip link, landmark regions, one `h1` per page, logical heading order.
- Visible blue focus ring (`:focus-visible`) on all interactive elements.
- Showcase switches use `aria-pressed`; About toggles use `aria-expanded` / `aria-controls`; portfolio filters use `aria-pressed` with an `aria-live` count.
- Gallery triggers are real `<button>`s, and the lightbox is a modal `<dialog>`.
- Decorative SVGs are `aria-hidden`. Icon-only controls have `sr-only` labels.
- Colour contrast meets WCAG AA (see above).
