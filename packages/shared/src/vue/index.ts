import {
  computed,
  getCurrentInstance,
  getCurrentScope,
  onMounted,
  onScopeDispose,
  shallowRef,
  type WritableComputedRef,
} from 'vue';
import type { NamespacedStorage } from '../storage';

/**
 * Значение из хранилища как ref: чтение — value.value, запись — присваивание (работает с v-model).
 * Синхронизируется между компонентами, вкладками и iframe.
 *
 * Мутации на месте (value.value.push(...)) НЕ сохраняются — присваивайте новое значение:
 * todos.value = [...todos.value, todo]
 *
 * const storage = createStorage('stopwatch-vue'); // на уровне модуля
 * const laps = useLocalStorage(storage, 'laps', [] as number[]);
 */
export function useLocalStorage<T>(
  storage: NamespacedStorage,
  key: string,
  initial: T,
): WritableComputedRef<T> & { remove: () => void } {
  const state = shallowRef<T>(initial);
  const read = () => {
    state.value = storage.get(key, initial);
  };

  let off = () => {};
  const start = () => {
    read();
    off = storage.subscribe(key, read);
  };

  // В компоненте читаем и подписываемся после монтирования: разметка совпадёт с серверной (SSR в Astro),
  // а на сервере подписок не будет вовсе
  if (getCurrentInstance()) onMounted(start);
  else start();
  if (getCurrentScope()) onScopeDispose(() => off());

  const value = computed<T>({
    get: () => state.value,
    set: (next) => storage.set(key, next),
  });

  return Object.assign(value, { remove: () => storage.remove(key) });
}
