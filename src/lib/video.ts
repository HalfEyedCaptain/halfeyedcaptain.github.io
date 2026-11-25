/** Converts YouTube / Vimeo page URLs into privacy-friendly embed URLs. */
export interface VideoEmbed {
  provider: 'youtube' | 'vimeo';
  id: string;
  embedUrl: string;
  watchUrl: string;
}

export function parseVideoUrl(raw: string): VideoEmbed | undefined {
  let u: URL;
  try {
    u = new URL(raw);
  } catch {
    return undefined;
  }
  const host = u.hostname.replace(/^www\.|^m\./, '');

  if (host === 'youtu.be' || host.endsWith('youtube.com') || host.endsWith('youtube-nocookie.com')) {
    let id: string | null | undefined;
    if (host === 'youtu.be') id = u.pathname.slice(1).split('/')[0];
    else if (u.pathname === '/watch') id = u.searchParams.get('v');
    else id = /^\/(?:embed|shorts|live|v)\/([^/?#]+)/.exec(u.pathname)?.[1];
    if (id && /^[\w-]{6,}$/.test(id)) {
      return {
        provider: 'youtube',
        id,
        embedUrl: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`,
        watchUrl: `https://www.youtube.com/watch?v=${id}`,
      };
    }
  }

  if (host.endsWith('vimeo.com')) {
    const id = /\/(\d{5,})(?:\/|$)/.exec(u.pathname)?.[1];
    if (id) {
      return {
        provider: 'vimeo',
        id,
        embedUrl: `https://player.vimeo.com/video/${id}?dnt=1&title=0&byline=0&portrait=0`,
        watchUrl: `https://vimeo.com/${id}`,
      };
    }
  }
  return undefined;
}
