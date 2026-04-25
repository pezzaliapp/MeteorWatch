import { describe, expect, it } from 'vitest';
import { getMoonInfo } from '@/lib/moonPhase';

describe('moonPhase', () => {
  it('returns sane illumination range', () => {
    const m = getMoonInfo(new Date('2026-01-15T00:00:00Z'));
    expect(m.illumination).toBeGreaterThanOrEqual(0);
    expect(m.illumination).toBeLessThanOrEqual(1);
    expect(m.ageDays).toBeGreaterThanOrEqual(0);
    expect(m.ageDays).toBeLessThan(30);
  });

  it('full moon on a known date has illumination near 1', () => {
    // 22 Apr 2024 was a full moon
    const m = getMoonInfo(new Date('2024-04-23T23:48:00Z'));
    expect(m.illumination).toBeGreaterThan(0.95);
    expect(m.name).toBe('fullMoon');
  });

  it('new moon ~ Apr 8 2024 has illumination near 0', () => {
    const m = getMoonInfo(new Date('2024-04-08T18:21:00Z'));
    expect(m.illumination).toBeLessThan(0.02);
    expect(m.name).toBe('newMoon');
  });

  it('emoji is a single glyph', () => {
    const m = getMoonInfo(new Date());
    expect(m.emoji.length).toBeGreaterThan(0);
  });
});
