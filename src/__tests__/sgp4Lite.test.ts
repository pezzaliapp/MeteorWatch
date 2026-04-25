import { describe, expect, it } from 'vitest';
import { propagate, getMeanMotion, getBStar, getEpoch, estimateRemainingLifetimeDays } from '@/lib/sgp4Lite';

const ISS_TLE = {
  name: 'ISS (ZARYA)',
  line1: '1 25544U 98067A   24115.50000000  .00012345  00000-0  22678-3 0  9990',
  line2: '2 25544  51.6420 200.0000 0001234  10.0000 350.0000 15.50000000400000',
};

describe('sgp4Lite', () => {
  it('propagates the ISS to a sane geodetic position', () => {
    const p = propagate(ISS_TLE, new Date('2024-04-25T12:00:00Z'));
    expect(p).not.toBeNull();
    expect(Math.abs(p!.lat)).toBeLessThan(60);
    expect(p!.altKm).toBeGreaterThan(300);
    expect(p!.altKm).toBeLessThan(500);
    expect(p!.velocityKms).toBeGreaterThan(7);
    expect(p!.velocityKms).toBeLessThan(8.5);
  });

  it('extracts mean motion from line 2', () => {
    expect(getMeanMotion(ISS_TLE)).toBeCloseTo(15.5, 1);
  });

  it('extracts BSTAR from line 1', () => {
    const bstar = getBStar(ISS_TLE);
    expect(bstar).toBeGreaterThan(0);
    expect(bstar).toBeLessThan(0.001);
  });

  it('extracts epoch from line 1', () => {
    const epoch = getEpoch(ISS_TLE);
    expect(epoch.getUTCFullYear()).toBe(2024);
  });

  it('estimates a finite remaining lifetime when altitude is low', () => {
    const lifetime = estimateRemainingLifetimeDays(ISS_TLE);
    expect(Number.isFinite(lifetime)).toBe(true);
    expect(lifetime).toBeGreaterThan(0);
  });
});
