import type { Category } from '@/types'
import { ctrl1_1 } from './localImages'
import { pencil_bc24018_white_shot } from './localImages'
import { kettle_mint_shot } from './localImages'

export const mockCategories: Category[] = [
  {
    id: 'cat-gaming',
    name: 'Gaming',
    slug: 'gaming',
    description: 'aslitec wireless game controllers with RGB lighting',
    image: ctrl1_1,
    isActive: true,
    sortOrder: 1,
    productCount: 5,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-accessories',
    name: 'Accessories',
    slug: 'accessories',
    description: 'aslitec stylus pens for iPad and tablet',
    image: pencil_bc24018_white_shot,
    isActive: true,
    sortOrder: 2,
    productCount: 9,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-appliances',
    name: 'Appliances',
    slug: 'appliances',
    description: 'aslitec home appliances — kettles and more',
    image: kettle_mint_shot,
    isActive: true,
    sortOrder: 3,
    productCount: 5,
    createdAt: '2024-01-01T00:00:00Z',
  },
]

export const getCategoryById   = (id: string)   => mockCategories.find((c) => c.id === id)
export const getCategoryBySlug = (slug: string) => mockCategories.find((c) => c.slug === slug)
