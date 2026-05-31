import type { Brand } from '@/types'

export const mockBrands: Brand[] = [
  { id: 'brand-apple', name: 'Apple', slug: 'apple', logo: 'https://upload.wikimedia.org/wikipedia/commons/f/fa/Apple_logo_black.svg', description: 'Think Different', website: 'https://apple.com', isActive: true, productCount: 12, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'brand-samsung', name: 'Samsung', slug: 'samsung', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/24/Samsung_Logo.svg', description: 'Inspire the World, Create the Future', website: 'https://samsung.com', isActive: true, productCount: 14, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'brand-google', name: 'Google', slug: 'google', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/2f/Google_2015_logo.svg', description: 'Organize the world\'s information', website: 'https://store.google.com', isActive: true, productCount: 8, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'brand-oneplus', name: 'OnePlus', slug: 'oneplus', logo: 'https://upload.wikimedia.org/wikipedia/commons/8/8e/OnePlus_Logo.svg', description: 'Never Settle', website: 'https://oneplus.com', isActive: true, productCount: 6, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'brand-xiaomi', name: 'Xiaomi', slug: 'xiaomi', logo: 'https://upload.wikimedia.org/wikipedia/commons/2/29/Xiaomi_logo.svg', description: 'Innovation for everyone', website: 'https://mi.com', isActive: true, productCount: 8, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'brand-anker', name: 'Anker', slug: 'anker', logo: 'https://upload.wikimedia.org/wikipedia/commons/7/7b/Anker_logo.svg', description: 'Charge On', website: 'https://anker.com', isActive: true, productCount: 10, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'brand-spigen', name: 'Spigen', slug: 'spigen', logo: '', description: 'Premium protection', website: 'https://spigen.com', isActive: true, productCount: 8, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'brand-otterbox', name: 'OtterBox', slug: 'otterbox', logo: '', description: 'Trusted Protection', website: 'https://otterbox.com', isActive: true, productCount: 6, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'brand-zagg', name: 'ZAGG', slug: 'zagg', logo: '', description: 'Screen & Case Protection', website: 'https://zagg.com', isActive: true, productCount: 5, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'brand-belkin', name: 'Belkin', slug: 'belkin', logo: '', description: 'People-inspired products', website: 'https://belkin.com', isActive: true, productCount: 7, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'brand-mophie', name: 'Mophie', slug: 'mophie', logo: '', description: 'Stay charged', website: 'https://mophie.com', isActive: true, productCount: 4, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'brand-baseus', name: 'Baseus', slug: 'baseus', logo: '', description: 'Follow Your Heart', website: 'https://baseus.com', isActive: true, productCount: 8, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'brand-ugreen', name: 'Ugreen', slug: 'ugreen', logo: '', description: 'Premium cables & hubs', website: 'https://ugreen.com', isActive: true, productCount: 6, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'brand-jbl', name: 'JBL', slug: 'jbl', logo: '', description: 'Live for the bass', website: 'https://jbl.com', isActive: true, productCount: 5, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'brand-sony', name: 'Sony', slug: 'sony', logo: '', description: 'Be Moved', website: 'https://sony.com', isActive: true, productCount: 4, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'brand-esr', name: 'ESR', slug: 'esr', logo: '', description: 'Essential everyday protection', website: 'https://esrgear.com', isActive: true, productCount: 5, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'brand-razer', name: 'Razer', slug: 'razer', logo: '', description: 'For Gamers. By Gamers.', website: 'https://razer.com', isActive: true, productCount: 3, createdAt: '2024-01-01T00:00:00Z' },
  { id: 'brand-backbone', name: 'Backbone', slug: 'backbone', logo: '', description: 'Mobile gaming controller', website: 'https://playbackbone.com', isActive: true, productCount: 2, createdAt: '2024-01-01T00:00:00Z' },
]

export const getBrandById = (id: string) => mockBrands.find((b) => b.id === id)
export const getBrandBySlug = (slug: string) => mockBrands.find((b) => b.slug === slug)
