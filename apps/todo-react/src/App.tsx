import { useState, type SubmitEvent } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';

interface Todo {
  id: number;
  text: string;
  done: boolean;
}

export default function App() {
  const [todos, setTodos] = useState<Todo[]>([
    { id: 1, text: 'Подключить Tailwind', done: true },
    { id: 2, text: 'Добавить shadcn/ui', done: true },
    { id: 3, text: 'Перенести свои проекты', done: false },
  ]);
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
        <Badge variant="secondary">Осталось: {left}</Badge>
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
