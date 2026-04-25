import PageHeader from '@/components/common/PageHeader';
import { useTranslation } from '@/i18n';

export default function Tonight() {
  const { t } = useTranslation();
  return <PageHeader title={t('tonight.title')} subtitle={t('tonight.subtitle')} />;
}
