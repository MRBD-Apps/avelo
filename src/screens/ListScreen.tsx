import { Button, ScrollContainer, Text } from 'mrbd-ui-kit';
import { ArrowLeft } from 'lucide-react';
import type { RankedStation } from '../api/types';
import { stationLevel, LEVEL_COLOR } from '../lib/status';
import { formatDistance } from '../lib/distance';

interface Props {
  stations: RankedStation[];
  onSelect: (id: string) => void;
  onBack: () => void;
}

export function ListScreen({ stations, onSelect, onBack }: Props) {
  return (
    <div className="flex h-full flex-col gap-2 p-3">
      <div className="flex items-center gap-2">
        <Button
          id="back-map"
          icon={ArrowLeft}
          variant="ghost"
          size="sm"
          autoFocus={false}
          onClick={onBack}
          className="h-10 w-10 rounded-full p-0"
        >
          <span className="sr-only">Carte</span>
        </Button>
        <Text as="h1" size="lg" weight="bold" className="block">
          Bornes proches
        </Text>
      </div>

      <ScrollContainer>
        {stations.map((s) => {
          const c = LEVEL_COLOR[stationLevel(s)];
          return (
            <Button
              key={s.id}
              id={`st-${s.id}`}
              onClick={() => onSelect(s.id)}
              className="w-full justify-between"
            >
              <span className="flex min-w-0 items-center gap-2">
                <span
                  className="size-2.5 shrink-0 rounded-full"
                  style={{ background: c.ring }}
                />
                <span className="truncate text-left">{s.name}</span>
              </span>
              <span className="ml-2 shrink-0 text-sm text-gray-300">
                {s.bikes}/{s.docks} · {formatDistance(s.distanceMeters)}
              </span>
            </Button>
          );
        })}
      </ScrollContainer>
    </div>
  );
}
