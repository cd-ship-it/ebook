import { readdirSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const IMAGE_EXT = /\.(jpe?g|png|gif|webp|avif)$/i;

/** List public URLs for photos in media/page{N}_photos/. */
export function getPagePhotoUrls(pageNumber: number): string[] {
  const folderName = `page${pageNumber}_photos`;
  const candidates = [
    join(process.cwd(), 'public', 'media', folderName),
    join(process.cwd(), 'media', folderName),
  ];

  const dir = candidates.find((path) => existsSync(path));
  if (!dir) return [];

  return readdirSync(dir)
    .filter((name) => IMAGE_EXT.test(name))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }))
    .map((name) => `/media/${folderName}/${name}`);
}
