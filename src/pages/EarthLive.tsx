import { useEffect, useMemo, useState } from 'react';
import { MapContainer, Polyline, ZoomControl, CircleMarker, Tooltip } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { useTranslation } from '@/i18n';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/common/Card';
import Loading from '@/components/common/Loading';
import { useAsync } from '@/hooks/useNasaApi';
import { fetchEpicLatest } from '@/services/epicApi';
import { terminator, subsolarPoint } from '@/lib/dayNightTerminator';
import MapLayerToggle, { type LayerId } from '@/components/maps/MapLayerToggle';
import SatelliteTileLayer from '@/components/maps/SatelliteTileLayer';
import { formatDateTimeLocal, formatNumber } from '@/utils/formatters';

export default function EarthLive() {
  const { t, language } = useTranslation();
  const epicQ = useAsync(() => fetchEpicLatest(), []);
  const [layer, setLayer] = useState<LayerId>('modis');
  const [showTerminator, setShowTerminator] = useState(true);

  useEffect(() => {
    document.title = 'MeteorWatch — Earth Live';
  }, []);

  const term = useMemo(() => terminator(new Date()), []);
  const subsol = useMemo(() => subsolarPoint(new Date()), []);

  const latest = epicQ.data?.[0];

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('earth.title')}
        subtitle={t('earth.subtitle')}
        source={`${t('common.source')}: NASA EPIC (DSCOVR) + NASA GIBS`}
      />

      <Card title={t('earth.satelliteView')}>
        <div className="relative overflow-hidden rounded-2xl border border-space-500/30">
          <MapLayerToggle value={layer} onChange={setLayer} />
          <button
            type="button"
            onClick={() => setShowTerminator((s) => !s)}
            aria-pressed={showTerminator}
            className={`glass absolute left-2 top-2 z-[400] rounded-lg px-2 py-1 text-[11px] font-mono uppercase tracking-wide ${
              showTerminator ? 'text-cyan-glow' : 'text-space-300'
            }`}
          >
            ☀ {t('earth.showTerminator')}
          </button>
          <MapContainer
            center={[20, 0]}
            zoom={2}
            style={{ height: '460px', width: '100%' }}
            worldCopyJump
            scrollWheelZoom
            zoomControl={false}
          >
            <SatelliteTileLayer layer={layer} />
            <ZoomControl position="bottomright" />
            {showTerminator && (
              <>
                <Polyline
                  positions={term}
                  pathOptions={{ color: '#ff5cd0', weight: 2, opacity: 0.7, dashArray: '6 4' }}
                />
                <CircleMarker
                  center={subsol}
                  radius={8}
                  pathOptions={{
                    color: '#fbbf24',
                    fillColor: '#fbbf24',
                    fillOpacity: 0.9,
                  }}
                >
                  <Tooltip direction="top" offset={[0, -8]}>
                    ☀ {t('earth.subtitle').split(' +')[0]}
                  </Tooltip>
                </CircleMarker>
              </>
            )}
          </MapContainer>
        </div>
      </Card>

      <Card
        tone="cyan"
        title={t('earth.latestImage')}
        subtitle={
          latest
            ? `${t('earth.captured')} ${formatDateTimeLocal(latest.date.replace(' ', 'T') + 'Z', language)}`
            : ''
        }
      >
        {epicQ.loading && <Loading />}
        {!epicQ.loading && !latest && (
          <p className="text-sm text-space-300">{t('common.noData')}</p>
        )}
        {latest && (
          <>
            <a href={latest.pngUrl} target="_blank" rel="noreferrer" className="block">
              <img
                src={latest.thumbUrl}
                alt={latest.caption}
                loading="lazy"
                className="mx-auto h-auto w-full max-w-md rounded-xl border border-space-500/30"
              />
            </a>
            <p className="mt-3 text-sm text-space-200">{latest.caption}</p>
            <div className="mt-2 text-xs text-space-300">
              {t('earth.centroid')}: {formatNumber(latest.centroidLat, 1, language)}°,{' '}
              {formatNumber(latest.centroidLon, 1, language)}°
            </div>
          </>
        )}
      </Card>

      {epicQ.data && epicQ.data.length > 1 && (
        <Card title={`${epicQ.data.length} ${language === 'it' ? 'immagini oggi' : 'images today'}`}>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4 lg:grid-cols-6">
            {epicQ.data.slice(0, 12).map((img) => (
              <a
                key={img.identifier}
                href={img.pngUrl}
                target="_blank"
                rel="noreferrer"
                className="block overflow-hidden rounded-xl border border-space-500/30 hover:border-cyan-glow/40"
              >
                <img
                  src={img.thumbUrl}
                  alt={img.caption}
                  loading="lazy"
                  className="aspect-square w-full object-cover"
                />
              </a>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
