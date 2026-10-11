import type { Product } from '@/types'

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
]

export const getSmartHomeSection = (p: Product) =>
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
}

export function groupSpecs(p: Product) {
  const groups: { name: string; rows: Product['specifications'] }[] = []
  const order = ['General', 'Camera', 'Smart Features', 'Storage', 'Network', 'Power']
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
