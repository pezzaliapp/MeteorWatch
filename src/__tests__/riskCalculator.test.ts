import { describe, expect, it } from 'vitest';
import { neoRisk, fireballRisk, aggregatedSkyStatus } from '@/lib/riskCalculator';
import type { NeoObject } from '@/services/nasaNeoApi';
import type { FireballEvent } from '@/services/cneosFireballApi';
import { LD_KM } from '@/utils/units';

function makeNeo(opts: Partial<NeoObject> & { ld: number; pha?: boolean }): NeoObject {
  return {
    id: '1',
    name: 'Test',
    isPotentiallyHazardous: opts.pha ?? false,
    absoluteMagnitude: 22,
    diameterKmMin: 0.05,
    diameterKmMax: 0.1,
    closeApproach: {
      closeApproachDate: '2026-01-01',
      epochMs: Date.now(),
      velocityKms: 15,
      missDistanceKm: opts.ld * LD_KM,
      orbitingBody: 'Earth',
    },
    nasaJplUrl: 'https://example.org',
    ...opts,
  };
}

function makeFireball(energyKt: number, ageMs = 0): FireballEvent {
  return {
    date: new Date(Date.now() - ageMs).toISOString().slice(0, 10),
    epochMs: Date.now() - ageMs,
    energyKt,
    impactEnergyJ: energyKt * 4.184e12,
    lat: 0,
    lon: 0,
  };
}

describe('riskCalculator', () => {
  it('NEO risk: high when PHA and within 5 LD', () => {
    expect(neoRisk(makeNeo({ ld: 2, pha: true }))).toBe('high');
  });

  it('NEO risk: mid when PHA but far', () => {
    expect(neoRisk(makeNeo({ ld: 20, pha: true }))).toBe('mid');
  });

  it('NEO risk: mid when not PHA but very close (< 1 LD)', () => {
    expect(neoRisk(makeNeo({ ld: 0.5, pha: false }))).toBe('mid');
  });

  it('NEO risk: low when far and not PHA', () => {
    expect(neoRisk(makeNeo({ ld: 30, pha: false }))).toBe('low');
  });

  it('Fireball risk thresholds', () => {
    expect(fireballRisk(makeFireball(15))).toBe('high');
    expect(fireballRisk(makeFireball(2))).toBe('mid');
    expect(fireballRisk(makeFireball(0.1))).toBe('low');
  });

  it('Aggregated sky status — picks max severity', () => {
    expect(aggregatedSkyStatus([], [])).toBe('low');
    expect(aggregatedSkyStatus([makeNeo({ ld: 0.5 })], [])).toBe('mid');
    expect(aggregatedSkyStatus([makeNeo({ ld: 1, pha: true })], [])).toBe('high');
    expect(aggregatedSkyStatus([], [makeFireball(20, 60_000)])).toBe('high');
    expect(aggregatedSkyStatus([], [makeFireball(20, 60 * 86400_000)])).toBe('low');
  });
});
