import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const pages = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/pages' }),
  schema: z.object({
    order: z.number(),
    title: z.string(),
    subtitle: z.string().optional(),
    layout: z.enum(['cover', 'content', 'fullImage', 'video', 'closing', 'article']),
    backgroundImage: z.string().optional(),
    heroImage: z.string().optional(),
    imageAlt: z.string().optional(),
    youtubeId: z.string().optional(),
    summary: z.string().optional(),
    externalLink: z
      .object({
        label: z.string(),
        url: z.string(),
      })
      .optional(),
    externalLinks: z
      .array(
        z.object({
          label: z.string(),
          url: z.string(),
        })
      )
      .optional(),
  }),
});

export const collections = { pages };
