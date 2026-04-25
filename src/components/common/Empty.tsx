import { ReactNode } from 'react';

interface Props {
  title?: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
}

export default function Empty({ title, description, action }: Props) {
  return (
    <div className="glass flex flex-col items-center justify-center gap-2 px-4 py-10 text-center">
      <div className="text-3xl opacity-60">🌌</div>
      {title && <div className="font-semibold">{title}</div>}
      {description && <div className="max-w-sm text-sm text-space-300">{description}</div>}
      {action && <div className="mt-2">{action}</div>}
    </div>
  );
}
