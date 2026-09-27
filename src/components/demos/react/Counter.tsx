import { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div
      style={{
        display: 'flex',
        gap: 'var(--space-4)',
        alignItems: 'center',
        padding: 'var(--space-4)',
        border: '1px dashed var(--color-border)',
        borderRadius: 'var(--radius-md)',
      }}
    >
      <button type="button" onClick={() => setCount((c) => c + 1)} style={{ font: 'inherit', cursor: 'pointer' }}>
        Кликов: {count}
      </button>
      <span>Удвоенное: {count * 2}</span>
    </div>
  );
}
