import PageHeader from '@/components/common/PageHeader';
import { useTranslation } from '@/i18n';

export default function Fireballs() {
  const { t } = useTranslation();
  return <PageHeader title={t('fireballs.title')} subtitle={t('fireballs.subtitle')} />;
}
