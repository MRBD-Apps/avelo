# Avélo · Meta Ray-Ban Display

Find **àVélo** bike-share stations around you, **hands-free**, on your **Meta Ray-Ban Display**.

A glanceable map of nearby [àVélo](https://www.accesvelo.ca/) (Québec City) stations: see live
**bikes / docks** availability, **swipe left/right** to browse stations nearest-first, **swipe
up/down** to zoom, and tap to open the full list.

> Community project, **not affiliated** with àVélo / RTC. Data comes from the public
> [GBFS](https://gbfs.org/) feeds (`station_information` + `station_status`).

## 📲 Install on the glasses

```
fb-viewapp://web_app_deep_link?appName=Av%C3%A9lo&appUrl=https%3A%2F%2Favelo.vercel.app%2F
```

Or open it in the glasses' browser: **https://avelo.vercel.app**

## ✨ Features

- **Live availability** — bikes (with electric/mechanical split) and free docks per station,
  refreshed every 20 s, colour-coded (green available · amber low · red empty · grey offline).
- **Nearest-first** — the closest ~30 stations to you, sorted by distance.
- **Swipe to browse** — Left/Right cycles stations (map flies to the selection + status card),
  Up/Down zooms; tap opens the list.
- **List screen** — scroll all nearby stations with status, pick one to center it on the map.

## 🏗️ How it works

The àVélo GBFS feeds don't send CORS headers, so the browser can't read them cross-origin.
A tiny **Vercel Edge Function** (`api/stations.ts`) fetches `station_information` +
`station_status` server-side, merges them by `station_id`, and serves clean JSON from the same
origin. The client computes distances from your geolocation, ranks stations, and renders them.

```
api/stations.ts         # Edge proxy: merges the two GBFS feeds → /api/stations
src/api/                # client fetch + types
src/lib/                # distance, ranking, status level/colour (with tests)
src/hooks/              # geolocation + stations polling
src/screens/MapScreen   # Leaflet map, markers, swipe selection, status card
src/screens/ListScreen  # nearby stations list
```

## 🛠️ Tech stack

React 19 · Vite · TypeScript · Tailwind v4 · [`mrbd-ui-kit`](https://github.com/michaelcummings12/mrbd-ui-kit)
· Leaflet / react-leaflet (CartoDB dark tiles) · Vitest. Built from
[mrbd-app-template](https://github.com/MRBD-Apps/mrbd-app-template).

## 🚀 Development

```bash
npm install
npm run test          # unit tests (distance, ranking, status)
npm run build         # production build

# The stations API is a Vercel function, so run the full stack with:
npm i -g vercel
vercel dev            # serves the app + /api/stations locally
```

> Geolocation needs HTTPS (or localhost). To preview in a desktop browser, simulate a position
> in Québec in DevTools (e.g. `46.81, -71.22`).

## 📄 License

[MIT](./LICENSE)
