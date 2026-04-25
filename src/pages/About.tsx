import PageHeader from '@/components/common/PageHeader';
import { useTranslation } from '@/i18n';

export default function About() {
  const { t } = useTranslation();
  return <PageHeader title={t('about.title')} />;
}
