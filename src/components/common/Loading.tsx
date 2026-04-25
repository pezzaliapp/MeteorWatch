interface Props {
  label?: string;
}

export default function Loading({ label }: Props) {
  return (
    <div className="flex items-center justify-center gap-3 py-6 text-space-300">
      <span className="relative inline-block h-4 w-4">
        <span className="absolute inset-0 rounded-full border-2 border-cyan-glow/30 border-t-cyan-glow animate-spin" />
      </span>
      <span className="font-mono text-xs uppercase tracking-wider">{label ?? 'Loading…'}</span>
    </div>
  );
}
