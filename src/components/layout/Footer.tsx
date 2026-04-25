import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n';

export default function Footer() {
  const { t } = useTranslation();
  return (
    <footer className="border-t border-space-500/30 bg-space-900/60 px-4 py-6 text-sm text-space-300 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="font-semibold text-space-50">PezzaliAPP — MeteorWatch</div>
          <div className="text-xs text-space-300">{t('footer.disclaimer')}</div>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-xs">
          <Link to="/about" className="hover:text-cyan-glow">
            {t('footer.about')}
          </Link>
          <a
            className="hover:text-cyan-glow"
            href="https://github.com/pezzaliapp/CubeSat_Constellation"
            target="_blank"
            rel="noreferrer"
          >
            CubeSat Constellation ↗
          </a>
          <a
            className="hover:text-cyan-glow"
            href="https://www.pezzaliapp.com"
            target="_blank"
            rel="noreferrer"
          >
            pezzaliapp.com ↗
          </a>
          <a
            className="hover:text-cyan-glow"
            href="https://github.com/pezzaliapp/MeteorWatch"
            target="_blank"
            rel="noreferrer"
          >
            GitHub ↗
          </a>
        </div>
      </div>
    </footer>
  );
}
