interface Props {
  /** 0..1 — 0/1 = new, 0.5 = full */
  phase: number;
  size?: number;
}

/**
 * Pure-SVG moon phase visualization. Northern-hemisphere oriented:
 * waxing → illuminated on the right, waning → on the left.
 */
export default function MoonPhaseSvg({ phase, size = 96 }: Props) {
  const r = size / 2 - 2;
  const cx = size / 2;
  const cy = size / 2;
  // Two semicircles + an ellipse describing the terminator
  const waxing = phase < 0.5;
  const k = waxing ? phase * 2 : (1 - phase) * 2; // 0..1
  // illuminated fraction → ellipse rx
  const rx = Math.abs(r * Math.cos(phase * 2 * Math.PI));
  const ry = r;
  const litColor = '#f5f0d6';
  const darkColor = '#0b1129';

  return (
    <svg
      viewBox={`0 0 ${size} ${size}`}
      width={size}
      height={size}
      role="img"
      aria-label={`Moon phase ${(phase * 100).toFixed(0)}%`}
    >
      <defs>
        <radialGradient id="moonLit" cx="35%" cy="35%" r="65%">
          <stop offset="0%" stopColor="#fff8d4" />
          <stop offset="100%" stopColor={litColor} />
        </radialGradient>
        <radialGradient id="moonShadow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#1a2240" />
          <stop offset="100%" stopColor={darkColor} />
        </radialGradient>
      </defs>
      {/* dark backdrop disc */}
      <circle cx={cx} cy={cy} r={r} fill="url(#moonShadow)" stroke="rgba(255,255,255,0.15)" />
      {/* lit half */}
      <clipPath id="moonClip">
        <circle cx={cx} cy={cy} r={r} />
      </clipPath>
      <g clipPath="url(#moonClip)">
        {phase < 0.5 ? (
          // waxing: lit on right
          <>
            <path d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 1 ${cx} ${cy + r} Z`} fill="url(#moonLit)" />
            <ellipse
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              fill={k < 1 ? darkColor : litColor}
              opacity={1}
            />
          </>
        ) : (
          // waning: lit on left
          <>
            <path d={`M ${cx} ${cy - r} A ${r} ${r} 0 0 0 ${cx} ${cy + r} Z`} fill="url(#moonLit)" />
            <ellipse
              cx={cx}
              cy={cy}
              rx={rx}
              ry={ry}
              fill={k < 1 ? darkColor : litColor}
              opacity={1}
            />
          </>
        )}
      </g>
      {/* subtle craters */}
      <g opacity="0.18" fill="#000">
        <circle cx={cx - r * 0.35} cy={cy - r * 0.2} r={r * 0.08} />
        <circle cx={cx + r * 0.15} cy={cy + r * 0.1} r={r * 0.06} />
        <circle cx={cx - r * 0.05} cy={cy + r * 0.45} r={r * 0.05} />
      </g>
    </svg>
  );
}
