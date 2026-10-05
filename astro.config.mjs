// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';

import vue from '@astrojs/vue';
import react from '@astrojs/react';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

// https://astro.build/config
export default defineConfig({
  // TODO: заменить на реальный домен
  site: 'https://skvortsov.dev',
  integrations: [
    vue(),
    // JSX/TSX обрабатывает только React: Vue-компоненты пишутся в .vue без JSX
    react(),
    mdx(),
    sitemap(),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
});
