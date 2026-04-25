/**
 * Lightweight sunrise/sunset/twilight calculator.
 * NOAA-style algorithm sufficient for divulgative use.
 * Inputs: latitude, longitude (degrees), date (UTC).
 * Outputs: UTC Date for each event, or null if event does not occur (polar day/night).
 */

const DEG = Math.PI / 180;

export interface SunTimes {
  sunrise: Date | null;
  sunset: Date | null;
  civilDuskEnd: Date | null;
  civilDawnStart: Date | null;
  nauticalDuskEnd: Date | null;
  nauticalDawnStart: Date | null;
  astroDuskEnd: Date | null;
  astroDawnStart: Date | null;
  solarNoon: Date | null;
  altitude: number; // current altitude (deg)
  azimuth: number; // current azimuth (deg, from N CW)
}

function toJulian(date: Date): number {
  return date.getTime() / 86400000 + 2440587.5;
}

function fromJulian(jd: number): Date {
  return new Date((jd - 2440587.5) * 86400000);
}

function toDays(date: Date): number {
  return toJulian(date) - 2451545.0;
}

const obliquity = 23.4397 * DEG;

function rightAscension(l: number, b: number): number {
  return Math.atan2(Math.sin(l) * Math.cos(obliquity) - Math.tan(b) * Math.sin(obliquity), Math.cos(l));
}
function declination(l: number, b: number): number {
  return Math.asin(Math.sin(b) * Math.cos(obliquity) + Math.cos(b) * Math.sin(obliquity) * Math.sin(l));
}
function azimuth(H: number, phi: number, dec: number): number {
  return Math.atan2(Math.sin(H), Math.cos(H) * Math.sin(phi) - Math.tan(dec) * Math.cos(phi));
}
function altitude(H: number, phi: number, dec: number): number {
  return Math.asin(Math.sin(phi) * Math.sin(dec) + Math.cos(phi) * Math.cos(dec) * Math.cos(H));
}
function siderealTime(d: number, lw: number): number {
  return (280.16 + 360.9856235 * d) * DEG - lw;
}
function solarMeanAnomaly(d: number): number {
  return (357.5291 + 0.98560028 * d) * DEG;
}
function eclipticLongitude(M: number): number {
  const C = (1.9148 * Math.sin(M) + 0.02 * Math.sin(2 * M) + 0.0003 * Math.sin(3 * M)) * DEG;
  const P = 102.9372 * DEG;
  return M + C + P + Math.PI;
}

interface SunCoords {
  ra: number;
  dec: number;
}

function sunCoords(d: number): SunCoords {
  const M = solarMeanAnomaly(d);
  const L = eclipticLongitude(M);
  return { ra: rightAscension(L, 0), dec: declination(L, 0) };
}

const J0 = 0.0009;
function julianCycle(d: number, lw: number): number {
  return Math.round(d - J0 - lw / (2 * Math.PI));
}
function approxTransit(Ht: number, lw: number, n: number): number {
  return J0 + (Ht + lw) / (2 * Math.PI) + n;
}
function solarTransitJ(ds: number, M: number, L: number): number {
  return 2451545.0 + ds + 0.0053 * Math.sin(M) - 0.0069 * Math.sin(2 * L);
}
function hourAngle(h: number, phi: number, dec: number): number | null {
  const cosH = (Math.sin(h) - Math.sin(phi) * Math.sin(dec)) / (Math.cos(phi) * Math.cos(dec));
  if (cosH < -1 || cosH > 1) return null;
  return Math.acos(cosH);
}

function getSetTime(h: number, lw: number, phi: number, dec: number, n: number, M: number, L: number) {
  const w = hourAngle(h, phi, dec);
  if (w === null) return null;
  const a = approxTransit(w, lw, n);
  return solarTransitJ(a, M, L);
}

export function computeSunTimes(date: Date, lat: number, lon: number): SunTimes {
  const lw = -lon * DEG;
  const phi = lat * DEG;

  const d = toDays(date);
  const n = julianCycle(d, lw);
  const ds = approxTransit(0, lw, n);
  const M = solarMeanAnomaly(ds);
  const L = eclipticLongitude(M);
  const dec = declination(L, 0);
  const Jnoon = solarTransitJ(ds, M, L);

  const set = (h: number) => {
    const j = getSetTime(h * DEG, lw, phi, dec, n, M, L);
    return j === null ? null : fromJulian(j);
  };
  const rise = (h: number) => {
    const jset = getSetTime(h * DEG, lw, phi, dec, n, M, L);
    if (jset === null) return null;
    const jrise = Jnoon - (jset - Jnoon);
    return fromJulian(jrise);
  };

  // current alt/az
  const lst = siderealTime(d, lw);
  const c = sunCoords(d);
  const H = lst - c.ra;
  const alt = altitude(H, phi, c.dec) / DEG;
  const az = ((azimuth(H, phi, c.dec) / DEG) + 180) % 360;

  return {
    sunrise: rise(-0.833),
    sunset: set(-0.833),
    civilDawnStart: rise(-6),
    civilDuskEnd: set(-6),
    nauticalDawnStart: rise(-12),
    nauticalDuskEnd: set(-12),
    astroDawnStart: rise(-18),
    astroDuskEnd: set(-18),
    solarNoon: fromJulian(Jnoon),
    altitude: alt,
    azimuth: az,
  };
}

export function isDarkSky(date: Date, lat: number, lon: number): boolean {
  const t = computeSunTimes(date, lat, lon);
  return t.altitude < -12;
}
