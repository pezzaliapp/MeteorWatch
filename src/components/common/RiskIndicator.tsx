interface Props {
  level: 'low' | 'mid' | 'high';
  label?: string;
  size?: 'sm' | 'md' | 'lg';
}

export default function RiskIndicator({ level, label, size = 'md' }: Props) {
  const colorMap = {
    low: 'bg-risk-low shadow-[0_0_12px_rgba(52,211,153,0.6)]',
    mid: 'bg-risk-mid shadow-[0_0_12px_rgba(251,191,36,0.6)]',
    high: 'bg-risk-high shadow-[0_0_12px_rgba(239,68,68,0.6)]',
  };
  const sizeMap = {
    sm: 'h-2 w-2',
    md: 'h-3 w-3',
    lg: 'h-4 w-4',
  };
  return (
    <span className="inline-flex items-center gap-2">
      <span className={`rounded-full ${colorMap[level]} ${sizeMap[size]} ${level !== 'low' ? 'animate-pulse-slow' : ''}`} />
      {label && <span className="text-sm">{label}</span>}
    </span>
  );
}
