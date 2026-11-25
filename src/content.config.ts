/**
 * Content collections — the validated single source of truth for all
 * artist-managed content. Every collection here is editable via Pages CMS
 * (see /.pages.yml). If a file fails validation, the build stops and prints
 * the file name and field that needs fixing.
 */
import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';
import {
  bool,
  imageList,
  imageRef,
  list,
  num,
  optDate,
  optStr,
  optUrl,
  refId,
  refList,
  reqStr,
  status,
  strList,
} from './lib/schema-helpers';

/** Loads a single JSON object file as a one-entry collection with id "main". */
const singleton = (path: string) =>
  file(path, { parser: (text) => ({ main: JSON.parse(text) as Record<string, unknown> }) });

/* ------------------------------------------------------------------ */
/* Collections (one file per entry)                                    */
/* ------------------------------------------------------------------ */

const projects = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/projects' }),
  schema: z.object({
    title: reqStr('Project title'),
    slug: optStr,
    status,
    featured: bool(false),
    order: num(100),
    placeholder: bool(false),
    summary: optStr,
    category: refId,
    classification: z
      .enum(['personal', 'professional'])
      .nullish()
      .transform((v) => v ?? 'personal'),
    studio: optStr,
    completed: optDate,
    tags: strList,
    software: strList,
    responsibilities: strList,
    thumbnail: imageRef,
    hero: imageRef,
    renders: imageList,
    gallery: imageList,
    sculpts: imageList,
    topology: imageList,
    textures: imageList,
    videos: list(z.object({ url: optUrl, title: optStr })).transform((v) =>
      v.filter((x): x is { url: string; title: string | undefined } => Boolean(x.url)),
    ),
    model: z
      .object({
        file: optStr,
        url: optUrl,
        poster: optStr,
        alt: optStr,
        autoRotate: bool(true),
      })
      .nullish()
      .transform((m) => {
        const src = m?.file ?? m?.url;
        return src ? { src, poster: m?.poster, alt: m?.alt ?? '3D model', autoRotate: m?.autoRotate ?? true } : undefined;
      }),
    artstation: optUrl,
    credits: list(z.object({ name: optStr, role: optStr, url: optUrl })).transform((v) =>
      v.filter((c) => Boolean(c.name)),
    ),
    copyright: optStr,
    relatedGame: refId,
  }),
});

const categories = defineCollection({
  loader: glob({ pattern: '*.json', base: './src/content/categories' }),
  schema: z.object({
    label: reqStr('Category name'),
    description: optStr,
    order: num(100),
  }),
});

const experience = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/experience' }),
  schema: z.object({
    role: reqStr('Job title'),
    company: reqStr('Company / studio'),
    companyUrl: optUrl,
    location: optStr,
    employmentType: z
      .enum(['full-time', 'part-time', 'contract', 'freelance', 'internship', 'other'])
      .nullish()
      .transform((v) => v ?? 'full-time'),
    start: optDate.refine((v) => Boolean(v), { message: 'Start date is required' }).transform((v) => v as string),
    end: optDate,
    current: bool(false),
    countTowardsExperience: bool(true),
    summary: optStr,
    responsibilities: strList,
    achievements: strList,
    leadership: strList,
    games: refList,
    status,
    placeholder: bool(false),
  }),
});

const games = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/games' }),
  schema: z.object({
    title: reqStr('Game title'),
    cover: imageRef,
    studio: optStr,
    publisher: optStr,
    year: z
      .union([z.number(), z.string()])
      .nullish()
      .transform((v) => (v === null || v === undefined || v === '' ? undefined : String(v))),
    platforms: strList,
    role: optStr,
    contributions: strList,
    creditNote: optStr,
    website: optUrl,
    relatedProjects: refList,
    featured: bool(true),
    order: num(100),
    status,
    placeholder: bool(false),
  }),
});

const education = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/education' }),
  schema: z.object({
    qualification: reqStr('Qualification'),
    institution: reqStr('Institution'),
    field: optStr,
    location: optStr,
    start: optDate,
    end: optDate,
    description: optStr,
    url: optUrl,
    order: num(100),
    status,
    placeholder: bool(false),
  }),
});

const recognition = defineCollection({
  loader: glob({ pattern: '**/[^_]*.md', base: './src/content/recognition' }),
  schema: z.object({
    title: reqStr('Title'),
    type: z
      .enum(['award', 'certification', 'publication', 'feature', 'exhibition', 'speaking', 'other'])
      .nullish()
      .transform((v) => v ?? 'other'),
    issuer: optStr,
    date: optDate,
    url: optUrl,
    description: optStr,
    image: imageRef,
    featured: bool(true),
    status,
    placeholder: bool(false),
  }),
});

/* ------------------------------------------------------------------ */
/* Singletons (one JSON file each, in src/data)                         */
/* ------------------------------------------------------------------ */

const profile = defineCollection({
  loader: singleton('src/data/profile.json'),
  schema: z.object({
    name: reqStr('Name'),
    title: reqStr('Professional title'),
    tagline: optStr,
    summary: optStr,
    bio: optStr,
    location: optStr,
    email: optStr,
    phone: optStr,
    availability: z
      .object({
        status: z
          .enum(['open', 'limited', 'unavailable', 'hidden'])
          .nullish()
          .transform((v) => v ?? 'hidden'),
        message: optStr,
      })
      .nullish()
      .transform((v) => v ?? { status: 'hidden' as const, message: undefined }),
    employmentPreferences: strList,
    languages: list(z.object({ name: optStr, proficiency: optStr })).transform((v) =>
      v.filter((l): l is { name: string; proficiency: string | undefined } => Boolean(l.name)),
    ),
    socials: list(
      z.object({
        platform: z
          .enum(['artstation', 'linkedin', 'github', 'instagram', 'x', 'youtube', 'vimeo', 'sketchfab', 'behance', 'website', 'other'])
          .nullish()
          .transform((v) => v ?? 'other'),
        label: optStr,
        url: optUrl,
      }),
    ).transform((v) => v.filter((s): s is typeof s & { url: string } => Boolean(s.url))),
  }),
});

const about = defineCollection({
  loader: singleton('src/data/about.json'),
  schema: z.object({
    portrait: imageRef,
    intro: optStr,
    philosophy: optStr,
    specialization: optStr,
    highlights: strList,
    workflow: list(z.object({ title: optStr, description: optStr })).transform((v) =>
      v.filter((s): s is { title: string; description: string | undefined } => Boolean(s.title)),
    ),
    interests: strList,
  }),
});

const skills = defineCollection({
  loader: singleton('src/data/skills.json'),
  schema: z.object({
    groups: list(
      z.object({
        title: optStr,
        kind: z
          .enum(['software', 'technical', 'artistic', 'leadership', 'other'])
          .nullish()
          .transform((v) => v ?? 'other'),
        items: strList,
        placeholder: bool(false),
      }),
    ).transform((v) => v.filter((g): g is typeof g & { title: string } => Boolean(g.title) && g.items.length > 0)),
  }),
});

const home = defineCollection({
  loader: singleton('src/data/home.json'),
  schema: z.object({
    hero: z.object({
      image: imageRef,
      eyebrow: optStr,
      heading: optStr,
      subheading: optStr,
      intro: optStr,
      focus: z
        .enum(['center', 'top', 'bottom', 'left', 'right'])
        .nullish()
        .transform((v) => v ?? 'center'),
    }),
    selectedWork: z
      .object({ title: optStr, intro: optStr, projects: refList, limit: num(6) })
      .nullish()
      .transform((v) => v ?? { title: undefined, intro: undefined, projects: [], limit: 6 }),
    sections: z
      .object({
        selectedWork: bool(true),
        stats: bool(true),
        games: bool(true),
        experience: bool(true),
        recognition: bool(true),
        contact: bool(true),
      })
      .nullish()
      .transform(
        (v) => v ?? { selectedWork: true, stats: true, games: true, experience: true, recognition: true, contact: true },
      ),
    contactHeading: optStr,
    contactText: optStr,
  }),
});

const navigation = defineCollection({
  loader: singleton('src/data/navigation.json'),
  schema: z.object({
    items: list(z.object({ label: optStr, href: optStr, header: bool(true), footer: bool(true) })).transform((v) =>
      v.filter((i): i is typeof i & { label: string; href: string } => Boolean(i.label && i.href)),
    ),
  }),
});

const settings = defineCollection({
  loader: singleton('src/data/settings.json'),
  schema: z.object({
    siteTitle: reqStr('Site title'),
    description: reqStr('Site description'),
    keywords: strList,
    locale: optStr.transform((v) => v ?? 'en'),
    ogImage: imageRef,
    hidePlaceholders: bool(false),
    resume: z
      .object({
        pdfEnabled: bool(true),
        pdfFileName: optStr.transform((v) => (v ?? 'resume.pdf').replace(/[^a-zA-Z0-9._-]/g, '-')),
        customPdf: optStr,
        showPhone: bool(false),
        showEmail: bool(true),
      })
      .nullish()
      .transform(
        (v) => v ?? { pdfEnabled: true, pdfFileName: 'resume.pdf', customPdf: undefined, showPhone: false, showEmail: true },
      ),
    cms: z
      .object({ url: optUrl, showAdminLink: bool(true) })
      .nullish()
      .transform((v) => v ?? { url: undefined, showAdminLink: true }),
    footerNote: optStr,
    rightsNotice: optStr,
  }),
});

export const collections = {
  projects,
  categories,
  experience,
  games,
  education,
  recognition,
  profile,
  about,
  skills,
  home,
  navigation,
  settings,
};
