import type { TleSet } from '@/types';

const CUBESAT_BASE = 'https://pezzaliapp.github.io/CubeSat_Constellation/';

function toBase64Utf8(input: string): string {
  if (typeof window === 'undefined') {
    // SSR / Node fallback
    const g = globalThis as unknown as {
      Buffer?: { from(s: string, enc: string): { toString(enc: string): string } };
    };
    if (g.Buffer) return g.Buffer.from(input, 'utf-8').toString('base64');
  }
  return window.btoa(unescape(encodeURIComponent(input)));
}

export function tleToDeepLink(tle: TleSet): string {
  const tleText = `${tle.name}\n${tle.line1}\n${tle.line2}`;
  const encoded = toBase64Utf8(tleText);
  return `${CUBESAT_BASE}?tle=${encodeURIComponent(encoded)}`;
}

export function asteroidsDeepLink(): string {
  return `${CUBESAT_BASE}?layer=neo`;
}

export function homeDeepLink(): string {
  return CUBESAT_BASE;
}
