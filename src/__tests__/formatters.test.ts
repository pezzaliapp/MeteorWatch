import { describe, expect, it } from 'vitest';
import {
  formatLD,
  formatAU,
  formatVelocity,
  formatDiameter,
  formatEnergy,
  compassDirection,
  formatNumber,
} from '@/utils/formatters';

describe('formatters', () => {
  it('formats lunar distance with LD suffix', () => {
    expect(formatLD(384400)).toMatch(/1[.,]00 LD/);
    expect(formatLD(192200)).toMatch(/0[.,]50 LD/);
  });

  it('formats astronomical unit', () => {
    expect(formatAU(149597870.7)).toMatch(/1[.,]0000 AU/);
  });

  it('formats velocity in km/s', () => {
    expect(formatVelocity(7.66)).toMatch(/7[.,]66 km\/s/);
  });

  it('formats diameter in km vs m', () => {
    expect(formatDiameter(1.5)).toMatch(/1[.,]50 km/);
    expect(formatDiameter(0.05)).toMatch(/50 m/);
  });

  it('formats energy in t/kt/Mt', () => {
    expect(formatEnergy(0.005)).toMatch(/5[.,]0 t/);
    expect(formatEnergy(440)).toMatch(/440[.,]00 kt/);
    expect(formatEnergy(1500)).toMatch(/1[.,]50 Mt/);
  });

  it('returns dash for non-finite numbers', () => {
    expect(formatLD(Number.NaN)).toBe('—');
    expect(formatNumber(Number.NaN)).toBe('—');
  });

  it('compass direction wraps to 16 sectors', () => {
    expect(compassDirection(0)).toBe('N');
    expect(compassDirection(90)).toBe('E');
    expect(compassDirection(180)).toBe('S');
    expect(compassDirection(270)).toBe('W');
    expect(compassDirection(45)).toBe('NE');
    expect(compassDirection(-90)).toBe('W');
    expect(compassDirection(360)).toBe('N');
  });
});
