// @ts-check
import { defineConfig } from 'astro/config';
import {
  cacheBustIntegration,
  cacheBustVitePlugin,
  createCacheBustToken,
} from './src/integrations/cacheBust.mjs';

const CACHE_BUST = createCacheBustToken();

// https://astro.build/config
export default defineConfig({
  site: 'https://cd-ship-it.github.io',
  base: process.env.ASTRO_BASE ?? '/',
  integrations: [cacheBustIntegration(CACHE_BUST)],
  build: {
    format: 'file',
  },
  vite: {
    define: {
      'import.meta.env.PUBLIC_CACHE_BUST': JSON.stringify(CACHE_BUST),
    },
    plugins: [cacheBustVitePlugin(CACHE_BUST)],
  },
});
