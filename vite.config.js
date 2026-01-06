import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Use repo subpath for GitHub Pages builds; empty for local dev.
  base: process.env.NODE_ENV === 'production'
    ? '/sf-icon-viewer/'
    : '',
})


