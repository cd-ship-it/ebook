export const PAGE_PHOTO_COLLAGE_MARKER = '---photo_collage---';
export const PAGE_DETAILS_START = '---details---';
export const PAGE_DETAILS_END = '---/details---';

export type PageSegment =
  | { type: 'content'; markdown: string }
  | { type: 'details'; markdown: string; index: number };

/**
 * Parse page body into alternating content and details segments:
 *   [content] ---details--- [details] ---/details--- [content] ---details--- ...
 */
export function parsePageSegments(body: string): PageSegment[] {
  const segments: PageSegment[] = [];
  let cursor = 0;
  let detailsIndex = 0;

  while (cursor < body.length) {
    const startIndex = body.indexOf(PAGE_DETAILS_START, cursor);

    if (startIndex < 0) {
      const remaining = body.slice(cursor).trim();
      if (remaining) segments.push({ type: 'content', markdown: remaining });
      break;
    }

    const before = body.slice(cursor, startIndex).trim();
    if (before) segments.push({ type: 'content', markdown: before });

    const afterStart = startIndex + PAGE_DETAILS_START.length;
    const endIndex = body.indexOf(PAGE_DETAILS_END, afterStart);

    if (endIndex < 0) {
      const detailsContent = body.slice(afterStart).trim();
      if (detailsContent) {
        segments.push({ type: 'details', markdown: detailsContent, index: detailsIndex++ });
      }
      break;
    }

    const detailsContent = body.slice(afterStart, endIndex).trim();
    if (detailsContent) {
      segments.push({ type: 'details', markdown: detailsContent, index: detailsIndex++ });
    }

    cursor = endIndex + PAGE_DETAILS_END.length;
  }

  return segments;
}
