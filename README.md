# SF Icons Viewer

Browse and search the SF Icons PNG set with fast filtering, virtualized grid, and quick copy of icon names.

## Features

- 🔍 Search-as-you-type with prefix filtering
- 🖼️ Virtualized grid for thousands of icons with lazy batches
- 🪄 Click any icon to preview in a dialog and copy its name
- ⚡ Lightweight Vite + React app

## Getting Started

### Prerequisites

- Node.js 18+
- npm (or compatible)

### Install

```bash
npm install
```

### Generate icon list

Create `public/icons.txt` from the PNGs in `public/SF-Icons`:

```bash
npm run generate-icons
```

> This writes the list to `public/icons.txt` (and keeps a root copy). The app reads that list at runtime to render icons.

### Develop

```bash
npm run dev
```

Open http://localhost:5173.

### Build

```bash
npm run build
```

`prebuild` runs automatically to regenerate `public/icons.txt`, then Vite outputs to `dist/`.

### Deploy (gh-pages)

```bash
npm run deploy
```

Runs the full build (including icon list generation) and publishes `dist/` via `gh-pages`.

## Project Structure

```
sf-icon-viewer/
├── public/
│   ├── SF-Icons/           # Icon files (PNG)
│   └── icons.txt           # Generated list consumed by the app
├── src/
│   ├── components/
│   ├── context/
│   ├── hooks/
│   └── App.jsx
├── scripts/
│   └── generate-icons.mjs  # Builds icons.txt
├── package.json
└── vite.config.js
```

## Usage

1. Type to filter by prefix (e.g., `heart`, `circle.fill`).
2. Scroll; icons load in batches after scroll stops for 200 ms.
3. Click an icon to view it large; nearby icons are preloaded for faster browsing.



