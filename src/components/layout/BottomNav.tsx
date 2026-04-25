import { NavLink } from 'react-router-dom';
import { useTranslation } from '@/i18n';
import { type ReactNode } from 'react';

const items: { path: string; key: string; icon: ReactNode }[] = [
  {
    path: '/',
    key: 'nav.home',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M3 12 12 4l9 8" />
        <path d="M5 10v10h14V10" />
      </svg>
    ),
  },
  {
    path: '/tonight',
    key: 'nav.tonight',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 12.8A9 9 0 1 1 11.2 3a7 7 0 0 0 9.8 9.8Z" />
      </svg>
    ),
  },
  {
    path: '/asteroids',
    key: 'nav.asteroids',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="6" />
        <circle cx="6" cy="6" r="1" fill="currentColor" />
        <circle cx="18" cy="18" r="1" fill="currentColor" />
      </svg>
    ),
  },
  {
    path: '/fireballs',
    key: 'nav.fireballs',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 13c0-3 3-5 7-5 3 0 5 2 5 5s-2 5-5 5c-1 0-2-.3-3-.9" />
        <path d="M5 13l-3 3M8 16l-3 3M11 18l-2 2" />
      </svg>
    ),
  },
  {
    path: '/showers',
    key: 'nav.showers',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M5 4l-2 6M11 4l-2 6M17 4l-2 6M5 14l-2 6M11 14l-2 6M17 14l-2 6" />
      </svg>
    ),
  },
  {
    path: '/iss',
    key: 'nav.iss',
    icon: (
      <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2">
        <circle cx="12" cy="12" r="3" />
        <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(20 12 12)" />
      </svg>
    ),
  },
];

export default function BottomNav() {
  const { t } = useTranslation();
  return (
    <nav className="safe-bottom fixed bottom-0 left-0 right-0 z-30 border-t border-space-500/30 bg-space-900/85 backdrop-blur-md md:hidden">
      <div className="mx-auto grid max-w-6xl grid-cols-6">
        {items.map((it) => (
          <NavLink
            key={it.path}
            to={it.path}
            end={it.path === '/'}
            className={({ isActive }) =>
              `flex flex-col items-center gap-1 px-2 py-2 text-[10px] font-mono uppercase tracking-wider ${
                isActive ? 'text-cyan-glow' : 'text-space-300'
              }`
            }
          >
            {it.icon}
            <span>{t(it.key)}</span>
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
