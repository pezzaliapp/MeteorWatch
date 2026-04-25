import { useState } from 'react';
import { MapContainer, CircleMarker, Popup, ZoomControl } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { FireballEvent } from '@/services/cneosFireballApi';
import { formatEnergy, formatDateTimeLocal } from '@/utils/formatters';
import { useTranslation } from '@/i18n';
import MapLayerToggle, { type LayerId } from './MapLayerToggle';
import SatelliteTileLayer from './SatelliteTileLayer';

interface Props {
  events: FireballEvent[];
  height?: number;
  initialLayer?: LayerId;
  enableLayerToggle?: boolean;
}

export default function FireballMap({
  events,
  height = 360,
  initialLayer = 'osm',
  enableLayerToggle = true,
}: Props) {
  const { t, language } = useTranslation();
  const [layer, setLayer] = useState<LayerId>(initialLayer);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-space-500/30">
      {enableLayerToggle && <MapLayerToggle value={layer} onChange={setLayer} />}
      <MapContainer
        center={[20, 0]}
        zoom={2}
        style={{ height: `${height}px`, width: '100%' }}
        worldCopyJump
        scrollWheelZoom
        zoomControl={false}
      >
        <SatelliteTileLayer layer={layer} />
        <ZoomControl position="bottomright" />
        {events.map((fb, idx) => {
          const radius = Math.max(4, Math.min(20, Math.log10(fb.energyKt + 1) * 6));
          const color =
            fb.energyKt >= 10 ? '#ef4444' : fb.energyKt >= 0.5 ? '#fbbf24' : '#5cf0ff';
          return (
            <CircleMarker
              key={idx}
              center={[fb.lat, fb.lon]}
              radius={radius}
              pathOptions={{
                color,
                fillColor: color,
                fillOpacity: 0.4,
                weight: 1.5,
              }}
            >
              <Popup>
                <div className="font-mono text-xs">
                  <div className="font-semibold">{formatDateTimeLocal(fb.epochMs, language)}</div>
                  <div>
                    {t('fireballs.energy')}: {formatEnergy(fb.energyKt, language)}
                  </div>
                  <div>
                    {t('fireballs.lat')}: {fb.lat.toFixed(2)}°
                  </div>
                  <div>
                    {t('fireballs.lon')}: {fb.lon.toFixed(2)}°
                  </div>
                  {fb.altitudeKm !== undefined && (
                    <div>
                      {t('fireballs.altitude')}: {fb.altitudeKm.toFixed(1)} km
                    </div>
                  )}
                  {fb.velocityKms !== undefined && (
                    <div>
                      {t('fireballs.velocity')}: {fb.velocityKms.toFixed(1)} km/s
                    </div>
                  )}
                </div>
              </Popup>
            </CircleMarker>
          );
        })}
      </MapContainer>
    </div>
  );
}
