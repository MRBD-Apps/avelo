import { useMemo, useState } from 'react';
import { DisplayRoot, Text } from 'mrbd-ui-kit';
import { useGeolocation } from './hooks/useGeolocation';
import { useStations } from './hooks/useStations';
import { rankNearest } from './lib/rank';
import { MapScreen } from './screens/MapScreen';
import { ListScreen } from './screens/ListScreen';

const NEAREST = 30;
type Screen = 'map' | 'list';

export default function App() {
  const [screen, setScreen] = useState<Screen>('map');
  const { pos } = useGeolocation();
  const { stations, error, loading } = useStations();

  const nearest = useMemo(() => rankNearest(stations, pos, NEAREST), [stations, pos]);

  const [selectedId, setSelectedId] = useState<string | null>(null);
  const effectiveId = nearest.some((s) => s.id === selectedId)
    ? selectedId
    : (nearest[0]?.id ?? null);
  const selectedIndex = Math.max(
    0,
    nearest.findIndex((s) => s.id === effectiveId),
  );

  const move = (delta: number) => {
    if (!nearest.length) return;
    const cur = Math.max(
      0,
      nearest.findIndex((s) => s.id === effectiveId),
    );
    const next = (cur + delta + nearest.length) % nearest.length;
    setSelectedId(nearest[next].id);
  };

  let content;
  if (loading && !nearest.length) {
    content = (
      <div className="flex h-full items-center justify-center">
        <Text className="text-gray-400">Chargement des bornes…</Text>
      </div>
    );
  } else if (error && !nearest.length) {
    content = (
      <div className="flex h-full items-center justify-center p-4 text-center">
        <Text className="text-gray-400">Service vélo indisponible.</Text>
      </div>
    );
  } else if (screen === 'map') {
    content = (
      <MapScreen
        stations={nearest}
        userPos={pos}
        selectedId={effectiveId}
        selectedIndex={selectedIndex}
        onPrev={() => move(-1)}
        onNext={() => move(1)}
        onOpenList={() => setScreen('list')}
      />
    );
  } else {
    content = (
      <ListScreen
        stations={nearest}
        onSelect={(id) => {
          setSelectedId(id);
          setScreen('map');
        }}
        onBack={() => setScreen('map')}
      />
    );
  }

  return (
    <DisplayRoot>
      <div
        className="flex flex-col bg-black text-mrbd-text"
        style={{ width: '100%', height: '100%' }}
      >
        {content}
      </div>
    </DisplayRoot>
  );
}
