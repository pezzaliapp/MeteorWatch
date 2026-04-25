import { Link } from 'react-router-dom';
import { useTranslation } from '@/i18n';
import { useSettingsStore } from '@/store/settingsStore';
import OnlineBadge from './OnlineBadge';

export default function Header() {
  const { t } = useTranslation();
  const language = useSettingsStore((s) => s.language);
  const setLanguage = useSettingsStore((s) => s.setLanguage);

  return (
    <header className="safe-top sticky top-0 z-30 border-b border-space-500/30 bg-space-900/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 group">
          <span className="grid h-9 w-9 place-items-center rounded-xl bg-cyan-glow/15 text-cyan-glow shadow-glow group-hover:scale-110 transition-transform">
            <svg viewBox="0 0 24 24" className="h-5 w-5" fill="currentColor" aria-hidden>
              <path d="M3 21 13 9l2 2L5 23l-2-2Zm10-10a4 4 0 1 1 0-8 4 4 0 0 1 0 8Zm6.5-1.5L21 11l1.5-1.5L21 8l-1.5 1.5ZM18 4l1 1 1-1-1-1-1 1Z" />
            </svg>
          </span>
          <div className="leading-tight">
            <div className="font-semibold tracking-wide">MeteorWatch</div>
            <div className="label text-space-300">{t('common.tagline')}</div>
          </div>
        </Link>

        <div className="flex items-center gap-2">
          <OnlineBadge />
          <button
            type="button"
            className="btn-ghost px-2 py-1 text-xs font-mono uppercase tracking-wider"
            onClick={() => setLanguage(language === 'it' ? 'en' : 'it')}
            aria-label="Switch language"
          >
            {language === 'it' ? 'EN' : 'IT'}
          </button>
        </div>
      </div>
    </header>
  );
}
