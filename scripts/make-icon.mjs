// Generates build/icon.ico (multi-resolution) from build/icon.svg.
// electron-builder requires a Windows .ico (>= 256px); it ignores SVG.
import sharp from 'sharp'
import pngToIco from 'png-to-ico'
import { writeFileSync } from 'fs'
import { fileURLToPath } from 'url'
import { dirname, resolve } from 'path'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const src = resolve(root, 'build/icon.svg')
const out = resolve(root, 'build/icon.ico')

// 256 is mandatory for electron-builder; the rest sharpen small UI sizes.
const sizes = [256, 128, 64, 48, 32, 16]

const pngs = await Promise.all(
  sizes.map((s) =>
    // High density rasterizes the SVG crisply before downscaling.
    sharp(src, { density: 512 }).resize(s, s, { fit: 'contain' }).png().toBuffer()
  )
)

writeFileSync(out, await pngToIco(pngs))
console.log(`✓ ${out} written (${sizes.join(', ')} px)`)
