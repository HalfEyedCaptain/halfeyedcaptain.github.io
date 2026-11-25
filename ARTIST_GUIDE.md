# Artist Guide — Managing your website

This guide is for you, Parth. You can update everything on the website from your browser, without writing any code.

> **The short version:** go to **https://app.pagescms.org**, sign in with GitHub, edit, click **Save**. A few minutes later the website updates by itself.

---

## Contents

1. [Signing in](#1-signing-in)
2. [How publishing works](#2-how-publishing-works)
3. [Adding a portfolio project](#3-adding-a-portfolio-project)
4. [Uploading artwork](#4-uploading-artwork)
5. [Changing a thumbnail or the homepage artwork](#5-changing-a-thumbnail-or-the-homepage-artwork)
6. [Categories, featured projects and order](#6-categories-featured-projects-and-order)
7. [Videos and 3D models](#7-videos-and-3d-models)
8. [Updating your résumé](#8-updating-your-résumé)
9. [Adding professional experience](#9-adding-professional-experience)
10. [Adding game credits](#10-adding-game-credits)
11. [Profile, contact and social links](#11-profile-contact-and-social-links)
12. [Downloading the latest résumé](#12-downloading-the-latest-résumé)
13. [Preparing artwork for the web](#13-preparing-artwork-for-the-web)
14. [Removing or archiving old work](#14-removing-or-archiving-old-work)
15. [Recovering previous content](#15-recovering-previous-content)
16. [Replacing the placeholder content](#16-replacing-the-placeholder-content)

---

## 1. Signing in

1. Open **https://app.pagescms.org**. You can also click **Edit website** at the bottom of any page on your site.
2. Click **Sign in with GitHub**, and use the GitHub account that owns the website repository.
3. **The first time only:** Pages CMS asks you to install its GitHub App. Choose **Only select repositories** and pick `halfeyedcaptain.github.io`.
4. Click the repository to open the editor. The sections on the left are what you can edit.

Your website doesn't have its own login page. Signing in happens on Pages CMS with your GitHub account, and only people with access to your GitHub repository can make changes.

---

## 2. How publishing works

- Clicking **Save** stores your change and starts an automatic rebuild of the website.
- After **1–3 minutes** the live site updates.
- To check progress, open your repository on GitHub and look at the **Actions** tab. A green tick means it's live; a red cross means something needs fixing (see [Recovering](#15-recovering-previous-content)).

### Drafts

Every project, job and credit has a **Status**:

| Status | On the live website |
| --- | --- |
| **Draft** | Hidden. Use this while you're still working on something. |
| **Published** | Visible. |
| **Archived** | Hidden, but kept so you can bring it back later. |

New portfolio projects start as **Draft**, so nothing goes live until you switch it to **Published**.

---

## 3. Adding a portfolio project

1. Click **Portfolio projects → Add an entry**.
2. Fill in:
   - **Project title**, e.g. *Forest Guardian*
   - **URL slug** (optional), e.g. `forest-guardian`, which becomes `…/portfolio/forest-guardian/`
   - **Short description**: one or two sentences shown on cards
   - **Category**: pick from your list (see [Categories](#6-categories-featured-projects-and-order))
   - **Personal or professional**
   - **Completion date**, **Software used**, **Responsibilities**
3. Add images (see [Uploading artwork](#4-uploading-artwork)):
   - **Thumbnail**: the image shown in the portfolio grid
   - **Hero artwork**: the big image at the top of the project page
   - **Final renders**, **Additional images**, **High-poly sculpt images**, **Wireframe & topology images**, **Texture breakdown images**
4. Write the **Detailed description** (bold, lists and links all work).
5. Optional: **Videos**, **3D model**, **ArtStation project link**, **Credits & collaborators**, **Copyright / attribution**.
6. Set **Status → Published** and click **Save**.

Sections you leave empty are hidden automatically.

---

## 4. Uploading artwork

Each image field has three parts:

- **Image**: click to upload from your computer, or choose an image you uploaded before.
- **Alt text**: a short description of the image, e.g. *"Three-quarter view of the orc warrior, final render"*. This helps visually impaired visitors and search engines. Please always fill it in.
- **Caption** (optional): shown under the image.

**Multiple images:** click **Add an item** under a list such as *Final renders*. **Reorder** them by dragging items up or down. The order on the site matches the order in the editor.

**Very large files:** if an image is huge (over ~20 MB), host it elsewhere and paste its link into **…or external image URL** instead.

---

## 5. Changing a thumbnail or the homepage artwork

- **Project thumbnail:** open the project, then under **Thumbnail (grid image)** pick a new image and **Save**. Grid thumbnails are cropped to a 4:5 portrait shape, so keep the character centred. The full image is always shown uncropped on the project page.
- **Homepage hero:** **Page: Home → Hero → Hero artwork**. Use a wide, cinematic image (at least 2400 px wide). If the character's face gets cut off on some screens, change **Image focus point** (e.g. *top*).
- **Social sharing image** (the preview shown on LinkedIn/X): **Site: Settings & SEO → Social sharing image**.

---

## 6. Categories, featured projects and order

- **Add a category:** **Portfolio categories → Add an entry**, give it a name (e.g. *Fantasy Characters*) and a display order, then **Save**. It appears as a filter on the portfolio page once a published project uses it.
- **Feature a project:** tick **Featured project**. Featured projects appear on the homepage and under the "Featured" filter.
- **Choose exactly which projects appear on the homepage:** **Page: Home → Selected work → Projects to show**. Leave it empty to use your featured projects.
- **Order:** set **Display order** with lower numbers first. Use gaps (10, 20, 30…) so you can slot new work in later.

---

## 7. Videos and 3D models

- **Videos:** paste a normal YouTube or Vimeo link into **Videos → Video URL**, such as `https://www.youtube.com/watch?v=…` or `https://vimeo.com/123456`.
- **3D models:** under **Interactive 3D model**, upload a `.glb` file (recommended) or paste a link to one. Add a **poster image** so visitors see something before they click *Load 3D model*. Keep uploaded models under ~20 MB, and use an external link for bigger ones.

---

## 8. Updating your résumé

Your online résumé, the printable version, the downloadable PDF, the homepage experience section and the "years in industry" figures **all come from the same entries**. Update something once and it changes everywhere.

| To change… | Go to… |
| --- | --- |
| Name, title, professional summary, email, location, languages | **Profile & contact** |
| Jobs | **Résumé: Experience** |
| Shipped games | **Résumé: Game credits** |
| Skills, software, artistic competencies, leadership | **Résumé: Skills & software** |
| Degrees and courses | **Résumé: Education** |
| Awards, certifications, publications, features | **Résumé: Awards, certifications & recognition** |

Skill groups are plain lists, with no percentage bars. Set a group's **Kind** to *Software*, *Technical skills*, *Artistic competencies* or *Leadership*.

---

## 9. Adding professional experience

1. **Résumé: Experience → Add an entry**.
2. Enter **Job title**, **Company / studio**, **Location** and **Employment type**.
3. Enter the **Start date**.
   - **Current job:** tick **I currently work here** and leave **End date** empty.
   - **Past job:** fill in **End date**.
4. Add **Responsibilities**, **Achievements** and **Leadership** items as separate bullet points.
5. Link the **Games shipped in this role**.
6. **Save**.

Total experience is calculated automatically from your dates. **Overlapping jobs are never counted twice**: a freelance contract during a full-time job doesn't inflate your years. To leave a role out of the total (e.g. a short course), untick **Count towards total years of experience**.

---

## 10. Adding game credits

1. **Résumé: Game credits → Add an entry**.
2. Fill in the **Game title**, **Cover artwork**, **Developer**, **Publisher**, **Release year**, **Platforms** and **Your role**.
3. Under **Your contributions**, list only work you actually did *and are allowed to disclose* (check your NDA).
4. Optional: **Official game website** and **Related portfolio projects**.
5. Tick **Show on homepage** if you want it featured.

The site automatically shows a notice that game titles and artwork belong to their respective owners.

---

## 11. Profile, contact and social links

**Profile & contact** holds:

- **Professional email**: shown on the Contact page and résumé. Leave it empty to hide it.
- **Availability**: choose *Open to opportunities*, *Limited*, *Not available* or *Don't show*.
- **Employment preferences**, e.g. *Full-time*, *Remote*, *Open to relocation*.
- **Social & portfolio links**: add, remove or reorder ArtStation, LinkedIn, Instagram, etc.

Visitors contact you by email or through your social profiles. There's no contact form, because the site has no server to receive messages.

---

## 12. Downloading the latest résumé

- On your website, open **Résumé** and click **Download PDF**. The PDF is rebuilt automatically every time you save a change.
- Or click **Print / Save as PDF** and choose *Save as PDF* in your browser.
- To use your own designed PDF instead, go to **Site: Settings & SEO → Résumé PDF → Use my own PDF** and upload it.

---

## 13. Preparing artwork for the web

| Setting | Recommendation |
| --- | --- |
| Format | **JPEG** (quality 85–92) or **WebP**. PNG only for transparency. |
| Size | Long edge **2400–3200 px**. The site creates smaller versions automatically. |
| File size | Ideally **under 5 MB**, and no more than ~20 MB. GitHub refuses files over 100 MB. |
| Colour | **sRGB** (convert from Adobe RGB / ACES before exporting). |
| File names | Lowercase with dashes: `orc-warrior-front.jpg`, not `Final FINAL (2).jpg` |
| Thumbnails | 4:5 portrait crops look best in grids. |
| Breakdowns | Export sculpt, wireframe and texture shots at the same size for a tidy layout. |

Don't upload source files (ZTL, PSD, SPP, EXR). They make the repository huge and aren't needed on the site.

---

## 14. Removing or archiving old work

- **Archive (recommended):** set **Status → Archived** and **Save**. The project disappears from the site but stays in the editor.
- **Delete permanently:** open the entry and click **Delete**. You can still recover it later through GitHub (see below).

---

## 15. Recovering previous content

Every save is recorded in GitHub's history, so nothing is ever truly lost.

1. Open your repository on GitHub, e.g. `github.com/halfeyedcaptain/halfeyedcaptain.github.io`.
2. Click the **commits** count (the clock icon, near the top).
3. Find the change by its date or description, open it, and you'll see exactly what changed.
4. To restore an old version of a file: browse to the file, click **History**, open the version you want, and copy its contents back into the editor. Or ask your developer to *revert* the commit, which takes one click on GitHub.

**If the website stops updating** (red cross in **Actions**): open the failed run and read the red message. It names the file and field, for example *"Start date is required"*. Fix that field in the CMS and save again.

---

## 16. Replacing the placeholder content

The site was delivered with clearly marked **placeholder** content (yellow "PLACEHOLDER" badges and `[Placeholder]` text) so the layout can be reviewed. To finish the site:

1. Replace each placeholder entry with real information, then untick **Placeholder content**. Delete sample entries you don't need.
2. Replace the placeholder images (**Page: Home → Hero**, **Page: About → Artist photograph**, and each project).
3. When everything is done, you can also tick **Site: Settings & SEO → Hide all placeholder content**. That hides anything you missed until you get to it.
