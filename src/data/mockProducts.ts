import type { Product } from '@/types'
import { smartphones } from './products/smartphones'
import { cases } from './products/cases'
import {
  screenProtectors,
  chargersAndCables,
  powerBanks,
  mountsAndHolders,
  cameraAccessories,
  mobileGaming,
} from './products/accessories'
import {
  earphones,
  bluetoothSpeakers,
  smartwatches,
} from './products/audioAndWearables'

export { mockCategories, getCategoryById, getCategoryBySlug } from './mockCategories'
export { mockBrands, getBrandById, getBrandBySlug } from './mockBrands'

// All products combined
export const mockProducts: Product[] = [
  ...smartphones,
  ...cases,
  ...screenProtectors,
  ...chargersAndCables,
  ...powerBanks,
  ...earphones,
  ...bluetoothSpeakers,
  ...smartwatches,
  ...mountsAndHolders,
  ...cameraAccessories,
  ...mobileGaming,
]

// By category
export const productsByCategory: Record<string, Product[]> = {
  smartphones,
  'cases-covers': cases,
  'screen-protectors': screenProtectors,
  'chargers-cables': chargersAndCables,
  'power-banks': powerBanks,
  'earphones-headphones': earphones,
  'bluetooth-speakers': bluetoothSpeakers,
  'smartwatches-wearables': smartwatches,
  'mounts-holders': mountsAndHolders,
  'camera-accessories': cameraAccessories,
  'mobile-gaming': mobileGaming,
}

// Featured products (isFeatured === true)
export const featuredProducts: Product[] = mockProducts.filter((p) => p.isFeatured)

// Best sellers (sorted by salesCount)
export const bestSellers: Product[] = [...mockProducts]
  .sort((a, b) => b.salesCount - a.salesCount)
  .slice(0, 12)

// New arrivals (sorted by createdAt desc)
export const newArrivals: Product[] = [...mockProducts]
  .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
  .slice(0, 12)

// Top rated (sorted by averageRating desc)
export const topRated: Product[] = [...mockProducts]
  .sort((a, b) => b.averageRating - a.averageRating || b.reviewCount - a.reviewCount)
  .slice(0, 12)

// On sale (has compareAtPrice > price)
export const onSale: Product[] = mockProducts.filter(
  (p) => p.compareAtPrice && p.compareAtPrice > p.price
)

// Lookup helpers
export const getProductById = (id: string): Product | undefined =>
  mockProducts.find((p) => p.id === id)

export const getProductBySlug = (slug: string): Product | undefined =>
  mockProducts.find((p) => p.slug === slug)

export const getProductsByCategorySlug = (slug: string): Product[] =>
  mockProducts.filter((p) => p.category.slug === slug)

export const getProductsByBrandSlug = (slug: string): Product[] =>
  mockProducts.filter((p) => p.brand?.slug === slug)

export const searchProducts = (query: string): Product[] => {
  const q = query.toLowerCase()
  return mockProducts.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      p.description.toLowerCase().includes(q) ||
      p.tags.some((t) => t.toLowerCase().includes(q)) ||
      p.brand?.name.toLowerCase().includes(q) ||
      p.category.name.toLowerCase().includes(q)
  )
}

export const getRelatedProducts = (product: Product, limit = 6): Product[] =>
  mockProducts
    .filter(
      (p) =>
        p.id !== product.id &&
        (p.category.id === product.category.id || p.brand?.id === product.brand?.id)
    )
    .sort((a, b) => b.salesCount - a.salesCount)
    .slice(0, limit)

export const getSuggestions = (query: string, limit = 8): string[] => {
  if (!query.trim()) return []
  const q = query.toLowerCase()
  const names = searchProducts(query)
    .map((p) => p.name)
    .slice(0, limit)
  const tags = mockProducts
    .flatMap((p) => p.tags)
    .filter((t, i, arr) => t.toLowerCase().includes(q) && arr.indexOf(t) === i)
    .slice(0, 4)
  return [...new Set([...names, ...tags])].slice(0, limit)
}
