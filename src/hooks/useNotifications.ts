import { useEffect, useState } from 'react';

type Permission = NotificationPermission | 'unsupported';

export function useNotifications() {
  const [permission, setPermission] = useState<Permission>(() =>
    typeof Notification === 'undefined' ? 'unsupported' : Notification.permission,
  );

  const request = async (): Promise<Permission> => {
    if (typeof Notification === 'undefined') return 'unsupported';
    const result = await Notification.requestPermission();
    setPermission(result);
    return result;
  };

  const send = (title: string, options?: NotificationOptions) => {
    if (permission === 'granted') {
      try {
        new Notification(title, { icon: '/MeteorWatch/icons/icon-192.png', ...options });
      } catch {
        /* ignore */
      }
    }
  };

  useEffect(() => {
    if (typeof Notification !== 'undefined') {
      setPermission(Notification.permission);
    }
  }, []);

  return { permission, request, send };
}
