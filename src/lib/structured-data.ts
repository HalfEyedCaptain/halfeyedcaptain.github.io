/** JSON-LD builders (schema.org Person / CreativeWork / ProfilePage). */
import type { CollectionEntry } from 'astro:content';
import type { Job, Project } from './content';
import { absoluteUrl } from './site';

type Profile = CollectionEntry<'profile'>['data'];

export function personLd(profile: Profile, site: URL | undefined, opts: { jobs?: Job[]; skills?: string[] } = {}) {
  const current = opts.jobs?.find((j) => j.isCurrent && !j.data.placeholder);
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    '@id': `${absoluteUrl('/', site)}#person`,
    name: profile.name,
    jobTitle: profile.title,
    description: profile.tagline ?? profile.summary,
    url: absoluteUrl('/', site),
    ...(profile.email ? { email: `mailto:${profile.email}` } : {}),
    ...(profile.location ? { address: { '@type': 'PostalAddress', addressLocality: profile.location } } : {}),
    sameAs: profile.socials.map((s) => s.url),
    ...(current ? { worksFor: { '@type': 'Organization', name: current.data.company } } : {}),
    ...(opts.skills?.length ? { knowsAbout: opts.skills } : {}),
  };
}

export function creativeWorkLd(project: Project, profile: Profile, site: URL | undefined, imageUrl?: string) {
  const d = project.data;
  return {
    '@context': 'https://schema.org',
    '@type': 'CreativeWork',
    name: d.title,
    headline: d.title,
    description: d.summary,
    url: absoluteUrl(`/work/${project.slug}`, site),
    ...(imageUrl ? { image: imageUrl } : {}),
    ...(d.completed ? { dateCreated: d.completed } : {}),
    genre: project.categoryInfo?.label,
    keywords: [...d.tags, ...d.software].join(', ') || undefined,
    creator: { '@type': 'Person', '@id': `${absoluteUrl('/', site)}#person`, name: profile.name },
    ...(d.copyright ? { copyrightNotice: d.copyright } : {}),
    ...(d.artstation ? { sameAs: d.artstation } : {}),
  };
}
