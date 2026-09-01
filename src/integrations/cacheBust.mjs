import { readFile, writeFile } from 'node:fs/promises';
import { glob } from 'node:fs/promises';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';

const ASSET_PATTERN = /\.(css|js|mjs|png|jpe?g|gif|webp|svg|ico|mp4|webm)(\?|#|$)/i;

function shouldCacheBust(url) {
  if (!url || url.startsWith('data:') || url.startsWith('#') || url.startsWith('mailto:')) {
    return false;
  }
  if (/[?&]=/.test(url)) {
    return false;
  }
  if (/youtube\.com|youtu\.be|youtube-nocookie/i.test(url)) {
    return false;
  }
  return (
    ASSET_PATTERN.test(url) ||
    url.includes('/_astro/') ||
    (url.includes('fonts.googleapis.com') && url.includes('/css')) ||
    url.includes('images.unsplash.com') ||
    url.includes('placehold.co')
  );
}

function cacheBustHtml(html, token) {
  return html.replace(
    /(\s(?:href|src)=["'])([^"']+)(["'])/gi,
    (match, prefix, url, suffix) => {
      if (!shouldCacheBust(url)) return match;
      const separator = url.includes('?') ? '&' : '?';
      return `${prefix}${url}${separator}=${token}${suffix}`;
    }
  );
}

export function createCacheBustToken() {
  return `${Date.now().toString(36)}${Math.random().toString(36).slice(2, 9)}`;
}

export function cacheBustVitePlugin(token) {
  return {
    name: 'cache-bust-html',
    transformIndexHtml: {
      order: 'post',
      handler(html) {
        return cacheBustHtml(html, token);
      },
    },
  };
}

export function cacheBustIntegration(token) {
  return {
    name: 'cache-bust',
    hooks: {
      'astro:build:done': async ({ dir }) => {
        const root = fileURLToPath(dir);
        const files = [];

        for await (const file of glob('**/*.html', { cwd: root })) {
          files.push(file);
        }

        await Promise.all(
          files.map(async (file) => {
            const path = join(root, file);
            const html = await readFile(path, 'utf8');
            const busted = cacheBustHtml(html, token);
            if (busted !== html) {
              await writeFile(path, busted, 'utf8');
            }
          })
        );
      },
    },
  };
}
