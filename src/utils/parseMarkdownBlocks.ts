import { resolveContentAssetUrl } from './contentAsset';
import { extractYouTubeId } from './youtube';

const IMAGE_MARKDOWN = /^!\[([^\]]*)\]\(([^)]+)\)$/;
const LINK_MARKDOWN = /^\[([^\]]*)\]\(([^)]+)\)$/;
const BARE_IMAGE_URL =
  /^(https?:\/\/[^\s]+?\.(?:png|jpe?g|gif|webp|svg|avif)(?:\?[^\s]*)?|\/[^\s]+?\.(?:png|jpe?g|gif|webp|svg|avif)(?:\?[^\s]*)?)$/i;
const BARE_URL = /^https?:\/\/[^\s]+$/i;

export type MarkdownBlock =
  | { type: 'paragraph'; lines: string[] }
  | { type: 'heading'; level: 2 | 3; text: string }
  | { type: 'image'; src: string; alt: string }
  | { type: 'youtube'; videoId: string; title: string };

export function parseMarkdownBlocks(markdown: string): MarkdownBlock[] {
  return markdown
    .trim()
    .split(/\n\n+/)
    .map((block) => parseBlock(block.trim()))
    .filter((block): block is MarkdownBlock => block !== null);
}

function parseBlock(block: string): MarkdownBlock | null {
  if (!block) return null;

  const imageMatch = block.match(IMAGE_MARKDOWN);
  if (imageMatch) {
    return { type: 'image', src: imageMatch[2], alt: imageMatch[1] };
  }

  const linkMatch = block.match(LINK_MARKDOWN);
  if (linkMatch) {
    const videoId = extractYouTubeId(linkMatch[2]);
    if (videoId) {
      return { type: 'youtube', videoId, title: linkMatch[1] || 'YouTube video' };
    }
  }

  if (BARE_IMAGE_URL.test(block)) {
    return { type: 'image', src: block, alt: '' };
  }

  if (BARE_URL.test(block)) {
    const videoId = extractYouTubeId(block);
    if (videoId) {
      return { type: 'youtube', videoId, title: 'YouTube video' };
    }
  }

  if (block.startsWith('# ')) {
    return { type: 'heading', level: 2, text: block.slice(2) };
  }

  if (block.startsWith('## ')) {
    return { type: 'heading', level: 3, text: block.slice(3) };
  }

  return { type: 'paragraph', lines: block.split('\n').map((line) => line.trimEnd()) };
}

export function resolveImageSrc(src: string): string {
  return resolveContentAssetUrl(src);
}
