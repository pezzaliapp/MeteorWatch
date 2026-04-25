import PageHeader from '@/components/common/PageHeader';
import { useTranslation } from '@/i18n';

export default function MeteorShowers() {
  const { t } = useTranslation();
  return <PageHeader title={t('showers.title')} subtitle={t('showers.subtitle')} />;
}
