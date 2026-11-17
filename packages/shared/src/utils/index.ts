/**
 * Чистые функции без DOM и фреймворков.
 * Сюда — только то, что нужно в двух местах и больше; остальное — в src/lib сайта или приложения.
 */

/**
 * Русское склонение по числу.
 * plural(1, ['урок', 'урока', 'уроков']) → 'урок'; 3 → 'урока'; 11 → 'уроков'; 21 → 'урок'
 */
export function plural(n: number, [one, few, many]: readonly [string, string, string]): string {
  const abs = Math.abs(n) % 100;
  const last = abs % 10;
  if (abs > 10 && abs < 20) return many;
  if (last === 1) return one;
  if (last >= 2 && last <= 4) return few;
  return many;
}

/** Ограничить число диапазоном [min, max] */
export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

/** Вызвать fn через ms после последнего вызова (поиск по вводу, ресайз) */
export function debounce<A extends unknown[]>(fn: (...args: A) => void, ms: number) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const debounced = (...args: A) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), ms);
  };
  debounced.cancel = () => clearTimeout(timer);
  return debounced;
}
