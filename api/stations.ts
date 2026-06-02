// Vercel Edge Function — proxies the àVélo (Québec) GBFS feeds and merges them.
// The upstream feeds send no CORS headers, so a browser can't read them directly;
// this same-origin endpoint returns clean JSON the glasses app can consume.
export const config = { runtime: 'edge' };

const INFO_URL =
  'https://quebec.publicbikesystem.net/customer/ube/gbfs/v1/en/station_information';
const STATUS_URL =
  'https://quebec.publicbikesystem.net/customer/ube/gbfs/v1/en/station_status';

interface RawInfo {
  station_id: string;
  name: string;
  lat: number;
  lon: number;
  capacity: number;
  address?: string;
  is_charging_station?: boolean;
}

interface RawStatus {
  station_id: string;
  num_bikes_available?: number;
  num_bikes_available_types?: { mechanical?: number; ebike?: number };
  num_docks_available?: number;
  status?: string;
  is_renting?: number;
  is_returning?: number;
  last_reported?: number;
}

function json(body: unknown, status: number, cache?: string): Response {
  const headers: Record<string, string> = {
    'content-type': 'application/json; charset=utf-8',
  };
  if (cache) headers['cache-control'] = cache;
  return new Response(JSON.stringify(body), { status, headers });
}

export default async function handler(): Promise<Response> {
  try {
    const [infoRes, statusRes] = await Promise.all([fetch(INFO_URL), fetch(STATUS_URL)]);
    if (!infoRes.ok || !statusRes.ok) {
      return json({ error: 'upstream_unavailable' }, 502);
    }

    const info = (await infoRes.json()) as { data: { stations: RawInfo[] } };
    const status = (await statusRes.json()) as {
      data: { stations: RawStatus[] };
      last_updated?: number;
    };

    const byId = new Map<string, RawStatus>();
    for (const s of status.data.stations) byId.set(s.station_id, s);

    const stations = info.data.stations.map((i) => {
      const s = byId.get(i.station_id);
      return {
        id: i.station_id,
        name: i.name,
        address: i.address ?? null,
        lat: i.lat,
        lon: i.lon,
        capacity: i.capacity,
        bikes: s?.num_bikes_available ?? 0,
        ebike: s?.num_bikes_available_types?.ebike ?? 0,
        mechanical: s?.num_bikes_available_types?.mechanical ?? 0,
        docks: s?.num_docks_available ?? 0,
        status: s?.status ?? null,
        isRenting: s?.is_renting === 1,
        isReturning: s?.is_returning === 1,
        isCharging: !!i.is_charging_station,
        lastReported: s?.last_reported ?? null,
      };
    });

    return json(
      { stations, lastUpdated: status.last_updated ?? null },
      200,
      's-maxage=15, stale-while-revalidate=30',
    );
  } catch {
    return json({ error: 'proxy_error' }, 500);
  }
}
