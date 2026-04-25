import { ReactNode } from 'react';

interface Props {
  title: ReactNode;
  subtitle?: ReactNode;
  source?: ReactNode;
  action?: ReactNode;
}

export default function PageHeader({ title, subtitle, source, action }: Props) {
  return (
    <header className="mb-4 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight text-space-50 md:text-3xl">
          {title}
        </h1>
        {subtitle && <p className="text-sm text-space-300">{subtitle}</p>}
        {source && <div className="mt-1 label">{source}</div>}
      </div>
      {action && <div>{action}</div>}
    </header>
  );
}
