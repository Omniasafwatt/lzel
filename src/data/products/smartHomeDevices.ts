import type { Product, ProductSpecification } from '@/types'
import { getCategoryById } from '../mockCategories'
import {
  fan_brz_a09, fan_cma660,
  mount_dxm12t, mount_mcdy1h, mount_mcet2m, mount_mgd10x2, mount_mge10x,
  mount_mgp40s, mount_mgqv2c, mount_mgtm40, mount_rdgm44,
  hum_vas302, dif_vra807_blk, dif_vra807_wht, dif_vrm370,
} from '../localImages'

const cat = getCategoryById('cat-accessories')!

// Details below are limited to what the product photos show (model, form,
// mounting, colour, controls). Electrical specs need the factory spec sheets.
interface DeviceInput {
  model: string
  name: string
  description: string
  shortDescription: string
  tags: string[]
  images: { url: string; alt: string }[]
  specs: ProductSpecification[]
  colors?: { name: string; image: string }[]
}

const device = (d: DeviceInput, i: number): Product => {
  const id = `prod-sh-${d.model.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`
  return {
    id,
    name: d.name,
    slug: `aslitec-${d.name.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`,
    description: d.description,
    shortDescription: d.shortDescription,
    sku: `ASL-${d.model}`,
    price: 0,
    categoryId: 'cat-accessories',
    category: cat,
    attributes: d.colors ? [{ id: `${id}-color`, name: 'Color', values: d.colors.map((c) => c.name) }] : [],
    variants: (d.colors ?? []).map((c) => ({
      id: `${id}-${c.name.toLowerCase()}`,
      productId: id,
      sku: `ASL-${d.model}-${c.name.slice(0, 3).toUpperCase()}`,
      attributes: { Color: c.name },
      price: 0,
      stock: 0,
      lowStockThreshold: 0,
      images: [c.image],
      isActive: true,
    })),
    images: d.images.map((img, j) => ({ id: `${id}-img-${j}`, url: img.url, alt: img.alt, sortOrder: j })),
    specifications: [{ label: 'Type', value: d.shortDescription.split('·')[0].trim() }, { label: 'Model', value: d.model }, ...d.specs],
    tags: ['accessories', 'aslitec', 'new', ...d.tags],
    status: 'active',
    isFeatured: false,
    isDigital: false,
    stock: 0,
    lowStockThreshold: 0,
    averageRating: 0,
    reviewCount: 0,
    salesCount: 0,
    viewCount: 0,
    createdAt: new Date(Date.UTC(2026, 9, 14) - i * 60_000).toISOString(),
    updatedAt: '2026-10-14T00:00:00Z',
  }
}

const one = (url: string, alt: string) => [{ url, alt }]

export const smartHomeDevices: Product[] = [
  // ── Bladeless fans ──────────────────────────────────────────────────────────
  {
    model: 'BRZ-A09',
    name: 'Bladeless Tower Fan BRZ-A09',
    description: 'A slim bladeless tower fan with a brushed-silver oval air loop over a white cylindrical base. Air is drawn in through the base grille and pushed out through the loop — no exposed blades, easy to wipe clean. Controls sit on the round touch panel at the foot of the fan.',
    shortDescription: 'Bladeless tower fan · Touch controls · White & silver',
    tags: ['fan', 'bladeless', 'cooling'],
    images: one(fan_brz_a09, 'aslitec BRZ-A09 bladeless tower fan'),
    specs: [
      { label: 'Design', value: 'Bladeless oval air loop' },
      { label: 'Air Intake', value: 'Perforated grille in the base' },
      { label: 'Controls', value: 'Touch panel on the base' },
      { label: 'Color', value: 'White with silver loop' },
    ],
  },
  {
    model: 'CMA660',
    name: 'Bladeless Fan CMA660',
    description: 'A sculpted bladeless fan: a brushed-silver air loop cradled by a curved white frame on a tall pedestal. The base carries a digital display and touch buttons, and the wrap-around grille draws air in quietly from every side.',
    shortDescription: 'Bladeless fan · Digital display · Touch buttons',
    tags: ['fan', 'bladeless', 'cooling'],
    images: one(fan_cma660, 'aslitec CMA660 bladeless fan'),
    specs: [
      { label: 'Design', value: 'Bladeless air loop with curved support frame' },
      { label: 'Air Intake', value: 'Wrap-around grille in the pedestal' },
      { label: 'Controls', value: 'Digital display with touch buttons' },
      { label: 'Color', value: 'White with silver loop' },
    ],
  },

  // ── Humidifiers & diffusers ─────────────────────────────────────────────────
  {
    model: 'VAS-302',
    name: 'Dual-Mist Humidifier VAS-302',
    description: 'A tall twin-chamber humidifier with two independent mist outlets on top, so you can run one side or both. The front touch panel controls each side separately, and a soft night-light glows from the base. Cream body with champagne trim.',
    shortDescription: 'Dual-mist humidifier · Left/right control · Night light',
    tags: ['humidifier', 'mist', 'air'],
    images: one(hum_vas302, 'aslitec VAS-302 dual-mist humidifier'),
    specs: [
      { label: 'Mist Outlets', value: 'Two (left and right)' },
      { label: 'Controls', value: 'Front touch panel with separate left/right controls' },
      { label: 'Lighting', value: 'Ambient night light in the base' },
      { label: 'Color', value: 'Cream with champagne trim' },
    ],
  },
  {
    model: 'VR-A807',
    name: 'Portable Aroma Diffuser VR-A807',
    description: 'A compact, pocket-sized aroma diffuser in a soft-touch cylinder. A glowing light ring marks it out on a desk, in the car or on a bedside table, and a single front button keeps it simple. Available in black and white.',
    shortDescription: 'Portable aroma diffuser · Light ring · Black / White',
    tags: ['diffuser', 'aroma', 'portable'],
    images: [
      { url: dif_vra807_blk, alt: 'aslitec VR-A807 aroma diffuser – Black' },
      { url: dif_vra807_wht, alt: 'aslitec VR-A807 aroma diffuser – White' },
    ],
    colors: [
      { name: 'Black', image: dif_vra807_blk },
      { name: 'White', image: dif_vra807_wht },
    ],
    specs: [
      { label: 'Form', value: 'Compact portable cylinder' },
      { label: 'Lighting', value: 'Glowing light ring' },
      { label: 'Controls', value: 'Single front button' },
      { label: 'Color', value: 'Black, White' },
    ],
  },
  {
    model: 'VRM-370',
    name: 'Aroma Diffuser Clock VRM-370',
    description: 'A bedside aroma diffuser and digital clock in one glossy black block. The LED time display shows through the front, touch controls sit on top beside the mist outlet, and a warm amber glow rises from the base.',
    shortDescription: 'Aroma diffuser · LED clock · Warm glow',
    tags: ['diffuser', 'aroma', 'clock'],
    images: one(dif_vrm370, 'aslitec VRM-370 aroma diffuser clock'),
    specs: [
      { label: 'Display', value: 'LED digital clock' },
      { label: 'Controls', value: 'Top touch controls' },
      { label: 'Lighting', value: 'Warm amber base glow' },
      { label: 'Color', value: 'Gloss black' },
    ],
  },

  // ── Magnetic car mounts ─────────────────────────────────────────────────────
  {
    model: 'MGQV2C',
    name: 'Magnetic Vent Mount MGQV2C',
    description: 'A magnetic phone mount that clips onto your car’s air vent. The round magnetic head has a carbon-fibre-textured rim around a gloss black centre with an orange accent ring, and swivels on a ball joint to set the perfect angle.',
    shortDescription: 'Magnetic car mount · Air vent clip · Carbon-fibre rim',
    tags: ['car mount', 'magnetic', 'car'],
    images: one(mount_mgqv2c, 'aslitec MGQV2C magnetic vent mount'),
    specs: [
      { label: 'Mounting', value: 'Air vent clip' },
      { label: 'Holding', value: 'Magnetic ring' },
      { label: 'Adjustment', value: 'Ball-joint swivel' },
      { label: 'Finish', value: 'Carbon-fibre texture, black with orange ring' },
    ],
  },
  {
    model: 'MGP40S',
    name: 'Magnetic Mount MGP40S',
    description: 'A low-profile magnetic mount with a flat aluminium base that sticks to the dashboard or console. The magnetic head pairs a gloss black centre and orange accent ring with a carbon-fibre-textured rim, and tilts on a ball joint.',
    shortDescription: 'Magnetic car mount · Flat adhesive base · Aluminium',
    tags: ['car mount', 'magnetic', 'car'],
    images: one(mount_mgp40s, 'aslitec MGP40S magnetic mount'),
    specs: [
      { label: 'Mounting', value: 'Flat adhesive base' },
      { label: 'Holding', value: 'Magnetic ring' },
      { label: 'Adjustment', value: 'Ball-joint tilt' },
      { label: 'Finish', value: 'Aluminium base, carbon-fibre-textured rim' },
    ],
  },
  {
    model: 'MGTM40',
    name: 'Magnetic Clip Mount MGTM40',
    description: 'A magnetic phone mount held by a sturdy clip bracket behind the head. The round magnetic face combines a gloss black centre, orange accent ring and carbon-fibre-textured rim.',
    shortDescription: 'Magnetic car mount · Clip bracket · Carbon-fibre rim',
    tags: ['car mount', 'magnetic', 'car'],
    images: one(mount_mgtm40, 'aslitec MGTM40 magnetic clip mount'),
    specs: [
      { label: 'Mounting', value: 'Clip bracket' },
      { label: 'Holding', value: 'Magnetic ring' },
      { label: 'Finish', value: 'Carbon-fibre texture, black with orange ring' },
    ],
  },
  {
    model: 'MCET2M',
    name: 'Magnetic Dashboard Mount MCET2M',
    description: 'A dashboard phone mount with a bold silver-and-carbon magnetic ring on an angled stand. The flat base sits securely on the dash, and the head rotates so you can switch between portrait and landscape.',
    shortDescription: 'Magnetic car mount · Dashboard stand · Silver & carbon',
    tags: ['car mount', 'magnetic', 'car'],
    images: one(mount_mcet2m, 'aslitec MCET2M magnetic dashboard mount'),
    specs: [
      { label: 'Mounting', value: 'Dashboard stand with flat base' },
      { label: 'Holding', value: 'Magnetic ring' },
      { label: 'Adjustment', value: 'Rotating head' },
      { label: 'Finish', value: 'Silver ring with carbon-fibre texture' },
    ],
  },
  {
    model: 'MGD10X2',
    name: 'Foldable Magnetic Stand MGD10X2',
    description: 'A foldable magnetic stand in gunmetal grey. The magnetic ring sits on a hinged arm above a round weighted base, so it lifts your phone to eye level and folds flat when you don’t need it.',
    shortDescription: 'Magnetic mount · Foldable arm · Gunmetal',
    tags: ['car mount', 'magnetic', 'car', 'stand'],
    images: one(mount_mgd10x2, 'aslitec MGD10X2 foldable magnetic stand'),
    specs: [
      { label: 'Mounting', value: 'Round base' },
      { label: 'Holding', value: 'Magnetic ring' },
      { label: 'Adjustment', value: 'Foldable hinged arm' },
      { label: 'Color', value: 'Gunmetal grey' },
    ],
  },
  {
    model: 'MGE10X',
    name: 'Magnetic Dashboard Mount MGE10X',
    description: 'A clean, minimal magnetic mount: an open magnetic ring with a ribbed edge on a compact ball-joint base for the dashboard or console.',
    shortDescription: 'Magnetic car mount · Compact base · Ball joint',
    tags: ['car mount', 'magnetic', 'car'],
    images: one(mount_mge10x, 'aslitec MGE10X magnetic dashboard mount'),
    specs: [
      { label: 'Mounting', value: 'Compact dashboard base' },
      { label: 'Holding', value: 'Magnetic ring' },
      { label: 'Adjustment', value: 'Ball-joint swivel' },
      { label: 'Color', value: 'Black' },
    ],
  },
  {
    model: 'RDGM44',
    name: 'Suction Gooseneck Mount RDGM44',
    description: 'A suction-cup mount for the windscreen or dashboard with a long flexible gooseneck arm. Bend it to bring the square magnetic head exactly where you want your phone.',
    shortDescription: 'Magnetic car mount · Suction cup · Flexible gooseneck',
    tags: ['car mount', 'magnetic', 'car'],
    images: one(mount_rdgm44, 'aslitec RDGM44 suction gooseneck mount'),
    specs: [
      { label: 'Mounting', value: 'Suction cup (windscreen or dashboard)' },
      { label: 'Holding', value: 'Square magnetic head' },
      { label: 'Adjustment', value: 'Flexible gooseneck arm' },
      { label: 'Color', value: 'Black' },
    ],
  },
  {
    model: 'DXM12T',
    name: 'Cup Holder Mount DXM12T',
    description: 'A phone mount that fits in a car cup holder. A curved arm rises from the holder base to a magnetic ring head, keeping your phone within reach without anything stuck to the dash or vents.',
    shortDescription: 'Magnetic car mount · Cup holder base · Curved arm',
    tags: ['car mount', 'magnetic', 'car'],
    images: one(mount_dxm12t, 'aslitec DXM12T cup holder mount'),
    specs: [
      { label: 'Mounting', value: 'Car cup holder' },
      { label: 'Holding', value: 'Magnetic ring' },
      { label: 'Arm', value: 'Curved riser arm' },
      { label: 'Color', value: 'Black' },
    ],
  },
  {
    model: 'MCDY1H',
    name: 'Hook Mount MCDY1H',
    description: 'A hook-on phone mount with an adjustable arm that ends in a magnetic ring head. Hang it, set the angle at the joints, and snap your phone on.',
    shortDescription: 'Magnetic mount · Hook-on · Adjustable arm',
    tags: ['car mount', 'magnetic', 'car'],
    images: one(mount_mcdy1h, 'aslitec MCDY1H hook mount'),
    specs: [
      { label: 'Mounting', value: 'Hook' },
      { label: 'Holding', value: 'Magnetic ring' },
      { label: 'Adjustment', value: 'Adjustable jointed arm' },
      { label: 'Color', value: 'Black' },
    ],
  },
].map(device)
