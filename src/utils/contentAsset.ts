import { cacheBustUrl } from './cacheBust';

/** Resolve a markdown image path (public, relative, or absolute URL). */
export function resolveContentAssetUrl(url: string): string {
  const trimmed = url.trim();
  if (!trimmed) return trimmed;

  if (
    trimmed.startsWith('http://') ||
    trimmed.startsWith('https://') ||
    trimmed.startsWith('data:')
  ) {
    return cacheBustUrl(trimmed);
  }

  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  const withoutLeadingDots = trimmed.replace(/^\.\//, '');
  const normalized = withoutLeadingDots.startsWith('/')
    ? withoutLeadingDots
    : `/${withoutLeadingDots}`;

  return cacheBustUrl(`${base}${normalized}`.replace(/\/+/g, '/'));
}
