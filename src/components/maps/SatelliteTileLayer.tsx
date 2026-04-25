import { TileLayer } from 'react-leaflet';
import type { LayerId } from './MapLayerToggle';
import { GIBS_LAYERS, gibsTileUrl } from '@/services/gibsLayers';

interface Props {
  layer: LayerId;
}

const OSM_URL = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const OSM_ATTR = '&copy; <a href="https://www.openstreetmap.org/copyright">OSM</a>';

export default function SatelliteTileLayer({ layer }: Props) {
  if (layer === 'osm') {
    return <TileLayer attribution={OSM_ATTR} url={OSM_URL} />;
  }
  const def =
    layer === 'modis'
      ? GIBS_LAYERS[0]
      : layer === 'viirs_truecolor'
        ? GIBS_LAYERS[1]
        : GIBS_LAYERS[2];
  return (
    <TileLayer
      key={def.id}
      attribution={def.attribution}
      url={gibsTileUrl(def)}
      maxNativeZoom={def.maxZoom}
      maxZoom={9}
      noWrap={false}
      crossOrigin
      tileSize={256}
    />
  );
}
