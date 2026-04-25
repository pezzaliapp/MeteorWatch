import { describe, expect, it } from 'vitest';
import {
  METEOR_SHOWERS,
  isShowerActive,
  daysToPeak,
  activeShowers,
  upcomingShowers,
} from '@/services/meteorShowersData';

describe('meteorShowersData', () => {
  it('catalog has at least 9 showers', () => {
    expect(METEOR_SHOWERS.length).toBeGreaterThanOrEqual(9);
  });

  it('Perseids active in mid-August', () => {
    const aug12 = new Date(Date.UTC(2026, 7, 12));
    const per = METEOR_SHOWERS.find((s) => s.code === 'PER')!;
    expect(isShowerActive(per, aug12)).toBe(true);
  });

  it('Quadrantids handle year wrap-around', () => {
    const jan3 = new Date(Date.UTC(2026, 0, 3));
    const qua = METEOR_SHOWERS.find((s) => s.code === 'QUA')!;
    expect(isShowerActive(qua, jan3)).toBe(true);
    const dec30 = new Date(Date.UTC(2026, 11, 30));
    expect(isShowerActive(qua, dec30)).toBe(true);
  });

  it('daysToPeak returns positive integer for upcoming', () => {
    const per = METEOR_SHOWERS.find((s) => s.code === 'PER')!;
    const apr20 = new Date(Date.UTC(2026, 3, 20));
    const d = daysToPeak(per, apr20);
    expect(d).toBeGreaterThan(0);
  });

  it('activeShowers + upcomingShowers do not overlap by code', () => {
    const ref = new Date(Date.UTC(2026, 7, 12));
    const a = activeShowers(ref).map((s) => s.code);
    const u = upcomingShowers(ref).map((s) => s.code);
    expect(a.filter((c) => u.includes(c))).toEqual([]);
  });
});
