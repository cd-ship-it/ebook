export function pageHref(page: number): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  if (page === 1) {
    return base ? `${base}/` : '/';
  }
  return `${base}/page${page}.html`.replace(/\/+/g, '/');
}
