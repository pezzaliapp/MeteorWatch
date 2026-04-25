import { useCallback, useState } from 'react';
import { useUserLocationStore, FALLBACK_LOCATION, type UserLocation } from '@/store/userLocationStore';

interface State {
  loading: boolean;
  error: string | null;
  request: () => Promise<UserLocation>;
  location: UserLocation | null;
  useFallback: () => UserLocation;
}

export function useGeolocation(): State {
  const location = useUserLocationStore((s) => s.location);
  const setLocation = useUserLocationStore((s) => s.setLocation);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const request = useCallback((): Promise<UserLocation> => {
    setError(null);
    setLoading(true);
    return new Promise((resolve) => {
      if (typeof navigator === 'undefined' || !navigator.geolocation) {
        setError('Geolocation not supported');
        setLoading(false);
        const fallback = FALLBACK_LOCATION;
        setLocation(fallback);
        resolve(fallback);
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          const loc: UserLocation = {
            lat: pos.coords.latitude,
            lon: pos.coords.longitude,
            alt: (pos.coords.altitude ?? 0) / 1000,
            source: 'browser',
          };
          setLocation(loc);
          setLoading(false);
          resolve(loc);
        },
        (err) => {
          setError(err.message);
          setLoading(false);
          const fallback = FALLBACK_LOCATION;
          setLocation(fallback);
          resolve(fallback);
        },
        { enableHighAccuracy: false, timeout: 10000, maximumAge: 60000 },
      );
    });
  }, [setLocation]);

  const useFallback = useCallback(() => {
    setLocation(FALLBACK_LOCATION);
    return FALLBACK_LOCATION;
  }, [setLocation]);

  return { loading, error, request, location, useFallback };
}
