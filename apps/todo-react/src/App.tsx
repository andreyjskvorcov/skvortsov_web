import { useState, type SubmitEvent } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@skvortsov/ui-react/badge';
import { Button } from '@skvortsov/ui-react/button';
import { Card, CardContent, CardHeader, CardTitle } from '@skvortsov/ui-react/card';
import { Input } from '@skvortsov/ui-react/input';
import { createStorage } from '@skvortsov/shared/storage';
import { useLocalStorage } from '@skvortsov/shared/react';
import { plural } from '@skvortsov/shared/utils';
import type { Todo } from './types';

// Ключи вида todo-react:<key> — localStorage общий с сайтом и другими приложениями
const storage = createStorage('todo-react');

const initialTodos: Todo[] = [
  { id: 1, text: 'Подключить Tailwind', done: true },
  { id: 2, text: 'Добавить shadcn/ui', done: true },
  { id: 3, text: 'Перенести свои проекты', done: false },
];

export default function App() {
  // Список сохраняется между перезагрузками и синхронизируется между вкладками
  const [todos, setTodos] = useLocalStorage(storage, 'todos', initialTodos);
  const [text, setText] = useState('');

  const left = todos.filter((t) => !t.done).length;

  function add(e: SubmitEvent) {
    e.preventDefault();
    if (!text.trim()) return;
    setTodos((list) => [...list, { id: Date.now(), text: text.trim(), done: false }]);
    setText('');
  }

  function toggle(id: number) {
    setTodos((list) => list.map((t) => (t.id === id ? { ...t, done: !t.done } : t)));
  }

  function remove(id: number) {
    setTodos((list) => list.filter((t) => t.id !== id));
  }

  return (
    <Card className="mx-auto max-w-md">
      <CardHeader className="flex items-center justify-between">
        <CardTitle>Задачи</CardTitle>
        <Badge variant="secondary">
          {left} {plural(left, ['задача', 'задачи', 'задач'])}
        </Badge>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form className="flex gap-2" onSubmit={add}>
          <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="Новая задача" />
          <Button type="submit">Добавить</Button>
        </form>
        <ul className="grid gap-1">
          {todos.map((t) => (
            <li key={t.id} className="flex items-center gap-2">
              <label className="flex flex-1 cursor-pointer items-center gap-2">
                <input type="checkbox" className="accent-primary" checked={t.done} onChange={() => toggle(t.id)} />
                <span className={t.done ? 'text-muted-foreground line-through' : undefined}>{t.text}</span>
              </label>
              <Button variant="ghost" size="icon-sm" aria-label={`Удалить «${t.text}»`} onClick={() => remove(t.id)}>
                <X />
              </Button>
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
}
