import { useState } from 'react';
import { Button } from '@/components/ui/button';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div className="not-prose flex items-center gap-4 rounded-lg border border-dashed p-4">
      <Button onClick={() => setCount((c) => c + 1)}>Кликов: {count}</Button>
      <span>Удвоенное: {count * 2}</span>
    </div>
  );
}
