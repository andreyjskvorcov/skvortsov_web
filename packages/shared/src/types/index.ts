/**
 * Обобщённые типы, которые не знают ни про одно приложение.
 * Типы конкретного приложения (ответы его API, пропсы виджетов) живут в самом приложении.
 */

export type Nullable<T> = T | null;
export type Maybe<T> = T | null | undefined;

/** Объединение значений объекта: ValueOf<{ a: 1; b: 2 }> → 1 | 2 */
export type ValueOf<T> = T[keyof T];

/** Состояние асинхронной операции (запрос, загрузка файла) */
export type AsyncState<T, E = Error> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'success'; data: T }
  | { status: 'error'; error: E };
