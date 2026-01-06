import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const iconsDir = path.join(__dirname, '..', 'public', 'SF-Icons')
const outputPath = path.join(__dirname, '..', 'icons.txt')

try {
  const dirEntries = fs.readdirSync(iconsDir, { withFileTypes: true })
  const iconFiles = dirEntries
    .filter(entry => entry.isFile() && entry.name.endsWith('.png'))
    .map(entry => entry.name)
    .sort()

  fs.writeFileSync(outputPath, iconFiles.join('\n'), 'utf8')
  console.log(`Wrote ${iconFiles.length} icons to icons.txt`)
} catch (error) {
  console.error('Error generating icons.txt:', error)
  process.exit(1)
}
