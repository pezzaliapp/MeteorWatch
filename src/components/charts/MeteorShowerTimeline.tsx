import { type MeteorShower } from '@/services/meteorShowersData';
import type { Language } from '@/store/settingsStore';

interface Props {
  showers: MeteorShower[];
  now?: Date;
  language: Language;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTHS_IT = ['Gen', 'Feb', 'Mar', 'Apr', 'Mag', 'Giu', 'Lug', 'Ago', 'Set', 'Ott', 'Nov', 'Dic'];

function dayFromMMDD(mmdd: string, year = 2026): number {
  const [m, d] = mmdd.split('-').map(Number);
  return Math.floor((Date.UTC(year, m - 1, d) - Date.UTC(year, 0, 1)) / 86400000);
}

export default function MeteorShowerTimeline({ showers, now = new Date(), language }: Props) {
  const labels = language === 'it' ? MONTHS_IT : MONTHS;
  const todayDoy = Math.floor(
    (Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()) -
      Date.UTC(now.getUTCFullYear(), 0, 1)) /
      86400000,
  );
  const W = 720;
  const rowH = 22;
  const padX = 60;
  const yearWidth = W - padX - 10;

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${W} ${showers.length * rowH + 30}`} className="w-full min-w-[640px]">
        {/* month grid */}
        {labels.map((m, i) => {
          const x = padX + (i / 12) * yearWidth;
          return (
            <g key={m}>
              <line x1={x} x2={x} y1={20} y2={showers.length * rowH + 25} stroke="rgba(255,255,255,0.07)" />
              <text x={x} y={14} fontSize="9" fill="#6b75a8">
                {m}
              </text>
            </g>
          );
        })}
        {/* today */}
        <line
          x1={padX + (todayDoy / 365) * yearWidth}
          x2={padX + (todayDoy / 365) * yearWidth}
          y1={20}
          y2={showers.length * rowH + 25}
          stroke="#ff5cd0"
          strokeDasharray="4 3"
        />
        {showers.map((s, i) => {
          const startDoy = dayFromMMDD(s.activeStart);
          const endDoy = dayFromMMDD(s.activeEnd);
          const peakDoy = dayFromMMDD(s.peak);
          const wrap = startDoy > endDoy;
          const y = 30 + i * rowH;

          const drawSegment = (a: number, b: number) => (
            <rect
              key={`${s.code}-${a}-${b}`}
              x={padX + (a / 365) * yearWidth}
              y={y}
              width={Math.max(2, ((b - a) / 365) * yearWidth)}
              height={rowH - 8}
              fill="rgba(92,240,255,0.18)"
              stroke="rgba(92,240,255,0.45)"
              rx={3}
            />
          );

          return (
            <g key={s.code}>
              <text x={4} y={y + 12} fontSize="10" fill="#e6e9f5">
                {s.name[language]}
              </text>
              {wrap ? (
                <>
                  {drawSegment(startDoy, 365)}
                  {drawSegment(0, endDoy)}
                </>
              ) : (
                drawSegment(startDoy, endDoy)
              )}
              <circle
                cx={padX + (peakDoy / 365) * yearWidth}
                cy={y + (rowH - 8) / 2}
                r={3}
                fill="#fbbf24"
              />
            </g>
          );
        })}
      </svg>
    </div>
  );
}
