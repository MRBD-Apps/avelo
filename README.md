# MRBD App Template

A clean starter for building **Meta Ray-Ban Display** web apps.

React + Vite + TypeScript + Tailwind v4 + [`mrbd-ui-kit`](https://github.com/michaelcummings12/mrbd-ui-kit),
with spatial (D-pad) navigation, a 600×600 dark layout, unit testing, and a ready-to-go
**PWA manifest + app icons** so your app shows up properly in the glasses launcher.

## Use this template

Click **“Use this template”** on GitHub, or:

```bash
gh repo create my-org/my-app --public --template MRBD-Apps/mrbd-app-template --clone
cd my-app
npm install
npm run dev
```

## Scripts

```bash
npm run dev       # dev server (http://localhost:5173)
npm run test      # unit tests (Vitest + Testing Library)
npm run build     # production build (dist/)
npm run preview   # preview the production build
npm run lint      # eslint
```

## What's inside

```
src/
  App.tsx              # DisplayRoot + icon dock navbar (kit <Button>)
  screens/             # HomeScreen (Counter, Pill, ScrollContainer list) + AboutScreen (asChild link)
  components/Counter.tsx + test   # example interactive component using the kit
  lib/format.ts + test            # example pure util + unit test
  index.css            # tailwind + mrbd-ui-kit/css + Nunito font + accent variable
public/
  favicon.svg / favicon.png / icon-512.png
  manifest.webmanifest # PWA manifest the glasses launcher reads for the app icon
```

It demonstrates the kit essentials: `DisplayRoot`, `Button`, `Text`, `Card`, `Pill`,
`ScrollContainer`, `usePreferredFocus`, lucide icons, the icon-dock navbar pattern, and theming
via a single CSS variable.

## Display notes (baked in)

- **Spatial navigation only.** Kit components activate on **Enter / temple-touch** through the
  focus engine — they're driven by the D-pad, not the mouse. Arrow keys move focus.
- **No pure white / no drop-shadows.** Use `text-mrbd-text` and outer glows (`shadow-mrbd-glow`).
- **Theme in one line:** change `--color-mrbd-accent` in `src/index.css`.
- **Adding a map?** Install `leaflet` + `react-leaflet` and use the CartoDB `dark_all` tiles with
  `zoomControl={false}`; drive zoom/recenter from kit `<Button>`s via `useMap()`.

## Deploy + install on the glasses

Deploy to a public HTTPS URL (geolocation/PWA need HTTPS):

```bash
npm i -g vercel
vercel --prod
```

Then open this deep link **on the glasses** to add the app (replace name + URL):

```
fb-viewapp://web_app_deep_link?appName=MRBD%20App&appUrl=https%3A%2F%2Fyour-app.vercel.app%2F
```

> The launcher icon comes from `manifest.webmanifest` + the **PNG** icons (and `apple-touch-icon`),
> not the SVG favicon. Keep a 256×256 (and 512×512) PNG in `public/` and referenced in the
> manifest. After changing the icon, **re-add** the app on the glasses so the launcher re-reads it.

## Customize

1. Rename in `package.json`, `index.html` (`<title>` + `<meta description>`), and
   `public/manifest.webmanifest` (`name`, `short_name`, `description`).
2. Replace `public/favicon.svg` and regenerate the PNGs:
   ```bash
   rsvg-convert -w 256 -h 256 public/favicon.svg -o public/favicon.png
   rsvg-convert -w 512 -h 512 public/favicon.svg -o public/icon-512.png
   ```
3. Build your screens in `src/screens/` and wire them in `src/App.tsx`.

## License

[MIT](./LICENSE)
