import { useTranslation } from '@/i18n';
import PageHeader from '@/components/common/PageHeader';
import Card from '@/components/common/Card';
import { useSettingsStore } from '@/store/settingsStore';
import { useNotifications } from '@/hooks/useNotifications';

const VERSION = '1.1.0';

export default function About() {
  const { t, language } = useTranslation();
  const notifEnabled = useSettingsStore((s) => s.notificationsEnabled);
  const setNotifEnabled = useSettingsStore((s) => s.setNotificationsEnabled);
  const threshold = useSettingsStore((s) => s.neoAlertThresholdLD);
  const setThreshold = useSettingsStore((s) => s.setNeoAlertThresholdLD);
  const { permission, request } = useNotifications();

  const toggleNotifications = async () => {
    if (!notifEnabled) {
      const result = await request();
      if (result === 'granted') setNotifEnabled(true);
    } else {
      setNotifEnabled(false);
    }
  };

  return (
    <div className="space-y-6">
      <PageHeader title={t('about.title')} subtitle={`${t('about.version')} ${VERSION}`} />

      <Card title="MeteorWatch">
        <p className="text-sm text-space-200">
          {language === 'it'
            ? "MeteorWatch è una PWA della serie PezzaliAPP, sister app di CubeSat Constellation. Aggrega dati pubblici NASA, JPL, ESA e CelesTrak per dare un quadro coerente — e divulgativo — di ciò che sta passando, cadendo o entrando nell'atmosfera."
            : 'MeteorWatch is a PezzaliAPP series PWA, sister app of CubeSat Constellation. It aggregates public NASA, JPL, ESA and CelesTrak data to provide a coherent — educational — overview of what is passing, falling or reentering near Earth.'}
        </p>
      </Card>

      <Card title={language === 'it' ? 'Notifiche' : 'Notifications'}>
        <div className="space-y-3 text-sm">
          <div className="flex items-center justify-between gap-3">
            <span>
              {language === 'it' ? 'Abilita notifiche browser' : 'Enable browser notifications'}
            </span>
            <button
              onClick={toggleNotifications}
              className={notifEnabled ? 'btn-primary' : 'btn-ghost'}
            >
              {notifEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
          <div className="text-xs text-space-300">
            {language === 'it' ? 'Permesso browser:' : 'Browser permission:'} {permission}
          </div>
          <label className="flex items-center justify-between gap-3">
            <span>
              {language === 'it' ? 'Soglia avviso NEO (LD)' : 'NEO alert threshold (LD)'}
            </span>
            <input
              type="number"
              min={0.1}
              step={0.5}
              value={threshold}
              onChange={(e) => setThreshold(parseFloat(e.target.value))}
              className="w-24 rounded-xl border border-space-500/40 bg-space-800/60 px-2 py-1 text-right text-sm font-mono"
            />
          </label>
        </div>
      </Card>

      <Card title={language === 'it' ? 'Sister app' : 'Sister app'}>
        <p className="text-sm text-space-200">
          <a
            className="text-cyan-glow hover:underline"
            href="https://github.com/pezzaliapp/CubeSat_Constellation"
            target="_blank"
            rel="noreferrer"
          >
            CubeSat Constellation ↗
          </a>{' '}
          —{' '}
          {language === 'it'
            ? "visualizzazione 3D di costellazioni satellitari e oggetti orbitali."
            : '3D visualization of satellite constellations and orbital objects.'}
        </p>
      </Card>

      <Card title={language === 'it' ? 'Crediti' : 'Credits'}>
        <ul className="space-y-1 text-sm text-space-200">
          <li>• NASA / JPL — NeoWs, CNEOS Sentry, Fireball, CAD APIs</li>
          <li>• ESA NEO Coordination Centre</li>
          <li>• CelesTrak — Two-Line Element data</li>
          <li>• wheretheiss.at — ISS live position</li>
          <li>• International Meteor Organization — Meteor calendar</li>
          <li>• Meteoritical Bulletin Database</li>
          <li>• OpenStreetMap contributors</li>
        </ul>
      </Card>

      <Card title="Author">
        <p className="text-sm text-space-200">
          PezzaliAPP — Alessandro Pezzali ·{' '}
          <a className="text-cyan-glow hover:underline" href="https://www.pezzaliapp.com" target="_blank" rel="noreferrer">
            pezzaliapp.com ↗
          </a>
        </p>
      </Card>
    </div>
  );
}
