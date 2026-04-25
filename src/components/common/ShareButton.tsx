import { useState } from 'react';
import { canShare, shareEvent } from '@/lib/webShare';

interface Props {
  title: string;
  text: string;
  url?: string;
  className?: string;
  label?: string;
}

export default function ShareButton({ title, text, url, className = '', label }: Props) {
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);

  const handleClick = async () => {
    setBusy(true);
    const ok = await shareEvent({ title, text, url });
    if (ok && !canShare()) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
    setBusy(false);
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={busy}
      className={`btn-ghost text-xs ${className}`}
      aria-label={label ?? 'Share'}
    >
      {copied ? '✓ copied' : canShare() ? '↗ share' : '⧉ copy'}
    </button>
  );
}
