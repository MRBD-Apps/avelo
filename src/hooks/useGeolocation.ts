import { useEffect, useState } from 'react';
import type { LatLng } from '../api/types';

export interface GeoState {
  pos: LatLng | null;
  error: string | null;
}

export function useGeolocation(): GeoState {
  const [state, setState] = useState<GeoState>({ pos: null, error: null });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState({ pos: null, error: 'unsupported' });
      return;
    }
    const id = navigator.geolocation.watchPosition(
      (p) => setState({ pos: { lat: p.coords.latitude, lon: p.coords.longitude }, error: null }),
      (err) => setState((s) => ({ ...s, error: err.message || 'denied' })),
      { enableHighAccuracy: true, maximumAge: 10000, timeout: 10000 },
    );
    return () => navigator.geolocation.clearWatch(id);
  }, []);

  return state;
}
