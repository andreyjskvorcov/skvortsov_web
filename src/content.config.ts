import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/lessons' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    section: z.enum(['js', 'vue', 'react', 'frontend']),
    order: z.number(),
    level: z.enum(['beginner', 'middle', 'advanced']).default('beginner'),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

/*
  Проект — папка src/projects/<slug>/ с index.mdx.
  island: код проекта лежит рядом и монтируется островом прямо в index.mdx.
  app:    самостоятельное приложение из apps/<slug>/, собирается в public/apps/<slug>/ и встраивается iframe.
*/
const projects = defineCollection({
  loader: glob({
    pattern: '*/index.mdx',
    base: './src/projects',
    generateId: ({ entry }) => entry.split('/')[0],
  }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    stack: z.enum(['react', 'vue', 'js']),
    type: z.enum(['island', 'app']),
    order: z.number(),
    tags: z.array(z.string()).default([]),
    repo: z.string().url().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { lessons, projects };
