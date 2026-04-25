import { describe, expect, it } from 'vitest';
import { computeSunTimes } from '@/lib/sunCalc';

describe('sunCalc', () => {
  it('produces sunrise before sunset on a normal day in Rome', () => {
    const times = computeSunTimes(new Date('2026-06-21T12:00:00Z'), 41.9028, 12.4964);
    expect(times.sunrise).not.toBeNull();
    expect(times.sunset).not.toBeNull();
    expect(times.sunrise!.getTime()).toBeLessThan(times.sunset!.getTime());
  });

  it('twilight ordering: civil < nautical < astronomical', () => {
    const t = computeSunTimes(new Date('2026-06-21T12:00:00Z'), 41.9028, 12.4964);
    expect(t.civilDuskEnd!.getTime()).toBeLessThan(t.nauticalDuskEnd!.getTime());
    expect(t.nauticalDuskEnd!.getTime()).toBeLessThan(t.astroDuskEnd!.getTime());
  });

  it('returns null at North Pole near summer solstice (no sunset)', () => {
    const t = computeSunTimes(new Date('2026-06-21T12:00:00Z'), 89, 0);
    expect(t.sunset).toBeNull();
  });

  it('current altitude is finite and in [-90, 90]', () => {
    const t = computeSunTimes(new Date(), 41.9028, 12.4964);
    expect(t.altitude).toBeGreaterThanOrEqual(-90);
    expect(t.altitude).toBeLessThanOrEqual(90);
  });
});
