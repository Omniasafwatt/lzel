// Builds every Smart Home image: product-page scenes and category banners.
// Drawn scenes (SVG) + real product cut-outs, lit to match the scene, then a
// photographic finishing pass (grade, bloom, vignette, grain).
// Run: node scripts/generate-smart-home-scenes.mjs [MODEL ... | banners]
import sharp from 'sharp'
import { mkdirSync } from 'node:fs'

const SRC = 'src/assets/smart home'
const OUT = `${SRC}/scenes`
const BANNERS = 'src/assets/banners/smart-home'
const CAM = `${SRC}/Eva Security Cam- aslitec`

// model → [cut-out photo, kind]
const PRODUCTS = {
  'JS-G20':  [`${CAM}/JS-G20/1.webp`, 'ptz'],
  'JS-R02':  [`${CAM}/JS-R02/r02-1.webp`, 'solar'],
  'JS-R03':  [`${CAM}/JS-R03/3.webp`, 'doorbell'],
  'BRZ-A09': [`${SRC}/1x/BRZ-A09.webp`, 'fan'],
  'CMA660':  [`${SRC}/1x/CMA660.webp`, 'fan'],
  'VAS-302': [`${SRC}/3x/VAS-302.webp`, 'humidifier'],
  'VR-A807': [`${SRC}/3x/VR-A807B.webp`, 'portable'],
  'VRM-370': [`${SRC}/3x/VRM-370.webp`, 'clock'],
  'MGQV2C':  [`${SRC}/2x/MGQV2C.webp`, 'vent'],
  'MGP40S':  [`${SRC}/2x/MGP40S.webp`, 'mount'],
  'MGTM40':  [`${SRC}/2x/MGTM40.webp`, 'mount'],
  'MCET2M':  [`${SRC}/2x/MCET2M.webp`, 'mount'],
  'MGD10X2': [`${SRC}/2x/MGD10X2.webp`, 'stand'],
  'MGE10X':  [`${SRC}/2x/MGE10X.webp`, 'mount'],
  'RDGM44':  [`${SRC}/2x/RDGM44.webp`, 'mount'],
  'DXM12T':  [`${SRC}/2x/DXM12T.webp`, 'mount'],
  'MCDY1H':  [`${SRC}/2x/MCDY1H.webp`, 'mount'],
}
const IMG = Object.fromEntries(Object.entries(PRODUCTS).map(([m, [p]]) => [m, p]))
IMG['VR-A807W'] = `${SRC}/3x/VR-A807W.webp`

// aslitec palette
const C = { orange: '#D4693A', navy: '#2d3444', ink: '#12171f', cream: '#F7F3EE', sand: '#E8E4DF' }

// ── SVG helpers ──────────────────────────────────────────────────────────────
const blurs = [2, 3, 4, 6, 8, 10, 14, 20, 28, 40, 60]
const DEFS = `<defs>
  ${blurs.map((b) => `<filter id="b${b}" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="${b}"/></filter>`).join('')}
  <filter id="sh" x="-50%" y="-400%" width="200%" height="900%"><feGaussianBlur stdDeviation="14"/></filter>
  <filter id="sh2" x="-50%" y="-400%" width="200%" height="900%"><feGaussianBlur stdDeviation="4"/></filter>
</defs>`
const svg = (W, H, body) => `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}">${DEFS}${body}</svg>`
const buf = (W, H, body) => Buffer.from(svg(W, H, body))
const lin = (id, stops, [x1, y1, x2, y2] = [0, 0, 0, 1]) =>
  `<linearGradient id="${id}" x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}">${stops
    .map(([o, c, a = 1]) => `<stop offset="${o}" stop-color="${c}" stop-opacity="${a}"/>`).join('')}</linearGradient>`
const rad = (id, c, a = 1, mid = 0) =>
  `<radialGradient id="${id}"><stop offset="0" stop-color="${c}" stop-opacity="${a}"/>${mid ? `<stop offset="${mid}" stop-color="${c}" stop-opacity="${a * 0.45}"/>` : ''}<stop offset="1" stop-color="${c}" stop-opacity="0"/></radialGradient>`

// Procedural texture: a rect filled with coloured noise (wood, plaster, leather…)
let texN = 0
function tex(x, y, w, h, { fx, fy = fx, oct = 3, seed = 2, rgb = [0, 0, 0], a = 1, b = -0.4, blur = 0 }) {
  const id = `t${texN++}`
  const [r, g, bl] = rgb.map((v) => (v / 255).toFixed(3))
  return `<filter id="${id}" x="${x}" y="${y}" width="${w}" height="${h}" filterUnits="userSpaceOnUse">
    <feTurbulence type="fractalNoise" baseFrequency="${fx} ${fy}" numOctaves="${oct}" seed="${seed}" result="n"/>
    <feColorMatrix in="n" type="matrix" values="0 0 0 0 ${r}  0 0 0 0 ${g}  0 0 0 0 ${bl}  ${a} 0 0 0 ${b}" result="c"/>
    ${blur ? `<feGaussianBlur in="c" stdDeviation="${blur}" result="c"/>` : ''}
    <feComposite in="c" in2="SourceGraphic" operator="in"/></filter>
    <rect x="${x}" y="${y}" width="${w}" height="${h}" fill="#000" filter="url(#${id})"/>`
}
const wood = (x, y, w, h, dark = [70, 40, 22], k = 1) =>
  tex(x, y, w, h, { fx: 0.0025, fy: 0.08 / k, oct: 4, seed: 7, rgb: dark, a: 1.5, b: -0.55 }) +
  tex(x, y, w, h, { fx: 0.02, fy: 0.5, oct: 2, seed: 3, rgb: dark, a: 0.6, b: -0.3 })
const plaster = (x, y, w, h, s = 1) =>
  tex(x, y, w, h, { fx: 0.004, oct: 3, seed: 11, rgb: [90, 70, 50], a: 0.35 * s, b: -0.12 }) +
  tex(x, y, w, h, { fx: 0.7, oct: 2, seed: 5, rgb: [60, 50, 40], a: 0.25 * s, b: -0.08 })
const leather = (x, y, w, h) =>
  tex(x, y, w, h, { fx: 0.35, oct: 3, seed: 9, rgb: [0, 0, 0], a: 0.7, b: -0.2 }) +
  tex(x, y, w, h, { fx: 0.006, oct: 2, seed: 4, rgb: [255, 255, 255], a: 0.12, b: -0.03 })

// Background props (drawn sharp, usually wrapped in a blur group)
const plant = (x, y, s, leaf = '#6f8f5a', leaf2 = '#566f45', pot = '#d8c9b6') => {
  // fiddle-leaf fig: a trunk with broad leaves climbing it
  const leaves = Array.from({ length: 13 }, (_, i) => {
    const t = i / 12, side = i % 2 ? 1 : -1
    const ly = y - (70 + t * 230) * s, lx = x + side * (18 + (1 - Math.abs(t - 0.6)) * 34) * s + Math.sin(i * 2.1) * 8 * s
    const sz = (0.75 + Math.sin(t * 3.1) * 0.35) * s
    return `<line x1="${x}" y1="${ly + 10 * s}" x2="${lx}" y2="${ly}" stroke="#4f5f3c" stroke-width="${3 * s}"/>
      <ellipse cx="${lx + side * 12 * sz}" cy="${ly - 6 * sz}" rx="${30 * sz}" ry="${44 * sz}" transform="rotate(${side * (40 + (i % 3) * 12)} ${lx} ${ly})" fill="${i % 3 ? leaf : leaf2}"/>`
  }).join('')
  return `<g><path d="M${x} ${y - 60 * s} C${x - 6 * s} ${y - 160 * s} ${x + 8 * s} ${y - 240 * s} ${x} ${y - 300 * s}" stroke="#5b4a3a" stroke-width="${6 * s}" fill="none"/>${leaves}
  <path d="M${x - 46 * s} ${y - 62 * s} h${92 * s} l${-12 * s} ${62 * s} h${-68 * s} Z" fill="${pot}"/>
  <rect x="${x - 50 * s}" y="${y - 66 * s}" width="${100 * s}" height="${10 * s}" rx="${4 * s}" fill="${pot}"/></g>`
}
// Palm-frond shadow cast on a wall
const frond = (x, y, s, rot, col = '#3b2a1e', op = 0.14, bl = 6) => `<g transform="rotate(${rot} ${x} ${y})" opacity="${op}" filter="url(#b${bl})">
  <rect x="${x}" y="${y - 3 * s}" width="${520 * s}" height="${6 * s}" fill="${col}"/>
  ${Array.from({ length: 16 }, (_, i) => {
    const px = x + (40 + i * 28) * s, l = (150 - i * 7) * s
    return [-1, 1].map((d) => `<ellipse cx="${px + l * 0.25}" cy="${y + d * l * 0.48}" rx="${11 * s}" ry="${l * 0.52}" transform="rotate(${-d * 32} ${px + l * 0.25} ${y + d * l * 0.48})" fill="${col}"/>`).join('')
  }).join('')}</g>`
// Window light falling on a surface: skewed panes
const gobo = (x, y, pw, ph, cols, rows, sk, col, op, bl = 10) => `<g transform="translate(${x} ${y}) skewX(${sk})" opacity="${op}" filter="url(#b${bl})">
  ${Array.from({ length: cols * rows }, (_, i) => `<rect x="${(i % cols) * pw * 1.12}" y="${Math.floor(i / cols) * ph * 1.08}" width="${pw}" height="${ph}" fill="${col}"/>`).join('')}</g>`
const bokeh = (pts, col, op = 0.5) => pts.map(([x, y, r], i) => `<circle cx="${x}" cy="${y}" r="${r}" fill="${Array.isArray(col) ? col[i % col.length] : col}" opacity="${op * (0.6 + (i % 3) * 0.2)}" filter="url(#b${r > 30 ? 6 : 3})"/>`).join('')
// Cylinder podium: top ellipse at (cx, top)
const cyl = (cx, top, w, h, [l, m, d, t]) => {
  const id = `cy${texN++}`
  return `<defs>${lin(id, [[0, l], [0.55, m], [1, d]], [0, 0, 1, 0])}</defs>
  <rect x="${cx - w / 2}" y="${top}" width="${w}" height="${h}" fill="url(#${id})"/>
  <ellipse cx="${cx}" cy="${top + h}" rx="${w / 2}" ry="${w * 0.09}" fill="${d}"/>
  <ellipse cx="${cx}" cy="${top}" rx="${w / 2}" ry="${w * 0.09}" fill="${t}"/>`
}

// ── Scenes ───────────────────────────────────────────────────────────────────
// Each returns { bg, floor, light: [x, y] (0–1), grade, reflect }
const SCENES = {
  // Moody warm room, sunlit wooden table (EZVIZ T33 hero mood)
  desk: (W, H) => {
    const f = H * 0.64
    return {
      floor: f + H * 0.06, light: [0.8, 0.1], reflect: 0.12,
      grade: { tint: [255, 170, 110, 0.14], bloom: [0.78, 0.18, 0.45, '#ffcf98', 0.5], vig: 0.45 },
      bg: svg(W, H, `<defs>${lin('wl', [[0, '#231a15'], [0.6, '#3b2d24'], [1, '#54402f']], [0, 0, 1, 0])}${lin('tb', [[0, '#b07c52'], [0.5, '#8a5a39'], [1, '#4d301e']])}</defs>
        <rect width="${W}" height="${H}" fill="url(#wl)"/>
        ${plaster(0, 0, W, f, 0.6)}
        ${gobo(W * 0.5, H * 0.05, W * 0.08, H * 0.22, 3, 2, -22, '#ffd3a0', 0.28, 14)}
        <g filter="url(#b14)">${plant(W * 0.12, f + 6, H / 520, '#3e4a33', '#2f3a28', '#5a4a3c')}
          <rect x="${W * 0.27}" y="${f - H * 0.3}" width="${W * 0.012}" height="${H * 0.3}" fill="#1b1512"/>
          <ellipse cx="${W * 0.276}" cy="${f - H * 0.32}" rx="${W * 0.05}" ry="${H * 0.06}" fill="#e8c9a0" opacity=".8"/></g>
        ${bokeh([[W * 0.3, f - H * 0.33, H * 0.05]], '#ffdcae', 0.5)}
        <rect y="${f}" width="${W}" height="${H - f}" fill="url(#tb)"/>
        ${wood(0, f, W, H - f)}
        <polygon points="${W * 0.42},${f} ${W},${f} ${W},${f + H * 0.2} ${W * 0.3},${H}" fill="#ffd7a6" opacity=".22" filter="url(#b40)"/>
        <rect y="${f}" width="${W}" height="3" fill="#e2b083" opacity=".7"/>
        <rect y="${f + 3}" width="${W}" height="${H * 0.05}" fill="#000" opacity=".12" filter="url(#b6)"/>`),
    }
  },

  // Airy cream wall, palm shadows, oak floating shelf
  shelf: (W, H) => {
    const f = H * 0.7
    return {
      floor: f, light: [0.15, 0.05], reflect: 0,
      grade: { tint: [255, 214, 170, 0.1], bloom: [0.15, 0.1, 0.5, '#fff3df', 0.45], vig: 0.22 },
      bg: svg(W, H, `<defs>${lin('wl', [[0, '#f7efe5'], [1, '#e7d5c1']], [0, 0, 1, 1])}${lin('sf', [[0, '#d6b48d'], [1, '#b98d63']])}</defs>
        <rect width="${W}" height="${H}" fill="url(#wl)"/>
        ${plaster(0, 0, W, H)}
        ${gobo(W * 0.05, -H * 0.05, W * 0.16, H * 0.3, 3, 2, -18, '#fff8ec', 0.45, 20)}
        ${frond(W * 0.62, H * 0.08, W / 1400, 20)}${frond(W * 0.75, H * 0.3, W / 1600, -15, '#3b2a1e', 0.1, 8)}
        <rect x="0" y="${f}" width="${W}" height="${H * 0.025}" fill="#e7cfb2"/>
        <rect x="0" y="${f + H * 0.025}" width="${W}" height="${H * 0.045}" fill="url(#sf)"/>
        ${wood(0, f, W, H * 0.07, [80, 50, 25], 0.6)}
        <rect x="0" y="${f + H * 0.07}" width="${W}" height="${H * 0.08}" fill="#5a3e28" opacity=".22" filter="url(#b14)"/>
        <g>
          <path d="M${W * 0.12} ${f} q-${W * 0.035} -${H * 0.1} 0 -${H * 0.17} h${W * 0.04} q${W * 0.035} ${H * 0.07} 0 ${H * 0.17} Z" fill="#cfa98a"/>
          <rect x="${W * 0.128}" y="${f - H * 0.24}" width="${W * 0.024}" height="${H * 0.08}" fill="#c49b7b"/>
          <path d="M${W * 0.14} ${f - H * 0.24} q-${W * 0.02} -${H * 0.12} -${W * 0.05} -${H * 0.16}" stroke="#7e8f63" stroke-width="3" fill="none"/>
          <ellipse cx="${W * 0.088}" cy="${f - H * 0.4}" rx="${W * 0.012}" ry="${H * 0.03}" fill="#8fa06f"/>
        </g>`),
    }
  },

  // Plaster wall with palm shadow (wall-mounted shots)
  wall: (W, H) => ({
    floor: null, light: [0.1, 0.0],
    grade: { tint: [255, 212, 168, 0.12], bloom: [0.15, 0.05, 0.6, '#fff1dc', 0.5], vig: 0.28 },
    bg: svg(W, H, `<defs>${lin('wl', [[0, '#f2e9df'], [1, '#d4c3b0']], [0, 0, 1, 1])}</defs>
      <rect width="${W}" height="${H}" fill="url(#wl)"/>
      ${plaster(0, 0, W, H, 1.3)}
      ${gobo(-W * 0.05, -H * 0.1, W * 0.18, H * 0.34, 2, 2, -20, '#fff7ea', 0.5, 20)}
      ${frond(-W * 0.05, H * 0.75, W / 1100, -30, '#3b2a1e', 0.16, 6)}
      ${frond(W * 0.05, H * 0.95, W / 1300, -50, '#3b2a1e', 0.11, 10)}`),
  }),

  // Modern house in soft focus, sunlit render wall in front (right)
  exterior: (W, H) => ({
    floor: null, light: [0.05, 0.05],
    grade: { tint: [255, 214, 170, 0.12], bloom: [0.08, 0.05, 0.5, '#fff3dc', 0.55], vig: 0.3 },
    bg: svg(W, H, `<defs>${lin('sky', [[0, '#8fb1cf'], [0.6, '#cfdbe3'], [1, '#f2ece2']])}${lin('pn', [[0, '#efe8de'], [1, '#cdc2b3']], [0, 0, 1, 1])}${lin('gl', [[0, '#2a3a4c'], [0.5, '#5c7591'], [1, '#22303e']], [0, 0, 1, 1])}</defs>
      <rect width="${W}" height="${H}" fill="url(#sky)"/>
      ${tex(0, 0, W, H * 0.5, { fx: 0.004, fy: 0.01, oct: 4, seed: 21, rgb: [255, 255, 255], a: 1.6, b: -0.75 })}
      <g filter="url(#b28)">
        ${[[-0.02, 0.5, 0.17, '#6d8a55'], [0.08, 0.42, 0.13, '#7c9a62'], [0.5, 0.48, 0.1, '#6a8752'], [0.57, 0.4, 0.08, '#7f9c66']].map(([x, y, r, c]) => `<circle cx="${W * x}" cy="${H * y}" r="${H * r * 2}" fill="${c}"/>`).join('')}
        <rect x="${W * 0.06}" y="${H * 0.3}" width="${W * 0.5}" height="${H * 0.5}" fill="#f3efe8"/>
        <rect x="${W * 0.02}" y="${H * 0.26}" width="${W * 0.58}" height="${H * 0.045}" fill="#e9e3da"/>
        <rect x="${W * 0.02}" y="${H * 0.305}" width="${W * 0.58}" height="${H * 0.03}" fill="#000" opacity=".12"/>
        <rect x="${W * 0.1}" y="${H * 0.38}" width="${W * 0.2}" height="${H * 0.42}" fill="url(#gl)"/>
        <rect x="${W * 0.32}" y="${H * 0.36}" width="${W * 0.11}" height="${H * 0.44}" fill="#7a5235"/>
        ${Array.from({ length: 9 }, (_, i) => `<rect x="${W * 0.32}" y="${H * (0.37 + i * 0.048)}" width="${W * 0.11}" height="3" fill="#000" opacity=".18"/>`).join('')}
        <rect x="${W * 0.45}" y="${H * 0.4}" width="${W * 0.09}" height="${H * 0.2}" fill="url(#gl)"/>
        <rect x="0" y="${H * 0.76}" width="${W * 0.62}" height="${H * 0.08}" rx="30" fill="#5f7d4a"/>
      </g>
      <rect y="${H * 0.8}" width="${W}" height="${H * 0.2}" fill="#7d9a5f" filter="url(#b20)"/>
      ${tex(0, H * 0.8, W * 0.6, H * 0.2, { fx: 0.05, oct: 3, seed: 8, rgb: [40, 70, 30], a: 0.8, b: -0.3 })}
      <rect x="${W * 0.6}" y="0" width="${W * 0.4}" height="${H}" fill="url(#pn)"/>
      ${plaster(W * 0.6, 0, W * 0.4, H, 1.4)}
      ${frond(W * 0.86, H * 1.02, W / 1500, -60, '#3b2a1e', 0.12, 6)}
      <rect x="${W * 0.6}" y="0" width="${W * 0.012}" height="${H}" fill="#000" opacity=".18" filter="url(#b4)"/>`),
  }),

  // Front door: oak door, render wall, potted plant
  door: (W, H) => ({
    floor: null, light: [0.95, 0.0],
    grade: { tint: [255, 205, 160, 0.12], bloom: [0.9, 0.05, 0.5, '#fff0d8', 0.5], vig: 0.3 },
    bg: svg(W, H, `<defs>${lin('wl', [[0, '#efe7dc'], [1, '#d3c6b6']], [1, 0, 0, 1])}${lin('dr', [[0, '#9a6943'], [0.5, '#7d5233'], [1, '#5d3b23']], [0, 0, 1, 0])}${lin('st', [[0, '#bdb3a6'], [1, '#8f877c']])}</defs>
      <rect width="${W}" height="${H}" fill="url(#wl)"/>
      ${plaster(0, 0, W, H, 1.2)}
      <rect x="${W * 0.11}" y="${H * 0.03}" width="${W * 0.38}" height="${H}" fill="#2d2925"/>
      <rect x="${W * 0.13}" y="${H * 0.06}" width="${W * 0.34}" height="${H}" fill="url(#dr)"/>
      ${tex(W * 0.13, H * 0.06, W * 0.34, H, { fx: 0.09, fy: 0.003, oct: 4, seed: 12, rgb: [50, 28, 14], a: 1.4, b: -0.5 })}
      <rect x="${W * 0.43}" y="${H * 0.36}" width="${W * 0.01}" height="${H * 0.34}" rx="3" fill="#d8d4cc"/>
      <rect x="${W * 0.432}" y="${H * 0.36}" width="${W * 0.003}" height="${H * 0.34}" fill="#fff" opacity=".7"/>
      <rect x="${W * 0.47}" y="${H * 0.06}" width="${W * 0.018}" height="${H}" fill="#000" opacity=".15" filter="url(#b6)"/>
      ${gobo(W * 0.62, -H * 0.05, W * 0.1, H * 0.35, 2, 2, 18, '#fff7e8', 0.4, 16)}
      ${frond(W * 1.05, H * 0.15, W / 1400, 160, '#3b2a1e', 0.12, 8)}
      <rect y="${H * 0.9}" width="${W}" height="${H * 0.1}" fill="url(#st)"/>
      ${tex(0, H * 0.9, W, H * 0.1, { fx: 0.3, oct: 3, seed: 6, rgb: [60, 55, 50], a: 0.5, b: -0.2 })}
      <g filter="url(#b10)">${plant(W * 0.55, H * 0.92, H / 700, '#6c8c55', '#547043', '#e2d6c5')}</g>`),
  }),

  // Night: moonlit room, fairy lights, warm night-light glow
  night: (W, H) => {
    const f = H * 0.72
    return {
      floor: f, light: [0.25, 0.2], reflect: 0.15, night: true,
      grade: { tint: [90, 120, 190, 0.18], bloom: [0.72, 0.72, 0.3, '#ff9a5a', 0.35], vig: 0.5 },
      bg: svg(W, H, `<defs>${lin('wl', [[0, '#0f1420'], [1, '#232c40']], [0, 0, 1, 1])}${lin('sh', [[0, '#3c4660'], [1, '#262e40']])}</defs>
        <rect width="${W}" height="${H}" fill="url(#wl)"/>
        ${plaster(0, 0, W, H, 0.5)}
        ${gobo(W * 0.04, H * 0.06, W * 0.1, H * 0.2, 2, 2, -15, '#a9c3ef', 0.22, 10)}
        <g filter="url(#b14)">
          <rect x="${W * 0.02}" y="${H * 0.56}" width="${W * 0.5}" height="${H * 0.5}" rx="40" fill="#2a3550"/>
          <rect x="${W * 0.04}" y="${H * 0.5}" width="${W * 0.16}" height="${H * 0.12}" rx="30" fill="#3a4866"/>
          <rect x="${W * 0.22}" y="${H * 0.5}" width="${W * 0.16}" height="${H * 0.12}" rx="30" fill="#34415e"/>
        </g>
        <path d="M0 ${H * 0.1} Q${W * 0.3} ${H * 0.2} ${W * 0.6} ${H * 0.08} T${W} ${H * 0.12}" stroke="#55493c" stroke-width="1.5" fill="none" opacity=".6"/>
        ${bokeh(Array.from({ length: 14 }, (_, i) => [W * (0.03 + i * 0.07), H * (0.12 + Math.sin(i * 1.3) * 0.04 + (i % 2) * 0.03), H * 0.018]), '#ffc98a', 0.9)}
        <rect x="${W * 0.5}" y="${f}" width="${W * 0.5}" height="${H * 0.04}" fill="#4a556f"/>
        <rect x="${W * 0.5}" y="${f + H * 0.04}" width="${W * 0.5}" height="${H}" fill="url(#sh)"/>
        ${wood(W * 0.5, f, W * 0.5, H, [10, 14, 24])}`),
    }
  },

  // Bright living room: sheer curtains, sun patch, sofa, art, monstera
  living: (W, H) => {
    const f = H * 0.8
    return {
      floor: f + H * 0.03, light: [0.75, 0.05], reflect: 0.08,
      grade: { tint: [255, 210, 160, 0.12], bloom: [0.72, 0.15, 0.5, '#fff4e0', 0.6], vig: 0.25 },
      bg: svg(W, H, `<defs>${lin('wl', [[0, '#f7efe5'], [1, '#e6d8c7']], [0, 0, 1, 0])}${lin('wd', [[0, '#c9a07a'], [1, '#e2c4a0']])}${lin('cu', [[0, '#ffffff', 0.9], [1, '#f2ebe2', 0.9]], [0, 0, 1, 0])}</defs>
        <rect width="${W}" height="${H}" fill="url(#wl)"/>
        ${plaster(0, 0, W, f, 0.6)}
        <g filter="url(#b10)">
          <rect x="${W * 0.56}" y="0" width="${W * 0.34}" height="${f}" fill="#fffdf8"/>
          ${Array.from({ length: 10 }, (_, i) => `<rect x="${W * (0.55 + i * 0.036)}" y="0" width="${W * 0.03}" height="${f}" fill="url(#cu)" opacity="${0.5 + (i % 3) * 0.15}"/>`).join('')}
          <rect x="${W * 0.04}" y="${f - H * 0.3}" width="${W * 0.4}" height="${H * 0.25}" rx="36" fill="#dacdbd"/>
          <rect x="${W * 0.06}" y="${f - H * 0.4}" width="${W * 0.36}" height="${H * 0.16}" rx="28" fill="#e6dccf"/>
          <rect x="${W * 0.09}" y="${f - H * 0.38}" width="${W * 0.08}" height="${H * 0.12}" rx="22" fill="${C.orange}" opacity=".75"/>
          <rect x="${W * 0.3}" y="${f - H * 0.37}" width="${W * 0.07}" height="${H * 0.11}" rx="22" fill="#b9a68f"/>
          <rect x="${W * 0.14}" y="${H * 0.1}" width="${W * 0.18}" height="${H * 0.26}" fill="#fbf7f1" stroke="#c9b59c" stroke-width="6"/>
          <circle cx="${W * 0.23}" cy="${H * 0.27}" r="${H * 0.08}" fill="${C.orange}" opacity=".7"/>
          <rect x="${W * 0.16}" y="${H * 0.27}" width="${W * 0.14}" height="${H * 0.07}" fill="${C.navy}" opacity=".75"/>
          ${plant(W * 0.48, f, H / 420)}
        </g>
        <rect y="${f}" width="${W}" height="${H - f}" fill="url(#wd)"/>
        ${wood(0, f, W, H - f, [90, 55, 30], 0.5)}
        ${Array.from({ length: 8 }, (_, i) => `<line x1="${W * (i * 0.15 - 0.1)}" y1="${f}" x2="${W * (i * 0.2 - 0.3)}" y2="${H}" stroke="#7a5638" stroke-width="1.5" opacity=".25"/>`).join('')}
        <polygon points="${W * 0.55},${f} ${W * 0.92},${f} ${W * 0.8},${H} ${W * 0.3},${H}" fill="#fff6e6" opacity=".35" filter="url(#b20)"/>
        <rect y="${f}" width="${W}" height="2" fill="#000" opacity=".1"/>`),
    }
  },

  // Bedroom: upholstered headboard, linen bed, glowing lamp, oak nightstand
  bedroom: (W, H) => {
    const f = H * 0.62
    return {
      floor: f, light: [0.85, 0.2], reflect: 0.1,
      grade: { tint: [255, 180, 120, 0.16], bloom: [0.86, 0.22, 0.4, '#ffbf80', 0.65], vig: 0.35 },
      bg: svg(W, H, `<defs>${lin('wl', [[0, '#eadccb'], [1, '#cdb59c']], [0, 0, 1, 0])}${lin('ns', [[0, '#c4956b'], [1, '#8a6040']])}${lin('dv', [[0, '#fbf8f3'], [1, '#e6ddd1']])}</defs>
        <rect width="${W}" height="${H}" fill="url(#wl)"/>
        ${plaster(0, 0, W, H, 0.7)}
        <g filter="url(#b14)">
          <rect x="${-W * 0.05}" y="${H * 0.18}" width="${W * 0.55}" height="${H * 0.45}" rx="30" fill="#c2a88c"/>
          ${Array.from({ length: 7 }, (_, i) => `<rect x="${W * (-0.03 + i * 0.075)}" y="${H * 0.2}" width="4" height="${H * 0.4}" fill="#000" opacity=".1"/>`).join('')}
          <rect x="${-W * 0.05}" y="${H * 0.5}" width="${W * 0.58}" height="${H * 0.6}" rx="40" fill="url(#dv)"/>
          <rect x="${W * 0.02}" y="${H * 0.4}" width="${W * 0.2}" height="${H * 0.15}" rx="34" fill="#fffdf9"/>
          <rect x="${W * 0.24}" y="${H * 0.42}" width="${W * 0.18}" height="${H * 0.14}" rx="34" fill="#f6f0e8"/>
          <rect x="${W * 0.3}" y="${H * 0.62}" width="${W * 0.25}" height="${H * 0.5}" rx="20" fill="${C.orange}" opacity=".55"/>
          <path d="M${W * 0.78} ${H * 0.06} h${W * 0.12} l${W * 0.02} ${H * 0.16} h${-W * 0.16} Z" fill="#fff0da"/>
          <rect x="${W * 0.835}" y="${H * 0.22}" width="${W * 0.01}" height="${f - H * 0.22}" fill="#9c8670"/>
        </g>
        <rect x="${W * 0.5}" y="${f}" width="${W * 0.55}" height="${H * 0.03}" fill="#dcb088"/>
        <rect x="${W * 0.5}" y="${f + H * 0.03}" width="${W * 0.55}" height="${H}" fill="url(#ns)"/>
        ${wood(W * 0.5, f, W * 0.55, H)}
        <rect x="${W * 0.53}" y="${f + H * 0.2}" width="${W * 0.47}" height="3" fill="#000" opacity=".25"/>
        <rect x="${W * 0.73}" y="${f + H * 0.1}" width="${W * 0.06}" height="${H * 0.012}" rx="4" fill="#3a2a1e" opacity=".5"/>`),
    }
  },

  // Home office: glowing monitor, books, plant, oak desk
  office: (W, H) => {
    const f = H * 0.66
    return {
      floor: f + H * 0.05, light: [0.1, 0.1], reflect: 0.08,
      grade: { tint: [255, 215, 175, 0.1], bloom: [0.1, 0.1, 0.45, '#fff6e6', 0.5], vig: 0.3 },
      bg: svg(W, H, `<defs>${lin('wl', [[0, '#f0ebe4'], [1, '#d9d1c6']], [0, 0, 1, 0])}${lin('dk', [[0, '#e2c5a2'], [1, '#c09a73']])}${lin('sc', [[0, '#e0874f'], [0.5, '#3d4d6a'], [1, '#1f2838']], [0, 0, 1, 1])}</defs>
        <rect width="${W}" height="${H}" fill="url(#wl)"/>
        ${plaster(0, 0, W, f, 0.7)}
        ${gobo(-W * 0.02, H * 0.02, W * 0.1, H * 0.25, 3, 2, -22, '#fff8ec', 0.35, 16)}
        <g filter="url(#b14)">
          <rect x="${W * 0.1}" y="${H * 0.16}" width="${W * 0.4}" height="${H * 0.34}" rx="10" fill="#1d2027"/>
          <rect x="${W * 0.112}" y="${H * 0.175}" width="${W * 0.376}" height="${H * 0.3}" fill="url(#sc)"/>
          <rect x="${W * 0.28}" y="${H * 0.5}" width="${W * 0.04}" height="${H * 0.16}" fill="#2a2e35"/>
          <rect x="${W * 0.6}" y="${H * 0.24}" width="${W * 0.38}" height="${H * 0.02}" fill="#c8a681"/>
          ${['#c96b40', C.navy, '#d9c7ad', '#7f8f75', '#b8846b', '#384055'].map((c, i) => `<rect x="${W * (0.62 + i * 0.032)}" y="${H * (0.1 + (i % 3) * 0.02)}" width="${W * 0.028}" height="${H * (0.14 - (i % 3) * 0.02)}" fill="${c}"/>`).join('')}
          ${plant(W * 0.9, H * 0.24, H / 900)}
        </g>
        ${bokeh([[W * 0.2, H * 0.3, H * 0.03], [W * 0.38, H * 0.25, H * 0.02]], '#ffb27a', 0.4)}
        <rect y="${f}" width="${W}" height="${H - f}" fill="url(#dk)"/>
        ${wood(0, f, W, H - f, [110, 70, 35])}
        <rect y="${f}" width="${W}" height="3" fill="#f0dcc2"/>
        <g filter="url(#b4)"><rect x="${W * 0.06}" y="${f - H * 0.02}" width="${W * 0.07}" height="${H * 0.14}" rx="8" fill="#f4efe8"/><rect x="${W * 0.06}" y="${f + H * 0.02}" width="${W * 0.07}" height="${H * 0.02}" fill="${C.orange}"/></g>`),
    }
  },

  // Car interior: golden-hour (or night city) road through the windscreen
  car: (W, H, night = false) => {
    const d = H * 0.7
    const hz = H * 0.46
    return {
      floor: d + H * 0.03, light: night ? [0.5, 0.3] : [0.6, 0.35], reflect: 0.12, night,
      grade: night ? { tint: [80, 110, 180, 0.15], bloom: [0.5, 0.42, 0.5, '#ff9e5c', 0.35], vig: 0.5 }
                   : { tint: [255, 180, 110, 0.16], bloom: [0.62, 0.4, 0.45, '#ffd59a', 0.7], vig: 0.4 },
      bg: svg(W, H, `<defs>${lin('sky', night ? [[0, '#0d1220'], [0.7, '#2b3550'], [1, '#6b4c4a']] : [[0, '#7fa3c4'], [0.55, '#f0c999'], [1, '#f6a36a']])}
        ${lin('rd', [[0, night ? '#2a2e38' : '#a39a90'], [1, night ? '#15171d' : '#6f6a64']])}${lin('dh', [[0, '#3a3e46'], [0.3, '#202328'], [1, '#0e0f12']])}</defs>
        <rect width="${W}" height="${H}" fill="url(#sky)"/>
        ${night ? '' : tex(0, 0, W, hz, { fx: 0.003, fy: 0.012, oct: 4, seed: 30, rgb: [255, 236, 214], a: 1.5, b: -0.7 })}
        <g filter="url(#b8)">
          <polygon points="${W * 0.47},${hz} ${W * 0.53},${hz} ${W * 0.95},${d} ${W * 0.05},${d}" fill="url(#rd)"/>
          ${[0.2, 0.4, 0.62].map((t) => `<polygon points="${W * (0.5 - 0.004 * (1 + t * 8))},${hz + (d - hz) * t} ${W * (0.5 + 0.004 * (1 + t * 8))},${hz + (d - hz) * t} ${W * (0.5 + 0.006 * (1 + t * 10))},${hz + (d - hz) * (t + 0.1)} ${W * (0.5 - 0.006 * (1 + t * 10))},${hz + (d - hz) * (t + 0.1)}" fill="${night ? '#c9b28a' : '#f4efe4'}" opacity=".8"/>`).join('')}
          ${night ? '' : `${[[0.08, 0.36, 0.12], [0.2, 0.4, 0.08], [0.88, 0.37, 0.12], [0.78, 0.41, 0.08], [0.33, 0.43, 0.05], [0.67, 0.43, 0.05]].map(([x, y, r]) => `<circle cx="${W * x}" cy="${H * y}" r="${H * r * 1.6}" fill="#5f7a4c"/>`).join('')}
             <circle cx="${W * 0.62}" cy="${hz - H * 0.02}" r="${H * 0.05}" fill="#fff4dc"/>`}
        </g>
        ${night ? bokeh([[0.12, 0.42, 26], [0.22, 0.47, 18], [0.3, 0.44, 34], [0.4, 0.46, 14], [0.58, 0.45, 22], [0.66, 0.48, 30], [0.75, 0.43, 16], [0.85, 0.46, 38], [0.93, 0.44, 20], [0.48, 0.48, 10], [0.53, 0.49, 9]].map(([x, y, r]) => [W * x, H * y, r * W / 1920 * 2.2]), ['#ffb36b', '#ff6a4d', '#fff1cf', '#ffd27a'], 0.75) : ''}
        <path d="M0 0 H${W} V${H * 0.09} Q${W / 2} ${H * 0.17} 0 ${H * 0.09} Z" fill="#121418"/>
        <polygon points="0,0 ${W * 0.07},0 ${W * 0.02},${d} 0,${d}" fill="#141619"/>
        <polygon points="${W},0 ${W * 0.93},0 ${W * 0.98},${d} ${W},${d}" fill="#141619"/>
        <path d="M0 ${d} Q${W / 2} ${d - H * 0.1} ${W} ${d} V${H} H0 Z" fill="url(#dh)"/>
        ${leather(0, d, W, H - d)}
        <path d="M0 ${d} Q${W / 2} ${d - H * 0.1} ${W} ${d}" stroke="${night ? '#5b6170' : '#8e8a86'}" stroke-width="2.5" fill="none"/>
        <path d="M0 ${d + H * 0.05} Q${W / 2} ${d - H * 0.05} ${W} ${d + H * 0.05}" stroke="${C.orange}" stroke-width="2" stroke-dasharray="10 8" fill="none" opacity=".75"/>
        <path d="M0 ${d + 4} Q${W / 2} ${d - H * 0.1 + 4} ${W} ${d + 4}" stroke="${night ? '#ff9a5a' : '#ffd8a8'}" stroke-width="10" fill="none" opacity=".18" filter="url(#b8)"/>`),
    }
  },
  carNight: (W, H) => SCENES.car(W, H, true),
  exteriorNight: (W, H) => nightify(SCENES.exterior(W, H), W, H, [0.68, 0.15]),
  doorNight: (W, H) => nightify(SCENES.door(W, H), W, H, [0.62, 0.12]),

  // Dashboard air vent close-up
  vent: (W, H) => ({
    floor: null, light: [0.2, 0.0], night: true,
    grade: { tint: [255, 160, 100, 0.1], bloom: [0.12, 0.1, 0.4, '#ff9a5a', 0.35], vig: 0.5 },
    bg: svg(W, H, `<defs>${lin('dh', [[0, '#34373d'], [1, '#141518']])}${lin('cr', [[0, '#e8e9ec'], [0.5, '#8d9097'], [1, '#d4d6da']])}${lin('sl', [[0, '#4a4f58'], [1, '#1c1e22']])}</defs>
      <rect width="${W}" height="${H}" fill="url(#dh)"/>
      ${leather(0, 0, W, H)}
      ${bokeh([[W * 0.08, H * 0.12, H * 0.08], [W * 0.2, H * 0.2, H * 0.05], [W * 0.12, H * 0.3, H * 0.03]], ['#ff9f60', '#7fb2ff', '#ffd9a0'], 0.35)}
      <path d="M0 ${H * 0.25} Q${W * 0.5} ${H * 0.18} ${W} ${H * 0.25}" stroke="${C.orange}" stroke-width="2" stroke-dasharray="10 8" fill="none" opacity=".7"/>
      <rect x="${W * 0.36}" y="${H * 0.4}" width="${W * 0.6}" height="${H * 0.4}" rx="24" fill="url(#cr)"/>
      <rect x="${W * 0.37}" y="${H * 0.415}" width="${W * 0.58}" height="${H * 0.37}" rx="20" fill="#0b0c0e"/>
      ${Array.from({ length: 6 }, (_, i) => `<rect x="${W * 0.39}" y="${H * (0.44 + i * 0.055)}" width="${W * 0.54}" height="${H * 0.024}" rx="5" fill="url(#sl)"/><rect x="${W * 0.39}" y="${H * (0.44 + i * 0.055)}" width="${W * 0.54}" height="1.5" fill="#fff" opacity=".18"/>`).join('')}
      <polygon points="${W * 0.4},${H * 0.4} ${W * 0.5},${H * 0.4} ${W * 0.42},${H * 0.8} ${W * 0.36},${H * 0.8}" fill="#fff" opacity=".05"/>`),
  }),

  // Navy studio, orange rings + glow (dark stat card)
  spot: (W, H) => {
    const f = H * 0.76
    return {
      floor: f, light: [0.5, 0.0], reflect: 0.3, night: true,
      grade: { tint: [255, 140, 80, 0.06], bloom: [0.5, 0.0, 0.35, '#ffffff', 0.2], vig: 0.55 },
      bg: svg(W, H, `<defs>${lin('bg', [[0, '#151a24'], [1, '#2d3444']])}${rad('gl', C.orange, 0.5, 0.4)}${lin('cone', [[0, '#ffffff', 0.22], [1, '#ffffff', 0]])}</defs>
        <rect width="${W}" height="${H}" fill="url(#bg)"/>
        <polygon points="${W * 0.42},0 ${W * 0.58},0 ${W * 0.85},${f} ${W * 0.15},${f}" fill="url(#cone)" filter="url(#b20)"/>
        <ellipse cx="${W / 2}" cy="${f}" rx="${W * 0.5}" ry="${H * 0.22}" fill="url(#gl)"/>
        ${[0.13, 0.21, 0.3, 0.4, 0.52].map((r, i) => `<ellipse cx="${W / 2}" cy="${f}" rx="${W * r}" ry="${W * r * 0.2}" fill="none" stroke="${C.orange}" stroke-width="${3.2 - i * 0.5}" opacity="${0.95 - i * 0.17}"/><ellipse cx="${W / 2}" cy="${f}" rx="${W * r}" ry="${W * r * 0.2}" fill="none" stroke="${C.orange}" stroke-width="10" opacity="${0.18 - i * 0.03}" filter="url(#b6)"/>`).join('')}
        ${bokeh(Array.from({ length: 18 }, (_, i) => [W * ((i * 0.137) % 1), H * (0.08 + ((i * 0.29) % 0.55)), 2 + (i % 3)]), '#ffd6b5', 0.5)}`),
    }
  },

  // Premium cream studio: orange arch, sand sphere, round podium (light stat card)
  studio: (W, H) => {
    const top = H * 0.74
    return {
      floor: top, light: [0.2, 0.0], reflect: 0.18,
      grade: { tint: [255, 214, 175, 0.1], bloom: [0.2, 0.05, 0.5, '#fffaf2', 0.5], vig: 0.22 },
      bg: svg(W, H, `<defs>${lin('bg', [[0, '#fbf7f1'], [0.7, '#f3e9dd'], [1, '#e7d9c8']])}${lin('ar', [[0, '#e49a70'], [1, '#d4693a']])}${rad('sp', '#f6e2cc', 1)}</defs>
        <rect width="${W}" height="${H}" fill="url(#bg)"/>
        ${plaster(0, 0, W, H, 0.4)}
        <path d="M${W * 0.62} ${H * 0.86} V${H * 0.32} a${W * 0.17} ${W * 0.17} 0 0 1 ${W * 0.34} 0 V${H * 0.86} Z" fill="url(#ar)" opacity=".9"/>
        <path d="M${W * 0.62} ${H * 0.86} V${H * 0.32} a${W * 0.17} ${W * 0.17} 0 0 1 ${W * 0.34} 0 V${H * 0.86} Z" fill="#000" opacity=".05" transform="translate(14 10)" filter="url(#b14)"/>
        ${frond(W * 0.75, H * 0.05, W / 1600, 25, '#3b2a1e', 0.09, 8)}
        <rect y="${H * 0.82}" width="${W}" height="${H * 0.18}" fill="#eadccb"/>
        <circle cx="${W * 0.16}" cy="${H * 0.82 - H * 0.08}" r="${H * 0.08}" fill="#e3cdb4"/>
        <circle cx="${W * 0.14}" cy="${H * 0.82 - H * 0.1}" r="${H * 0.03}" fill="#fff" opacity=".35" filter="url(#b6)"/>
        <ellipse cx="${W * 0.5}" cy="${H * 0.865}" rx="${W * 0.26}" ry="${H * 0.03}" fill="#000" opacity=".18" filter="url(#b10)"/>
        ${cyl(W * 0.5, top, W * 0.44, H * 0.12, ['#fbf6ef', '#efe4d6', '#d8c7b3', '#fdfaf6'])}`),
    }
  },

  // Category hero: podiums in front of a navy arch
  podium: (W, H) => {
    const fl = H * 0.86
    return {
      floor: fl, light: [0.3, 0.0], reflect: 0.1,
      grade: { tint: [255, 214, 175, 0.1], bloom: [0.3, 0.0, 0.5, '#fffaf2', 0.5], vig: 0.2 },
      bg: svg(W, H, `<defs>${lin('wl', [[0, '#fbf6f0'], [0.5, '#f4e9dc'], [1, '#ead7c2']], [0, 0, 1, 0])}${lin('ar', [[0, '#3a4357'], [1, '#262c3a']])}${lin('fl', [[0, '#eadccb'], [1, '#f7f1ea']])}${lin('or', [[0, '#e9a079'], [1, '#d4693a']], [0, 0, 1, 0])}</defs>
        <rect width="${W}" height="${H}" fill="url(#wl)"/>
        ${plaster(0, 0, W, H, 0.4)}
        <path d="M${W * 0.55} ${fl} V${H * 0.5} a${W * 0.17} ${W * 0.17} 0 0 1 ${W * 0.34} 0 V${fl} Z" fill="url(#ar)"/>
        <path d="M${W * 0.6} ${fl} V${H * 0.52} a${W * 0.12} ${W * 0.12} 0 0 1 ${W * 0.24} 0 V${fl} Z" fill="#efdcc7"/>
        <rect x="${W * 0.43}" y="${H * 0.12}" width="${W * 0.06}" height="${fl}" rx="${W * 0.03}" fill="url(#or)" opacity=".85"/>
        <rect x="${W * 0.92}" y="${H * 0.06}" width="${W * 0.05}" height="${fl}" rx="${W * 0.025}" fill="#e6d0b6"/>
        ${frond(W * 0.62, H * 0.0, W / 1500, 30, '#3b2a1e', 0.08, 8)}
        <rect y="${fl}" width="${W}" height="${H - fl}" fill="url(#fl)"/>
        ${PODS.map(([x, t, w, cols]) => `<ellipse cx="${W * x + 10}" cy="${fl + 4}" rx="${W * w * 0.6}" ry="${H * 0.025}" fill="#000" opacity=".16" filter="url(#b10)"/>${cyl(W * x, H * t, W * w, fl - H * t, cols)}`).join('')}`),
    }
  },
}

// Podiums for the category hero: [x, top, width, colours]
const PODS = [
  [0.47, 0.62, 0.1, ['#f6e7d4', '#ecd6bb', '#cfb08d', '#fbf1e4']],
  [0.575, 0.42, 0.085, ['#e7966c', '#d4693a', '#a94f27', '#eba882']],
  [0.68, 0.7, 0.13, ['#ffffff', '#f2eee8', '#d6cfc5', '#ffffff']],
  [0.8, 0.54, 0.095, ['#ead2b3', '#d9b993', '#b38f68', '#f2e0c8']],
  [0.9, 0.66, 0.08, ['#4a5468', '#2d3444', '#1d222d', '#5b667d']],
]

// ── Product compositing ─────────────────────────────────────────────────────
const cut = new Map()
const cutout = async (path) => {
  if (!cut.has(path)) cut.set(path, await sharp(path).trim({ threshold: 5 }).toBuffer())
  return cut.get(path)
}

// Light the product to match the scene: darken the side away from the light,
// warm/cool tint, and a little extra darkness at night
async function lightProduct(png, width, height, cx, scene, W) {
  const [lx] = scene.light
  const fromLeft = lx * W < cx
  const tint = scene.grade?.tint ?? [255, 255, 255, 0]
  const shade = `<defs>${lin('s', [[0, '#000', fromLeft ? 0 : 0.28], [0.5, '#000', 0.04], [1, '#000', fromLeft ? 0.28 : 0]], [0, 0, 1, 0])}${lin('v', [[0, '#fff', 0.1], [0.4, '#fff', 0], [1, '#000', 0.18]])}</defs>
    <rect width="${width}" height="${height}" fill="url(#s)"/>
    <rect width="${width}" height="${height}" fill="url(#v)"/>
    <rect width="${width}" height="${height}" fill="rgb(${tint[0]},${tint[1]},${tint[2]})" opacity="${tint[3] * 0.6}"/>
    ${scene.night ? `<rect width="${width}" height="${height}" fill="#0b1020" opacity=".22"/>` : ''}`
  return sharp(png).composite([{ input: buf(width, height, shade), blend: 'atop' }]).png().toBuffer()
}

// Place one product. h = height as a fraction of H, x = centre (fraction of W),
// base = bottom edge (fraction of H; defaults to the scene floor).
async function place(path, W, H, scene, { h, x, base, maxW = 0.8, shadow }) {
  const bottom = Math.round(base != null ? H * base : scene.floor)
  const maxH = Math.min(H * h, bottom - H * 0.05)
  let png = await sharp(await cutout(path)).resize({ height: Math.round(maxH), width: Math.round(W * maxW), fit: 'inside' }).png().toBuffer()
  const { width, height } = await sharp(png).metadata()
  // keep the whole product inside the frame
  const cx = Math.min(Math.max(W * x, width / 2 + W * 0.03), W * 0.97 - width / 2)
  const left = Math.round(cx - width / 2), top = bottom - height
  png = await lightProduct(png, width, height, cx, scene, W)
  const layers = []
  const mode = shadow ?? (scene.floor == null || base != null ? 'drop' : 'floor')
  const [lx] = scene.light

  if (mode === 'drop') {
    // soft cast shadow on the wall, pushed away from the light
    const dir = lx * W < cx ? 1 : -1
    const sil = await sharp({ create: { width, height, channels: 4, background: { r: 30, g: 20, b: 12, alpha: 0.42 } } })
      .composite([{ input: png, blend: 'dest-in' }]).png().toBuffer()
    const pad = 60
    const soft = await sharp(sil).extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } }).blur(18).png().toBuffer()
    const hard = await sharp(sil).extend({ top: pad, bottom: pad, left: pad, right: pad, background: { r: 0, g: 0, b: 0, alpha: 0 } }).blur(5).png().toBuffer()
    layers.push({ input: soft, left: left - pad + dir * Math.round(width * 0.12), top: top - pad + Math.round(height * 0.08) })
    layers.push({ input: hard, left: left - pad + dir * Math.round(width * 0.03), top: top - pad + Math.round(height * 0.02) })
  } else {
    // ambient + tight contact shadow
    layers.push({ input: buf(W, H, `
      <ellipse cx="${cx + (lx * W < cx ? 1 : -1) * width * 0.08}" cy="${bottom - 2}" rx="${width * 0.6}" ry="${Math.max(10, width * 0.09)}" fill="#1a120c" opacity=".32" filter="url(#sh)"/>
      <ellipse cx="${cx}" cy="${bottom - 1}" rx="${width * 0.42}" ry="${Math.max(3, width * 0.025)}" fill="#0d0805" opacity=".55" filter="url(#sh2)"/>`), left: 0, top: 0 })
    // reflection on glossy surfaces
    if (scene.reflect) {
      const rh = Math.round(height * 0.35)
      const mask = buf(width, height, `<defs>${lin('m', [[0, '#fff', scene.reflect], [rh / height, '#fff', 0], [1, '#fff', 0]])}</defs><rect width="${width}" height="${height}" fill="url(#m)"/>`)
      const refl = await sharp(png).flip().composite([{ input: mask, blend: 'dest-in' }]).blur(1.5).png().toBuffer()
      layers.push({ input: refl, left, top: bottom })
    }
  }
  layers.push({ input: png, left, top })
  return Object.assign(layers, { box: { cx, left, top, width, height, bottom } })
}

// Photographic finish: colour grade, light bloom, vignette and film grain
const grainCache = new Map()
async function finish(W, H, scene) {
  const g = scene.grade ?? {}
  const out = []
  if (g.bloom) {
    const [x, y, r, c, a] = g.bloom
    out.push({ input: buf(W, H, `<defs>${rad('bl', c, a, 0.35)}</defs><ellipse cx="${W * x}" cy="${H * y}" rx="${W * r}" ry="${W * r * 0.75}" fill="url(#bl)"/>`), blend: 'screen' })
  }
  if (g.tint) {
    const [r, gg, b, a] = g.tint
    out.push({ input: { create: { width: W, height: H, channels: 4, background: { r, g: gg, b, alpha: a } } }, blend: 'soft-light' })
  }
  out.push({ input: buf(W, H, `<defs><radialGradient id="vg" cx=".5" cy=".5" r=".75"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#140c06" stop-opacity="${g.vig ?? 0.3}"/></radialGradient></defs><rect width="${W}" height="${H}" fill="url(#vg)"/>`) })
  const key = `${W}x${H}`
  if (!grainCache.has(key)) {
    grainCache.set(key, await sharp(buf(W, H, `<filter id="gr"><feTurbulence type="fractalNoise" baseFrequency=".85" numOctaves="2" seed="5"/><feColorMatrix type="saturate" values="0"/><feComponentTransfer><feFuncA type="linear" slope="0" intercept=".16"/></feComponentTransfer></filter><rect width="${W}" height="${H}" filter="url(#gr)"/>`)).png().toBuffer())
  }
  out.push({ input: grainCache.get(key), blend: 'overlay' })
  return out
}

async function clip(layers, W, H) {
  return (await Promise.all(layers.map(async (l) => {
    if (!Buffer.isBuffer(l.input)) return l
    const m = await sharp(l.input).metadata()
    if (l.left >= 0 && l.top >= 0 && l.left + m.width <= W && l.top + m.height <= H) return l
    const left = Math.max(0, -l.left), top = Math.max(0, -l.top)
    const w = Math.min(m.width - left, W - Math.max(0, l.left)), h = Math.min(m.height - top, H - Math.max(0, l.top))
    if (w <= 0 || h <= 0) return null
    return { ...l, input: await sharp(l.input).extract({ left, top, width: w, height: h }).png().toBuffer(), left: Math.max(0, l.left), top: Math.max(0, l.top) }
  }))).filter(Boolean)
}

async function render(file, W, H, sceneName, items, under = [], fx = [], model) {
  texN = 0
  const scene = SCENES[sceneName](W, H)
  const placed = []
  for (const [path, spec] of items) placed.push(await place(path, W, H, scene, spec))
  const fxOut = await Promise.all(fx.map((name) => FX[name](W, H, placed[0].box, scene, model)))
  const layers = [...under, ...fxOut.flatMap((f) => f.under ?? []), ...placed.flat(), ...fxOut.flatMap((f) => f.over ?? [])]
  const base = await sharp(Buffer.from(scene.bg)).composite(await clip(layers, W, H)).png().toBuffer()
  await sharp(base).composite(await finish(W, H, scene)).webp({ quality: 84 }).toFile(file)
}

// ── Overlays (drawn under the product) ──────────────────────────────────────
// Phone showing an aslitec Eva live view
async function phoneOverlay(W, H) {
  const pw = H * 0.42, ph = H * 0.84, px = W * 0.1, py = H * 0.08
  texN = 100
  const sc = SCENES.exterior(Math.round(pw - 16), Math.round(ph * 0.42))
  const screen = await sharp(Buffer.from(sc.bg)).png().toBuffer()
  const frame = svg(W, H, `<defs>${lin('fr', [[0, '#3a3e46'], [1, '#121418']], [0, 0, 1, 1])}</defs>
    <rect x="${px + 24}" y="${py + 30}" width="${pw}" height="${ph}" rx="${pw * 0.14}" fill="#2a1a10" opacity=".3" filter="url(#b20)"/>
    <rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="${pw * 0.14}" fill="url(#fr)"/>
    <rect x="${px + 8}" y="${py + 8}" width="${pw - 16}" height="${ph - 16}" rx="${pw * 0.12}" fill="${C.cream}"/>
    <rect x="${px + pw * 0.36}" y="${py + 18}" width="${pw * 0.28}" height="${pw * 0.07}" rx="${pw * 0.035}" fill="#121418"/>
    <text x="${px + 26}" y="${py + ph * 0.135}" font-family="Arial" font-weight="700" font-size="${pw * 0.075}" fill="${C.navy}">aslitec Eva</text>
    ${[0.62, 0.7, 0.78].map((y, i) => `<rect x="${px + 26}" y="${py + ph * y}" width="${pw * (0.7 - i * 0.12)}" height="${ph * 0.045}" rx="8" fill="${C.sand}"/>`).join('')}
    <circle cx="${px + pw / 2}" cy="${py + ph * 0.9}" r="${pw * 0.075}" fill="${C.orange}"/>
    <polygon points="${px + pw * 0.1},${py} ${px + pw * 0.45},${py} ${px + pw * 0.15},${py + ph} ${px},${py + ph}" fill="#fff" opacity=".06"/>`)
  const sx = Math.round(px + 8), sy = Math.round(py + ph * 0.16)
  const chrome = svg(W, H, `
    <rect x="${sx + 10}" y="${sy + 10}" width="${pw * 0.2}" height="${pw * 0.08}" rx="${pw * 0.04}" fill="${C.orange}"/>
    <text x="${sx + 10 + pw * 0.1}" y="${sy + 10 + pw * 0.058}" text-anchor="middle" font-family="Arial" font-weight="700" font-size="${pw * 0.05}" fill="#fff">LIVE</text>
    <circle cx="${sx + pw - 34}" cy="${sy + 10 + pw * 0.04}" r="${pw * 0.022}" fill="#e5484d"/>`)
  return [
    { input: Buffer.from(frame), left: 0, top: 0 },
    { input: screen, left: sx, top: sy },
    { input: Buffer.from(chrome), left: 0, top: 0 },
  ]
}

// Person in the garden, framed by an orange AI detection box
const detectOverlay = (W, H) => [{ input: buf(W, H, `
  <g filter="url(#b4)" fill="#3b3a3c">
    <circle cx="${W * 0.32}" cy="${H * 0.4}" r="${H * 0.05}" fill="#4a3a32"/>
    <path d="M${W * 0.32 - H * 0.08} ${H * 0.72} q0 -${H * 0.25} ${H * 0.08} -${H * 0.25} q${H * 0.08} 0 ${H * 0.08} ${H * 0.25} Z" fill="#3f4a5c"/>
    <rect x="${W * 0.32 - H * 0.055}" y="${H * 0.7}" width="${H * 0.045}" height="${H * 0.2}" rx="10" fill="#2f3542"/>
    <rect x="${W * 0.32 + H * 0.01}" y="${H * 0.7}" width="${H * 0.045}" height="${H * 0.2}" rx="10" fill="#2f3542"/>
  </g>
  <rect x="${W * 0.32 - H * 0.13}" y="${H * 0.31}" width="${H * 0.26}" height="${H * 0.62}" fill="${C.orange}" opacity=".08" rx="6"/>
  ${[[0, 0, 1, 1], [1, 0, -1, 1], [0, 1, 1, -1], [1, 1, -1, -1]].map(([ax, ay, dx, dy]) => {
    const x0 = W * 0.32 - H * 0.13 + ax * H * 0.26, y0 = H * 0.31 + ay * H * 0.62, l = H * 0.06
    return `<path d="M${x0} ${y0 + dy * l} V${y0} H${x0 + dx * l}" stroke="${C.orange}" stroke-width="5" fill="none" stroke-linecap="round"/>`
  }).join('')}
  <rect x="${W * 0.32 - H * 0.13}" y="${H * 0.31}" width="${H * 0.26}" height="${H * 0.62}" fill="none" stroke="${C.orange}" stroke-width="1.5" opacity=".6" rx="6"/>
  <rect x="${W * 0.32 - H * 0.13}" y="${H * 0.31 - H * 0.08}" width="${H * 0.22}" height="${H * 0.065}" rx="${H * 0.032}" fill="${C.orange}"/>
  <text x="${W * 0.32 - H * 0.02}" y="${H * 0.31 - H * 0.033}" text-anchor="middle" font-family="Arial" font-weight="700" font-size="${H * 0.038}" fill="#fff">Person</text>`), left: 0, top: 0 }]

// Night version of a daytime scene: navy dusk, a warm porch lamp, stars
function nightify(sc, W, H, [lx, ly]) {
  const overlay = `<defs>${rad('lamp', '#ffb36b', 0.75, 0.3)}</defs>
    <rect width="${W}" height="${H}" fill="#0c1220" opacity=".72"/>
    ${bokeh(Array.from({ length: 22 }, (_, i) => [W * ((i * 0.173) % 0.58), H * (0.03 + ((i * 0.31) % 0.25)), 1.5 + (i % 3)]), '#ffffff', 0.7)}
    <ellipse cx="${W * lx}" cy="${H * ly}" rx="${W * 0.22}" ry="${H * 0.45}" fill="url(#lamp)"/>
    <rect x="${W * lx - 14}" y="${H * ly - 22}" width="28" height="44" rx="8" fill="#ffe2b8"/>`
  return {
    ...sc, light: [lx, ly], night: true, reflect: 0,
    grade: { tint: [70, 100, 170, 0.16], bloom: [lx, ly, 0.25, '#ffb36b', 0.55], vig: 0.55 },
    bg: sc.bg.replace(/<\/svg>$/, overlay + '</svg>'),
  }
}

// ── Benefit effects (RH2-style visuals) ─────────────────────────────────────
// Each gets the placed product's box and returns layers under/over it.
// Magnetic head + mounting point inside each mount photo: [hx, hy, head Ø, bx, by]
const HEADS = {
  MGQV2C: [0.37, 0.3, 0.65, 0.65, 0.8], MGP40S: [0.4, 0.5, 0.65, 0.82, 0.5], MGTM40: [0.4, 0.5, 0.7, 0.85, 0.5],
  MCET2M: [0.33, 0.33, 0.66, 0.5, 0.9], MGD10X2: [0.5, 0.25, 0.85, 0.5, 0.88], MGE10X: [0.48, 0.3, 0.9, 0.48, 0.86],
  RDGM44: [0.12, 0.83, 0.3, 0.38, 0.1], DXM12T: [0.45, 0.1, 0.4, 0.38, 0.85], MCDY1H: [0.4, 0.84, 0.6, 0.75, 0.2],
}
const head = (b, model) => {
  const [hx, hy, hd, bx, by] = HEADS[model] ?? [0.5, 0.35, 0.7, 0.5, 0.9]
  return { x: b.left + b.width * hx, y: b.top + b.height * hy, d: b.width * hd, bx: b.left + b.width * bx, by: b.top + b.height * by }
}
const over = (W, H, body) => ({ over: [{ input: buf(W, H, body), left: 0, top: 0 }] })
const under = (W, H, body) => ({ under: [{ input: buf(W, H, body), left: 0, top: 0 }] })
const rnd = (i) => { const x = Math.sin(i * 12.9898) * 43758.5453; return x - Math.floor(x) }
const pill = (x, y, text, fs, bg = C.orange, fg = '#fff') => {
  const w = text.length * fs * 0.62 + fs * 1.6
  return `<rect x="${x - w / 2}" y="${y - fs * 0.95}" width="${w}" height="${fs * 1.9}" rx="${fs * 0.95}" fill="${bg}"/>
    <text x="${x}" y="${y + fs * 0.35}" text-anchor="middle" font-family="Arial" font-weight="700" font-size="${fs}" fill="${fg}">${text}</text>`
}

const FX = {
  // 355° pan ring + 90° tilt arc around a PTZ camera
  panRing: (W, H, b) => {
    const cy = b.top + b.height * 0.62, rx = b.width * 1.05, ry = b.width * 0.26
    return over(W, H, `
      <ellipse cx="${b.cx}" cy="${cy}" rx="${rx}" ry="${ry}" fill="none" stroke="${C.orange}" stroke-width="10" opacity=".25" filter="url(#b6)"/>
      <path d="M${b.cx - rx * 0.2} ${cy + ry} A${rx} ${ry} 0 1 1 ${b.cx + rx * 0.2} ${cy + ry}" fill="none" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>
      <polygon points="${b.cx + rx * 0.2},${cy + ry - 10} ${b.cx + rx * 0.2 + 22},${cy + ry} ${b.cx + rx * 0.2},${cy + ry + 10}" fill="${C.orange}"/>
      <path d="M${b.cx + b.width * 0.75} ${b.top + b.height * 0.15} A${b.width * 0.8} ${b.height * 0.5} 0 0 1 ${b.cx + b.width * 0.75} ${b.top + b.height * 0.85}" fill="none" stroke="#fff" stroke-width="3" stroke-dasharray="8 8" opacity=".8"/>
      ${pill(b.cx - rx * 0.75, cy - ry - 18, '355°', H * 0.04)}
      ${pill(b.cx + b.width * 1.08, b.top + b.height * 0.5, '90°', H * 0.035, '#fff', C.navy)}`)
  },
  // Field-of-view cone thrown to the left of the product
  wedgeLeft: (W, H, b) => {
    const x = b.cx - b.width * 0.2, y = b.top + b.height * 0.45, len = Math.min(W * 0.55, x - W * 0.04), sp = H * 0.32
    return under(W, H, `<defs>${lin('fov', [[0, C.orange, 0.42], [1, C.orange, 0]], [1, 0, 0, 0])}</defs>
      <polygon points="${x},${y} ${x - len},${y - sp} ${x - len},${y + sp}" fill="url(#fov)"/>
      <line x1="${x}" y1="${y}" x2="${x - len}" y2="${y - sp}" stroke="${C.orange}" stroke-width="2" stroke-dasharray="10 8" opacity=".8"/>
      <line x1="${x}" y1="${y}" x2="${x - len}" y2="${y + sp}" stroke="${C.orange}" stroke-width="2" stroke-dasharray="10 8" opacity=".8"/>
      ${[0.35, 0.6, 0.85].map((t) => `<path d="M${x - len * t} ${y - sp * t} Q${x - len * t - 24} ${y} ${x - len * t} ${y + sp * t}" stroke="${C.orange}" stroke-width="2" fill="none" opacity="${0.6 - t * 0.4}"/>`).join('')}`)
  },
  // Rain falling in front of the scene (IP66)
  rain: (W, H) => over(W, H, `<g opacity=".55">${Array.from({ length: Math.round(W / 4) }, (_, i) => {
    const x = rnd(i) * W * 1.1, y = rnd(i + 99) * H, l = 18 + rnd(i + 7) * 40
    return `<line x1="${x}" y1="${y}" x2="${x - l * 0.25}" y2="${y + l}" stroke="#eef4ff" stroke-width="${1 + rnd(i + 3) * 1.2}" opacity="${0.25 + rnd(i + 5) * 0.5}"/>`
  }).join('')}</g><rect width="${W}" height="${H}" fill="#6c86a8" opacity=".14"/>`),
  // Sunbeams hitting a solar camera
  sun: (W, H, b) => over(W, H, `<defs>${rad('sn', '#fff3c9', 0.95, 0.25)}</defs>
    <circle cx="${W * 0.06}" cy="${H * 0.04}" r="${H * 0.55}" fill="url(#sn)"/>
    <g opacity=".3" filter="url(#b10)">${[0, 1, 2, 3, 4].map((i) => `<polygon points="${W * 0.04},${H * 0.02} ${b.cx - b.width * (0.6 - i * 0.25)},${b.top + b.height * 0.3} ${b.cx - b.width * (0.5 - i * 0.25)},${b.top + b.height * 0.5}" fill="#fff2c4"/>`).join('')}</g>`),
  // Sound waves for two-way audio
  waves: (W, H, b) => {
    const x = b.left - b.width * 0.08, y = b.top + b.height * 0.45
    return over(W, H, [1, 2, 3].map((i) => `<path d="M${x - i * b.width * 0.18} ${y - i * b.height * 0.1} Q${x - i * b.width * 0.26} ${y} ${x - i * b.width * 0.18} ${y + i * b.height * 0.1}" stroke="${C.orange}" stroke-width="${5 - i}" fill="none" stroke-linecap="round" opacity="${1 - i * 0.22}"/>`).join('') +
      pill(x - b.width * 0.55, y - b.height * 0.42, 'Hello!', H * 0.034, '#fff', C.navy))
  },
  // Air flowing out of a bladeless loop
  airflow: (W, H, b, scene) => {
    const col = scene.night ? '#ffffff' : '#7f9fc9'
    const y = b.top + b.height * 0.22
    const lines = Array.from({ length: 7 }, (_, i) => {
      const dy = (i - 3) * b.height * 0.045, len = W * (0.25 + rnd(i) * 0.15)
      return `<path d="M${b.cx - b.width * 0.15} ${y + dy} C${b.cx - len * 0.4} ${y + dy - 30} ${b.cx - len * 0.7} ${y + dy + 40} ${b.cx - len} ${y + dy + 10}" stroke="${col}" stroke-width="${2.5 + (i % 2)}" fill="none" stroke-linecap="round" opacity="${0.8 - Math.abs(i - 3) * 0.12}"/>`
    }).join('')
    return over(W, H, `<g filter="url(#b8)" opacity=".6">${lines.replaceAll(col, '#ffffff').replaceAll('stroke-width="2', 'stroke-width="9').replaceAll('stroke-width="3', 'stroke-width="10')}</g><g filter="url(#b2)">${lines}</g>`)
  },
  // Rising mist: 1 or 2 plumes from the top of the product
  mist1: (W, H, b) => FX.mist(W, H, b, [0]),
  mist2: (W, H, b) => FX.mist(W, H, b, [-0.22, 0.22]),
  mist: (W, H, b, xs) => over(W, H, xs.map((ox, k) => Array.from({ length: 7 }, (_, i) => {
    const t = i / 6
    return `<ellipse cx="${b.cx + ox * b.width + Math.sin(t * 4 + k) * b.width * 0.12}" cy="${b.top - t * H * 0.3}" rx="${b.width * (0.08 + t * 0.2)}" ry="${H * (0.035 + t * 0.05)}" fill="#ffffff" opacity="${0.5 - t * 0.45}" filter="url(#b${t > 0.5 ? 14 : 8})"/>`
  }).join('')).join('')),
  // Warm glow around the product (night light / light ring)
  glow: (W, H, b) => ({
    ...under(W, H, `<defs>${rad('gw', '#ff9a52', 0.7, 0.35)}</defs><ellipse cx="${b.cx}" cy="${b.bottom - b.height * 0.2}" rx="${b.width * 1.6}" ry="${b.height * 0.9}" fill="url(#gw)"/>`),
    ...over(W, H, `<ellipse cx="${b.cx}" cy="${b.bottom - 4}" rx="${b.width * 0.55}" ry="${b.width * 0.08}" fill="#ffb066" opacity=".55" filter="url(#b8)"/>`),
  }),
  // Tap ripples on the touch controls (tall fans: base; others: front middle)
  tap: (W, H, b) => {
    const y = b.top + b.height * (b.height > b.width * 2 ? 0.86 : 0.6)
    return over(W, H, [1, 2, 3].map((i) => `<circle cx="${b.cx}" cy="${y}" r="${b.width * 0.06 * i}" fill="none" stroke="${C.orange}" stroke-width="${4 - i}" opacity="${1.1 - i * 0.3}"/>`).join('') +
      `<circle cx="${b.cx}" cy="${y}" r="${b.width * 0.03}" fill="${C.orange}"/>`)
  },
  // "L" / "R" labels over the two mist outlets
  lr: (W, H, b) => over(W, H, [-0.22, 0.22].map((ox, i) => `<line x1="${b.cx + ox * b.width}" y1="${b.top - H * 0.02}" x2="${b.cx + ox * b.width * 1.8}" y2="${b.top - H * 0.14}" stroke="${C.navy}" stroke-width="2" stroke-dasharray="5 5"/>${pill(b.cx + ox * b.width * 1.8, b.top - H * 0.17, i ? 'R' : 'L', H * 0.04, C.navy)}`).join('')),
  // Magnetic field lines round the head, phone snapping on
  magnet: (W, H, b, _s, model) => {
    const h = head(b, model), pw = h.d * 1.3, ph = pw * 2.05
    const px = Math.max(W * 0.05, h.x - b.width * 0.9 - pw), py = h.y - ph * 0.55
    return over(W, H, `${[0.65, 0.8, 0.95].map((r, i) => `<circle cx="${h.x}" cy="${h.y}" r="${h.d * r}" fill="none" stroke="${C.orange}" stroke-width="${3 - i * 0.6}" stroke-dasharray="${10 - i * 2} 8" opacity="${0.9 - i * 0.22}"/>`).join('')}
      <g transform="rotate(-10 ${px + pw / 2} ${py + ph / 2})">
        <rect x="${px + 12}" y="${py + 18}" width="${pw}" height="${ph}" rx="${pw * 0.16}" fill="#000" opacity=".25" filter="url(#b14)"/>
        <rect x="${px}" y="${py}" width="${pw}" height="${ph}" rx="${pw * 0.16}" fill="#1c1f25"/>
        <rect x="${px + 5}" y="${py + 5}" width="${pw - 10}" height="${ph - 10}" rx="${pw * 0.14}" fill="#2b3140"/>
        <circle cx="${px + pw / 2}" cy="${py + ph * 0.55}" r="${pw * 0.36}" fill="none" stroke="#5b6475" stroke-width="3"/>
      </g>
      ${[0, 1, 2].map((i) => `<line x1="${px + pw + 14 + i * 4}" y1="${py + ph * (0.4 + i * 0.1)}" x2="${px + pw + 50 + i * 12}" y2="${py + ph * (0.4 + i * 0.1)}" stroke="${C.orange}" stroke-width="3" stroke-linecap="round" opacity=".8"/>`).join('')}`)
  },
  // Rotation arrow around the head
  rotate: (W, H, b, _s, model) => {
    const h = head(b, model), r = h.d * 0.75
    return over(W, H, `<path d="M${h.x + r} ${h.y} A${r} ${r} 0 1 1 ${h.x} ${h.y - r}" fill="none" stroke="${C.orange}" stroke-width="4" stroke-linecap="round"/>
      <polygon points="${h.x - 2},${h.y - r - 12} ${h.x + 20},${h.y - r} ${h.x - 2},${h.y - r + 12}" fill="${C.orange}"/>
      <circle cx="${h.x}" cy="${h.y}" r="${r}" fill="none" stroke="${C.orange}" stroke-width="12" opacity=".15" filter="url(#b6)"/>`)
  },
  // Highlight ring round the mounting point
  baseRing: (W, H, b, _s, model) => {
    const h = head(b, model), rx = b.width * 0.32
    return over(W, H, `<ellipse cx="${h.bx}" cy="${h.by}" rx="${rx}" ry="${rx * 0.45}" fill="none" stroke="${C.orange}" stroke-width="3" stroke-dasharray="9 7"/>
      <ellipse cx="${h.bx}" cy="${h.by}" rx="${rx}" ry="${rx * 0.45}" fill="none" stroke="${C.orange}" stroke-width="14" opacity=".18" filter="url(#b6)"/>`)
  },
  // Phone mounted on the head, showing a map with an orange route
  phoneMap: (W, H, b, _s, model) => {
    const h = head(b, model), pw = h.d * 1.2, ph = pw * 2.05, x = h.x - pw / 2, y = h.y - ph / 2
    return over(W, H, `<defs><clipPath id="scr"><rect x="${x + 6}" y="${y + 6}" width="${pw - 12}" height="${ph - 12}" rx="${pw * 0.13}"/></clipPath></defs>
      <rect x="${x + 10}" y="${y + 16}" width="${pw}" height="${ph}" rx="${pw * 0.16}" fill="#000" opacity=".35" filter="url(#b14)"/>
      <rect x="${x}" y="${y}" width="${pw}" height="${ph}" rx="${pw * 0.16}" fill="#15171c"/>
      <g clip-path="url(#scr)">
        <rect x="${x}" y="${y}" width="${pw}" height="${ph}" fill="#eef0ea"/>
        ${[0.2, 0.45, 0.7].map((t) => `<rect x="${x}" y="${y + ph * t}" width="${pw}" height="${ph * 0.03}" fill="#fff"/>`).join('')}
        ${[0.3, 0.65].map((t) => `<rect x="${x + pw * t}" y="${y}" width="${pw * 0.05}" height="${ph}" fill="#fff"/>`).join('')}
        <rect x="${x + pw * 0.7}" y="${y + ph * 0.05}" width="${pw * 0.25}" height="${ph * 0.12}" fill="#cfe3c4"/>
        <path d="M${x + pw * 0.32} ${y + ph * 0.95} V${y + ph * 0.46} H${x + pw * 0.67} V${y + ph * 0.1}" stroke="${C.orange}" stroke-width="${pw * 0.05}" fill="none" stroke-linejoin="round"/>
        <circle cx="${x + pw * 0.32}" cy="${y + ph * 0.8}" r="${pw * 0.06}" fill="#3b7bf0" stroke="#fff" stroke-width="3"/>
        <rect x="${x + 6}" y="${y + 6}" width="${pw - 12}" height="${ph * 0.12}" fill="${C.navy}"/>
        <rect x="${x + pw * 0.12}" y="${y + ph * 0.045}" width="${pw * 0.5}" height="${ph * 0.025}" rx="4" fill="#fff" opacity=".85"/>
      </g>
      <polygon points="${x + pw * 0.1},${y} ${x + pw * 0.45},${y} ${x + pw * 0.15},${y + ph} ${x},${y + ph}" fill="#fff" opacity=".07"/>`)
  },
  // Person crossing the garden: dashed path + tracking box
  track: (W, H) => ({ under: [...detectOverlay(W, H), { input: buf(W, H, `
    <path d="M${W * 0.04} ${H * 0.95} Q${W * 0.15} ${H * 0.86} ${W * 0.26} ${H * 0.9}" stroke="${C.orange}" stroke-width="3" stroke-dasharray="4 10" stroke-linecap="round" fill="none"/>
    ${[0.1, 0.17].map((x) => `<circle cx="${W * x}" cy="${H * 0.9}" r="5" fill="${C.orange}" opacity=".6"/>`).join('')}`), left: 0, top: 0 }] }),
  // Colour night vision: a brightened viewfinder on the left
  nightFrame: (W, H) => {
    const x = W * 0.06, y = H * 0.16, w = W * 0.44, h = H * 0.68, l = H * 0.07
    return under(W, H, `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="12" fill="#ffd9a8" opacity=".2"/>
      ${[[0, 0, 1, 1], [1, 0, -1, 1], [0, 1, 1, -1], [1, 1, -1, -1]].map(([ax, ay, dx, dy]) => `<path d="M${x + ax * w} ${y + ay * h + dy * l} V${y + ay * h} H${x + ax * w + dx * l}" stroke="#fff" stroke-width="4" fill="none" stroke-linecap="round"/>`).join('')}
      <circle cx="${x + 26}" cy="${y + 28}" r="7" fill="#e5484d"/>
      <text x="${x + 42}" y="${y + 35}" font-family="Arial" font-weight="700" font-size="${H * 0.035}" fill="#fff">REC</text>
      ${pill(x + w / 2, y + h - H * 0.06, 'Colour night vision', H * 0.034)}`)
  },
}

// ── Shot lists ──────────────────────────────────────────────────────────────
const S = (h, x, extra = {}) => ({ h, x, ...extra })
const CAMERA = {
  'use-1': ['night', S(0.42, 0.75)],
  'use-2': ['studio', S(0.42, 0.6), 'phone'],
  'use-3': ['exterior', S(0.42, 0.8, { base: 0.62 }), 'detect'],
  'stat-1': ['spot', S(0.55, 0.5)],
  'stat-2': ['studio', S(0.55, 0.5)],
}
const SHOTS = {
  ptz: { hero: ['exterior', S(0.62, 0.78, { base: 0.82 })], ...CAMERA,
    'place-1': ['shelf', S(0.5, 0.55)], 'place-2': ['exterior', S(0.5, 0.8, { base: 0.7 })] },
  solar: { hero: ['exterior', S(0.5, 0.78, { base: 0.75 })], ...CAMERA,
    'place-1': ['exterior', S(0.45, 0.8, { base: 0.65 })], 'place-2': ['wall', S(0.5, 0.55, { base: 0.75 })] },
  doorbell: { hero: ['door', S(0.42, 0.72, { base: 0.62 })], ...CAMERA,
    'place-1': ['door', S(0.4, 0.74, { base: 0.62 })], 'place-2': ['shelf', S(0.45, 0.55)] },
  fan: { hero: ['living', S(0.8, 0.72)],
    'use-1': ['bedroom', S(0.85, 0.75, { maxW: 0.4 })], 'use-2': ['office', S(0.8, 0.8)], 'use-3': ['living', S(0.8, 0.72)],
    'stat-1': ['spot', S(0.7, 0.5)], 'stat-2': ['studio', S(0.66, 0.5)],
    'place-1': ['living', S(0.82, 0.68)], 'place-2': ['bedroom', S(0.85, 0.78)] },
  humidifier: { hero: ['bedroom', S(0.5, 0.74)],
    'use-1': ['night', S(0.45, 0.75)], 'use-2': ['living', S(0.5, 0.7)], 'use-3': ['office', S(0.45, 0.78)],
    'stat-1': ['spot', S(0.6, 0.5)], 'stat-2': ['studio', S(0.6, 0.5)],
    'place-1': ['bedroom', S(0.5, 0.75)], 'place-2': ['living', S(0.55, 0.65)] },
  portable: { hero: ['office', S(0.3, 0.74)],
    'use-1': ['office', S(0.32, 0.75)], 'use-2': ['car', S(0.3, 0.72)], 'use-3': ['bedroom', S(0.3, 0.76)],
    'stat-1': ['spot', S(0.5, 0.5)], 'stat-2': ['studio', S(0.5, 0.5)],
    'place-1': ['bedroom', S(0.3, 0.75)], 'place-2': ['car', S(0.3, 0.7)] },
  clock: { hero: ['bedroom', S(0.3, 0.74)],
    'use-1': ['night', S(0.3, 0.76)], 'use-2': ['office', S(0.3, 0.76)], 'use-3': ['living', S(0.25, 0.7)],
    'stat-1': ['spot', S(0.42, 0.5)], 'stat-2': ['studio', S(0.42, 0.5)],
    'place-1': ['bedroom', S(0.32, 0.76)], 'place-2': ['desk', S(0.32, 0.7)] },
  mount: { hero: ['car', S(0.42, 0.72)],
    'use-1': ['carNight', S(0.42, 0.72)], 'use-2': ['car', S(0.42, 0.7)], 'use-3': ['desk', S(0.45, 0.72)],
    'stat-1': ['spot', S(0.55, 0.5)], 'stat-2': ['studio', S(0.52, 0.5)],
    'place-1': ['car', S(0.45, 0.68)], 'place-2': ['carNight', S(0.45, 0.7)] },
  vent: { hero: ['vent', S(0.5, 0.66, { base: 0.86 })],
    'use-1': ['carNight', S(0.42, 0.72)], 'use-2': ['car', S(0.42, 0.7)], 'use-3': ['vent', S(0.55, 0.66, { base: 0.88 })],
    'stat-1': ['spot', S(0.55, 0.5)], 'stat-2': ['studio', S(0.52, 0.5)],
    'place-1': ['vent', S(0.55, 0.66, { base: 0.88 })], 'place-2': ['car', S(0.42, 0.7)] },
  stand: { hero: ['desk', S(0.5, 0.72)],
    'use-1': ['office', S(0.5, 0.76)], 'use-2': ['car', S(0.45, 0.7)], 'use-3': ['bedroom', S(0.45, 0.76)],
    'stat-1': ['spot', S(0.55, 0.5)], 'stat-2': ['studio', S(0.52, 0.5)],
    'place-1': ['office', S(0.5, 0.76)], 'place-2': ['desk', S(0.5, 0.7)] },
}

// Category banners: several products in one scene, left side kept clear for text
const BANNER_SHOTS = {
  hero: [1920, 620, 'podium', [
    ['VRM-370', S(0.2, PODS[0][0], { base: PODS[0][1] + 0.005 })],
    ['JS-R03', S(0.26, PODS[1][0], { base: PODS[1][1] + 0.005 })],
    ['BRZ-A09', S(0.62, PODS[2][0] - 0.03, { base: PODS[2][1] + 0.005 })],
    ['VAS-302', S(0.34, PODS[2][0] + 0.035, { base: PODS[2][1] + 0.005 })],
    ['JS-G20', S(0.36, PODS[3][0], { base: PODS[3][1] + 0.005 })],
    ['MGP40S', S(0.2, PODS[4][0], { base: PODS[4][1] + 0.005 })],
  ]],
  security: [1920, 440, 'exterior', [
    ['JS-R03', S(0.42, 0.68, { base: 0.62 })],
    ['JS-G20', S(0.66, 0.8, { base: 0.78 })],
    ['JS-R02', S(0.42, 0.92, { base: 0.66 })],
  ]],
  comfort: [1920, 440, 'living', [
    ['VRM-370', S(0.2, 0.6)],
    ['CMA660', S(0.78, 0.68)],
    ['VAS-302', S(0.48, 0.77)],
    ['BRZ-A09', S(0.86, 0.86)],
    ['VR-A807W', S(0.24, 0.95)],
  ]],
  drive: [1920, 440, 'carNight', [
    ['MGQV2C', S(0.4, 0.56)],
    ['MCET2M', S(0.52, 0.68)],
    ['MGP40S', S(0.44, 0.8)],
    ['MGD10X2', S(0.5, 0.92)],
  ]],
}

// Benefit story images: step-1..3 (alternating rows) and spot-1/2 (full width)
const F = (scene, spec, ...fx) => [scene, spec, fx]
const CAM_STORY = {
  'step-3': F('exteriorNight', S(0.42, 0.85, { base: 0.6 }), 'nightFrame'),
  'spot-1-wide': F('exteriorNight', S(0.55, 0.8, { base: 0.7 }), 'wedgeLeft'),
  'spot-2-wide': F('exterior', S(0.55, 0.8, { base: 0.72 }), 'rain'),
}
const MOUNT_STORY = (base) => ({
  'step-1': F('studio', S(0.42, 0.72), 'magnet'),
  'step-2': F('spot', S(0.5, 0.5), 'rotate'),
  'step-3': base,
  'spot-1-wide': F('car', S(0.42, 0.72), 'phoneMap'),
  'spot-2-wide': F('carNight', S(0.42, 0.72), 'phoneMap'),
})
const STORY = {
  ptz: { 'step-1': F('spot', S(0.48, 0.5), 'panRing'), 'step-2': F('exterior', S(0.42, 0.85, { base: 0.62 }), 'track'), ...CAM_STORY },
  solar: { 'step-1': F('exterior', S(0.45, 0.8, { base: 0.68 }), 'sun'), 'step-2': F('exterior', S(0.42, 0.85, { base: 0.62 }), 'wedgeLeft'), ...CAM_STORY },
  doorbell: {
    'step-1': F('door', S(0.4, 0.78, { base: 0.6 }), 'wedgeLeft'),
    'step-2': F('door', S(0.4, 0.78, { base: 0.6 }), 'waves'),
    'step-3': F('doorNight', S(0.4, 0.78, { base: 0.6 }), 'nightFrame'),
    'spot-1-wide': F('door', S(0.45, 0.74, { base: 0.6 }), 'wedgeLeft'),
    'spot-2-wide': F('doorNight', S(0.45, 0.74, { base: 0.6 }), 'waves'),
  },
  fan: {
    'step-1': F('studio', S(0.66, 0.62), 'airflow'),
    'step-2': F('studio', S(1.7, 0.5, { base: 1.6 })),
    'step-3': F('living', S(0.88, 0.55), 'tap'),
    'spot-1-wide': F('living', S(0.82, 0.72), 'airflow'),
    'spot-2-wide': F('bedroom', S(0.85, 0.75)),
  },
  humidifier: {
    'step-1': F('bedroom', S(0.48, 0.74), 'mist2'),
    'step-2': F('studio', S(0.5, 0.5), 'mist2', 'lr'),
    'step-3': F('night', S(0.45, 0.74), 'glow'),
    'spot-1-wide': F('bedroom', S(0.5, 0.74), 'mist2'),
    'spot-2-wide': F('night', S(0.46, 0.74), 'glow', 'mist2'),
  },
  portable: {
    'step-1': F('office', S(0.32, 0.74), 'mist1'),
    'step-2': F('night', S(0.32, 0.74), 'glow'),
    'step-3': F('studio', S(0.5, 0.5), 'tap'),
    'spot-1-wide': F('office', S(0.32, 0.74), 'mist1'),
    'spot-2-wide': F('bedroom', S(0.32, 0.74), 'mist1', 'glow'),
  },
  clock: {
    'step-1': F('bedroom', S(0.3, 0.74), 'mist1'),
    'step-2': F('studio', S(0.62, 0.5)),
    'step-3': F('night', S(0.3, 0.74), 'glow'),
    'spot-1-wide': F('bedroom', S(0.32, 0.74), 'mist1'),
    'spot-2-wide': F('night', S(0.32, 0.74), 'glow', 'mist1'),
  },
  mount: MOUNT_STORY(F('car', S(0.42, 0.72), 'baseRing')),
  vent: MOUNT_STORY(F('vent', S(0.55, 0.66, { base: 0.88 }), 'baseRing')),
  stand: MOUNT_STORY(F('office', S(0.5, 0.76), 'baseRing')),
}

const only = process.argv.slice(2)
if (!only.length || only.includes('banners')) {
  mkdirSync(BANNERS, { recursive: true })
  for (const [name, [W, H, scene, items]] of Object.entries(BANNER_SHOTS)) {
    await render(`${BANNERS}/${name}-wide.webp`, W, H, scene, items.map(([m, s]) => [IMG[m], s]))
    console.log('wrote banner', name)
  }
}
for (const [model, [path, kind]] of Object.entries(PRODUCTS)) {
  if (only.length && !only.includes(model)) continue
  const dir = `${OUT}/${model}`
  mkdirSync(dir, { recursive: true })
  for (const [slot, [scene, spec, extra]] of Object.entries(SHOTS[kind])) {
    const [W, H] = slot === 'hero' ? [1920, 800] : [800, 560]
    const under = extra === 'phone' ? await phoneOverlay(W, H) : extra === 'detect' ? detectOverlay(W, H) : []
    await render(`${dir}/${slot === 'hero' ? 'hero-wide' : slot}.webp`, W, H, scene, [[path, spec]], under)
  }
  for (const [slot, [scene, spec, fx]] of Object.entries(STORY[kind])) {
    const [W, H] = slot.endsWith('-wide') ? [1920, 760] : [800, 560]
    await render(`${dir}/${slot}.webp`, W, H, scene, [[path, spec]], [], fx, model)
  }
  console.log('wrote', model)
}
