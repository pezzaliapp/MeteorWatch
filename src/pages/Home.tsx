import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import RiskIndicator from '@/components/common/RiskIndicator';
import Loading from '@/components/common/Loading';
import { useAsync } from '@/hooks/useNasaApi';
import { fetchNeoFeed } from '@/services/nasaNeoApi';
import { fetchFireballs } from '@/services/cneosFireballApi';
import { fetchSentryTop } from '@/services/cneosSentryApi';
import { fetchISSPosition } from '@/services/issApi';
import { activeShowers, upcomingShowers } from '@/services/meteorShowersData';
import { fetchReentryGroup } from '@/services/celestrakApi';
import { neoRisk, fireballRisk, aggregatedSkyStatus } from '@/lib/riskCalculator';
import { estimateRemainingLifetimeDays } from '@/lib/sgp4Lite';
import {
  formatLD,
  formatDiameter,
  formatVelocity,
  formatEnergy,
  formatRelative,
  formatDateTimeLocal,
  formatNumber,
} from '@/utils/formatters';
import { homeDeepLink } from '@/lib/deepLinkBuilder';
import { usePeriodicSync } from '@/hooks/usePeriodicSync';
import { useState, useEffect } from 'react';
import type { ISSPosition } from '@/services/issApi';

export default function Home() {
  const { t, language } = useTranslation();
  const neoQ = useAsync(() => fetchNeoFeed(7), []);
  const fbQ = useAsync(() => fetchFireballs(50), []);
  const sentryQ = useAsync(() => fetchSentryTop(5), []);
  const reentryQ = useAsync(() => fetchReentryGroup(), []);
  const [iss, setIss] = useState<ISSPosition | null>(null);
  usePeriodicSync(() => {
    fetchISSPosition().then(setIss).catch(() => undefined);
  }, 5000);

  useEffect(() => {
    document.title = 'MeteorWatch — Home';
  }, []);

  const closestNeo = neoQ.data?.[0];
  const lastFireball = fbQ.data?.[0];
  const sentryTop = sentryQ.data?.[0];
  const showersNow = activeShowers();
  const showersNext = upcomingShowers().slice(0, 1);
  const skyStatus = aggregatedSkyStatus(neoQ.data ?? [], fbQ.data ?? []);
  const skyLabel =
    skyStatus === 'high'
      ? t('home.skyStatusRed')
      : skyStatus === 'mid'
        ? t('home.skyStatusYellow')
        : t('home.skyStatusGreen');

  const nextReentry = (reentryQ.data ?? [])
    .map((tle) => ({ tle, lifetime: estimateRemainingLifetimeDays(tle) }))
    .filter((x) => Number.isFinite(x.lifetime) && x.lifetime < 60)
    .sort((a, b) => a.lifetime - b.lifetime)[0];

  return (
    <div className="space-y-6">
      <Card
        tone={skyStatus === 'low' ? 'cyan' : 'magenta'}
        title={
          <span className="flex items-center gap-3">
            <RiskIndicator level={skyStatus} size="lg" />
            {t('home.skyStatus')}
          </span>
        }
        subtitle={skyLabel}
      >
        <p className="text-sm text-space-200">
          {neoQ.loading || fbQ.loading
            ? t('home.loading')
            : language === 'it'
              ? "Aggregato live su NEO ravvicinati e bolidi recenti."
              : 'Live aggregate of close NEOs and recent fireballs.'}
        </p>
      </Card>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        <Card
          tone="cyan"
          title={t('home.issTitle')}
          subtitle={iss ? `${formatRelative(iss.timestamp, language)}` : t('common.loading')}
          action={
            <Link to="/iss" className="btn-ghost text-xs">
              {t('home.viewAll')} →
            </Link>
          }
        >
          {iss ? (
            <div className="grid grid-cols-2 gap-2 data">
              <Stat label={t('home.issAlt')} value={`${formatNumber(iss.altKm, 1, language)} km`} />
              <Stat label={t('home.issVel')} value={`${formatNumber(iss.velocityKmh, 0, language)} km/h`} />
              <Stat label={t('home.issLat')} value={`${formatNumber(iss.lat, 2, language)}°`} />
              <Stat label={t('home.issLon')} value={`${formatNumber(iss.lon, 2, language)}°`} />
            </div>
          ) : (
            <Loading label={t('common.loading')} />
          )}
        </Card>

        <Card
          tone={closestNeo && neoRisk(closestNeo) === 'high' ? 'magenta' : 'cyan'}
          title={t('home.neoTitle')}
          subtitle={closestNeo?.name}
          action={
            <Link to="/asteroids" className="btn-ghost text-xs">
              {t('home.viewAll')} →
            </Link>
          }
        >
          {neoQ.loading && <Loading />}
          {closestNeo && (
            <div className="space-y-2">
              <div className="flex flex-wrap gap-2">
                {closestNeo.isPotentiallyHazardous && <Badge tone="high">PHA</Badge>}
                <Badge tone={neoRisk(closestNeo)}>{t('home.skyStatus')}</Badge>
              </div>
              <div className="grid grid-cols-2 gap-2 data">
                <Stat
                  label={t('home.neoMissDistance')}
                  value={formatLD(closestNeo.closeApproach.missDistanceKm, language)}
                />
                <Stat
                  label={t('home.neoSize')}
                  value={formatDiameter(
                    (closestNeo.diameterKmMin + closestNeo.diameterKmMax) / 2,
                    language,
                  )}
                />
                <Stat
                  label={t('home.neoVelocity')}
                  value={formatVelocity(closestNeo.closeApproach.velocityKms, language)}
                />
                <Stat
                  label={t('common.updated')}
                  value={formatRelative(closestNeo.closeApproach.epochMs, language)}
                />
              </div>
            </div>
          )}
        </Card>

        <Card
          tone="magenta"
          title={t('home.fireballTitle')}
          subtitle={lastFireball ? formatDateTimeLocal(lastFireball.epochMs, language) : ''}
          action={
            <Link to="/fireballs" className="btn-ghost text-xs">
              {t('home.viewAll')} →
            </Link>
          }
        >
          {fbQ.loading && <Loading />}
          {lastFireball && (
            <div className="space-y-2">
              <Badge tone={fireballRisk(lastFireball)}>
                {formatEnergy(lastFireball.energyKt, language)}
              </Badge>
              <div className="grid grid-cols-2 gap-2 data">
                <Stat
                  label={t('home.fireballEnergy')}
                  value={formatEnergy(lastFireball.energyKt, language)}
                />
                <Stat
                  label="Lat / Lon"
                  value={`${formatNumber(lastFireball.lat, 1, language)}°, ${formatNumber(lastFireball.lon, 1, language)}°`}
                />
                {lastFireball.altitudeKm !== undefined && (
                  <Stat
                    label="Alt"
                    value={`${formatNumber(lastFireball.altitudeKm, 1, language)} km`}
                  />
                )}
                {lastFireball.velocityKms !== undefined && (
                  <Stat label="V" value={formatVelocity(lastFireball.velocityKms, language)} />
                )}
              </div>
            </div>
          )}
        </Card>

        <Card
          tone="cyan"
          title={t('home.showerTitle')}
          subtitle={
            showersNow[0]?.name?.[language] ??
            (showersNext[0]?.name?.[language] ?? t('home.showerNoActive'))
          }
          action={
            <Link to="/showers" className="btn-ghost text-xs">
              {t('home.viewAll')} →
            </Link>
          }
        >
          {showersNow[0] ? (
            <div className="data space-y-1">
              <div>
                <span className="label">ZHR</span> {showersNow[0].zhr}
              </div>
              <div>
                <span className="label">V</span> {showersNow[0].velocityKms} km/s
              </div>
              <div className="text-xs text-space-300">{showersNow[0].tip[language]}</div>
            </div>
          ) : showersNext[0] ? (
            <div className="text-sm text-space-300">
              {language === 'it' ? 'Prossimo:' : 'Next:'} {showersNext[0].name[language]} (
              {showersNext[0].peak})
            </div>
          ) : (
            <div className="text-sm text-space-300">{t('home.showerNoActive')}</div>
          )}
        </Card>

        <Card
          tone="magenta"
          title={t('home.reentryTitle')}
          subtitle={nextReentry?.tle.name}
          action={
            <Link to="/reentry" className="btn-ghost text-xs">
              {t('home.viewAll')} →
            </Link>
          }
        >
          {reentryQ.loading && <Loading />}
          {nextReentry ? (
            <div className="data space-y-1">
              <div>
                <span className="label">{t('reentry.remainingLifetime')}</span>{' '}
                {Number.isFinite(nextReentry.lifetime)
                  ? `${formatNumber(nextReentry.lifetime, 1, language)} ${t('reentry.lifetime.days')}`
                  : '—'}
              </div>
              <div className="text-xs text-space-300">{t('reentry.uncertainty')}</div>
            </div>
          ) : (
            !reentryQ.loading && (
              <div className="text-sm text-space-300">{t('reentry.noObjects')}</div>
            )
          )}
        </Card>

        <Card
          tone="cyan"
          title={t('home.sentryTitle')}
          action={
            <Link to="/asteroids" className="btn-ghost text-xs">
              {t('home.viewAll')} →
            </Link>
          }
        >
          {sentryQ.loading && <Loading />}
          {sentryTop && (
            <div className="data space-y-1">
              <div className="font-semibold text-space-50">{sentryTop.fullname}</div>
              <div>
                <span className="label">{t('asteroids.palermo')}</span>{' '}
                {sentryTop.palermo.toFixed(2)}
              </div>
              <div>
                <span className="label">{t('asteroids.ipMax')}</span>{' '}
                {(sentryTop.ipMax * 100).toExponential(2)}%
              </div>
            </div>
          )}
        </Card>
      </div>

      <a
        href={homeDeepLink()}
        target="_blank"
        rel="noreferrer"
        className="btn-primary inline-flex w-full justify-center md:w-auto"
      >
        🛰 {t('common.viewIn3d')} → CubeSat Constellation
      </a>
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
