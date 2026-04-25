import type { NeoObject } from '@/services/nasaNeoApi';
import type { FireballEvent } from '@/services/cneosFireballApi';
import type { RiskLevel } from '@/types';
import { LD_KM } from '@/utils/units';

export function neoRisk(neo: NeoObject): RiskLevel {
  const ld = neo.closeApproach.missDistanceKm / LD_KM;
  if (neo.isPotentiallyHazardous && ld < 5) return 'high';
  if (neo.isPotentiallyHazardous || ld < 1) return 'mid';
  return 'low';
}

export function fireballRisk(fb: FireballEvent): RiskLevel {
  if (fb.energyKt >= 10) return 'high';
  if (fb.energyKt >= 0.5) return 'mid';
  return 'low';
}

export function aggregatedSkyStatus(neos: NeoObject[], fireballs: FireballEvent[]): RiskLevel {
  if (neos.some((n) => neoRisk(n) === 'high')) return 'high';
  const recentFireball = fireballs.find((f) => Date.now() - f.epochMs < 1000 * 60 * 60 * 24 * 7);
  if (recentFireball && fireballRisk(recentFireball) === 'high') return 'high';
  if (neos.some((n) => neoRisk(n) === 'mid')) return 'mid';
  if (recentFireball && fireballRisk(recentFireball) === 'mid') return 'mid';
  return 'low';
}
