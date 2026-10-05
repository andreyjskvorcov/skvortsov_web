import type { ReactNode } from 'react';
import { CircleAlert, Info, Lightbulb, TriangleAlert } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

const types = {
  info: { title: 'Заметка', icon: Info, className: 'border-l-info [&>svg]:text-info' },
  tip: { title: 'Совет', icon: Lightbulb, className: 'border-l-success [&>svg]:text-success' },
  warning: { title: 'Внимание', icon: TriangleAlert, className: 'border-l-warning [&>svg]:text-warning' },
  danger: { title: 'Опасно', icon: CircleAlert, className: 'border-l-destructive [&>svg]:text-destructive' },
};

interface Props {
  type?: keyof typeof types;
  title?: string;
  children?: ReactNode;
}

export default function Callout({ type = 'info', title, children }: Props) {
  const { icon: Icon, className, ...defaults } = types[type];

  return (
    <Alert className={`not-prose my-6 border-l-4 ${className}`}>
      <Icon />
      <AlertTitle>{title ?? defaults.title}</AlertTitle>
      <AlertDescription className="text-foreground [&_p]:m-0">{children}</AlertDescription>
    </Alert>
  );
}
