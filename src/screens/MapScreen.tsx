import { useEffect, useRef } from 'react';
import { MapContainer, TileLayer, CircleMarker, useMap } from 'react-leaflet';
import type { Map as LeafletMap } from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSpatialInput } from 'mrbd-ui-kit';
import type { RankedStation, LatLng } from '../api/types';
import { stationLevel, LEVEL_COLOR } from '../lib/status';
import { StationStatusCard } from '../components/StationStatusCard';

const DARK_TILES = 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';
const DEFAULT_CENTER: [number, number] = [46.81, -71.22]; // Québec

interface Props {
  stations: RankedStation[];
  userPos: LatLng | null;
  selectedId: string | null;
  selectedIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onOpenList: () => void;
}

// Fly to the selected station and keep the map sized correctly.
function MapController({ target }: { target: [number, number] | null }) {
  const map = useMap();
  useEffect(() => {
    map.invalidateSize();
  }, [map]);
  useEffect(() => {
    if (target) map.flyTo(target, Math.max(map.getZoom(), 15), { duration: 0.5 });
  }, [target, map]);
  return null;
}

export function MapScreen({
  stations,
  userPos,
  selectedId,
  selectedIndex,
  onPrev,
  onNext,
  onOpenList,
}: Props) {
  const mapRef = useRef<LeafletMap | null>(null);
  const selected = stations.find((s) => s.id === selectedId) ?? null;

  // Temple-touch / D-pad: Left/Right pick stations, Up/Down zoom, tap opens the list.
  useSpatialInput({
    onPress: (key) => {
      if (key === 'left') onPrev();
      else if (key === 'right') onNext();
      else if (key === 'up') mapRef.current?.zoomIn();
      else if (key === 'down') mapRef.current?.zoomOut();
      else if (key === 'select') onOpenList();
    },
  });

  const center: [number, number] = selected
    ? [selected.lat, selected.lon]
    : userPos
      ? [userPos.lat, userPos.lon]
      : DEFAULT_CENTER;

  return (
    <div className="relative h-full w-full">
      <MapContainer
        ref={mapRef}
        center={center}
        zoom={15}
        zoomControl={false}
        attributionControl={false}
        keyboard={false}
        style={{ height: '100%', width: '100%', background: '#000' }}
      >
        <TileLayer url={DARK_TILES} subdomains="abcd" maxZoom={20} />
        <MapController target={selected ? [selected.lat, selected.lon] : null} />

        {userPos && (
          <CircleMarker
            center={[userPos.lat, userPos.lon]}
            radius={6}
            pathOptions={{ color: '#fff', weight: 2, fillColor: '#52d9ff', fillOpacity: 1 }}
          />
        )}

        {stations.map((s) => {
          const c = LEVEL_COLOR[stationLevel(s)];
          const isSel = s.id === selectedId;
          return (
            <CircleMarker
              key={s.id}
              center={[s.lat, s.lon]}
              radius={isSel ? 11 : 7}
              pathOptions={{
                color: isSel ? '#fff' : c.ring,
                weight: isSel ? 3 : 2,
                fillColor: c.fill,
                fillOpacity: 0.95,
              }}
            />
          );
        })}
      </MapContainer>

      {/* Interaction hint */}
      <div className="pointer-events-none absolute inset-x-0 top-2 flex justify-center">
        <span className="rounded-full bg-black/60 px-3 py-1 text-xs font-semibold text-gray-300">
          Bornes ‹ ›   Zoom + −   Appui : liste
        </span>
      </div>

      {/* Selected station status */}
      {selected && (
        <div className="absolute inset-x-2 bottom-2">
          <StationStatusCard station={selected} index={selectedIndex} total={stations.length} />
        </div>
      )}
    </div>
  );
}
