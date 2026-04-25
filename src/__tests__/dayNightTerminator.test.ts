import { describe, expect, it } from 'vitest';
import { terminator, subsolarPoint } from '@/lib/dayNightTerminator';

describe('dayNightTerminator', () => {
  it('returns N+1 points for default sampling', () => {
    const pts = terminator(new Date('2026-06-21T12:00:00Z'));
    expect(pts.length).toBe(181);
    pts.forEach(([lat, lon]) => {
      expect(lat).toBeGreaterThanOrEqual(-90);
      expect(lat).toBeLessThanOrEqual(90);
      expect(lon).toBeGreaterThanOrEqual(-180);
      expect(lon).toBeLessThanOrEqual(180);
    });
  });

  it('subsolar point at June solstice has positive declination ~23°', () => {
    const [lat] = subsolarPoint(new Date('2026-06-21T12:00:00Z'));
    expect(lat).toBeGreaterThan(22);
    expect(lat).toBeLessThan(24);
  });
});
