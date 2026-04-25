import PageHeader from '@/components/common/PageHeader';
import { useTranslation } from '@/i18n';

export default function Meteorites() {
  const { t } = useTranslation();
  return <PageHeader title={t('meteorites.title')} subtitle={t('meteorites.subtitle')} />;
}
