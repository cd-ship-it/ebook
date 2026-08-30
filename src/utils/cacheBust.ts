const ASSET_PATTERN = /\.(css|js|mjs|png|jpe?g|gif|webp|svg|ico)(\?|#|$)/i;

function getToken(): string {
  return import.meta.env.PUBLIC_CACHE_BUST ?? 'dev';
}

export function shouldCacheBust(url: string): boolean {
  if (!url || url.startsWith('data:') || url.startsWith('#') || url.startsWith('mailto:')) {
    return false;
  }
  if (/youtube\.com|youtu\.be|youtube-nocookie/i.test(url)) {
    return false;
  }
  return (
    ASSET_PATTERN.test(url) ||
    url.includes('/_astro/') ||
    (url.includes('fonts.googleapis.com') && url.includes('/css')) ||
    url.includes('images.unsplash.com')
  );
}

export function cacheBustUrl(url: string): string {
  if (!shouldCacheBust(url)) return url;

  const token = getToken();
  const separator = url.includes('?') ? '&' : '?';
  return `${url}${separator}=${token}`;
}

export function cacheBustHtml(html: string, token = getToken()): string {
  return html.replace(
    /(\s(?:href|src)=["'])([^"']+)(["'])/gi,
    (match, prefix, url, suffix) => {
      if (!shouldCacheBust(url)) return match;
      const separator = url.includes('?') ? '&' : '?';
      return `${prefix}${url}${separator}=${token}${suffix}`;
    }
  );
}
