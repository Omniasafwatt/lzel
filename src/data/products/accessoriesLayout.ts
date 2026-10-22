import type { Product } from '@/types'

// Sections on the Accessories page (also used by the navbar menu)
export const ACCESSORY_SECTIONS = [
  {
    key: 'earphones',
    title: 'Earphones',
    filter: (p: Product) => p.tags.includes('earphones'),
  },
  {
    key: 'case-phone',
    title: 'Cases',
    filter: (p: Product) => p.tags.includes('case') && !p.tags.includes('waterproof-case'),
  },
  {
    key: 'grip',
    title: 'Phone Grips & Ring Stands',
    filter: (p: Product) => p.tags.includes('grip') && !p.tags.includes('case'),
  },
  {
    key: 'lens',
    title: 'Lens Protectors',
    filter: (p: Product) => p.tags.includes('lens protector'),
  },
  {
    key: 'charger',
    title: 'Home Charger Adapter',
    filter: (p: Product) => p.tags.includes('charger') && !p.tags.includes('display-charger'),
  },
  {
    key: 'display-charger',
    title: 'GaN Display Chargers',
    filter: (p: Product) => p.tags.includes('display-charger'),
  },
  {
    key: 'smart-band',
    title: 'Smart Bands',
    filter: (p: Product) => p.tags.includes('smart band'),
  },
  {
    key: 'stylus',
    title: 'Stylus',
    filter: (p: Product) => p.tags.includes('stylus'),
  },
  {
    key: 'powerbank',
    title: 'Powerbank',
    filter: (p: Product) => p.tags.includes('powerbank'),
  },
  {
    key: 'waterproof',
    title: 'WaterProof Case',
    filter: (p: Product) => p.tags.includes('waterproof-case'),
  },
  {
    key: 'fan',
    title: 'Bladeless Fans',
    filter: (p: Product) => p.tags.includes('fan'),
  },
  {
    key: 'humidifier',
    title: 'Humidifiers & Diffusers',
    filter: (p: Product) => p.tags.includes('humidifier') || p.tags.includes('diffuser'),
  },
  {
    key: 'car-mount',
    title: 'Magnetic Car Mounts',
    filter: (p: Product) => p.tags.includes('car mount'),
  },
]

export const accessorySectionId = (key: string) => `acc-${key}`
