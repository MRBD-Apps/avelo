import { Card, Text } from 'mrbd-ui-kit';
import { Bike, Zap } from 'lucide-react';
import type { RankedStation } from '../api/types';
import { stationLevel, LEVEL_COLOR, LEVEL_LABEL } from '../lib/status';
import { formatDistance } from '../lib/distance';

interface Props {
  station: RankedStation;
  index: number;
  total: number;
}

export function StationStatusCard({ station, index, total }: Props) {
  const level = stationLevel(station);
  const c = LEVEL_COLOR[level];

  return (
    <Card className="flex flex-col gap-1 border border-white/10 bg-neutral-950/90 backdrop-blur-sm">
      <div className="flex items-center justify-between gap-2">
        <Text weight="bold" className="truncate">
          {station.name}
        </Text>
        <span
          className="shrink-0 rounded-full px-2 py-0.5 text-xs font-bold text-white"
          style={{ background: c.fill, border: `1px solid ${c.ring}` }}
        >
          {LEVEL_LABEL[level]}
        </span>
      </div>

      <div className="flex items-center gap-4 text-sm">
        <span className="inline-flex items-center gap-1">
          <Bike className="size-4" />
          {station.bikes}
        </span>
        <span className="inline-flex items-center gap-1 text-amber-300">
          <Zap className="size-4" />
          {station.ebike}
        </span>
        <span className="text-sky-300">Docks {station.docks}</span>
        <span className="ml-auto text-gray-400">{formatDistance(station.distanceMeters)}</span>
      </div>

      <Text size="sm" className="block text-gray-500">
        {index + 1} / {total}
      </Text>
    </Card>
  );
}
