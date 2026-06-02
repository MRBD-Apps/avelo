import type { Station, RankedStation, LatLng } from '../api/types';
import { distanceMeters } from './distance';

/**
 * Attach the distance from `user` to each station, sort nearest-first, and keep
 * the closest `limit`. With no user position, keeps the original order.
 */
export function rankNearest(
  stations: Station[],
  user: LatLng | null,
  limit: number,
): RankedStation[] {
  const ranked: RankedStation[] = stations.map((s) => ({
    ...s,
    distanceMeters: user
      ? distanceMeters(user, { lat: s.lat, lon: s.lon })
      : Number.POSITIVE_INFINITY,
  }));
  ranked.sort((a, b) => a.distanceMeters - b.distanceMeters);
  return limit > 0 ? ranked.slice(0, limit) : ranked;
}
