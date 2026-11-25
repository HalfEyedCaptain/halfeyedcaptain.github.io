# Design System

A premium, editorial character-art portfolio. **The artwork is always the hero.** The UI is graphite, warm off-white and a restrained copper accent, with technical "sculpting-software" labels and subtle topology motifs.

> **Status:** the current visual direction is a first pass and is expected to change (including fonts). Everything visual is token-driven, so a redesign is mostly a matter of editing **one file**. See [Changing the design](#changing-the-design).

---

## Changing the design

| To change… | Edit | Notes |
| --- | --- | --- |
| **Fonts** | `src/styles/global.css`: the three `@import '@fontsource-variable/…'` lines plus `--font-display`, `--font-sans` and `--font-mono` in `@theme` | Install the new font with `npm i @fontsource-variable/<name>` (self-hosted, no Google Fonts request). Update `package.json` and remove unused font packages. |
| **Colours** | `@theme` colour tokens in `global.css` (`--color-ink-*`, `--color-bone-*`, `--color-copper-*`) | Components only use these tokens, so renaming a scale means a find-and-replace on class names (e.g. `text-copper-400`). |
| **Type scale** | `--text-display-*` tokens | Fluid `clamp()` sizes, used through `text-display-xl/lg/md/sm`. |
| **Buttons, prose, labels** | `@layer components` and `@utility` blocks in `global.css` | `.btn*`, `.prose-art`, `.label`, `.display`, `.art-well`, `.placeholder-badge` |
| **Print résumé** | `src/styles/print.css` | Independent of the screen theme, so it always stays black-on-white. |
| **Placeholder image look** | `scripts/generate-placeholders.mjs` → `npm run placeholders` | |
| **Favicon** | `public/favicon.svg` | |
| **Browser UI colour** | `theme-color` in `src/layouts/BaseLayout.astro` | |

Content, schemas and the CMS are completely separate from styling. A redesign never requires content changes.

---

## Principles

1. **Art first.** No decoration ever sits on top of artwork, apart from functional legibility scrims behind hero text.
2. **Editorial, not SaaS.** Rectangular forms with no rounded "cards", generous whitespace, strong typographic hierarchy.
3. **Restraint.** One accent colour. Motion only for meaning (reveal, hover feedback, page cross-fade), and all of it is disabled under `prefers-reduced-motion`.
4. **Honesty.** No fake skill percentages, no invented credits. Placeholder content is always visibly badged.

---

## Colour

| Token | Hex | Use |
| --- | --- | --- |
| `ink-950` | `#0b0a09` | Page background |
| `ink-900` | `#121110` | Raised panels (contact block, specialisation band) |
| `ink-850` | `#191715` | Image wells / loading state |
| `ink-800` | `#211f1c` | Well grid lines, hover surface |
| `ink-700` | `#2e2b27` | Hairlines and dividers |
| `ink-600` | `#45403a` | Strong borders, dashed empty states |
| `bone-50` | `#f6f1e8` | Headings |
| `bone-100` | `#ece6dc` | Body text (primary) |
| `bone-300` | `#c9c0b2` | Secondary text |
| `bone-500` | `#9c9387` | Meta / labels |
| `copper-300` | `#e2a77c` | Hover on accent text, italic name in hero |
| `copper-400` | `#d48c5d` | Primary button, links, active states |
| `copper-500` | `#c27a4a` | Decorative rules, topology lines, focus |
| `copper-700` | `#7d4526` | Accent on white (print résumé) |

**Contrast (computed, WCAG 2.x):** on `ink-950`, bone-100 15.9:1, bone-300 11.0:1, bone-500 6.5:1 and copper-400 7.3:1. The primary button (ink-950 on copper-400) is 7.3:1. In print, copper-700 on white is 7.6:1. All pass AA for normal text, and most pass AAA.

---

## Typography

| Role | Family (current) | Token | Usage |
| --- | --- | --- | --- |
| Display | Fraunces Variable (serif, weight ≈ 350) | `--font-display`, `.display` | Names, page and section titles, project titles |
| Body | Inter Variable | `--font-sans` | Paragraphs, UI text |
| Technical label | JetBrains Mono Variable, 11 px, uppercase, 0.16 em tracking | `--font-mono`, `.label` | Section indices ("01 — Portfolio"), metadata, buttons |

Fluid display sizes (360 px → 1440 px):

| Class | Range | Use |
| --- | --- | --- |
| `text-display-xl` | 48 → 120 px | Homepage hero name, 404 |
| `text-display-lg` | 38 → 80 px | Page titles, stats numbers |
| `text-display-md` | 30 → 52 px | Section headings |
| `text-display-sm` | 22 → 32 px | Sub-section headings |

Body is 16 px / 1.65, and long-form prose 17 px / 1.75 with a 42 rem measure (`.prose-art`). Headings use `text-wrap: balance` and paragraphs `text-wrap: pretty`.

---

## Spacing & layout

- **Container:** `.container-page`, max 92 rem (1472 px), with a fluid gutter `--gutter: clamp(1rem, …, 3rem)`.
- **Vertical rhythm between homepage sections:** `mt-28` (mobile) → `mt-40` (desktop).
- **Grids:** project grids are 1 → 2 → 3 columns with 24 px gutters and 56 px row gaps; breakdown galleries use two-column masonry (`columns-2`).
- **Header height:** `--header-h: 4.5rem`. It is fixed, transparent over the hero, and becomes a blurred solid bar on scroll.
- **Breakpoints:** Tailwind defaults (`sm` 640, `md` 768, `lg` 1024, `xl` 1280).

---

## Components

| Component | File | Notes |
| --- | --- | --- |
| Navigation | `Header.astro` | Desktop links with `aria-current`, mobile disclosure menu (Esc closes) |
| Footer | `Footer.astro` | Links, socials, rights notice, "Edit website" |
| Hero | `Hero.astro` | Full-bleed art, focus-point control, three CTAs |
| Section heading | `SectionHeading.astro` | Mono index label + display title + optional link |
| Artwork image | `ArtImage.astro` | Optimised WebP + srcset, aspect-ratio reservation, missing-image state, `maxHeight` for tall portraits |
| Project card | `ProjectCard.astro` | 4:5 crop, hover zoom 1.03, metadata, optional fullscreen button |
| Project gallery | `ProjectGallery.astro` | `stack` (full-width renders capped to the viewport) or `grid` (masonry breakdowns) |
| Image lightbox | `Lightbox.astro` | Native `<dialog>`; arrows/Esc/swipe; "Full resolution" link; focus restore |
| Experience timeline | `ExperienceTimeline.astro` | `full` / `compact`, per-role durations |
| Career stats | `CareerStats.astro` | Computed figures; zero values hidden |
| Game credit card | `GameCreditCard.astro` | 3:4 cover, `full` / `compact` |
| Skill group | `SkillGroup.astro` | Bordered tags, no ratings |
| Recognition card | `RecognitionCard.astro` | Type label + date + link |
| Social links | `SocialLinks.astro` | `icons` / `list` variants |
| Contact block | `ContactBlock.astro` | Availability, email/ArtStation CTA, links. No form. |
| Résumé section | `resume/ResumeSection.astro` | Two-column on screen, single column in print |
| 3D model viewer | `ModelViewer.astro` | Click-to-load `<model-viewer>` |
| Video embed | `VideoEmbed.astro` | youtube-nocookie / Vimeo `dnt` |
| SEO | `SEO.astro` | Title, canonical, OG/Twitter, JSON-LD |
| Empty state | `EmptyState.astro` | Dashed frame + topology |
| Placeholder badge | `PlaceholderBadge.astro` | Yellow marker for unreplaced content |
| Topology | `Topology.astro` | Build-time SVG warped quad mesh. Decorative, `aria-hidden`. |
| Icons | `Icon.astro` | Inline SVG set |

### Buttons

| Class | Look | Use |
| --- | --- | --- |
| `.btn-primary` | Copper fill, dark text | One per view: the main action |
| `.btn-outline` | 1 px bone border | Secondary actions |
| `.btn-ghost` | Text only | Tertiary / inline actions |

All buttons are rectangular, use mono uppercase 12 px text, and have a minimum height of 46 px for touch.

---

## Artwork presentation standards

- **Never crop on project pages.** Natural aspect ratio, `object-fit: contain`, with height capped to the viewport for portrait renders.
- **Crop only in grids:** project thumbnails 4:5, game covers 3:4. The artist chooses a dedicated thumbnail when a crop doesn't work.
- **Sections appear in production order:** final renders → additional images → high-poly sculpt → wireframe & topology → texture breakdown → video → interactive 3D.
- **Image wells** (`.art-well`) show a faint 32 px grid while loading, which reads as a viewport rather than a grey box.
- **Fullscreen:** every gallery image opens in the lightbox. The original file is available via "Full resolution".
- **Alt text is required in practice:** components fall back to "<Project> — <Section> n" rather than leaving it empty.
- **Attribution:** project `copyright` and `credits` are shown, and game IP notices appear on credit pages.

---

## Motion

| Element | Motion |
| --- | --- |
| Page navigation | Cross-document View Transition, 260 ms cross-fade (CSS only) |
| Section reveal | 18 px rise + fade, 700 ms, once (`[data-reveal]`) |
| Card hover | Image scale 1.03 over 700 ms; arrow nudge |
| Lightbox | 220 ms fade-in |

Under `prefers-reduced-motion: reduce`, all transitions and animations are effectively disabled and reveal content is shown immediately. Without JavaScript, all content is visible.

---

## Accessibility checklist

- Skip link, landmark regions, one `h1` per page, logical heading order.
- Visible copper focus ring (`:focus-visible`) on all interactive elements.
- Gallery triggers are real `<button>`s. The lightbox is a modal `<dialog>` with labelled controls and keyboard navigation.
- Filters use `aria-pressed`, and the result count is announced via `aria-live`.
- Decorative SVGs are `aria-hidden`. Icon-only links have `sr-only` labels.
- Colour contrast meets WCAG AA (see the table above).
