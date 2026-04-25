import { ReactNode } from 'react';

interface Props {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  children: ReactNode;
  className?: string;
  tone?: 'default' | 'cyan' | 'magenta';
}

export default function Card({ title, subtitle, action, children, className, tone = 'default' }: Props) {
  const toneClass =
    tone === 'cyan'
      ? 'border-cyan-glow/30 hover:shadow-glow'
      : tone === 'magenta'
        ? 'border-magenta-glow/30 hover:shadow-glow-magenta'
        : 'border-space-500/30';
  return (
    <section
      className={`glass p-4 transition-shadow duration-300 ${toneClass} ${className ?? ''}`}
    >
      {(title || action) && (
        <header className="mb-3 flex items-start justify-between gap-2">
          <div>
            {title && <h2 className="text-base font-semibold text-space-50">{title}</h2>}
            {subtitle && <div className="label mt-0.5">{subtitle}</div>}
          </div>
          {action && <div>{action}</div>}
        </header>
      )}
      {children}
    </section>
  );
}
