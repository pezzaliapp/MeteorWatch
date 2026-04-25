export type MoonPhaseName =
  | 'newMoon'
  | 'waxingCrescent'
  | 'firstQuarter'
  | 'waxingGibbous'
  | 'fullMoon'
  | 'waningGibbous'
  | 'lastQuarter'
  | 'waningCrescent';

export interface MoonInfo {
  phase: number; // 0..1 where 0/1 = new, 0.5 = full
  ageDays: number;
  illumination: number; // 0..1
  name: MoonPhaseName;
  emoji: string;
}

const SYNODIC = 29.530588853; // mean synodic month, days
const KNOWN_NEW_MOON_JD = 2451550.1; // 6 Jan 2000 18:14 UTC

function toJD(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

export function getMoonInfo(date: Date = new Date()): MoonInfo {
  const jd = toJD(date);
  const days = jd - KNOWN_NEW_MOON_JD;
  const phase = ((days % SYNODIC) + SYNODIC) % SYNODIC / SYNODIC;
  const ageDays = phase * SYNODIC;
  // illumination = (1 - cos(phase * 2π)) / 2
  const illumination = (1 - Math.cos(phase * 2 * Math.PI)) / 2;
  let name: MoonPhaseName;
  if (phase < 0.0306 || phase >= 0.9694) name = 'newMoon';
  else if (phase < 0.2306) name = 'waxingCrescent';
  else if (phase < 0.2806) name = 'firstQuarter';
  else if (phase < 0.4694) name = 'waxingGibbous';
  else if (phase < 0.5306) name = 'fullMoon';
  else if (phase < 0.7194) name = 'waningGibbous';
  else if (phase < 0.7806) name = 'lastQuarter';
  else name = 'waningCrescent';
  const emoji = {
    newMoon: '🌑',
    waxingCrescent: '🌒',
    firstQuarter: '🌓',
    waxingGibbous: '🌔',
    fullMoon: '🌕',
    waningGibbous: '🌖',
    lastQuarter: '🌗',
    waningCrescent: '🌘',
  }[name];
  return { phase, ageDays, illumination, name, emoji };
}

export function nextPhase(name: MoonPhaseName, from: Date = new Date()): Date {
  const target =
    name === 'newMoon'
      ? 0
      : name === 'firstQuarter'
        ? 0.25
        : name === 'fullMoon'
          ? 0.5
          : 0.75; // lastQuarter
  const start = toJD(from);
  let bestDiff = Number.POSITIVE_INFINITY;
  let bestJd = start;
  // Search ahead up to 35 days at 6h step for the nearest target phase, then refine.
  for (let d = 0; d <= 35; d += 0.25) {
    const jd = start + d;
    const days = jd - KNOWN_NEW_MOON_JD;
    const phase = ((days % SYNODIC) + SYNODIC) % SYNODIC / SYNODIC;
    const diff = Math.abs(phase - target);
    const wrapDiff = Math.abs(phase - target - 1);
    const minDiff = Math.min(diff, wrapDiff);
    if (minDiff < bestDiff) {
      bestDiff = minDiff;
      bestJd = jd;
    }
  }
  return new Date((bestJd - 2440587.5) * 86400000);
}
