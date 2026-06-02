import { useEffect, useRef, useState } from 'react';
import type { Station } from '../api/types';
import { fetchStations } from '../api/stations';

const REFRESH_MS = 20000;

interface UseStations {
  stations: Station[];
  lastUpdated: number | null;
  error: string | null;
  loading: boolean;
}

/** Loads the merged stations from /api/stations and refreshes every 20 s. */
export function useStations(): UseStations {
  const [stations, setStations] = useState<Station[]>([]);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    let alive = true;
    const load = async () => {
      try {
        const data = await fetchStations();
        if (!alive) return;
        setStations(data.stations);
        setLastUpdated(data.lastUpdated);
        setError(null);
      } catch (e) {
        if (!alive) return;
        setError(e instanceof Error ? e.message : String(e));
      } finally {
        if (alive) setLoading(false);
      }
    };
    load();
    timer.current = setInterval(load, REFRESH_MS);
    return () => {
      alive = false;
      if (timer.current) clearInterval(timer.current);
    };
  }, []);

  return { stations, lastUpdated, error, loading };
}
