// Transparent product photos for the new cameras (from the "for web" set).
// PNGs keep their own alpha; JPGs on white are cut out by flood-filling the
// near-white background from the image border.
// Run: node scripts/cutout-camera-photos.mjs
import sharp from 'sharp'
import fs from 'node:fs'
const SRC = 'src/assets/smart home/for web'
const DST = 'src/assets/smart home/Eva Security Cam- aslitec'
const TH = 243
const jobs = [
  ['JS-G12', fs.readdirSync(`${SRC}/JS-G12`).filter(f => /^G12.*\.jpg$/i.test(f)).sort().map(f => `${SRC}/JS-G12/${f}`)],
  ['JS-P160', [`${SRC}/JS-P160/2.69.png`]],
  ['JS-P200', [`${SRC}/JS-P200/2.1904(1).png`, ...fs.readdirSync(`${SRC}/JS-P200/Black color`).filter(f => !f.startsWith('._') && /\.jpg$/i.test(f) && f !== '2.1904(1).jpg').sort().map(f => `${SRC}/JS-P200/Black color/${f}`)]],
]

async function cutout(file) {
  if (/\.png$/i.test(file)) return sharp(file).ensureAlpha().png().toBuffer()
  const { data, info } = await sharp(file).removeAlpha().raw().toBuffer({ resolveWithObject: true })
  const { width: W, height: H } = info
  const bg = new Uint8Array(W * H)
  const isBg = (i) => Math.min(data[i * 3], data[i * 3 + 1], data[i * 3 + 2]) >= TH
  const stack = []
  for (let x = 0; x < W; x++) stack.push(x, (H - 1) * W + x)
  for (let y = 0; y < H; y++) stack.push(y * W, y * W + W - 1)
  while (stack.length) {
    const i = stack.pop()
    if (bg[i] || !isBg(i)) continue
    bg[i] = 1
    const x = i % W
    if (x > 0) stack.push(i - 1)
    if (x < W - 1) stack.push(i + 1)
    if (i >= W) stack.push(i - W)
    if (i < W * (H - 1)) stack.push(i + W)
  }
  const alpha = Buffer.alloc(W * H)
  for (let i = 0; i < W * H; i++) alpha[i] = bg[i] ? 0 : 255
  // soften the cut edge by a pixel
  const soft = await sharp(alpha, { raw: { width: W, height: H, channels: 1 } }).blur(0.8).extractChannel(0).raw().toBuffer()
  return sharp(data, { raw: { width: W, height: H, channels: 3 } }).joinChannel(soft, { raw: { width: W, height: H, channels: 1 } }).png().toBuffer()
}

await (async () => {
  const outs = []
  for (const [model, files] of jobs) {
    let i = 1
    for (const f of files) {
      const out = `${DST}/${model}/${model.slice(3).toLowerCase()}-${i++}.webp`
      const cut = await cutout(f)
      const { data: trimmed } = await sharp(cut).trim({ background: { r: 0, g: 0, b: 0, alpha: 0 }, threshold: 1 }).png().toBuffer({ resolveWithObject: true })
      // sharp resizes before it extends, so fit inside 1072px and then pad to 1200
      await sharp(trimmed).resize(1072, 1072, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .extend({ top: 64, bottom: 64, left: 64, right: 64, background: { r: 0, g: 0, b: 0, alpha: 0 } })
        .webp({ quality: 85, alphaQuality: 100 }).toFile(out)
      outs.push(out)
    }
  }
  console.log(outs.length, 'images')
})()
