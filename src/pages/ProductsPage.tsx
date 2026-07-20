import { useEffect, useRef, useState } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { SlidersHorizontal, LayoutGrid, List, X } from 'lucide-react'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import ProductFilters from '@/features/products/components/ProductFilters'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setFilters, resetFilters } from '@/features/search/store/searchSlice'
import { useGetProductsQuery } from '@/data/useMockData'
import Pagination from '@/components/common/Pagination'
import { formatPrice } from '@/lib/utils'
import { addItem } from '@/features/cart/store/cartSlice'
import { toast } from 'sonner'
import type { Product } from '@/types'

function LightCard({ product, index = 0 }: { product: Product; index?: number }) {
  const dispatch = useAppDispatch()
  const ref = useRef<HTMLDivElement>(null)
  const rx = useMotionValue(0), ry = useMotionValue(0)
  const srx = useSpring(rx, { stiffness: 130, damping: 22 })
  const sry = useSpring(ry, { stiffness: 130, damping: 22 })
  const [hovered, setHovered] = useState(false)

  const onMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const r = ref.current!.getBoundingClientRect()
    rx.set(((e.clientY - r.top - r.height / 2) / r.height) * -5)
    ry.set(((e.clientX - r.left - r.width / 2) / r.width) * 5)
  }

  const addToCart = (e: React.MouseEvent) => {
    e.preventDefault(); e.stopPropagation()
    dispatch(addItem({ product })); toast.success('Added to cart')
  }

  const img = product.images[0]?.url

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: index * 0.04, ease: [0.16, 1, 0.3, 1] }}
      ref={ref}
      style={{ perspective: 800 }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { rx.set(0); ry.set(0); setHovered(false) }}
    >
      <motion.div
        style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }}
        className="bg-white rounded-2xl overflow-hidden border border-[#E8E4DF]"
        animate={{
          boxShadow: hovered
            ? '0 16px 48px rgba(0,0,0,0.09)'
            : '0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.05)',
        }}
        transition={{ duration: 0.3 }}
      >
        <Link to={`/products/${product.slug}`}>
          <div className="relative aspect-square overflow-hidden bg-[#F7F3EE]">
            {img && (
              <motion.img
                src={img} alt={product.name}
                className="size-full object-cover"
                animate={hovered ? { scale: 1.06 } : { scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
            {product.compareAtPrice && (
              <div className="absolute top-3 left-3 rounded-full bg-[#D4693A] px-2.5 py-0.5 text-[10px] font-bold text-white">
                SALE
              </div>
            )}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 8 }}
                  className="absolute inset-x-3 bottom-3"
                >
                  <button
                    onClick={addToCart}
                    className="w-full rounded-xl bg-[#2d3444] py-2.5 text-sm font-bold text-white hover:bg-[#D4693A] transition-colors duration-200"
                  >
                    Add to Cart
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="p-4">
            <p className="text-[10px] text-[#D4693A] font-semibold uppercase tracking-widest mb-1">
              {product.category.name}
            </p>
            <h3 className="text-sm font-semibold text-[#2d3444] line-clamp-2 leading-snug">
              {product.name}
            </h3>
            <div className="mt-3 flex items-center justify-between">
              <div className="flex items-baseline gap-2">
                <span className="font-bold text-[#2d3444]">{formatPrice(product.price)}</span>
                {product.compareAtPrice && (
                  <span className="text-xs text-[#BBB] line-through">
                    {formatPrice(product.compareAtPrice)}
                  </span>
                )}
              </div>
              <span className="text-xs text-amber-500">★ {product.averageRating.toFixed(1)}</span>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  )
}

export default function ProductsPage() {
  const dispatch = useAppDispatch()
  const [searchParams] = useSearchParams()
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  const filters = useAppSelector((s) => s.search.filters)

  useEffect(() => {
    dispatch(resetFilters())
    const patch: Record<string, unknown> = {}
    if (searchParams.get('sort'))     patch.sortBy     = searchParams.get('sort')
    if (searchParams.get('category')) patch.categoryId = searchParams.get('category')
    if (searchParams.get('q'))        patch.query      = searchParams.get('q')
    if (Object.keys(patch).length > 0) dispatch(setFilters(patch))
  }, [searchParams, dispatch])

  const { data, isLoading } = useGetProductsQuery(filters)
  const products = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24">
      <div className="container py-10">

        {/* Header */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
          <div>
            <p className="text-xs font-bold tracking-[.3em] text-[#D4693A] uppercase mb-2">Catalog</p>
            <h1 className="text-4xl font-black tracking-tight text-[#2d3444]">All Products</h1>
            {meta && <p className="mt-2 text-sm text-[#888]">{meta.total} products</p>}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className="flex items-center gap-2 rounded-xl border border-[#E8E4DF] bg-white px-4 py-2.5 text-sm text-[#666] hover:text-[#2d3444] transition-colors lg:hidden"
            >
              <SlidersHorizontal className="size-4" /> Filters
              {showFilters && <X className="size-4" />}
            </button>
            <div className="flex rounded-xl border border-[#E8E4DF] bg-white overflow-hidden">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 transition-colors ${viewMode === 'grid' ? 'bg-[#D4693A]/10 text-[#D4693A]' : 'text-[#BBB] hover:text-[#2d3444]'}`}
              >
                <LayoutGrid className="size-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 transition-colors ${viewMode === 'list' ? 'bg-[#D4693A]/10 text-[#D4693A]' : 'text-[#BBB] hover:text-[#2d3444]'}`}
              >
                <List className="size-4" />
              </button>
            </div>
          </div>
        </div>

        <div className="flex gap-6">
          {/* Filters sidebar */}
          <aside className={`${showFilters ? 'block' : 'hidden'} lg:block w-full lg:w-60 xl:w-72 shrink-0`}>
            <div className="sticky top-24 rounded-2xl border border-[#E8E4DF] bg-white p-5">
              <ProductFilters />
            </div>
          </aside>

          {/* Grid */}
          <div className="flex-1 min-w-0">
            {isLoading ? (
              <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="rounded-2xl bg-white border border-[#E8E4DF] aspect-[3/4] animate-pulse" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-32 text-center">
                <div className="text-6xl mb-6 opacity-20">⬡</div>
                <h3 className="text-xl font-bold text-[#555]">No products found</h3>
                <p className="text-sm text-[#AAA] mt-2">Try adjusting your filters.</p>
              </div>
            ) : (
              <div className={`grid gap-4 ${viewMode === 'grid' ? 'grid-cols-2 md:grid-cols-3' : 'grid-cols-1'}`}>
                {products.map((p, i) => <LightCard key={p.id} product={p} index={i} />)}
              </div>
            )}
            {meta && meta.totalPages > 1 && (
              <div className="mt-10">
                <Pagination
                  currentPage={meta.page}
                  totalPages={meta.totalPages}
                  onPageChange={(p) => dispatch(setFilters({ page: p }))}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
