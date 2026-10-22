import type { Product } from '@/types'
import { stylus }          from './products/stylus'
import { kettles }         from './products/kettles'
import { chargers }        from './products/chargers'
import { smartHome }       from './products/smartHome'
import { smartHomeDevices } from './products/smartHomeDevices'
import { newAccessories }  from './products/newAccessories'
import { controllers }     from './products/controllers'
import { powerbanks }      from './products/powerbanks'
import { waterproofCases } from './products/waterproofCases'
import { phoneCases }      from './products/phoneCases'
import { earphones }       from './products/earphones'

export { mockCategories, getCategoryById, getCategoryBySlug } from './mockCategories'

export const mockProducts: Product[] = [
  ...controllers,
  ...stylus,
  ...chargers,
  ...powerbanks,
  ...waterproofCases,
  ...phoneCases,
  ...earphones,
  ...newAccessories,
  ...kettles,
  ...smartHome,
  ...smartHomeDevices,
]

export const productsByCategory: Record<string, Product[]> = {
  gaming:       controllers,
  accessories:  [...stylus, ...chargers, ...powerbanks, ...waterproofCases, ...phoneCases, ...earphones, ...newAccessories, ...smartHomeDevices],
  appliances:   kettles,
  'smart-home': smartHome,
}

export const featuredProducts: Product[] = mockProducts.filter((p) => p.isFeatured)

export const bestSellers: Product[] = [...mockProducts]
  .sort((a, b) => b.salesCount - a.salesCount)
  .slice(0, 12)

const NEW_ARRIVALS_IDS = [
  // October 2026 drop
  'prod-acc-duo-lens',
  'prod-sh-cma660',
  'prod-acc-r001',
  'prod-acc-gan-100w',
  'prod-sh-vas-302',
  'prod-acc-sb-f',
  'prod-sh-mgqv2c',
  'prod-acc-r012',
  'prod-sh-vrm-370',
  'prod-acc-gan-65w',
  'prod-sh-brz-a09',
  'prod-acc-r008-b',
  'prod-sh-vr-a807',
  'prod-acc-sb-a',
  'prod-ear-dl-white',
  'prod-ear-sl-black',
  'prod-ear-dc-white',
  'prod-ear-sc-black',
  'prod-cam-js-g20',
  'prod-cam-js-r02',
  'prod-ket-glass',
  'prod-ket-vintage-mint',
  'prod-sty-bc24018-p',
  'prod-sty-bc24016-w',
  'prod-charger-200w',
  'prod-sty-bc23-w',
]
export const newArrivals: Product[] = NEW_ARRIVALS_IDS
  .map(id => mockProducts.find(p => p.id === id))
  .filter((p): p is Product => p !== undefined)

export const topRated: Product[] = [...mockProducts]
  .sort((a, b) => b.averageRating - a.averageRating || b.reviewCount - a.reviewCount)
  .slice(0, 12)

export const onSale: Product[] = mockProducts.filter(
  (p) => p.compareAtPrice && p.compareAtPrice > p.price
)

export const getProductById   = (id: string):   Product | undefined => mockProducts.find((p) => p.id   === id)
export const getProductBySlug = (slug: string): Product | undefined => mockProducts.find((p) => p.slug === slug)

export const getProductsByCategorySlug = (slug: string): Product[] =>
  mockProducts.filter((p) => p.category.slug === slug)

export const getRelatedProducts = (product: Product, limit = 8): Product[] =>
  mockProducts
    .filter((p) => p.id !== product.id && p.categoryId === product.categoryId)
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, limit)

export const getSuggestions = (query: string, limit = 8): string[] => {
  const q = query.toLowerCase()
  const matches = mockProducts
    .filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.tags.some((t) => t.toLowerCase().includes(q))
    )
    .map((p) => p.name)
  return [...new Set(matches)].slice(0, limit)
}
