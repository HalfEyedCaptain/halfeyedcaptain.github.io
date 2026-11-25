/**
 * Content query layer. Pages and components fetch data only through these
 * helpers, so visibility rules (drafts, archived items, placeholders) and
 * sort orders are defined in exactly one place.
 */
import { getCollection, getEntry, type CollectionEntry } from 'astro:content';
import { dateSortKey } from './dates';
import { totalExperienceMonths, wholeYears } from './experience';
import { slugify } from './site';

const isDev = import.meta.env.DEV;

/* ------------------------------ Singletons ------------------------------ */

async function single<C extends 'profile' | 'about' | 'skills' | 'home' | 'navigation' | 'settings'>(collection: C) {
  const entry = await getEntry(collection, 'main');
  if (!entry) throw new Error(`Missing data file for "${collection}" (src/data/${collection}.json).`);
  return entry.data as CollectionEntry<C>['data'];
}

export const getProfile = () => single('profile');
export const getAbout = () => single('about');
export const getSkills = () => single('skills');
export const getHome = () => single('home');
export const getNavigation = () => single('navigation');
export const getSettings = () => single('settings');

/* ------------------------------ Visibility ------------------------------ */

interface Visible {
  status: 'published' | 'draft' | 'archived';
  placeholder?: boolean;
}

/** Drafts are visible only in local development; archived items never. */
async function isVisible(data: Visible): Promise<boolean> {
  if (data.status === 'archived') return false;
  if (data.status === 'draft' && !isDev) return false;
  if (data.placeholder && (await getSettings()).hidePlaceholders) return false;
  return true;
}

async function visibleEntries<C extends 'projects' | 'experience' | 'games' | 'education' | 'recognition'>(collection: C) {
  const all = (await getCollection(collection)) as CollectionEntry<C>[];
  const checks = await Promise.all(all.map((e) => isVisible(e.data as Visible)));
  return all.filter((_, i) => checks[i]);
}

/* ------------------------------ Categories ------------------------------ */

export type Category = { id: string; label: string; description: string | undefined; order: number };

export async function getCategories(): Promise<Category[]> {
  const all = await getCollection('categories');
  return all
    .map((c) => ({ id: c.id, ...c.data }))
    .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label));
}

/* ------------------------------- Projects ------------------------------- */

export type Project = CollectionEntry<'projects'> & {
  slug: string;
  categoryInfo: Category | undefined;
};

export async function getProjects(): Promise<Project[]> {
  const [entries, categories] = await Promise.all([visibleEntries('projects'), getCategories()]);
  const catMap = new Map(categories.map((c) => [c.id, c]));
  const seen = new Set<string>();
  return entries
    .map((e) => {
      let slug = e.data.slug ? slugify(e.data.slug) : e.id;
      if (seen.has(slug)) slug = `${slug}-${e.id}`;
      seen.add(slug);
      return { ...e, slug, categoryInfo: e.data.category ? catMap.get(e.data.category) : undefined };
    })
    .sort(
      (a, b) =>
        a.data.order - b.data.order ||
        dateSortKey(b.data.completed) - dateSortKey(a.data.completed) ||
        a.data.title.localeCompare(b.data.title),
    );
}

/** Projects chosen for the homepage, falling back to featured projects. */
export async function getSelectedProjects(): Promise<Project[]> {
  const [projects, home] = await Promise.all([getProjects(), getHome()]);
  const { projects: chosen, limit } = home.selectedWork;
  if (chosen.length) {
    const byId = new Map(projects.map((p) => [p.id, p]));
    const bySlug = new Map(projects.map((p) => [p.slug, p]));
    return chosen
      .map((id) => byId.get(id) ?? bySlug.get(id))
      .filter((p): p is Project => Boolean(p))
      .slice(0, limit);
  }
  const featured = projects.filter((p) => p.data.featured);
  return (featured.length ? featured : projects).slice(0, limit);
}

/** Only categories that are actually used by visible projects. */
export async function getUsedCategories(projects?: Project[]): Promise<Category[]> {
  const list = projects ?? (await getProjects());
  const used = new Set(list.map((p) => p.data.category).filter(Boolean));
  return (await getCategories()).filter((c) => used.has(c.id));
}

/* ------------------------------ Experience ------------------------------ */

export type Job = CollectionEntry<'experience'> & { isCurrent: boolean };

export async function getExperience(): Promise<Job[]> {
  const entries = await visibleEntries('experience');
  return entries
    .map((e) => ({ ...e, isCurrent: e.data.current || !e.data.end }))
    .sort(
      (a, b) =>
        Number(b.isCurrent) - Number(a.isCurrent) ||
        dateSortKey(b.data.end ?? '9999') - dateSortKey(a.data.end ?? '9999') ||
        dateSortKey(b.data.start) - dateSortKey(a.data.start),
    );
}

/* -------------------------------- Games -------------------------------- */

export type Game = CollectionEntry<'games'>;

export async function getGames(): Promise<Game[]> {
  const entries = await visibleEntries('games');
  return entries.sort(
    (a, b) =>
      a.data.order - b.data.order ||
      Number(b.data.year ?? 0) - Number(a.data.year ?? 0) ||
      a.data.title.localeCompare(b.data.title),
  );
}

/* ------------------------- Education & recognition ------------------------ */

export async function getEducation() {
  const entries = await visibleEntries('education');
  return entries.sort(
    (a, b) =>
      a.data.order - b.data.order ||
      dateSortKey(b.data.end ?? b.data.start) - dateSortKey(a.data.end ?? a.data.start),
  );
}

export type Recognition = CollectionEntry<'recognition'>;

export async function getRecognition(): Promise<Recognition[]> {
  const entries = await visibleEntries('recognition');
  return entries.sort((a, b) => dateSortKey(b.data.date) - dateSortKey(a.data.date));
}

export const RECOGNITION_LABELS: Record<Recognition['data']['type'], string> = {
  award: 'Award',
  certification: 'Certification',
  publication: 'Publication',
  feature: 'Feature',
  exhibition: 'Exhibition',
  speaking: 'Talk',
  other: 'Recognition',
};

/* ------------------------------ Résumé links ------------------------------ */

/**
 * Where the "Download CV" button points:
 * 1. A manually uploaded PDF (settings → résumé → custom PDF), if provided;
 * 2. otherwise the PDF generated from the résumé page during CI;
 * 3. otherwise undefined (buttons fall back to the printable résumé page).
 */
export async function getResumePdfPath(): Promise<string | undefined> {
  const { resume } = await getSettings();
  if (resume.customPdf) return resume.customPdf.replace(/^\/?public\//, '/');
  if (resume.pdfEnabled) return `/${resume.pdfFileName}`;
  return undefined;
}

/* ---------------------------- Career statistics --------------------------- */

export interface CareerStats {
  months: number;
  years: number;
  shippedTitles: number;
  projects: number;
  studios: number;
  /** True when any figure is derived from placeholder content (shown with a badge). */
  fromPlaceholders: boolean;
}

/**
 * Derived entirely from the experience / games / projects collections, so
 * updating any of them in the CMS updates every statistic on the site.
 */
export async function getCareerStats(): Promise<CareerStats> {
  const [jobs, games, projects] = await Promise.all([getExperience(), getGames(), getProjects()]);
  const counted = jobs.filter((j) => j.data.countTowardsExperience);
  const months = totalExperienceMonths(
    counted.map((j) => ({ start: j.data.start, end: j.data.end, current: j.data.current })),
  );
  return {
    months,
    years: wholeYears(months),
    shippedTitles: games.length,
    projects: projects.length,
    studios: new Set(counted.map((j) => j.data.company.toLowerCase())).size,
    fromPlaceholders: [...counted, ...games, ...projects].some((e) => e.data.placeholder),
  };
}
