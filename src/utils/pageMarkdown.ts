export const PAGE_DETAILS_MARKER = '---details 1---';

export function splitPageMarkdown(body: string, marker = PAGE_DETAILS_MARKER) {
  const markerIndex = body.indexOf(marker);
  if (markerIndex < 0) {
    return { main: body.trim(), details: '' };
  }

  return {
    main: body.slice(0, markerIndex).trim(),
    details: body.slice(markerIndex + marker.length).trim(),
  };
}
