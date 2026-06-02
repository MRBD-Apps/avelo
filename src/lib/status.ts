import type { Station } from '../api/types';

export type StationLevel = 'offline' | 'empty' | 'low' | 'ok';

type StatusInput = Pick<Station, 'status' | 'isRenting' | 'bikes'>;

/** Availability level driving colour and label. */
export function stationLevel(s: StatusInput): StationLevel {
  if (s.status !== 'IN_SERVICE' || !s.isRenting) return 'offline';
  if (s.bikes === 0) return 'empty';
  if (s.bikes < 5) return 'low';
  return 'ok';
}

export const LEVEL_COLOR: Record<StationLevel, { fill: string; ring: string }> = {
  offline: { fill: '#3f3f46', ring: '#52525b' },
  empty: { fill: '#7f1d1d', ring: '#ef4444' },
  low: { fill: '#78350f', ring: '#f59e0b' },
  ok: { fill: '#064e3b', ring: '#10b981' },
};

export const LEVEL_LABEL: Record<StationLevel, string> = {
  offline: 'Hors service',
  empty: 'Aucun vélo',
  low: 'Peu de vélos',
  ok: 'Disponible',
};

export function statusLabel(s: StatusInput): string {
  return LEVEL_LABEL[stationLevel(s)];
}
