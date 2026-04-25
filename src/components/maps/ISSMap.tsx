import { useMemo, useState } from 'react';
import {
  MapContainer,
  CircleMarker,
  Polyline,
  Tooltip,
  Marker,
  ZoomControl,
} from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import type { ISSPosition } from '@/services/issApi';
import type { PropagatedPosition } from '@/lib/sgp4Lite';
import MapLayerToggle, { type LayerId } from './MapLayerToggle';
import SatelliteTileLayer from './SatelliteTileLayer';
import { terminator } from '@/lib/dayNightTerminator';

interface Props {
  position: ISSPosition | null;
  groundTrack?: PropagatedPosition[];
  observer?: { lat: number; lon: number };
  height?: number;
}

const issIcon = L.divIcon({
  className: 'iss-icon',
  html: '<div style="font-size:24px;line-height:24px;text-shadow:0 0 8px #5cf0ff;">🛰️</div>',
  iconSize: [24, 24],
  iconAnchor: [12, 12],
});

export default function ISSMap({ position, groundTrack, observer, height = 320 }: Props) {
  const [layer, setLayer] = useState<LayerId>('osm');
  const [showTerm, setShowTerm] = useState(true);
  const center: [number, number] = position ? [position.lat, position.lon] : [0, 0];
  const trackLine = (groundTrack ?? []).map<[number, number]>((p) => [p.lat, p.lon]);
  // Recompute terminator once per minute by re-rendering — cheap; map ‘key' the tick
  const minuteTick = Math.floor(Date.now() / 60000);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const term = useMemo(() => terminator(new Date()), [minuteTick]);

  return (
    <div className="relative overflow-hidden rounded-2xl border border-space-500/30">
      <MapLayerToggle value={layer} onChange={setLayer} />
      <button
        type="button"
        onClick={() => setShowTerm((v) => !v)}
        aria-pressed={showTerm}
        className={`glass absolute left-2 top-2 z-[400] rounded-lg px-2 py-1 text-[11px] font-mono uppercase tracking-wide ${
          showTerm ? 'text-cyan-glow' : 'text-space-300'
        }`}
      >
        ☀ day/night
      </button>
      <MapContainer
        center={center}
        zoom={2}
        style={{ height: `${height}px`, width: '100%' }}
        worldCopyJump
        scrollWheelZoom
        zoomControl={false}
      >
        <SatelliteTileLayer layer={layer} />
        <ZoomControl position="bottomright" />
        {showTerm && (
          <Polyline
            positions={term}
            pathOptions={{ color: '#ff5cd0', weight: 1.5, opacity: 0.6, dashArray: '4 4' }}
          />
        )}
        {trackLine.length > 1 && (
          <Polyline
            positions={trackLine}
            pathOptions={{ color: '#5cf0ff', weight: 2, opacity: 0.7, dashArray: '4 4' }}
          />
        )}
        {position && (
          <>
            <Marker position={[position.lat, position.lon]} icon={issIcon}>
              <Tooltip permanent={false} direction="top">
                ISS — {position.altKm.toFixed(0)} km
              </Tooltip>
            </Marker>
            <CircleMarker
              center={[position.lat, position.lon]}
              radius={Math.max(20, position.footprintKm / 100)}
              pathOptions={{
                color: '#5cf0ff',
                weight: 1,
                fillColor: '#5cf0ff',
                fillOpacity: 0.05,
              }}
            />
          </>
        )}
        {observer && (
          <CircleMarker
            center={[observer.lat, observer.lon]}
            radius={5}
            pathOptions={{ color: '#ff5cd0', fillColor: '#ff5cd0', fillOpacity: 0.7 }}
          >
            <Tooltip>You</Tooltip>
          </CircleMarker>
        )}
      </MapContainer>
    </div>
  );
}
