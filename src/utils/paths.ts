export function pageHref(page: number): string {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/page${page}.html`.replace(/\/+/g, '/');
}
