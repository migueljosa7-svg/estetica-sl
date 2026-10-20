import { readdir, stat, unlink } from 'node:fs/promises'
import { writeFileSync } from 'node:fs'
import path from 'node:path'
import sharp from 'sharp'

const src = path.resolve('public/images')

async function walk(dir) {
  const entries = await readdir(dir, { withFileTypes: true })
  for (const e of entries) {
    const full = path.join(dir, e.name)
    if (e.isDirectory()) await walk(full)
    else if (e.name.toLowerCase().endsWith('.jpg')) await optimize(full)
  }
}

async function optimize(file) {
  const mm = await sharp(file).metadata()
  if (!mm.width) return
  const w =
    file.includes('hero.jpg') ? 1600 :
    file.includes('slide') ? 1200 :
    file.includes('about.jpg') ? 1000 :
    900
  const resized = await sharp(file)
    .resize(w, undefined, { mozjpeg: true })
    .jpeg({ quality: 82, progressive: true, force: true })
    .toBuffer()
  await unlink(file)
  writeFileSync(file, resized)
  const st = await stat(file)
  console.log(`${file} ok ${st.size / 1024} KB`)
}

walk(src).catch((e) => {
  console.error(e)
  process.exit(1)
})
