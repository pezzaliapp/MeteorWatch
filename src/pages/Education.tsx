import PageHeader from '@/components/common/PageHeader';
import { useTranslation } from '@/i18n';

export default function Education() {
  const { t } = useTranslation();
  return <PageHeader title={t('education.title')} subtitle={t('education.subtitle')} />;
}
