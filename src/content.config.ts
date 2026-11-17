import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';
import { sectionIds } from './lib/sections';

const lessons = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/lessons' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    // Список разделов — в src/lib/sections.ts
    section: z.enum(sectionIds),
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

/*
  Книга — описание <slug>.md + PDF:
  - публичная: src/content/books/<slug>.md и public/books/<file>;
  - личная (private: true): books-private/<slug>.md и books-private/<file> — папка вне git, видна только в npm run dev.
  Текст после frontmatter — заметки о книге, показываются под читалкой.
*/
const books = defineCollection({
  loader: glob({
    pattern: ['src/content/books/*.md', 'books-private/*.md'],
    base: '.',
    // id — имя файла без расширения: из него получается адрес /books/<slug>
    generateId: ({ entry }) => entry.split('/').pop()!.replace(/\.md$/, ''),
  }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    description: z.string(),
    // Только латиница, цифры, точка, дефис и подчёркивание — чтобы ссылка на файл не ломалась
    file: z.string().regex(/^[\w.-]+\.pdf$/i, 'Имя PDF: латиница, цифры, . - _ и расширение .pdf'),
    year: z.number().optional(),
    cover: z.string().optional(),
    tags: z.array(z.string()).default([]),
    order: z.number().default(100),
    draft: z.boolean().default(false),
    // true — личная книга: PDF и описание в books-private/, видна только в npm run dev и не попадает на сайт
    private: z.boolean().default(false),
  }),
});

export const collections = { lessons, projects, books };
