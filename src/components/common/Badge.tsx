import { ReactNode } from 'react';

interface Props {
  tone?: 'low' | 'mid' | 'high' | 'info' | 'magenta';
  children: ReactNode;
  className?: string;
}

const toneMap = {
  low: 'border-risk-low/40 text-risk-low',
  mid: 'border-risk-mid/40 text-risk-mid',
  high: 'border-risk-high/40 text-risk-high',
  info: 'border-cyan-glow/40 text-cyan-glow',
  magenta: 'border-magenta-glow/40 text-magenta-glow',
};

export default function Badge({ tone = 'info', children, className }: Props) {
  return <span className={`chip ${toneMap[tone]} ${className ?? ''}`}>{children}</span>;
}
