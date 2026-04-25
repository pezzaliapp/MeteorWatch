import { useMemo, useState } from 'react';
import { useTranslation } from '@/i18n';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/common/Card';
import Loading from '@/components/common/Loading';
import Empty from '@/components/common/Empty';
import Badge from '@/components/common/Badge';
import { useAsync } from '@/hooks/useNasaApi';
import { fetchReentryGroup } from '@/services/celestrakApi';
import {
  estimateRemainingLifetimeDays,
  groundTrack,
  propagate,
  getMeanMotion,
} from '@/lib/sgp4Lite';
import { tleToDeepLink } from '@/lib/deepLinkBuilder';
import { formatNumber } from '@/utils/formatters';
import ReentryMap from '@/components/maps/ReentryMap';
import type { TleSet } from '@/types';

interface Candidate {
  tle: TleSet;
  altKm: number;
  lifetimeDays: number;
  meanMotion: number;
}

export default function Reentry() {
  const { t, language } = useTranslation();
  const tleQ = useAsync(() => fetchReentryGroup(), []);
  const [selected, setSelected] = useState<TleSet | null>(null);

  const candidates = useMemo<Candidate[]>(() => {
    return (tleQ.data ?? [])
      .map((tle) => {
        const p = propagate(tle);
        const lifetime = estimateRemainingLifetimeDays(tle);
        return {
          tle,
          altKm: p?.altKm ?? Number.POSITIVE_INFINITY,
          lifetimeDays: lifetime,
          meanMotion: getMeanMotion(tle),
        };
      })
      .filter((c) => c.altKm < 600 && c.lifetimeDays < 60)
      .sort((a, b) => a.lifetimeDays - b.lifetimeDays)
      .slice(0, 30);
  }, [tleQ.data]);

  const trackForSelected = useMemo(() => {
    if (!selected) return [];
    const now = Date.now();
    return groundTrack(selected, now, now + 90 * 60 * 1000, 30);
  }, [selected]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('reentry.title')}
        subtitle={t('reentry.subtitle')}
        source={`${t('common.source')}: CelesTrak GP (last-30-days)`}
      />

      <div className="text-xs text-space-300">⚠️ {t('reentry.uncertainty')}</div>

      {tleQ.loading && <Loading />}
      {!tleQ.loading && candidates.length === 0 && <Empty title={t('reentry.noObjects')} />}

      <div className="grid gap-3 md:grid-cols-2">
        {candidates.map((c) => (
          <button
            key={c.tle.name}
            onClick={() => setSelected(c.tle)}
            className="text-left"
            aria-label={`Open ${c.tle.name}`}
          >
            <Card
              tone={c.lifetimeDays < 7 ? 'magenta' : 'default'}
              title={c.tle.name}
              subtitle={`${formatNumber(c.altKm, 1, language)} km`}
            >
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <Stat
                  label={t('reentry.remainingLifetime')}
                  value={
                    Number.isFinite(c.lifetimeDays)
                      ? `${formatNumber(c.lifetimeDays, 1, language)} ${t('reentry.lifetime.days')}`
                      : '—'
                  }
                />
                <Stat label="rev/day" value={formatNumber(c.meanMotion, 2, language)} />
                <Stat label={t('reentry.altitude')} value={`${formatNumber(c.altKm, 1, language)} km`} />
                <div className="flex items-end justify-end">
                  {c.lifetimeDays < 3 && <Badge tone="high">imminent</Badge>}
                  {c.lifetimeDays >= 3 && c.lifetimeDays < 14 && <Badge tone="mid">soon</Badge>}
                  {c.lifetimeDays >= 14 && <Badge tone="info">monitored</Badge>}
                </div>
              </div>
            </Card>
          </button>
        ))}
      </div>

      {selected && (
        <Card
          title={selected.name}
          subtitle="Ground track ~90 min"
          action={
            <a
              className="btn-primary text-xs"
              href={tleToDeepLink(selected)}
              target="_blank"
              rel="noreferrer"
            >
              🛰 {t('common.viewIn3d')} →
            </a>
          }
        >
          <ReentryMap groundTrack={trackForSelected} />
          <pre className="mt-3 overflow-x-auto rounded-lg bg-space-900/60 p-3 text-[10px] text-space-200">
            {selected.line1}
            {'\n'}
            {selected.line2}
          </pre>
        </Card>
      )}
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <div className="label">{label}</div>
      <div>{value}</div>
    </div>
  );
}
