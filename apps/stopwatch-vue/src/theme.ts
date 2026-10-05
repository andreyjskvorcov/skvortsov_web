/**
 * В iframe на сайте повторяем его тему (data-theme на <html>),
 * открытое отдельно приложение берёт системную тему.
 */
export function syncTheme() {
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
