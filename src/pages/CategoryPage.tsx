import { useEffect, useRef, useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useGetCategoryQuery, useGetProductsQuery } from '@/data/useMockData'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setFilters } from '@/features/search/store/searchSlice'
import Pagination from '@/components/common/Pagination'
import { formatPrice } from '@/lib/utils'
import { addItem } from '@/features/cart/store/cartSlice'
import { toast } from 'sonner'
import type { Product } from '@/types'

function CatCard({ product, index = 0 }: { product: Product; index?: number }) {
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
      transition={{ duration: 0.6, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
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
            <h3 className="text-sm font-semibold text-[#2d3444] line-clamp-2 leading-snug">
              {product.name}
            </h3>
            <div className="mt-3 flex items-center justify-between">
              <span className="font-bold text-[#2d3444]">{formatPrice(product.price)}</span>
              <span className="text-xs text-amber-500">★ {product.averageRating.toFixed(1)}</span>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  )
}

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const dispatch = useAppDispatch()
  const { data: catData } = useGetCategoryQuery(slug!)
  const cat = catData?.data
  const filters = useAppSelector((s) => s.search.filters)

  useEffect(() => {
    if (cat?.id) dispatch(setFilters({ categoryId: cat.id }))
  }, [cat?.id, dispatch])

  const { data, isLoading } = useGetProductsQuery(filters)
  const products = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="min-h-screen bg-[#FAFAF8] pt-24">

      {/* Hero */}
      <div className="relative overflow-hidden border-b border-[#E8E4DF] bg-white">
        {cat?.image && (
          <div className="absolute inset-0">
            <img src={cat.image} alt={cat?.name} className="size-full object-cover opacity-[0.07]" />
            <div className="absolute inset-0 bg-gradient-to-b from-white/60 to-white" />
          </div>
        )}
        <div className="container relative z-10 py-16">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            <p className="text-xs text-[#D4693A] uppercase tracking-widest font-bold mb-4">Collection</p>
            <h1 className="text-[clamp(40px,6vw,80px)] font-black tracking-tight text-[#2d3444] leading-tight">
              {cat?.name ?? slug}
            </h1>
            {cat?.description && (
              <p className="mt-4 text-base text-[#777] max-w-xl leading-relaxed">{cat.description}</p>
            )}
            {meta && (
              <p className="mt-3 text-sm text-[#AAA] flex items-center gap-2">
                {meta.total} products
                <ArrowRight className="size-3" />
              </p>
            )}
          </motion.div>
        </div>
      </div>

      {/* Grid */}
      <div className="container py-12">
        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-white border border-[#E8E4DF] aspect-[3/4] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {products.map((p, i) => <CatCard key={p.id} product={p} index={i} />)}
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
  )
}
