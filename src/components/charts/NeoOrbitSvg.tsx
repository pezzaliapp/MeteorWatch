import type { NeoObject } from '@/services/nasaNeoApi';
import { LD_KM } from '@/utils/units';

interface Props {
  neo: NeoObject;
  size?: number;
}

export default function NeoOrbitSvg({ neo, size = 240 }: Props) {
  const cx = size / 2;
  const cy = size / 2;
  const earthR = 8;
  const moonOrbit = size * 0.35;
  const ld = neo.closeApproach.missDistanceKm / LD_KM;
  const ratio = Math.min(Math.log10(Math.max(ld, 0.1) + 1) / Math.log10(20), 1);
  const neoOrbit = moonOrbit + ratio * (size * 0.42 - moonOrbit);
  const angle = (neo.closeApproach.epochMs / (1000 * 60 * 60 * 24)) % (2 * Math.PI);
  const neoX = cx + neoOrbit * Math.cos(angle);
  const neoY = cy + neoOrbit * Math.sin(angle);
  const neoRadius = Math.max(2, Math.min(8, ((neo.diameterKmMin + neo.diameterKmMax) / 2) * 8));

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      role="img"
      aria-label={`Orbit visualization for ${neo.name}`}
    >
      <defs>
        <radialGradient id="earthGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#5cf0ff" />
          <stop offset="100%" stopColor="#1f2a5a" />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={moonOrbit} fill="none" stroke="rgba(255,255,255,0.15)" strokeDasharray="3 5" />
      <circle cx={cx} cy={cy} r={neoOrbit} fill="none" stroke="rgba(92,240,255,0.3)" strokeDasharray="6 4" />
      <circle cx={cx + moonOrbit} cy={cy} r={3} fill="#cccccc" />
      <text x={cx + moonOrbit + 6} y={cy + 4} fontSize="9" fill="#9aa3c9">
        Moon
      </text>
      <circle cx={cx} cy={cy} r={earthR} fill="url(#earthGrad)" />
      <circle
        cx={neoX}
        cy={neoY}
        r={neoRadius}
        fill={neo.isPotentiallyHazardous ? '#ef4444' : '#5cf0ff'}
      >
        <title>{neo.name}</title>
      </circle>
      <text x={neoX + neoRadius + 4} y={neoY + 4} fontSize="9" fill="#e6e9f5">
        {neo.name.replace(/[()]/g, '')}
      </text>
      <text x={4} y={size - 6} fontSize="9" fill="#6b75a8">
        {`${ld.toFixed(2)} LD`}
      </text>
    </svg>
  );
}
