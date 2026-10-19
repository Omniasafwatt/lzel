import type { Product, ProductSpecification } from '@/types'
import { getCategoryById } from '../mockCategories'

const cat = getCategoryById('cat-accessories')!

// Image folders are globbed (several file names are Chinese) and sorted by name
type Glob = Record<string, string>
const sorted = (g: Glob) => Object.keys(g).sort((a, b) => a.localeCompare(b, 'en', { numeric: true })).map((k) => g[k])
const byFile = (g: Glob, file: string) => {
  const key = Object.keys(g).find((k) => k.endsWith('/' + file))
  if (!key) throw new Error(`missing image ${file}`)
  return g[key]
}

const charger35  = import.meta.glob<string>('../../assets/accessories/35/*.webp',  { eager: true, import: 'default' })
const charger45  = import.meta.glob<string>('../../assets/accessories/45/*.webp',  { eager: true, import: 'default' })
const charger65  = import.meta.glob<string>('../../assets/accessories/65/*.webp',  { eager: true, import: 'default' })
const charger100 = import.meta.glob<string>('../../assets/accessories/100/*.webp', { eager: true, import: 'default' })
const charger140 = import.meta.glob<string>('../../assets/accessories/140/*.webp', { eager: true, import: 'default' })
const charger200 = import.meta.glob<string>('../../assets/accessories/200/*.webp', { eager: true, import: 'default' })
const r001  = import.meta.glob<string>('../../assets/accessories/R001/*.webp',   { eager: true, import: 'default' })
const r002  = import.meta.glob<string>('../../assets/accessories/R002/*.webp',   { eager: true, import: 'default' })
const r005  = import.meta.glob<string>('../../assets/accessories/R005/*.webp',   { eager: true, import: 'default' })
const r008  = import.meta.glob<string>('../../assets/accessories/R008-B/*.webp', { eager: true, import: 'default' })
const r012  = import.meta.glob<string>('../../assets/accessories/R012/*.webp',   { eager: true, import: 'default' })
const band  = import.meta.glob<string>('../../assets/accessories/Smart Band/*.webp',   { eager: true, import: 'default' })
const lens  = import.meta.glob<string>('../../assets/accessories/iPh Duo Lens/*.webp', { eager: true, import: 'default' })

interface Option { name: string; image: string; extra?: Record<string, string> }
interface Input {
  model: string
  name: string
  description: string
  shortDescription: string
  tags: string[]
  specs: ProductSpecification[]
  options: Option[]                 // one per colour / style, each with its photo
  attributes?: { name: string; values: string[] }[]
  gallery?: string[]                // extra photos not tied to an option
  featured?: boolean
}

const slugify = (s: string) => s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '')

const build = (d: Input, i: number): Product => {
  const id = `prod-acc-${slugify(d.model)}`
  const attributes = d.attributes ?? [{ name: 'Color', values: d.options.map((o) => o.name) }]
  return {
    id,
    name: d.name,
    slug: `aslitec-${slugify(d.name)}`,
    description: d.description,
    shortDescription: d.shortDescription,
    sku: `ASL-${d.model}`,
    price: 0,
    categoryId: 'cat-accessories',
    category: cat,
    attributes: attributes.map((a) => ({ id: `${id}-${slugify(a.name)}`, ...a })),
    variants: d.options.map((o) => ({
      id: `${id}-${slugify(o.name)}`,
      productId: id,
      sku: `ASL-${d.model}-${slugify(o.name).toUpperCase()}`,
      attributes: o.extra ?? { Color: o.name },
      price: 0,
      stock: 0,
      lowStockThreshold: 0,
      images: [o.image],
      isActive: true,
    })),
    images: [
      ...d.options.map((o, j) => ({ id: `${id}-img-${j}`, url: o.image, alt: `${d.name} – ${o.name}`, sortOrder: j })),
      ...(d.gallery ?? []).map((url, j) => ({ id: `${id}-gal-${j}`, url, alt: `${d.name} – detail ${j + 1}`, sortOrder: d.options.length + j })),
    ],
    specifications: [{ label: 'Model', value: d.model }, ...d.specs],
    tags: ['accessories', 'aslitec', 'new', ...d.tags],
    status: 'active',
    isFeatured: !!d.featured,
    isDigital: false,
    stock: 0,
    lowStockThreshold: 0,
    averageRating: 0,
    reviewCount: 0,
    salesCount: 0,
    viewCount: 0,
    createdAt: new Date(Date.UTC(2026, 9, 15) - i * 60_000).toISOString(),
    updatedAt: '2026-10-15T00:00:00Z',
  }
}

// ── GaN display chargers ──────────────────────────────────────────────────────
// Colour from the file name: 枪 = gunmetal, 银 = silver, 黑 = black
const chargerColors = (g: Glob): Option[] => {
  const pick = (ch: string) => g[Object.keys(g).find((k) => k.includes(ch))!]
  return [
    { name: 'Gunmetal', image: pick('枪') },
    { name: 'Silver',   image: pick('银') },
    { name: 'Black',    image: pick('黑') },
  ]
}

const chargerSpecs = (ports: string, perPort?: string): ProductSpecification[] => [
  { label: 'Technology', value: 'GaN' },
  { label: 'Ports', value: ports },
  ...(perPort ? [{ label: 'Port Output', value: perPort }] : []),
  { label: 'Display', value: 'Round wattage display on top' },
  { label: 'Plug', value: 'UK 3-pin' },
  { label: 'Design', value: 'Glowing light strip around the base' },
  { label: 'Color', value: 'Gunmetal, Silver, Black' },
]

const charger = (w: number, g: Glob, ports: string, perPort: string | undefined, use: string, featured = false): Input => ({
  model: `GaN-${w}W`,
  name: `GaN Display Charger ${w}W`,
  description: `A ${w}W GaN wall charger with a live wattage display on top and a glowing light strip around the base. ${ports} let you ${use}. Finished in gunmetal, silver or black.`,
  shortDescription: `${w}W GaN · ${ports} · Wattage display`,
  tags: ['charger', 'display-charger', 'gan', `${w}w`, 'usb-c'],
  specs: chargerSpecs(ports, perPort),
  options: chargerColors(g),
  featured,
})

// ── Ring grips & stands ───────────────────────────────────────────────────────
const colorOptions = (g: Glob, names: string[]): Option[] =>
  sorted(g).map((image, i) => ({ name: names[i] ?? `Style ${i + 1}`, image }))

const ring = (model: string, title: string, description: string, short: string, specs: ProductSpecification[], g: Glob, colors: string[], featured = false): Input => ({
  model,
  name: `${title} ${model}`,
  description,
  shortDescription: short,
  tags: ['grip', 'ring', 'phone grip', 'stand'],
  specs: [...specs, { label: 'Color', value: colors.join(', ') }],
  options: colorOptions(g, colors),
  featured,
})

// ── Lens protector: colour × style ────────────────────────────────────────────
const lensOptions: Option[] = [
  { name: 'Deep Blue · Double', image: byFile(lens, 'DEEP Blue Double-1.webp'), extra: { Color: 'Deep Blue', Style: 'Double' } },
  { name: 'Deep Blue · Single', image: byFile(lens, 'DEEP Blue single-1.webp'), extra: { Color: 'Deep Blue', Style: 'Single' } },
  { name: 'White · Double',     image: byFile(lens, 'White Double -1.webp'),    extra: { Color: 'White', Style: 'Double' } },
  { name: 'White · Single',     image: byFile(lens, 'White single -1.webp'),    extra: { Color: 'White', Style: 'Single' } },
]
const lensGallery = [
  'DEEP Blue Double-2.webp', 'DEEP Blue single-2.webp', 'White Double -2 .webp', 'White single -2.webp',
  '1.webp', '2.webp', '3.webp', '4.webp', '5.webp', '6.webp', '7.webp', '8.webp',
].map((f) => byFile(lens, f))

const inputs: Input[] = [
  charger(35,  charger35,  '2× USB-C', undefined, 'top up a phone and earbuds together'),
  charger(45,  charger45,  '2× USB-C', undefined, 'fast-charge a phone and a tablet at once'),
  charger(65,  charger65,  '2× USB-C + 1× USB-A', 'USB-C1/C2: 65W · USB-A: 30W', 'power a laptop, phone and accessory from one plug', true),
  charger(100, charger100, '2× USB-C + 1× USB-A', 'USB-C1/C2: 100W · USB-A: 30W', 'run a laptop at full speed with room for two more devices', true),
  charger(140, charger140, '3× USB-C + 1× USB-A', undefined, 'charge four devices at once, including a power-hungry laptop'),
  charger(200, charger200, '2× USB-C + 1× USB-A', 'USB-C1/C2: 200W · USB-A: 30W', 'replace a whole desk of power bricks'),

  ring('R001', 'Wave Grip Ring',
    'A round phone ring with a soft, wave-textured grip band across the middle. Slide your fingers under the band for a secure one-handed hold while you scroll, shoot or call.',
    'Phone ring grip · Wave-textured band · 7 colours',
    [{ label: 'Grip', value: 'Wave-textured band across the ring' }, { label: 'Form', value: 'Round ring' }],
    r001, ['Black', 'Titanium', 'Cream', 'Plum', 'Orange', 'Navy', 'Sky Blue'], true),
  ring('R002', 'Hinged Wave Grip Ring',
    'A wave-textured grip ring with a hinge at the top, so it folds out to prop your phone up for videos and calls and lies flat when you just want to hold it.',
    'Phone ring grip · Fold-out hinge · 7 colours',
    [{ label: 'Grip', value: 'Wave-textured band across the ring' }, { label: 'Stand', value: 'Hinged ring folds out as a stand' }],
    r002, ['Titanium', 'Plum', 'Orange', 'Navy', 'Black', 'Cream', 'Sky Blue']),
  ring('R005', 'Flat Grip Ring',
    'A clean, minimal phone ring with a smooth flat grip panel. Two-tone options pair the ring colour with a contrasting panel.',
    'Phone ring grip · Smooth flat panel · 6 colours',
    [{ label: 'Grip', value: 'Smooth flat panel across the ring' }, { label: 'Form', value: 'Round ring' }],
    r005, ['Navy', 'Orange', 'Black', 'Titanium', 'Plum', 'Cream']),
  ring('R008-B', 'Strap Grip Ring',
    'A phone ring threaded with a soft woven fabric strap — slip a finger or two under the strap for a relaxed, secure hold.',
    'Phone ring grip · Woven fabric strap · 6 colours',
    [{ label: 'Grip', value: 'Woven fabric strap' }, { label: 'Form', value: 'Round ring' }],
    r008, ['Cream & Wine', 'Titanium', 'Plum', 'Orange', 'Sky Blue', 'Black']),
  ring('R012', 'Dial Ring Stand',
    'A bold ring stand with a watch-dial inspired face and a stand tab at the base. Two-tone finishes give it a sporty, technical look.',
    'Phone ring stand · Dial-style ring · 6 colours',
    [{ label: 'Design', value: 'Dial-style markings around the ring' }, { label: 'Stand', value: 'Stand tab at the base' }],
    r012, ['Titanium', 'Cream', 'Orange', 'Sky Blue', 'Plum', 'Black']),

  {
    model: 'SB-F',
    name: 'Smart Band – Buckle Strap',
    description: 'A slim smart band on a soft nylon strap with a metal buckle for an exact fit. Comfortable enough to wear all day and night.',
    shortDescription: 'Smart band · Nylon buckle strap · 4 colours',
    tags: ['smart band', 'wearable', 'band'],
    specs: [{ label: 'Strap', value: 'Nylon with metal buckle' }, { label: 'Color', value: 'Orange, Pink, Blue, Black' }],
    options: [
      { name: 'Orange', image: byFile(band, 'F橙尼龙.webp') },
      { name: 'Pink',   image: byFile(band, 'F粉尼龙.webp') },
      { name: 'Blue',   image: byFile(band, 'F蓝尼龙.webp') },
      { name: 'Black',  image: byFile(band, 'F黑尼龙.webp') },
    ],
    featured: true,
  },
  {
    model: 'SB-A',
    name: 'Smart Band – Nylon Loop',
    description: 'The same slim smart band on a stretchy woven nylon loop — just slide it on. Breathable, light and easy to wear.',
    shortDescription: 'Smart band · Woven nylon loop · 4 colours',
    tags: ['smart band', 'wearable', 'band'],
    specs: [{ label: 'Strap', value: 'Woven nylon loop' }, { label: 'Color', value: 'Orange Grey, Grey, Berry Red, Blue' }],
    options: [
      { name: 'Orange Grey', image: byFile(band, '橙灰尼龙A.webp') },
      { name: 'Grey',        image: byFile(band, '灰尼龙A.webp') },
      { name: 'Berry Red',   image: byFile(band, '莓果红尼龙A.webp') },
      { name: 'Blue',        image: byFile(band, '蓝尼龙A.webp') },
    ],
  },

  {
    model: 'DUO-LENS',
    name: 'Duo Lens Camera Protector',
    description: 'Metal-framed camera lens protectors for iPhone that guard each lens without hiding the camera’s look. Choose Double or Single, in Deep Blue or White to match your phone.',
    shortDescription: 'Camera lens protector · Metal frame · Deep Blue / White',
    tags: ['lens protector', 'camera', 'iphone'],
    specs: [
      { label: 'Fits', value: 'iPhone (dual camera)' },
      { label: 'Frame', value: 'Metal ring frames' },
      { label: 'Style', value: 'Double, Single' },
      { label: 'Color', value: 'Deep Blue, White' },
    ],
    attributes: [{ name: 'Color', values: ['Deep Blue', 'White'] }, { name: 'Style', values: ['Double', 'Single'] }],
    options: lensOptions,
    gallery: lensGallery,
    featured: true,
  },
]

export const newAccessories: Product[] = inputs.map(build)
