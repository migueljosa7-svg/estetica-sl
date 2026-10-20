/**
 * Genera las imágenes SVG originales del catálogo (obra propia de la demo).
 * Uso: node scripts/gen-product-images.mjs
 * Paleta: marfil, beige, rosa empolvado, salvia y dorado.
 */
import { mkdirSync, writeFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const root = join(dirname(fileURLToPath(import.meta.url)), '..')
const outDir = join(root, 'public', 'images', 'products')
mkdirSync(outDir, { recursive: true })

const W = 720
const H = 900

/** @type {Array<{file:string, bg:string[], body:string, accent:string, shape:string}>} */
const items = [
  { file: 'serum-luminar.svg', bg: ['#f6ede2', '#e8d8c4'], body: '#f3e3d3', accent: '#c8a15e', shape: 'dropper' },
  { file: 'crema-nube-avena.svg', bg: ['#f7f1e8', '#eadfcd'], body: '#fbf6ee', accent: '#c8a15e', shape: 'jar' },
  { file: 'mascarilla-arcilla.svg', bg: ['#f8efe9', '#eed6cd'], body: '#e8c4bd', accent: '#b5877f', shape: 'jar' },
  { file: 'contorno-aurora.svg', bg: ['#f4efe9', '#e4d9cb'], body: '#efe7da', accent: '#c8a15e', shape: 'tube' },
  { file: 'aceite-seda.svg', bg: ['#f2f0e7', '#dfe2d3'], body: '#d9dfcc', accent: '#8d9d84', shape: 'bottle' },
  { file: 'exfoliante-melocoton.svg', bg: ['#faf0e6', '#f0dcc8'], body: '#eecdb2', accent: '#c8895e', shape: 'jar' },
  { file: 'lotion-salvia.svg', bg: ['#eff2ec', '#d8dfd2'], body: '#cdd8c6', accent: '#6f7f66', shape: 'pump' },
  { file: 'rubor-petalo.svg', bg: ['#faefec', '#f0d8d3'], body: '#e8b7ae', accent: '#b06f66', shape: 'tube' },
  { file: 'balsamo-rosa-vieja.svg', bg: ['#f9f0ec', '#eed9d3'], body: '#d98d84', accent: '#a55a52', shape: 'flacon' },
  { file: 'base-segunda-piel.svg', bg: ['#f7f2ea', '#e9ddcd'], body: '#e7d5c0', accent: '#c8a15e', shape: 'pump' },
  { file: 'parfum-jardin.svg', bg: ['#f5efe6', '#e3d6c0'], body: '#d8c29b', accent: '#b08d4c', shape: 'flacon' },
  { file: 'bruma-vela-sal.svg', bg: ['#f0f2ef', '#d9dfd8'], body: '#cfd9d3', accent: '#7d9086', shape: 'spray' },
]

function label(x, y, w, h, accent) {
  return `<rect x="${x + w * 0.18}" y="${y + h * 0.24}" width="${w * 0.64}" height="${h * 0.4}" rx="10" fill="#ffffff" opacity="0.55"/>
  <text x="${x + w / 2}" y="${y + h * 0.48}" text-anchor="middle" font-family="Georgia, serif" font-size="${w * 0.14}" fill="${accent}" opacity="0.9">EG</text>`
}

function bottle(x, y, w, h, body, accent) {
  const neckW = w * 0.32
  const capH = h * 0.12
  return `
  <rect x="${x + (w - neckW) / 2}" y="${y - capH}" width="${neckW}" height="${capH}" rx="6" fill="${accent}"/>
  <rect x="${x + (w - neckW) / 2 - 4}" y="${y + capH * 0.3}" width="${neckW + 8}" height="${capH * 0.5}" rx="4" fill="${accent}" opacity="0.85"/>
  <rect x="${x}" y="${y + capH}" width="${w}" height="${h}" rx="${w * 0.18}" fill="${body}"/>
  ${label(x, y + capH, w, h, accent)}`
}

function jar(x, y, w, h, body, accent) {
  const lidH = h * 0.22
  return `
  <rect x="${x}" y="${y}" width="${w}" height="${lidH}" rx="14" fill="${accent}"/>
  <rect x="${x + w * 0.05}" y="${y + lidH}" width="${w * 0.9}" height="${h - lidH}" rx="18" fill="${body}"/>
  ${label(x, y + lidH, w, h - lidH, accent)}`
}

function tube(x, y, w, h, body, accent) {
  const capH = h * 0.14
  return `
  <rect x="${x + w * 0.2}" y="${y}" width="${w * 0.6}" height="${capH}" rx="6" fill="${accent}"/>
  <path d="M ${x} ${y + capH + h} L ${x + w * 0.06} ${y + capH} L ${x + w * 0.94} ${y + capH} L ${x + w} ${y + capH + h} Z" fill="${body}"/>
  ${label(x, y + capH, w, h, accent)}`
}


function flacon(x, y, w, h, body, accent) {
  const neckW = w * 0.26
  const capH = h * 0.16
  return `
  <rect x="${x + (w - neckW) / 2}" y="${y}" width="${neckW}" height="${capH}" rx="5" fill="${accent}"/>
  <path d="M ${x + (w - neckW) / 2} ${y + capH} C ${x - w * 0.02} ${y + h * 0.45}, ${x} ${y + h}, ${x + w * 0.1} ${y + h}
           L ${x + w * 0.9} ${y + h} C ${x + w} ${y + h}, ${x + w + w * 0.02} ${y + h * 0.45}, ${x + (w + neckW) / 2} ${y + capH} Z" fill="${body}"/>
  ${label(x, y + h * 0.3, w, h * 0.5, accent)}`
}

function pump(x, y, w, h, body, accent) {
  const neckW = w * 0.3
  const capH = h * 0.16
  return `
  <rect x="${x + w * 0.34}" y="${y}" width="${w * 0.5}" height="${capH * 0.3}" rx="4" fill="${accent}"/>
  <rect x="${x + (w - neckW) / 2}" y="${y + capH * 0.2}" width="${neckW}" height="${capH}" rx="5" fill="${accent}"/>
  <rect x="${x}" y="${y + capH}" width="${w}" height="${h}" rx="${w * 0.22}" fill="${body}"/>
  ${label(x, y + capH, w, h, accent)}`
}

function spray(x, y, w, h, body, accent) {
  const capH = h * 0.2
  const neckW = w * 0.3
  return `
  <rect x="${x + (w - neckW) / 2}" y="${y}" width="${neckW}" height="${capH}" rx="7" fill="${accent}" opacity="0.9"/>
  <rect x="${x + w * 0.08}" y="${y + capH}" width="${w * 0.84}" height="${h}" rx="${w * 0.16}" fill="${body}"/>
  <circle cx="${x + w * 0.3}" cy="${y + capH * 0.35}" r="4" fill="#ffffff" opacity="0.8"/>
  <circle cx="${x + w * 0.22}" cy="${y + capH * 0.18}" r="3" fill="#ffffff" opacity="0.6"/>
  ${label(x, y + capH, w, h, accent)}`
}

function dropper(x, y, w, h, body, accent) {
  const neckW = w * 0.3
  const capH = h * 0.18
  return `
  <rect x="${x + (w - neckW) / 2}" y="${y}" width="${neckW}" height="${capH}" rx="8" fill="${accent}"/>
  <rect x="${x + (w - neckW) / 2 - 3}" y="${y + capH - 10}" width="${neckW + 6}" height="12" rx="4" fill="${accent}" opacity="0.85"/>
  <rect x="${x}" y="${y + capH}" width="${w}" height="${h}" rx="${w * 0.16}" fill="${body}"/>
  ${label(x, y + capH, w, h, accent)}`
}

const shapes = { bottle, jar, tube, flacon, pump, spray, dropper }

for (const it of items) {
  const cx = W / 2
  const bw = 240
  const bh = 420
  const x = cx - bw / 2
  const y = (H - bh) / 2 - 10
  const draw = shapes[it.shape]
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}" role="img">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${it.bg[0]}"/>
      <stop offset="100%" stop-color="${it.bg[1]}"/>
    </linearGradient>
    <radialGradient id="halo" cx="0.5" cy="0.42" r="0.55">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.75"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
    <filter id="shadow" x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="18" stdDeviation="22" flood-color="#8a7454" flood-opacity="0.28"/>
    </filter>
  </defs>
  <rect width="${W}" height="${H}" fill="url(#bg)"/>
  <circle cx="${cx}" cy="${H * 0.44}" r="${W * 0.42}" fill="url(#halo)"/>
  <ellipse cx="${cx}" cy="${y + bh + 34}" rx="${bw * 0.62}" ry="26" fill="#8a7454" opacity="0.16"/>
  <g filter="url(#shadow)">
    ${draw(x, y, bw, bh, it.body, it.accent)}
  </g>
  <text x="${cx}" y="${H - 54}" text-anchor="middle" font-family="Georgia, serif" font-size="30" letter-spacing="6" fill="${it.accent}">ESTÉTICA GUION</text>
</svg>
`
  writeFileSync(join(outDir, it.file), svg, 'utf8')
  console.log('ok', it.file)
}
