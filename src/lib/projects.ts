export const stacks = {
  react: 'React',
  vue: 'Vue',
  js: 'JavaScript',
} as const;

export const projectTypes = {
  island: 'Остров',
  app: 'Приложение',
} as const;

/**
 * Куда собирается самостоятельное приложение из apps/<slug>/.
 * index.html указан явно: dev-сервер Astro не раскрывает папки из public/ в index.html.
 */
export const appUrl = (slug: string) => `/apps/${slug}/index.html`;
