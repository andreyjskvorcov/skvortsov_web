import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

// Приложение живёт на сайте по адресу /apps/notes-vue/ — туда и собираем
export default defineConfig({
  base: '/apps/notes-vue/',
  plugins: [vue()],
  build: {
    outDir: '../../public/apps/notes-vue',
    emptyOutDir: true,
  },
});
