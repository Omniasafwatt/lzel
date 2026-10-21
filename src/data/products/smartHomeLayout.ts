import type { Product } from '@/types'
import securityBanner from '@/assets/banners/smart-home/security-wide.webp'
import comfortBanner from '@/assets/banners/smart-home/comfort-wide.webp'
import driveBanner from '@/assets/banners/smart-home/drive-wide.webp'

// Section layout for the Smart Home page and its product pages
export interface SmartHomeSection {
  name: string
  subtitle: string
  match: (p: Product) => boolean
}

export const SMART_HOME_SECTIONS: SmartHomeSection[] = [
  { name: 'Pan & Tilt Cameras', subtitle: 'Smart Pan & Tilt Wi-Fi Camera', match: (p) => p.tags.includes('ptz') },
  { name: 'Wire-Free Cameras',  subtitle: 'Solar-Powered Wire-Free Camera', match: (p) => p.tags.includes('solar') },
  { name: 'Video Doorbells',    subtitle: 'Smart Wi-Fi Video Doorbell',      match: (p) => p.tags.includes('doorbell') },
  { name: 'Bladeless Fans',     subtitle: 'Bladeless Fan',                   match: (p) => p.tags.includes('fan') },
  { name: 'Humidifiers & Diffusers', subtitle: 'Humidifier & Aroma Diffuser', match: (p) => p.tags.includes('humidifier') || p.tags.includes('diffuser') },
  { name: 'Magnetic Car Mounts', subtitle: 'Magnetic Phone Mount',           match: (p) => p.tags.includes('car mount') },
]

// Top-level groups on the Smart Home page, each with its banner and sections
export interface SmartHomeGroup {
  name: string
  tagline: string
  banner: string
  darkBanner?: boolean
  sections: string[]
}

export const SMART_HOME_GROUPS: SmartHomeGroup[] = [
  {
    name: 'Smart Security',
    tagline: 'See, hear and protect every corner of your home',
    banner: securityBanner,
    sections: ['Pan & Tilt Cameras', 'Wire-Free Cameras', 'Video Doorbells'],
  },
  {
    name: 'Home Comfort',
    tagline: 'Cleaner air, gentle mist and calm scents, room by room',
    banner: comfortBanner,
    sections: ['Bladeless Fans', 'Humidifiers & Diffusers'],
  },
  {
    name: 'Smart Drive',
    tagline: 'Magnetic mounts that keep your phone steady on every road',
    banner: driveBanner,
    darkBanner: true,
    sections: ['Magnetic Car Mounts'],
  },
]

// Anchor ids on the Smart Home page (groups and sections)
export const smartHomeAnchor = (name: string) => 'sh-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

export const modelOf = (p: Product) => p.specifications.find((s) => s.label === 'Model')?.value

export const getSmartHomeSection =(p: Product) =>
  p.categoryId === 'cat-smart-home' ? SMART_HOME_SECTIONS.find((s) => s.match(p)) : undefined

const SPEC_GROUPS: Record<string, string> = {
  Model: 'General',
  Type: 'General',
  Resolution: 'Camera',
  'Night vision': 'Camera',
  FOV: 'Camera',
  'Pan/Tilt': 'Camera',
  Detection: 'Smart Features',
  App: 'Smart Features',
  Storage: 'Storage',
  Connectivity: 'Network',
  Power: 'Power',
  Standby: 'Power',
  Protection: 'General',
  Color: 'General',
  Finish: 'General',
  Design: 'Design & Controls',
  Form: 'Design & Controls',
  'Air Intake': 'Design & Controls',
  'Mist Outlets': 'Design & Controls',
  Display: 'Design & Controls',
  Lighting: 'Design & Controls',
  Controls: 'Design & Controls',
  Mounting: 'Mounting',
  Holding: 'Mounting',
  Adjustment: 'Mounting',
  Arm: 'Mounting',
}

export function groupSpecs(p: Product) {
  const groups: { name: string; rows: Product['specifications'] }[] = []
  const order = ['General', 'Design & Controls', 'Mounting', 'Camera', 'Smart Features', 'Storage', 'Network', 'Power']
  for (const s of p.specifications) {
    const name = SPEC_GROUPS[s.label] ?? 'General'
    let g = groups.find((x) => x.name === name)
    if (!g) groups.push((g = { name, rows: [] }))
    g.rows.push(s)
  }
  return groups.sort((a, b) => order.indexOf(a.name) - order.indexOf(b.name))
}

// Core camera specs first, then whatever makes this model different
export function highlightsOf(p: Product) {
  const core = ['Resolution', 'Night vision', 'Detection']
  const picked = core
    .map((l) => p.specifications.find((s) => s.label === l))
    .filter((s): s is NonNullable<typeof s> => !!s)
  const modelIdx = p.specifications.findIndex((s) => s.label === 'Model')
  const extras = modelIdx >= 0 ? p.specifications.slice(modelIdx + 1) : []
  const rest = p.specifications.filter((s) => !picked.includes(s) && !extras.includes(s) && s.label !== 'Model')
  return [...picked, ...extras, ...rest].slice(0, 6)
}

// Feature chips, minus the one already used as the subtitle
export const chipsOf = (p: Product) => {
  const chips = p.shortDescription?.split('·').map((c) => c.trim()).filter(Boolean) ?? []
  return p.tags.includes('camera') ? chips : chips.slice(1)
}

// Cameras share their section's subtitle; other devices describe themselves
export const subtitleOf = (p: Product, section: SmartHomeSection) =>
  p.tags.includes('camera') ? section.subtitle : p.shortDescription?.split('·')[0].trim() || section.subtitle
