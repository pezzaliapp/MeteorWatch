import { useTranslation } from '@/i18n';

export type LayerId = 'osm' | 'modis' | 'viirs_truecolor' | 'viirs_night';

interface Props {
  value: LayerId;
  onChange: (id: LayerId) => void;
  /** Show or hide the night-lights option (only meaningful where it makes sense) */
  showNightLights?: boolean;
}

export default function MapLayerToggle({ value, onChange, showNightLights = true }: Props) {
  const { t } = useTranslation();
  const options: Array<{ id: LayerId; label: string }> = [
    { id: 'osm', label: t('earth.layerOSM') },
    { id: 'modis', label: t('earth.layerTrueColor') },
    { id: 'viirs_truecolor', label: 'VIIRS' },
  ];
  if (showNightLights) options.push({ id: 'viirs_night', label: t('earth.layerNightLights') });

  return (
    <div
      role="radiogroup"
      aria-label="Map layer"
      className="glass absolute right-2 top-2 z-[400] flex flex-wrap gap-1 p-1 text-[11px]"
    >
      {options.map((o) => (
        <button
          key={o.id}
          role="radio"
          aria-checked={value === o.id}
          onClick={() => onChange(o.id)}
          className={`rounded-lg px-2 py-1 font-mono uppercase tracking-wide ${
            value === o.id
              ? 'bg-cyan-glow/20 text-cyan-glow'
              : 'text-space-300 hover:text-space-50'
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
