import { fetchNeoFeed } from '@/services/nasaNeoApi';
import { fetchFireballs } from '@/services/cneosFireballApi';
import { fetchISSTle } from '@/services/celestrakApi';
import { predictPasses } from '@/lib/passPredictor';
import { useSettingsStore } from '@/store/settingsStore';
import { useUserLocationStore } from '@/store/userLocationStore';
import { LD_KM } from '@/utils/units';

const NOTIF_LOG_KEY = 'meteorwatch:notif:log';

interface NotifLog {
  [eventId: string]: number; // last fired ms
}

function loadLog(): NotifLog {
  try {
    return JSON.parse(localStorage.getItem(NOTIF_LOG_KEY) ?? '{}') as NotifLog;
  } catch {
    return {};
  }
}

function saveLog(log: NotifLog) {
  try {
    localStorage.setItem(NOTIF_LOG_KEY, JSON.stringify(log));
  } catch {
    /* ignore */
  }
}

function fire(title: string, body: string, eventId: string) {
  if (typeof Notification === 'undefined' || Notification.permission !== 'granted') return;
  const log = loadLog();
  if (log[eventId] && Date.now() - log[eventId] < 1000 * 60 * 60 * 12) return;
  try {
    new Notification(title, {
      body,
      icon: '/MeteorWatch/icons/icon-192.png',
      tag: eventId,
    });
    log[eventId] = Date.now();
    saveLog(log);
  } catch {
    /* ignore */
  }
}

export async function checkAlerts(): Promise<void> {
  const settings = useSettingsStore.getState();
  if (!settings.notificationsEnabled) return;
  const observer = useUserLocationStore.getState().location;

  // 1) NEO threshold alert
  try {
    const neos = await fetchNeoFeed(7);
    const closest = neos.find(
      (n) => n.closeApproach.missDistanceKm <= settings.neoAlertThresholdLD * LD_KM,
    );
    if (closest) {
      const ld = closest.closeApproach.missDistanceKm / LD_KM;
      fire(
        `NEO ravvicinato: ${closest.name}`,
        `Distanza ${ld.toFixed(2)} LD · ${new Date(closest.closeApproach.epochMs).toLocaleString()}`,
        `neo:${closest.id}`,
      );
    }
  } catch {
    /* ignore */
  }

  // 2) Significant fireball (last 7 days, ≥ 1 kt)
  try {
    const fb = await fetchFireballs(50);
    const recent = fb.find(
      (f) => f.energyKt >= 1 && Date.now() - f.epochMs < 1000 * 60 * 60 * 24 * 7,
    );
    if (recent) {
      fire(
        'Bolide significativo registrato',
        `${recent.energyKt.toFixed(1)} kt · ${recent.lat.toFixed(1)}°, ${recent.lon.toFixed(1)}°`,
        `fb:${recent.epochMs}`,
      );
    }
  } catch {
    /* ignore */
  }

  // 3) ISS visible pass within 10 minutes
  if (observer) {
    try {
      const tle = await fetchISSTle();
      const passes = predictPasses(tle, observer, { durationHours: 1, minElDeg: 10 });
      const visible = passes.find((p) => p.visible && p.aos - Date.now() < 10 * 60 * 1000);
      if (visible) {
        const minutes = Math.max(0, Math.round((visible.aos - Date.now()) / 60000));
        fire(
          'ISS visibile a breve',
          `Tra ~${minutes} min, max ${visible.maxElDeg.toFixed(0)}°`,
          `iss:${visible.aos}`,
        );
      }
    } catch {
      /* ignore */
    }
  }
}

export function startNotificationScheduler(intervalMs = 5 * 60 * 1000): () => void {
  void checkAlerts();
  const id = window.setInterval(() => void checkAlerts(), intervalMs);
  return () => window.clearInterval(id);
}
