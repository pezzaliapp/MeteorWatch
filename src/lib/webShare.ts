interface ShareData {
  title: string;
  text: string;
  url?: string;
}

export function canShare(): boolean {
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function';
}

export async function shareEvent(data: ShareData): Promise<boolean> {
  if (!canShare()) {
    // Fallback: copy to clipboard
    try {
      const text = `${data.title}\n${data.text}${data.url ? `\n${data.url}` : ''}`;
      await navigator.clipboard?.writeText(text);
      return true;
    } catch {
      return false;
    }
  }
  try {
    await navigator.share(data);
    return true;
  } catch {
    return false;
  }
}
