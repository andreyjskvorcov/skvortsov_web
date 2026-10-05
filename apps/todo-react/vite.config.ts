import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// Приложение живёт на сайте по адресу /apps/todo-react/ — туда и собираем
export default defineConfig({
  base: '/apps/todo-react/',
  plugins: [react(), tailwindcss()],
  resolve: {
    // @ → src сайта: берём shadcn-компоненты из его UI-kit
    alias: { '@': fileURLToPath(new URL('../../src', import.meta.url)) },
  },
  build: {
    outDir: '../../public/apps/todo-react',
    emptyOutDir: true,
  },
});
