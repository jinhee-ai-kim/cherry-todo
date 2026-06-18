// Generates app icons from build/icon.svg:
//   - build/icon.ico  (Windows, multi-resolution; electron-builder needs >= 256px)
//   - build/icon.png  (1024px; macOS — electron-builder converts it to .icns)
// (electron-builder ignores SVG, so we rasterize first.)
import sharp from 'sharp'
import pngToIco from 'png-to-ico'
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = resolve(root, 'build/icon.svg')
const ico = resolve(root, 'build/icon.ico')
const png = resolve(root, 'build/icon.png')

// Windows .ico — 256 is mandatory for electron-builder; the rest sharpen small UI sizes.
const sizes = [256, 128, 64, 48, 32, 16]
const pngs = await Promise.all(
  sizes.map((s) =>
    // High density rasterizes the SVG crisply before downscaling.
    sharp(src, { density: 512 }).resize(s, s, { fit: 'contain' }).png().toBuffer()
  )
)
writeFileSync(ico, await pngToIco(pngs))
console.log(`✓ ${ico} written (${sizes.join(', ')} px)`)

// macOS source PNG (electron-builder turns this into icon.icns on a Mac build).
await sharp(src, { density: 1024 }).resize(1024, 1024, { fit: 'contain' }).png().toFile(png)
console.log(`✓ ${png} written (1024 px)`)
