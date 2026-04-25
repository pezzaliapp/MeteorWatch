import { useEffect, useMemo, useState } from 'react';
import { useTranslation } from '@/i18n';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/common/Card';
import Loading from '@/components/common/Loading';
import Badge from '@/components/common/Badge';
import { fetchISSPosition, type ISSPosition } from '@/services/issApi';
import { fetchISSTle } from '@/services/celestrakApi';
import { groundTrack } from '@/lib/sgp4Lite';
import { predictPasses } from '@/lib/passPredictor';
import { passesToIcs, downloadIcs } from '@/lib/icsExporter';
import { tleToDeepLink } from '@/lib/deepLinkBuilder';
import { useAsync } from '@/hooks/useNasaApi';
import { useGeolocation } from '@/hooks/useGeolocation';
import { useUserLocationStore } from '@/store/userLocationStore';
import { usePeriodicSync } from '@/hooks/usePeriodicSync';
import {
  formatNumber,
  formatDateTimeLocal,
  compassDirection,
  formatRelative,
} from '@/utils/formatters';
import ISSMap from '@/components/maps/ISSMap';

export default function ISSLive() {
  const { t, language } = useTranslation();
  const [pos, setPos] = useState<ISSPosition | null>(null);
  const tleQ = useAsync(() => fetchISSTle(), []);
  const location = useUserLocationStore((s) => s.location);
  const { request, loading: locLoading } = useGeolocation();

  usePeriodicSync(() => {
    fetchISSPosition().then(setPos).catch(() => undefined);
  }, 5000);

  const track = useMemo(() => {
    if (!tleQ.data) return [];
    const now = Date.now();
    return groundTrack(tleQ.data, now - 30 * 60 * 1000, now + 90 * 60 * 1000, 30);
  }, [tleQ.data]);

  const passes = useMemo(() => {
    if (!tleQ.data || !location) return [];
    return predictPasses(tleQ.data, location, { durationHours: 48, minElDeg: 10 });
  }, [tleQ.data, location]);

  useEffect(() => {
    document.title = 'MeteorWatch — ISS Live';
  }, []);

  const handleExport = () => {
    if (passes.length === 0) return;
    const ics = passesToIcs(passes.slice(0, 3), 'ISS');
    downloadIcs(ics, 'meteorwatch-iss-passes.ics');
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('iss.title')}
        subtitle={t('iss.subtitle')}
        source={`${t('common.source')}: wheretheiss.at + CelesTrak`}
      />

      <Card
        tone="cyan"
        title={pos ? `${formatRelative(pos.timestamp, language)}` : t('common.loading')}
        subtitle={pos ? `Visibility: ${pos.visibility}` : ''}
      >
        {!pos ? (
          <Loading />
        ) : (
          <div className="grid grid-cols-2 gap-3 data sm:grid-cols-4">
            <Stat label={t('iss.altitude')} value={`${formatNumber(pos.altKm, 1, language)} km`} />
            <Stat label={t('iss.velocity')} value={`${formatNumber(pos.velocityKmh, 0, language)} km/h`} />
            <Stat label="Lat" value={`${formatNumber(pos.lat, 2, language)}°`} />
            <Stat label="Lon" value={`${formatNumber(pos.lon, 2, language)}°`} />
            <Stat label={t('iss.footprint')} value={`${formatNumber(pos.footprintKm, 0, language)} km`} />
          </div>
        )}
      </Card>

      <ISSMap position={pos} groundTrack={track} observer={location ?? undefined} />

      <Card
        title={t('iss.next3passes')}
        action={
          passes.length > 0 ? (
            <button className="btn-primary text-xs" onClick={handleExport}>
              ⤓ {t('iss.exportIcs')}
            </button>
          ) : null
        }
      >
        {!location && (
          <div className="space-y-3 text-sm">
            <p className="text-space-300">{t('iss.needLocation')}</p>
            <button
              className="btn-primary"
              onClick={() => request()}
              disabled={locLoading}
            >
              📍 {t('iss.enableLocation')}
            </button>
          </div>
        )}
        {location && passes.length === 0 && (
          <div className="text-sm text-space-300">{t('iss.noPasses')}</div>
        )}
        {location && passes.length > 0 && (
          <ul className="divide-y divide-space-500/20">
            {passes.slice(0, 3).map((p, i) => (
              <li key={i} className="grid grid-cols-2 gap-2 py-3 text-xs sm:grid-cols-5">
                <Stat label={t('iss.aos')} value={formatDateTimeLocal(p.aos, language)} />
                <Stat label={t('iss.maxEl')} value={`${formatNumber(p.maxElDeg, 0, language)}°`} />
                <Stat label={t('iss.duration')} value={`${formatNumber(p.durationSec, 0, language)} s`} />
                <Stat
                  label={t('iss.azimuth')}
                  value={`${compassDirection(p.startAzDeg)} → ${compassDirection(p.endAzDeg)}`}
                />
                <div className="flex items-center justify-end">
                  {p.visible ? (
                    <Badge tone="low">{t('iss.visible')}</Badge>
                  ) : (
                    <Badge tone="info">daylight</Badge>
                  )}
                </div>
              </li>
            ))}
          </ul>
        )}
      </Card>

      {tleQ.data && (
        <a
          className="btn-primary inline-flex w-full justify-center md:w-auto"
          href={tleToDeepLink(tleQ.data)}
          target="_blank"
          rel="noreferrer"
        >
          🛰 {t('common.viewIn3d')} → CubeSat Constellation
        </a>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="label">{label}</div>
      <div className="font-mono">{value}</div>
    </div>
  );
}
