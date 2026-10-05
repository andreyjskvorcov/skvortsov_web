/**
 * Если приложение открыто в iframe на сайте, повторяем его тему (data-theme на <html>).
 * Открытое отдельно — берёт системную тему через prefers-color-scheme в style.css.
 */
export function syncThemeWithParent() {
  let root: HTMLElement;
  try {
    if (window.parent === window) return;
    root = window.parent.document.documentElement;
  } catch {
    return; // другой origin — доступа к родителю нет
  }

  const apply = () => {
    if (root.dataset.theme) document.documentElement.dataset.theme = root.dataset.theme;
  };

  apply();
  new MutationObserver(apply).observe(root, { attributes: true, attributeFilter: ['data-theme'] });
}
