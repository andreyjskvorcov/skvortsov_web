import { useEffect, useState, type ReactNode } from 'react';
import { Check, RotateCcw, X } from 'lucide-react';
import { cn } from 'cn';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface Props {
  /** Уникальный id вопроса на сайте — по нему сохраняется ответ */
  id: string;
  /** Варианты ответа */
  options: string[];
  /** Индекс правильного варианта, с нуля */
  answer: number;
  /** Пояснение после ответа — в MDX передаётся через <Fragment slot="explanation"> */
  explanation?: ReactNode;
  /** Текст вопроса — содержимое тега в MDX */
  children?: ReactNode;
}

const storageKey = (id: string) => `quiz:${id}`;

export default function Quiz({ id, options, answer, explanation, children }: Props) {
  const [selected, setSelected] = useState<number | null>(null);

  // Читаем сохранённый ответ после гидрации, чтобы разметка совпала с серверной
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey(id));
      if (saved !== null && Number(saved) < options.length) setSelected(Number(saved));
    } catch {}
  }, [id, options.length]);

  function choose(index: number) {
    setSelected(index);
    try {
      localStorage.setItem(storageKey(id), String(index));
    } catch {}
  }

  function reset() {
    setSelected(null);
    try {
      localStorage.removeItem(storageKey(id));
    } catch {}
  }

  const answered = selected !== null;
  const correct = selected === answer;

  return (
    <section className="my-6 rounded-xl border bg-card px-5 py-4 text-card-foreground">
      <div className="not-prose flex items-center justify-between gap-2">
        <Badge variant="secondary">Вопрос</Badge>
        {answered && (
          <Badge variant="outline" className={correct ? 'text-success' : 'text-destructive'}>
            {correct ? 'Верно' : 'Неверно'}
          </Badge>
        )}
      </div>

      <div className="mb-4">{children}</div>

      <ul className="not-prose grid gap-2" aria-label="Варианты ответа">
        {options.map((option, i) => {
          const isAnswer = i === answer;
          const isSelected = i === selected;
          return (
            <li key={i}>
              <button
                type="button"
                disabled={answered}
                aria-pressed={isSelected}
                onClick={() => choose(i)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-md border bg-background px-3 py-2 text-left font-mono text-sm transition-colors',
                  !answered && 'cursor-pointer hover:border-primary hover:bg-accent',
                  answered && isAnswer && 'border-success bg-success/10',
                  answered && isSelected && !isAnswer && 'border-destructive bg-destructive/10',
                  answered && !isAnswer && !isSelected && 'opacity-60',
                )}
              >
                <span className="flex-1 whitespace-pre-wrap">{option}</span>
                {answered && isAnswer && <Check className="size-4 shrink-0 text-success" aria-label="Правильный ответ" />}
                {answered && isSelected && !isAnswer && (
                  <X className="size-4 shrink-0 text-destructive" aria-label="Ваш ответ" />
                )}
              </button>
            </li>
          );
        })}
      </ul>

      {answered && (
        <div className="mt-4 border-t pt-1">
          {explanation}
          <div className="not-prose mt-3">
            <Button variant="ghost" size="sm" onClick={reset}>
              <RotateCcw /> Ответить заново
            </Button>
          </div>
        </div>
      )}
    </section>
  );
}
