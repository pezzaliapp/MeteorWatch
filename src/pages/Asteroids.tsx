import PageHeader from '@/components/common/PageHeader';
import { useTranslation } from '@/i18n';

export default function Asteroids() {
  const { t } = useTranslation();
  return <PageHeader title={t('asteroids.title')} subtitle={t('asteroids.subtitle')} />;
}
