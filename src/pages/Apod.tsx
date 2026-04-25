import { useEffect } from 'react';
import { useTranslation } from '@/i18n';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/common/Card';
import Loading from '@/components/common/Loading';
import { useAsync } from '@/hooks/useNasaApi';
import { fetchApodToday, fetchApodLastDays, type ApodItem } from '@/services/apodApi';
import { formatDateLocal } from '@/utils/formatters';

export default function Apod() {
  const { t, language } = useTranslation();
  const todayQ = useAsync(() => fetchApodToday(), []);
  const archiveQ = useAsync(() => fetchApodLastDays(7), []);

  useEffect(() => {
    document.title = 'MeteorWatch — APOD';
  }, []);

  return (
    <div className="space-y-6">
      <PageHeader
        title={t('apod.title')}
        subtitle={t('apod.subtitle')}
        source={`${t('common.source')}: NASA / api.nasa.gov/planetary/apod`}
      />

      {todayQ.loading && <Loading />}
      {todayQ.data && <ApodFeature item={todayQ.data} />}

      {archiveQ.data && archiveQ.data.length > 1 && (
        <section className="space-y-3">
          <h2 className="label">7 {language === 'it' ? 'giorni' : 'days'}</h2>
          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {archiveQ.data.slice(1).map((item) => (
              <ApodThumb key={item.date} item={item} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function ApodFeature({ item }: { item: ApodItem }) {
  const { t, language } = useTranslation();
  return (
    <Card
      tone="cyan"
      title={item.title}
      subtitle={formatDateLocal(item.date, language)}
      action={
        <a
          className="btn-ghost text-xs"
          href={`https://apod.nasa.gov/apod/ap${item.date.slice(2).replace(/-/g, '')}.html`}
          target="_blank"
          rel="noreferrer"
        >
          NASA ↗
        </a>
      }
    >
      <ApodMedia item={item} />
      <p className="mt-3 text-sm leading-relaxed text-space-200">{item.explanation}</p>
      {item.copyright && (
        <p className="mt-2 text-[11px] text-space-300">
          © {item.copyright} ({t('apod.copyright')})
        </p>
      )}
    </Card>
  );
}

function ApodMedia({ item }: { item: ApodItem }) {
  const { t } = useTranslation();
  if (item.mediaType === 'image') {
    return (
      <a href={item.hdurl ?? item.url} target="_blank" rel="noreferrer" className="block">
        <img
          src={item.url}
          alt={item.title}
          loading="lazy"
          className="h-auto w-full rounded-xl border border-space-500/30"
        />
      </a>
    );
  }
  if (item.mediaType === 'video') {
    return (
      <div className="aspect-video w-full overflow-hidden rounded-xl border border-space-500/30">
        <iframe
          title={item.title}
          src={item.url}
          allow="encrypted-media; picture-in-picture; fullscreen"
          loading="lazy"
          className="h-full w-full"
        />
      </div>
    );
  }
  return (
    <div className="rounded-xl border border-space-500/30 p-4 text-sm text-space-300">
      {t('apod.videoNote')}{' '}
      <a className="text-cyan-glow underline" href={item.url} target="_blank" rel="noreferrer">
        {t('apod.openOriginal')} ↗
      </a>
    </div>
  );
}

function ApodThumb({ item }: { item: ApodItem }) {
  const { language } = useTranslation();
  return (
    <a
      href={`https://apod.nasa.gov/apod/ap${item.date.slice(2).replace(/-/g, '')}.html`}
      target="_blank"
      rel="noreferrer"
      className="glass block overflow-hidden p-0 transition-shadow hover:shadow-glow"
    >
      {item.mediaType === 'image' ? (
        <img
          src={item.url}
          alt={item.title}
          loading="lazy"
          className="aspect-video w-full object-cover"
        />
      ) : (
        <div className="grid aspect-video w-full place-items-center bg-space-800 text-magenta-glow">
          ▶ video
        </div>
      )}
      <div className="p-3">
        <div className="text-xs text-space-300">{formatDateLocal(item.date, language)}</div>
        <div className="font-semibold leading-snug">{item.title}</div>
      </div>
    </a>
  );
}
