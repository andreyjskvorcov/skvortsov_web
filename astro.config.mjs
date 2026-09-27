// @ts-check
import { defineConfig } from 'astro/config';

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
    // React-компоненты живут только в demos/react, чтобы не конфликтовать с Vue
    react({ include: ['**/react/**'] }),
    mdx(),
    sitemap(),
  ],
});
