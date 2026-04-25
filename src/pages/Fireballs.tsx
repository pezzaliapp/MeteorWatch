import { useMemo, useState } from 'react';
import { useTranslation } from '@/i18n';
import PageHeader from '@/components/common/PageHeader';
import Loading from '@/components/common/Loading';
import Empty from '@/components/common/Empty';
import Card from '@/components/common/Card';
import Badge from '@/components/common/Badge';
import { useAsync } from '@/hooks/useNasaApi';
import { fetchFireballs } from '@/services/cneosFireballApi';
import { fireballRisk } from '@/lib/riskCalculator';
import {
  formatEnergy,
  formatDateTimeLocal,
  formatNumber,
  formatVelocity,
} from '@/utils/formatters';
import FireballMap from '@/components/maps/FireballMap';

export default function Fireballs() {
  const { t, language } = useTranslation();
  const [year, setYear] = useState<string>('all');
  const [minEnergy, setMinEnergy] = useState<number>(0);
  const fbQ = useAsync(() => fetchFireballs(500), []);

  const years = useMemo(() => {
    const set = new Set<string>();
    (fbQ.data ?? []).forEach((f) => set.add(f.date.slice(0, 4)));
    return Array.from(set).sort().reverse();
  }, [fbQ.data]);

  const filtered = useMemo(
    () =>
      (fbQ.data ?? []).filter((f) => {
        if (year !== 'all' && !f.date.startsWith(year)) return false;
        if (minEnergy > 0 && f.energyKt < minEnergy) return false;
        return true;
      }),
    [fbQ.data, year, minEnergy],
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('fireballs.title')}
        subtitle={t('fireballs.subtitle')}
        source={`${t('common.source')}: NASA / JPL CNEOS Fireball DB`}
      />

      <div className="glass flex flex-wrap items-center gap-3 p-3 text-sm">
        <label className="flex items-center gap-2">
          <span className="label">{t('fireballs.filterYear')}</span>
          <select
            className="rounded-xl border border-space-500/40 bg-space-800/60 px-2 py-1 text-xs"
            value={year}
            onChange={(e) => setYear(e.target.value)}
          >
            <option value="all">{t('asteroids.filterAll')}</option>
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          <span className="label">{t('fireballs.filterEnergy')}</span>
          <input
            type="range"
            min={0}
            max={50}
            step={0.5}
            value={minEnergy}
            onChange={(e) => setMinEnergy(parseFloat(e.target.value))}
            className="w-40 accent-cyan-glow"
          />
          <span className="data text-xs">{minEnergy.toFixed(1)}</span>
        </label>
      </div>

      {fbQ.loading && <Loading />}
      {!fbQ.loading && filtered.length === 0 && <Empty title={t('common.noData')} />}

      {filtered.length > 0 && <FireballMap events={filtered} />}

      <Card title={t('fireballs.title')} subtitle={`${filtered.length} ${language === 'it' ? 'eventi' : 'events'}`}>
        <ul className="divide-y divide-space-500/20">
          {filtered.slice(0, 80).map((fb, i) => (
            <li key={`${fb.epochMs}-${i}`} className="flex flex-wrap items-center gap-3 py-2 text-xs">
              <Badge tone={fireballRisk(fb)}>{formatEnergy(fb.energyKt, language)}</Badge>
              <span className="font-mono">{formatDateTimeLocal(fb.epochMs, language)}</span>
              <span className="font-mono">
                {formatNumber(fb.lat, 2, language)}°, {formatNumber(fb.lon, 2, language)}°
              </span>
              {fb.altitudeKm !== undefined && (
                <span className="font-mono">
                  {t('fireballs.altitude')}: {formatNumber(fb.altitudeKm, 1, language)} km
                </span>
              )}
              {fb.velocityKms !== undefined && (
                <span className="font-mono">{formatVelocity(fb.velocityKms, language)}</span>
              )}
            </li>
          ))}
        </ul>
      </Card>

      <Card title={language === 'it' ? "Come si misura l'energia" : 'How energy is measured'}>
        <p className="text-sm text-space-200">{t('fireballs.edu')}</p>
      </Card>
    </div>
  );
}
