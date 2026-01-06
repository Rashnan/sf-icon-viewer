# SF Icons Viewer

A modern web application to browse and search through SF Icons.

## Features

- 🔍 Search bar to filter icons by name
- 📱 Responsive grid layout displaying icons with their names
- 🔎 Click on any icon to view it in a large dialog
- ⚡ Fast and lightweight React application

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Install dependencies:
```bash
npm install
```

2. Generate the icon manifest (if not already generated):
```bash
npm run generate-manifest
```

Or on Windows PowerShell:
```powershell
.\scripts\generate-manifest.ps1
```

### Running the Application

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
```

The built files will be in the `dist` folder.

## Project Structure

```
sf-icon-viewer/
├── public/
│   ├── SF-Icons/          # Icon files (PNG)
│   └── icon-manifest.json # Generated manifest of all icons
├── src/
│   ├── components/
│   │   ├── IconGrid.jsx   # Grid display of icons
│   │   ├── IconDialog.jsx # Dialog for viewing icons large
│   │   └── SearchBar.jsx  # Search input component
│   ├── App.jsx            # Main application component
│   ├── main.jsx           # Application entry point
│   └── *.css              # Styling files
├── scripts/
│   └── generate-manifest.* # Scripts to generate icon manifest
└── package.json
```

## Usage

1. Use the search bar at the top to filter icons by name
2. Browse through the grid of icons
3. Click on any icon to view it in a large dialog with its name
4. Click outside the dialog or the × button to close it


