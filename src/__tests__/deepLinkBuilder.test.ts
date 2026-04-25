import { describe, expect, it } from 'vitest';
import { tleToDeepLink, asteroidsDeepLink, homeDeepLink } from '@/lib/deepLinkBuilder';

describe('deepLinkBuilder', () => {
  it('builds a base64-encoded TLE URL pointing to CubeSat Constellation', () => {
    const link = tleToDeepLink({
      name: 'ISS (ZARYA)',
      line1: '1 25544U 98067A   26115.50000000  .00012345  00000-0  22678-3 0  9990',
      line2: '2 25544  51.6420 200.0000 0001234  10.0000 350.0000 15.50000000400000',
    });
    expect(link).toMatch(/^https:\/\/www\.alessandropezzali\.it\/CubeSat_Constellation\/\?tle=/);
    const encoded = decodeURIComponent(link.split('?tle=')[1]);
    const decoded = atob(encoded);
    expect(decoded).toContain('ISS (ZARYA)');
    expect(decoded).toContain('1 25544U');
  });

  it('asteroidsDeepLink includes the layer hint', () => {
    expect(asteroidsDeepLink()).toMatch(/layer=neo/);
  });

  it('homeDeepLink is the bare CubeSat Constellation URL', () => {
    expect(homeDeepLink()).toBe('https://www.alessandropezzali.it/CubeSat_Constellation/');
  });
});
