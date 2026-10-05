export const stacks = {
  react: 'React',
  vue: 'Vue',
  js: 'JavaScript',
} as const;

export const projectTypes = {
  island: 'Остров',
  app: 'Приложение',
} as const;

/** Куда собирается самостоятельное приложение из apps/<slug>/ */
export const appUrl = (slug: string) => `/apps/${slug}/`;
