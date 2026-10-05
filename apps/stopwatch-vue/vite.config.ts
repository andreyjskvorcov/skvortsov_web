import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import tailwindcss from '@tailwindcss/vite';

// Приложение живёт на сайте по адресу /apps/stopwatch-vue/ — туда и собираем
export default defineConfig({
  base: '/apps/stopwatch-vue/',
  plugins: [vue(), tailwindcss()],
  build: {
    outDir: '../../public/apps/stopwatch-vue',
    emptyOutDir: true,
  },
});
