import PageHeader from '@/components/common/PageHeader';
import { useTranslation } from '@/i18n';

export default function Reentry() {
  const { t } = useTranslation();
  return <PageHeader title={t('reentry.title')} subtitle={t('reentry.subtitle')} />;
}
