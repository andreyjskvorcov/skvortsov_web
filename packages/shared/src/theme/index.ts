import { readRaw, writeRaw } from '../storage';

export type Theme = 'light' | 'dark';

/**
 * Ключ темы в localStorage. Значение — строка 'light' | 'dark' без JSON
 * (так его читает inline-скрипт в BaseLayout до загрузки любых модулей).
 */
export const THEME_STORAGE_KEY = 'theme';

/** Сохранённая пользователем тема или null, если он её не выбирал */
export function getStoredTheme(): Theme | null {
  const value = readRaw(THEME_STORAGE_KEY);
  return value === 'light' || value === 'dark' ? value : null;
}

/** Текущая тема страницы — по атрибуту data-theme на <html> */
export function getTheme(): Theme {
  return document.documentElement.dataset.theme === 'dark' ? 'dark' : 'light';
}

/** Применить тему к странице и запомнить выбор */
export function setTheme(theme: Theme): void {
  document.documentElement.dataset.theme = theme;
  writeRaw(THEME_STORAGE_KEY, theme);
}

export function toggleTheme(): Theme {
  const next: Theme = getTheme() === 'dark' ? 'light' : 'dark';
  setTheme(next);
  return next;
}

/**
 * Для приложений из apps/: вызвать до монтирования.
 * В iframe на сайте повторяет его тему (data-theme на <html> родителя),
 * открытое отдельно приложение берёт системную тему.
 */
export function syncTheme(): void {
  const html = document.documentElement;

  let root: HTMLElement | undefined;
  try {
    if (window.parent !== window) root = window.parent.document.documentElement;
  } catch {
    // другой origin — доступа к родителю нет
  }

  if (!root) {
    const media = matchMedia('(prefers-color-scheme: dark)');
    const apply = () => (html.dataset.theme = media.matches ? 'dark' : 'light');
    apply();
    media.addEventListener('change', apply);
    return;
  }

  const parent = root;
  const apply = () => {
    if (parent.dataset.theme) html.dataset.theme = parent.dataset.theme;
  };
  apply();
  new MutationObserver(apply).observe(parent, { attributes: true, attributeFilter: ['data-theme'] });
}
