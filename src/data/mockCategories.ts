import type { Category } from '@/types'
import { pencil_bc24018_white_shot } from './localImages'
import { kettle_steel_shot2 }        from './localImages'
import { cam_g20_1 }                 from './localImages'
import { ctrl1_1 }                   from './localImages'

export const mockCategories: Category[] = [
  {
    id: 'cat-gaming',
    name: 'Gaming',
    slug: 'gaming',
    description: 'aslitec G7 Pro wireless RGB controllers for PlayStation and PC',
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
    description: 'aslitec stylus pens, chargers, cases, bladeless fans, humidifiers, aroma diffusers and magnetic car mounts',
    image: pencil_bc24018_white_shot,
    isActive: true,
    sortOrder: 2,
    productCount: 27,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-appliances',
    name: 'Appliances',
    slug: 'appliances',
    description: 'aslitec home appliances — kettles and more',
    image: kettle_steel_shot2,
    isActive: true,
    sortOrder: 3,
    productCount: 5,
    createdAt: '2024-01-01T00:00:00Z',
  },
  {
    id: 'cat-smart-home',
    name: 'Smart Home',
    slug: 'smart-home',
    description: 'Security cameras and video doorbell',
    image: cam_g20_1,
    isActive: true,
    sortOrder: 4,
    productCount: 6,
    createdAt: '2024-01-01T00:00:00Z',
  },
]

export const getCategoryById   = (id: string)   => mockCategories.find((c) => c.id === id)
export const getCategoryBySlug = (slug: string) => mockCategories.find((c) => c.slug === slug)
