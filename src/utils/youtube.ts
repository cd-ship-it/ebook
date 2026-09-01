const YOUTUBE_HOST =
  /^(?:www\.)?(?:youtube\.com|youtube-nocookie\.com|m\.youtube\.com)$/i;

export function extractYouTubeId(url: string): string | null {
  const trimmed = url.trim();
  if (!trimmed) return null;

  try {
    const parsed = new URL(trimmed);
    if (!YOUTUBE_HOST.test(parsed.hostname) && parsed.hostname !== 'youtu.be') {
      return null;
    }

    if (parsed.hostname === 'youtu.be') {
      const id = parsed.pathname.split('/').filter(Boolean)[0];
      return id ? sanitizeId(id) : null;
    }

    const fromQuery = parsed.searchParams.get('v');
    if (fromQuery) return sanitizeId(fromQuery);

    const pathMatch = parsed.pathname.match(/^\/(?:embed|shorts|live)\/([^/?]+)/);
    if (pathMatch) return sanitizeId(pathMatch[1]);
  } catch {
    return null;
  }

  return null;
}

export function isYouTubeUrl(url: string): boolean {
  return extractYouTubeId(url) !== null;
}

function sanitizeId(id: string): string | null {
  const cleaned = id.replace(/[^\w-]/g, '');
  return cleaned.length >= 6 ? cleaned : null;
}

export function renderYouTubeEmbedHtml(videoId: string, title = 'YouTube video'): string {
  const safeTitle = title.replace(/"/g, '&quot;');
  const embedUrl = `https://www.youtube-nocookie.com/embed/${videoId}`;

  return `<div class="video-wrapper content-video"><iframe src="${embedUrl}" title="${safeTitle}" loading="lazy" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen></iframe></div>`;
}
