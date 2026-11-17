/**
 * Безопасная работа с localStorage.
 *
 * Сайт и приложения из apps/ открыты с одного домена (приложения — в iframe),
 * поэтому localStorage у них ОБЩИЙ. Каждый пользователь хранилища получает своё
 * пространство имён: createStorage('todo-react') пишет ключи вида `todo-react:<key>`.
 *
 * - не падает при SSR (нет window) и в браузерах, где localStorage запрещён, —
 *   тогда данные живут в памяти до перезагрузки страницы;
 * - значения хранятся в JSON, битый JSON возвращает значение по умолчанию;
 * - subscribe() сообщает об изменениях из этой вкладки и из других вкладок/iframe.
 */

type Listener = () => void;

const memory = new Map<string, string>();
const listeners = new Map<string, Set<Listener>>();
let storageEventBound = false;

function local(): globalThis.Storage | null {
  try {
    return typeof window === 'undefined' ? null : window.localStorage;
  } catch {
    return null;
  }
}

/** Строка по полному ключу, без JSON и пространства имён. */
export function readRaw(key: string): string | null {
  // Копия в памяти есть, только если запись в localStorage не удалась — она свежее
  if (memory.has(key)) return memory.get(key)!;
  try {
    return local()?.getItem(key) ?? null;
  } catch {
    return null;
  }
}

/** Запись строки по полному ключу. Если localStorage недоступен или переполнен — в память. */
export function writeRaw(key: string, value: string): void {
  try {
    const ls = local();
    if (ls) {
      ls.setItem(key, value);
      memory.delete(key);
      return;
    }
  } catch {}
  memory.set(key, value);
}

export function removeRaw(key: string): void {
  try {
    local()?.removeItem(key);
  } catch {}
  memory.delete(key);
}

function notify(key: string | null) {
  if (key === null) {
    // localStorage.clear() в другой вкладке — сообщаем всем
    listeners.forEach((set) => set.forEach((cb) => cb()));
    return;
  }
  listeners.get(key)?.forEach((cb) => cb());
}

function bindStorageEvent() {
  if (storageEventBound || typeof window === 'undefined') return;
  storageEventBound = true;
  // Событие storage приходит из ДРУГИХ документов того же домена: вкладок и iframe
  window.addEventListener('storage', (e) => notify(e.key));
}

export interface NamespacedStorage {
  readonly namespace: string;
  /** Значение по ключу или fallback, если ключа нет или JSON битый */
  get<T>(key: string, fallback: T): T;
  set<T>(key: string, value: T): void;
  remove(key: string): void;
  /** Подписка на изменения ключа. Возвращает функцию отписки. */
  subscribe(key: string, callback: Listener): () => void;
}

export function createStorage(namespace: string): NamespacedStorage {
  const full = (key: string) => `${namespace}:${key}`;

  return {
    namespace,

    get<T>(key: string, fallback: T): T {
      const raw = readRaw(full(key));
      if (raw === null) return fallback;
      try {
        return JSON.parse(raw) as T;
      } catch {
        return fallback;
      }
    },

    set<T>(key: string, value: T) {
      writeRaw(full(key), JSON.stringify(value));
      notify(full(key));
    },

    remove(key: string) {
      removeRaw(full(key));
      notify(full(key));
    },

    subscribe(key: string, callback: Listener) {
      bindStorageEvent();
      const k = full(key);
      if (!listeners.has(k)) listeners.set(k, new Set());
      listeners.get(k)!.add(callback);
      return () => {
        listeners.get(k)?.delete(callback);
      };
    },
  };
}
