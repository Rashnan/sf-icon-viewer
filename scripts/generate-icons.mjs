import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const iconsDir = path.join(__dirname, '..', 'public', 'SF-Icons')
const outputPaths = [
  path.join(__dirname, '..', 'public', 'icons.txt'), // served by Vite in dev/build
  path.join(__dirname, '..', 'icons.txt'), // keep root copy for convenience
]

try {
  const dirEntries = fs.readdirSync(iconsDir, { withFileTypes: true })
  const iconFiles = dirEntries
    .filter(entry => entry.isFile() && entry.name.endsWith('.png'))
    .map(entry => entry.name)
    .sort()

  outputPaths.forEach(outPath => {
    fs.writeFileSync(outPath, iconFiles.join('\n'), 'utf8')
  })
  console.log(`Wrote ${iconFiles.length} icons to:`, outputPaths.map(p => path.relative(process.cwd(), p)).join(', '))
} catch (error) {
  console.error('Error generating icons.txt:', error)
  process.exit(1)
}
