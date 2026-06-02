import { useEffect } from 'react';
import { MapContainer, TileLayer, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useSpatialInput } from 'mrbd-ui-kit';
import type { RankedStation, LatLng } from '../api/types';
import { stationLevel, LEVEL_COLOR, fillPercent } from '../lib/status';
import { StationStatusCard } from '../components/StationStatusCard';

const MAP_TILES = 'https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png';
const DEFAULT_CENTER: [number, number] = [46.81, -71.22]; // Québec

// "You are here" — blue location dot.
function userIcon(): L.DivIcon {
  const html = `<div style="
    width:16px;height:16px;border-radius:9999px;
    background:#3b82f6;border:2px solid #fff;
    box-shadow:0 0 0 4px rgba(59,130,246,0.35);
    transform:translate(-50%,-50%);
  "></div>`;
  return L.divIcon({ className: '', html, iconSize: [0, 0], iconAnchor: [0, 0] });
}

interface Props {
  stations: RankedStation[];
  userPos: LatLng | null;
  selectedId: string | null;
  selectedIndex: number;
  onPrev: () => void;
  onNext: () => void;
  onOpenList: () => void;
}

// A pin showing the fill percentage (bikes / capacity), coloured by availability.
function bikeIcon(label: string, fill: string, ring: string, selected: boolean): L.DivIcon {
  const size = selected ? 32 : 24;
  const font = selected ? 13 : 11;
  const border = selected ? '#ffffff' : ring;
  const glow = selected ? '0 0 0 3px rgba(255,255,255,0.25)' : '0 0 0 2px rgba(0,0,0,0.5)';
  const html = `<div style="
    display:flex;align-items:center;justify-content:center;
    min-width:${size}px;height:${size}px;padding:0 6px;
    border-radius:9999px;background:${fill};border:2px solid ${border};
    color:#fff;font:700 ${font}px/1 Nunito,system-ui,sans-serif;
    box-shadow:${glow};transform:translate(-50%,-50%);
    transition:min-width .15s ease,height .15s ease;
  ">${label}</div>`;
  return L.divIcon({ className: '', html, iconSize: [0, 0], iconAnchor: [0, 0] });
}

// Lives inside MapContainer: owns the map instance for input + smooth follow.
function MapEngine({
  targetLat,
  targetLon,
  onPrev,
  onNext,
  onOpenList,
}: {
  targetLat: number | null;
  targetLon: number | null;
  onPrev: () => void;
  onNext: () => void;
  onOpenList: () => void;
}) {
  const map = useMap();

  useEffect(() => {
    map.invalidateSize();
  }, [map]);

  // Smoothly follow the selected station (only when its coordinates change).
  useEffect(() => {
    if (targetLat != null && targetLon != null) {
      map.flyTo([targetLat, targetLon], Math.max(map.getZoom(), 15), {
        duration: 0.7,
        easeLinearity: 0.25,
      });
    }
  }, [targetLat, targetLon, map]);

  // Temple-touch / D-pad: Left/Right pick stations, Up/Down zoom, tap opens list.
  useSpatialInput({
    onPress: (key) => {
      if (key === 'left') onPrev();
      else if (key === 'right') onNext();
      else if (key === 'up') map.zoomIn();
      else if (key === 'down') map.zoomOut();
      else if (key === 'select') onOpenList();
    },
  });

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
  const selected = stations.find((s) => s.id === selectedId) ?? null;

  const center: [number, number] = selected
    ? [selected.lat, selected.lon]
    : userPos
      ? [userPos.lat, userPos.lon]
      : DEFAULT_CENTER;

  return (
    <div className="relative h-full w-full">
      <MapContainer
        center={center}
        zoom={15}
        zoomControl={false}
        attributionControl={false}
        keyboard={false}
        style={{ height: '100%', width: '100%', background: '#000' }}
      >
        <TileLayer url={MAP_TILES} subdomains="abcd" maxZoom={20} />
        <MapEngine
          targetLat={selected ? selected.lat : null}
          targetLon={selected ? selected.lon : null}
          onPrev={onPrev}
          onNext={onNext}
          onOpenList={onOpenList}
        />

        {userPos && (
          <Marker position={[userPos.lat, userPos.lon]} icon={userIcon()} zIndexOffset={500} />
        )}

        {stations.map((s) => {
          const c = LEVEL_COLOR[stationLevel(s)];
          const isSel = s.id === selectedId;
          return (
            <Marker
              key={s.id}
              position={[s.lat, s.lon]}
              icon={bikeIcon(`${fillPercent(s)}%`, c.fill, c.ring, isSel)}
              zIndexOffset={isSel ? 1000 : 0}
            />
          );
        })}
      </MapContainer>

      {/* Interaction hint — above Leaflet panes (z up to ~700) */}
      <div className="pointer-events-none absolute inset-x-0 top-2 z-[1000] flex justify-center">
        <span className="rounded-full bg-black/70 px-3 py-1 text-xs font-semibold text-gray-200">
          Bornes ‹ ›   Zoom + −   Appui : liste
        </span>
      </div>

      {/* Selected station status — carousel sliding between stations */}
      {stations.length > 0 && (
        <div className="absolute inset-x-2 bottom-2 z-[1000] overflow-hidden">
          <div
            className="flex transition-transform duration-300 ease-out"
            style={{ transform: `translateX(-${selectedIndex * 100}%)` }}
          >
            {stations.map((s, i) => (
              <div key={s.id} className="w-full shrink-0 px-1">
                <StationStatusCard station={s} index={i} total={stations.length} />
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
