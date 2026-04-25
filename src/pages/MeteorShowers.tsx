import { useMemo } from 'react';
import { useTranslation } from '@/i18n';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import {
  METEOR_SHOWERS,
  activeShowers,
  upcomingShowers,
  isShowerActive,
  daysToPeak,
  type MeteorShower,
} from '@/services/meteorShowersData';
import MeteorShowerTimeline from '@/components/charts/MeteorShowerTimeline';

export default function MeteorShowers() {
  const { t, language } = useTranslation();
  const now = new Date();
  const active = activeShowers(now);
  const next = upcomingShowers(now);

  const sorted = useMemo(
    () =>
      [...METEOR_SHOWERS].sort((a, b) => {
        const ai = a.peak.localeCompare(b.peak);
        return ai;
      }),
    [],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('showers.title')}
        subtitle={t('showers.subtitle')}
        source={`${t('common.source')}: IMO Meteor Calendar`}
      />

      {active.length > 0 && (
        <Card tone="cyan" title={t('showers.active')}>
          <div className="grid gap-3 md:grid-cols-2">
            {active.map((s) => (
              <ShowerCard key={s.code} shower={s} active />
            ))}
          </div>
        </Card>
      )}

      <Card title={t('showers.upcoming')}>
        <div className="grid gap-3 md:grid-cols-2">
          {next.slice(0, 4).map((s) => (
            <ShowerCard key={s.code} shower={s} />
          ))}
        </div>
      </Card>

      <Card title={t('showers.calendar')}>
        <MeteorShowerTimeline showers={sorted} now={now} language={language} />
      </Card>
    </div>
  );
}

function ShowerCard({ shower, active }: { shower: MeteorShower; active?: boolean }) {
  const { language, t } = useTranslation();
  const days = daysToPeak(shower);
  const peakLabel =
    days === 0
      ? language === 'it'
        ? 'oggi'
        : 'today'
      : days > 0
        ? language === 'it'
          ? `tra ${days} giorni`
          : `in ${days} days`
        : language === 'it'
          ? `${Math.abs(days)} giorni fa`
          : `${Math.abs(days)} days ago`;
  return (
    <div className="glass p-3">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-semibold text-space-50">{shower.name[language]}</h3>
        <Badge tone={active ? 'low' : 'info'}>{shower.code}</Badge>
        {isShowerActive(shower) && <Badge tone="low">{t('showers.active').split(' ')[0]}</Badge>}
      </div>
      <div className="mt-2 grid grid-cols-2 gap-2 text-xs font-mono">
        <Stat label={t('showers.peak')} value={`${shower.peak} (${peakLabel})`} />
        <Stat label={t('showers.zhr')} value={String(shower.zhr)} />
        <Stat label={t('showers.velocity')} value={`${shower.velocityKms} km/s`} />
        <Stat
          label={t('showers.parent')}
          value={shower.parent ?? '—'}
        />
      </div>
      <p className="mt-2 text-xs text-space-300">
        <span className="label">{t('showers.tip')}: </span>
        {shower.tip[language]}
      </p>
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
