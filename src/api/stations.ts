import type { StationsResponse } from './types';

/** Fetch merged station data from our same-origin proxy (see /api/stations). */
export async function fetchStations(): Promise<StationsResponse> {
  const resp = await fetch('/api/stations', { headers: { Accept: 'application/json' } });
  if (!resp.ok) throw new Error(`stations error (${resp.status})`);
  return resp.json();
}
