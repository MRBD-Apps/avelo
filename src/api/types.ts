export interface Station {
  id: string;
  name: string;
  address: string | null;
  lat: number;
  lon: number;
  capacity: number;
  bikes: number;
  ebike: number;
  mechanical: number;
  docks: number;
  status: string | null; // "IN_SERVICE" | "MAINTENANCE" | ...
  isRenting: boolean;
  isReturning: boolean;
  isCharging: boolean;
  lastReported: number | null;
}

export interface StationsResponse {
  stations: Station[];
  lastUpdated: number | null;
}

/** Station enriched with the distance from the user (metres). */
export interface RankedStation extends Station {
  distanceMeters: number;
}

export interface LatLng {
  lat: number;
  lon: number;
}
