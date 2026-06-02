import { Text } from 'mrbd-ui-kit';
import { Bike, Zap } from 'lucide-react';
import type { RankedStation } from '../api/types';
import { stationLevel, LEVEL_LABEL } from '../lib/status';
import { formatDistance } from '../lib/distance';

interface Props {
  station: RankedStation;
  index: number;
  total: number;
}

const STATUS_TEXT: Record<string, string> = {
  ok: '#34d399',
  low: '#fbbf24',
  empty: '#f87171',
  offline: '#a1a1aa',
};

// Frosted-glass info card, inspired by the native Display maps UI.
export function StationStatusCard({ station, index, total }: Props) {
  const level = stationLevel(station);

  return (
    <div
      className="relative overflow-hidden rounded-[1.75rem] border border-white/15 px-5 py-4 backdrop-blur-md"
      style={{
        background:
          'linear-gradient(135deg, rgba(120,119,198,0.30), rgba(255,255,255,0.06) 45%, rgba(56,189,248,0.20))',
      }}
    >
      <Text as="h2" size="lg" weight="bold" className="block truncate">
        {station.name}
      </Text>

      <div className="mt-1 flex items-center gap-3 text-base text-white/90">
        <span className="inline-flex items-center gap-1">
          <Bike className="size-4" />
          {station.bikes}
        </span>
        <span className="inline-flex items-center gap-1 text-amber-300">
          <Zap className="size-4" />
          {station.ebike}
        </span>
        <span className="text-white/60">· {formatDistance(station.distanceMeters)}</span>
      </div>

      <div className="mt-0.5 text-sm">
        <span className="font-semibold" style={{ color: STATUS_TEXT[level] }}>
          {LEVEL_LABEL[level]}
        </span>
        <span className="text-white/50">
          {' '}
          · Docks {station.docks} · {index + 1}/{total}
        </span>
      </div>
    </div>
  );
}
