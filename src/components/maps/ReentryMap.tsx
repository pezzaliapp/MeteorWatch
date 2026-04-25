import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { PropagatedPosition } from '@/lib/sgp4Lite';

interface Props {
  groundTrack: PropagatedPosition[];
  height?: number;
}

export default function ReentryMap({ groundTrack, height = 280 }: Props) {
  const positions = groundTrack.map<[number, number]>((p) => [p.lat, p.lon]);
  const center: [number, number] = positions[0] ?? [0, 0];
  return (
    <div className="overflow-hidden rounded-2xl border border-space-500/30">
      <MapContainer
        center={center}
        zoom={2}
        style={{ height: `${height}px`, width: '100%' }}
        worldCopyJump
        scrollWheelZoom
      >
        <TileLayer
          attribution='&copy; OSM'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {positions.length > 1 && (
          <Polyline
            positions={positions}
            pathOptions={{ color: '#ff5cd0', weight: 2, opacity: 0.85 }}
          />
        )}
      </MapContainer>
    </div>
  );
}
