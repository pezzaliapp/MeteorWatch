import { useMemo, useState } from 'react';
import { useTranslation } from '@/i18n';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import Loading from '@/components/common/Loading';
import Empty from '@/components/common/Empty';
import RiskIndicator from '@/components/common/RiskIndicator';
import ShareButton from '@/components/common/ShareButton';
import { useAsync } from '@/hooks/useNasaApi';
import { fetchNeoFeed, type NeoObject } from '@/services/nasaNeoApi';
import { fetchSentryTop, type SentryObject } from '@/services/cneosSentryApi';
import { neoRisk } from '@/lib/riskCalculator';
import { LD_KM } from '@/utils/units';
import {
  formatLD,
  formatDiameter,
  formatVelocity,
  formatDateTimeLocal,
  formatNumber,
} from '@/utils/formatters';
import NeoOrbitSvg from '@/components/charts/NeoOrbitSvg';

type Tab = 'feed' | 'sentry';
type Filter = 'all' | 'pha' | 'close' | 'big';
type Sort = 'date' | 'distance' | 'size' | 'hazardous';

export default function Asteroids() {
  const { t, language } = useTranslation();
  const [tab, setTab] = useState<Tab>('feed');
  const [filter, setFilter] = useState<Filter>('all');
  const [sort, setSort] = useState<Sort>('date');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<NeoObject | null>(null);

  const feedQ = useAsync(() => fetchNeoFeed(7), []);
  const sentryQ = useAsync(() => fetchSentryTop(15), []);

  const filtered = useMemo(() => {
    const data = feedQ.data ?? [];
    const q = search.trim().toLowerCase();
    return data
      .filter((n) => {
        if (q && !n.name.toLowerCase().includes(q)) return false;
        if (filter === 'pha') return n.isPotentiallyHazardous;
        if (filter === 'close') return n.closeApproach.missDistanceKm <= LD_KM;
        if (filter === 'big') return (n.diameterKmMin + n.diameterKmMax) / 2 >= 0.1;
        return true;
      })
      .sort((a, b) => {
        if (sort === 'distance') return a.closeApproach.missDistanceKm - b.closeApproach.missDistanceKm;
        if (sort === 'size')
          return (
            (b.diameterKmMin + b.diameterKmMax) / 2 - (a.diameterKmMin + a.diameterKmMax) / 2
          );
        if (sort === 'hazardous') return Number(b.isPotentiallyHazardous) - Number(a.isPotentiallyHazardous);
        return a.closeApproach.epochMs - b.closeApproach.epochMs;
      });
  }, [feedQ.data, filter, sort, search]);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('asteroids.title')}
        subtitle={t('asteroids.subtitle')}
        source={`${t('common.source')}: NASA NeoWs / CNEOS Sentry`}
      />

      <div className="flex flex-wrap gap-2">
        <button
          className={tab === 'feed' ? 'btn-primary' : 'btn-ghost'}
          onClick={() => setTab('feed')}
        >
          {t('asteroids.feedTab')}
        </button>
        <button
          className={tab === 'sentry' ? 'btn-primary' : 'btn-ghost'}
          onClick={() => setTab('sentry')}
        >
          {t('asteroids.sentryTab')}
        </button>
      </div>

      {tab === 'feed' && (
        <>
          <div className="glass flex flex-wrap items-center gap-2 p-2">
            <span className="text-space-300" aria-hidden>🔍</span>
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder={language === 'it' ? 'Cerca per nome…' : 'Search by name…'}
              aria-label={language === 'it' ? 'Cerca asteroidi' : 'Search asteroids'}
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-space-300"
            />
            {search && (
              <button onClick={() => setSearch('')} className="btn-ghost text-xs" aria-label="Clear">
                ✕
              </button>
            )}
          </div>

          <div className="flex flex-wrap gap-2 text-xs">
            <FilterBtn active={filter === 'all'} onClick={() => setFilter('all')}>
              {t('asteroids.filterAll')}
            </FilterBtn>
            <FilterBtn active={filter === 'pha'} onClick={() => setFilter('pha')}>
              {t('asteroids.filterPha')}
            </FilterBtn>
            <FilterBtn active={filter === 'close'} onClick={() => setFilter('close')}>
              {t('asteroids.filterClose')}
            </FilterBtn>
            <FilterBtn active={filter === 'big'} onClick={() => setFilter('big')}>
              {t('asteroids.filterBig')}
            </FilterBtn>
            <span className="ml-auto" />
            <select
              className="rounded-xl border border-space-500/40 bg-space-800/60 px-3 py-1.5 text-xs"
              value={sort}
              onChange={(e) => setSort(e.target.value as Sort)}
            >
              <option value="date">{t('asteroids.sortDate')}</option>
              <option value="distance">{t('asteroids.sortDistance')}</option>
              <option value="size">{t('asteroids.sortSize')}</option>
              <option value="hazardous">{t('asteroids.sortHazardous')}</option>
            </select>
          </div>

          {feedQ.loading && <Loading />}
          {feedQ.error && (
            <div className="text-sm text-risk-high">{t('common.error')}: {feedQ.error.message}</div>
          )}

          {!feedQ.loading && filtered.length === 0 && <Empty title={t('asteroids.noResults')} />}

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {filtered.map((neo) => (
              <button
                key={neo.id}
                onClick={() => setSelected(neo)}
                className="text-left"
                aria-label={`Open ${neo.name}`}
              >
                <Card
                  tone={neo.isPotentiallyHazardous ? 'magenta' : 'default'}
                  title={
                    <span className="flex items-center gap-2">
                      <RiskIndicator level={neoRisk(neo)} />
                      {neo.name}
                    </span>
                  }
                  subtitle={formatDateTimeLocal(neo.closeApproach.epochMs, language)}
                >
                  <div className="grid grid-cols-2 gap-2 data text-xs">
                    <Stat label={t('asteroids.missDistance')} value={formatLD(neo.closeApproach.missDistanceKm, language)} />
                    <Stat
                      label={t('asteroids.diameter')}
                      value={formatDiameter((neo.diameterKmMin + neo.diameterKmMax) / 2, language)}
                    />
                    <Stat label={t('asteroids.velocity')} value={formatVelocity(neo.closeApproach.velocityKms, language)} />
                    <div className="flex items-end justify-end">
                      {neo.isPotentiallyHazardous && <Badge tone="high">PHA</Badge>}
                      {neo.isSentry && <Badge tone="magenta">Sentry</Badge>}
                    </div>
                  </div>
                </Card>
              </button>
            ))}
          </div>
        </>
      )}

      {tab === 'sentry' && (
        <>
          {sentryQ.loading && <Loading />}
          <div className="grid gap-3 md:grid-cols-2">
            {(sentryQ.data ?? []).map((s) => (
              <SentryCard key={s.designation} item={s} language={language} t={t} />
            ))}
          </div>
        </>
      )}

      {selected && <NeoDetailModal neo={selected} onClose={() => setSelected(null)} />}
    </div>
  );
}

function FilterBtn({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button onClick={onClick} className={active ? 'btn-primary' : 'btn-ghost'}>
      {children}
    </button>
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

function SentryCard({
  item,
  language,
  t,
}: {
  item: SentryObject;
  language: 'it' | 'en';
  t: (k: string) => string;
}) {
  return (
    <Card
      tone={item.palermo > -2 ? 'magenta' : 'default'}
      title={item.fullname}
      subtitle={
        item.yearRangeStart && item.yearRangeEnd
          ? `${item.yearRangeStart} – ${item.yearRangeEnd}`
          : ''
      }
      action={
        <a className="btn-ghost text-xs" href={item.url} target="_blank" rel="noreferrer">
          JPL ↗
        </a>
      }
    >
      <div className="grid grid-cols-2 gap-2 data text-xs">
        <Stat label={t('asteroids.palermo')} value={item.palermo.toFixed(2)} />
        <Stat label={t('asteroids.torino')} value={item.torino.toFixed(0)} />
        <Stat label={t('asteroids.ipMax')} value={item.ipMax.toExponential(2)} />
        {item.diameterKm !== undefined && (
          <Stat label={t('asteroids.diameter')} value={formatDiameter(item.diameterKm, language)} />
        )}
      </div>
    </Card>
  );
}

function NeoDetailModal({ neo, onClose }: { neo: NeoObject; onClose: () => void }) {
  const { t, language } = useTranslation();
  return (
    <div
      className="fixed inset-0 z-40 flex items-center justify-center bg-space-900/80 p-4 backdrop-blur"
      onClick={onClose}
    >
      <div
        className="glass-strong w-full max-w-lg space-y-4 p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <header className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold">{neo.name}</h2>
            <p className="text-xs text-space-300">
              H = {formatNumber(neo.absoluteMagnitude, 2, language)}
            </p>
          </div>
          <button className="btn-ghost text-xs" onClick={onClose}>
            ✕
          </button>
        </header>

        <div className="flex justify-center">
          <NeoOrbitSvg neo={neo} />
        </div>

        <div className="grid grid-cols-2 gap-2 data text-sm">
          <Stat
            label={t('asteroids.missDistance')}
            value={formatLD(neo.closeApproach.missDistanceKm, language)}
          />
          <Stat
            label={t('asteroids.diameter')}
            value={formatDiameter((neo.diameterKmMin + neo.diameterKmMax) / 2, language)}
          />
          <Stat
            label={t('asteroids.velocity')}
            value={formatVelocity(neo.closeApproach.velocityKms, language)}
          />
          <Stat
            label={t('asteroids.approach')}
            value={formatDateTimeLocal(neo.closeApproach.epochMs, language)}
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {neo.isPotentiallyHazardous && <Badge tone="high">PHA</Badge>}
          {neo.isSentry && <Badge tone="magenta">Sentry</Badge>}
        </div>

        <div className="flex flex-wrap gap-2">
          <a
            className="btn-primary flex-1"
            href={neo.nasaJplUrl}
            target="_blank"
            rel="noreferrer"
          >
            NASA JPL Small-Body ↗
          </a>
          <ShareButton
            title={`MeteorWatch — ${neo.name}`}
            text={`${neo.name} passa a ${(neo.closeApproach.missDistanceKm / 384400).toFixed(2)} LD il ${new Date(neo.closeApproach.epochMs).toLocaleDateString()}`}
            url={neo.nasaJplUrl}
          />
        </div>
      </div>
    </div>
  );
}
