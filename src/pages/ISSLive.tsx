import PageHeader from '@/components/common/PageHeader';
import { useTranslation } from '@/i18n';

export default function ISSLive() {
  const { t } = useTranslation();
  return <PageHeader title={t('iss.title')} subtitle={t('iss.subtitle')} />;
}
