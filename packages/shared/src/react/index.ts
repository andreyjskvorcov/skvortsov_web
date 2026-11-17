import { useCallback, useEffect, useRef, useState } from 'react';
import type { NamespacedStorage } from '../storage';

type SetValue<T> = (next: T | ((prev: T) => T)) => void;

/**
 * Значение из хранилища, синхронизированное между компонентами, вкладками и iframe.
 *
 * Первый рендер возвращает initial, а сохранённое значение читается после монтирования —
 * так разметка совпадает с серверной (острова Astro) и нет ошибок гидрации.
 *
 * const storage = createStorage('todo-react'); // на уровне модуля, не внутри компонента
 * const [todos, setTodos, removeTodos] = useLocalStorage(storage, 'todos', []);
 */
export function useLocalStorage<T>(storage: NamespacedStorage, key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const initialRef = useRef(initial);
  const valueRef = useRef(value);
  valueRef.current = value;

  useEffect(() => {
    const read = () => setValue(storage.get(key, initialRef.current));
    read();
    return storage.subscribe(key, read);
  }, [storage, key]);

  // Пишем в хранилище, а состояние обновит подписка — у всех компонентов с этим ключом сразу
  const set: SetValue<T> = useCallback(
    (next) => {
      const resolved = typeof next === 'function' ? (next as (prev: T) => T)(valueRef.current) : next;
      valueRef.current = resolved;
      storage.set(key, resolved);
    },
    [storage, key],
  );

  const remove = useCallback(() => storage.remove(key), [storage, key]);

  return [value, set, remove] as const;
}
