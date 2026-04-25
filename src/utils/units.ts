export const AU_KM = 149597870.7;
export const LD_KM = 384400;
export const EARTH_RADIUS_KM = 6371;
export const KT_TO_JOULES = 4.184e12;

export function auToKm(au: number): number {
  return au * AU_KM;
}

export function kmToLD(km: number): number {
  return km / LD_KM;
}

export function ldToKm(ld: number): number {
  return ld * LD_KM;
}

export function kmsToKmh(kms: number): number {
  return kms * 3600;
}

export function ktToJoules(kt: number): number {
  return kt * KT_TO_JOULES;
}

export function ktToHiroshima(kt: number): number {
  return kt / 15;
}
