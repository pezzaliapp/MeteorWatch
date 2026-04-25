import PageHeader from '@/components/common/PageHeader';
import { useTranslation } from '@/i18n';

export default function Apod() {
  const { t } = useTranslation();
  return <PageHeader title={t('apod.title')} subtitle={t('apod.subtitle')} />;
}
