import { useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Loading from '@/components/common/Loading';
import { useAsync } from '@/hooks/useNasaApi';
import { fetchNeoFeed } from '@/services/nasaNeoApi';
import { fetchISSTle } from '@/services/celestrakApi';
import { useUserLocationStore, FALLBACK_LOCATION } from '@/store/userLocationStore';
import { useGeolocation } from '@/hooks/useGeolocation';
import { getMoonInfo, type MoonPhaseName } from '@/lib/moonPhase';
import { computeSunTimes } from '@/lib/sunCalc';
import { predictPasses } from '@/lib/passPredictor';
import { activeShowers } from '@/services/meteorShowersData';
import {
  formatNumber,
  formatDateTimeLocal,
  formatLD,
  compassDirection,
  formatDiameter,
} from '@/utils/formatters';
import MoonPhaseSvg from '@/components/charts/MoonPhaseSvg';

export default function Tonight() {
  const { t, language } = useTranslation();
  const fallbackLoc = useUserLocationStore((s) => s.location) ?? FALLBACK_LOCATION;
  const userLoc = useUserLocationStore((s) => s.location);
  const { request, loading: locLoading } = useGeolocation();
  const tleQ = useAsync(() => fetchISSTle(), []);
  const neoQ = useAsync(() => fetchNeoFeed(2), []);

  useEffect(() => {
    document.title = 'MeteorWatch — Tonight';
  }, []);

  const now = useMemo(() => new Date(), []);
  const moon = useMemo(() => getMoonInfo(now), [now]);
  const sun = useMemo(() => computeSunTimes(now, fallbackLoc.lat, fallbackLoc.lon), [
    now,
    fallbackLoc.lat,
    fallbackLoc.lon,
  ]);
  const passes = useMemo(() => {
    if (!tleQ.data || !userLoc) return [];
    return predictPasses(tleQ.data, userLoc, { durationHours: 12, minElDeg: 10 }).filter(
      (p) => p.visible,
    );
  }, [tleQ.data, userLoc]);
  const showersNow = useMemo(() => activeShowers(now), [now]);
  const todayMs = now.getTime();
  const neoToday = useMemo(
    () =>
      (neoQ.data ?? [])
        .filter((n) => n.closeApproach.epochMs >= todayMs - 6 * 3600_000)
        .sort(
          (a, b) =>
            a.closeApproach.missDistanceKm - b.closeApproach.missDistanceKm,
        )[0],
    [neoQ.data, todayMs],
  );

  const moonName = `tonight.phases.${moon.name as MoonPhaseName}`;
  const observingTip = pickTip(moon.illumination);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('tonight.title')}
        subtitle={`${t('tonight.subtitle')} · ${fallbackLoc.label ?? `${fallbackLoc.lat.toFixed(2)}°, ${fallbackLoc.lon.toFixed(2)}°`}`}
      />

      {!userLoc && (
        <div className="glass flex flex-wrap items-center justify-between gap-3 p-3 text-sm">
          <span className="text-space-200">📍 {t('tonight.needLocationCta')}</span>
          <button className="btn-primary text-xs" onClick={() => request()} disabled={locLoading}>
            {t('iss.enableLocation')}
          </button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card
          tone="cyan"
          title={t('tonight.moonTitle')}
          subtitle={t(moonName)}
        >
          <div className="flex items-center gap-4">
            <MoonPhaseSvg phase={moon.phase} size={96} />
            <div className="data space-y-1 text-sm">
              <div>
                <span className="label">{t('tonight.moonIllumination')}</span>{' '}
                {formatNumber(moon.illumination * 100, 0, language)}%
              </div>
              <div>
                <span className="label">{t('tonight.moonAge')}</span>{' '}
                {formatNumber(moon.ageDays, 1, language)} {t('reentry.lifetime.days')}
              </div>
              <div>
                <span className="label">{t('tonight.observingTip')}</span>
                <p className="mt-1 text-xs text-space-300">{t(observingTip)}</p>
              </div>
            </div>
          </div>
        </Card>

        <Card tone="magenta" title={t('tonight.sunTitle')}>
          <ul className="data space-y-1 text-sm">
            <SunRow label={t('tonight.sunRise')} value={sun.sunrise} language={language} />
            <SunRow label={t('tonight.sunSet')} value={sun.sunset} language={language} />
            <SunRow label={t('tonight.civilDusk')} value={sun.civilDuskEnd} language={language} />
            <SunRow label={t('tonight.nauticalDusk')} value={sun.nauticalDuskEnd} language={language} />
            <SunRow label={t('tonight.astroDusk')} value={sun.astroDuskEnd} language={language} />
          </ul>
          <p className="mt-3 text-xs text-space-300">
            ☀️ alt {sun.altitude.toFixed(0)}° · az {compassDirection(sun.azimuth)} (
            {sun.azimuth.toFixed(0)}°)
          </p>
        </Card>

        <Card title={t('tonight.issTonightTitle')}>
          {!userLoc ? (
            <p className="text-sm text-space-300">{t('tonight.needLocationCta')}</p>
          ) : tleQ.loading ? (
            <Loading />
          ) : passes.length === 0 ? (
            <p className="text-sm text-space-300">{t('tonight.noVisiblePass')}</p>
          ) : (
            <ul className="space-y-2 text-xs">
              {passes.slice(0, 3).map((p, i) => (
                <li key={i} className="glass p-2">
                  <div className="font-mono">
                    {formatDateTimeLocal(p.aos, language)}
                  </div>
                  <div className="text-space-300">
                    max {p.maxElDeg.toFixed(0)}° · {compassDirection(p.startAzDeg)} →{' '}
                    {compassDirection(p.endAzDeg)} · {p.durationSec}s
                    {p.visible && (
                      <span className="ml-2">
                        <Badge tone="low">{t('iss.visible')}</Badge>
                      </span>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          )}
          <Link to="/iss" className="btn-ghost mt-3 inline-flex w-full justify-center text-xs">
            ISS Live →
          </Link>
        </Card>

        <Card title={t('tonight.showerTonight')}>
          {showersNow.length === 0 ? (
            <p className="text-sm text-space-300">{t('home.showerNoActive')}</p>
          ) : (
            <ul className="space-y-1 text-sm">
              {showersNow.map((s) => (
                <li key={s.code} className="flex flex-wrap items-center gap-2">
                  <Badge tone="low">{s.code}</Badge>
                  <span className="font-semibold">{s.name[language]}</span>
                  <span className="data text-xs text-space-300">
                    ZHR {s.zhr} · {s.velocityKms} km/s
                  </span>
                </li>
              ))}
            </ul>
          )}
          <Link to="/showers" className="btn-ghost mt-3 inline-flex w-full justify-center text-xs">
            {t('home.viewAll')} →
          </Link>
        </Card>

        <Card tone="magenta" title={t('tonight.neoToday')}>
          {neoQ.loading ? (
            <Loading />
          ) : !neoToday ? (
            <p className="text-sm text-space-300">{t('common.noData')}</p>
          ) : (
            <div className="data space-y-1 text-sm">
              <div className="font-semibold">{neoToday.name}</div>
              <div>
                <span className="label">{t('asteroids.missDistance')}</span>{' '}
                {formatLD(neoToday.closeApproach.missDistanceKm, language)}
              </div>
              <div>
                <span className="label">{t('asteroids.diameter')}</span>{' '}
                {formatDiameter(
                  (neoToday.diameterKmMin + neoToday.diameterKmMax) / 2,
                  language,
                )}
              </div>
              <div className="text-xs text-space-300">
                {formatDateTimeLocal(neoToday.closeApproach.epochMs, language)}
              </div>
            </div>
          )}
          <Link to="/asteroids" className="btn-ghost mt-3 inline-flex w-full justify-center text-xs">
            {t('home.viewAll')} →
          </Link>
        </Card>
      </div>
    </div>
  );
}

function SunRow({
  label,
  value,
  language,
}: {
  label: string;
  value: Date | null;
  language: 'it' | 'en';
}) {
  return (
    <li className="flex items-center justify-between gap-3">
      <span className="label">{label}</span>
      <span className="font-mono">
        {value
          ? value.toLocaleTimeString(language === 'it' ? 'it-IT' : 'en-US', {
              hour: '2-digit',
              minute: '2-digit',
            })
          : '—'}
      </span>
    </li>
  );
}

function pickTip(illum: number): string {
  if (illum > 0.85) return 'tonight.tipFullMoon';
  if (illum > 0.5) return 'tonight.tipBrightMoon';
  if (illum > 0.15) return 'tonight.tipDarkMoon';
  return 'tonight.tipNewMoon';
}
