import PageHeader from '@/components/common/PageHeader';
import { useTranslation } from '@/i18n';

export default function EarthLive() {
  const { t } = useTranslation();
  return <PageHeader title={t('earth.title')} subtitle={t('earth.subtitle')} />;
}
