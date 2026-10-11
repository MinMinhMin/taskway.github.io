import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    locale: z.enum(['en', 'vi']),
    translationKey: z.string(),
    group: z.enum(['get-started', 'concepts', 'guides', 'reliability', 'reference', 'help']),
    order: z.number(),
    sections: z.array(z.object({ id: z.string(), label: z.string() })),
  }),
});

export const collections = { docs };
