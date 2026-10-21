import { productsByCategory } from './mockProducts'
import { ACCESSORY_SECTIONS, accessorySectionId } from './products/accessoriesLayout'
import { SMART_HOME_SECTIONS, smartHomeAnchor } from './products/smartHomeLayout'
import type { Product } from '@/types'

// Navbar mega-menu: one tile per sub-category (or per model when a category
// has a single product type), each with a product image.
export interface MenuItem { label: string; image?: string; href: string }

const shortName = (p: Product) => p.name.replace(/^aslitec\s+/i, '').replace(/\s+–\s+/, ' · ')

const bySection = <S>(slug: string, sections: S[], title: (s: S) => string, match: (s: S) => (p: Product) => boolean, anchor: (s: S) => string): MenuItem[] =>
  sections.flatMap((s) => {
    const first = productsByCategory[slug].find(match(s))
    return first ? [{ label: title(s), image: first.images[0]?.url, href: `/categories/${slug}#${anchor(s)}` }] : []
  })

const byProduct = (slug: string): MenuItem[] =>
  productsByCategory[slug].map((p) => ({ label: shortName(p), image: p.images[0]?.url, href: `/products/${p.slug}` }))

export const NAV_MENUS: Record<string, MenuItem[]> = {
  '/categories/gaming': byProduct('gaming'),
  '/categories/accessories': bySection('accessories', ACCESSORY_SECTIONS, (s) => s.title, (s) => s.filter, (s) => accessorySectionId(s.key)),
  '/categories/appliances': byProduct('appliances'),
  '/categories/smart-home': bySection('smart-home', SMART_HOME_SECTIONS, (s) => s.name, (s) => s.match, (s) => smartHomeAnchor(s.name)),
}
