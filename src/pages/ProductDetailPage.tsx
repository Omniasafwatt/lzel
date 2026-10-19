import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ChevronLeft, ChevronRight, ArrowLeft } from 'lucide-react'
import { useGetProductQuery, useGetRelatedProductsQuery } from '@/data/useMockData'
import { Skeleton } from '@/components/common/Skeleton'
import { getSmartHomeSection } from '@/data/products/smartHomeLayout'
import type { ProductVariant } from '@/types'
import SmartHomeProductPage from './SmartHomeProductPage'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const { data, isLoading } = useGetProductQuery(slug!)
  const product = data?.data

  const [selectedImageIdx, setSelectedImageIdx] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({})
  const [tab, setTab] = useState<'description' | 'specs'>('description')

  const { data: relatedData } = useGetRelatedProductsQuery(product?.id ?? '', {
    skip: !product?.id,
  })
  const related = relatedData?.data ?? []

  const handleAttributeSelect = (attrName: string, value: string) => {
    const newAttrs = { ...selectedAttributes, [attrName]: value }
    setSelectedAttributes(newAttrs)
    const matchedVariant = product?.variants.find((v) =>
      Object.entries(newAttrs).every(([k, val]) => v.attributes[k] === val)
    )
    setSelectedVariant(matchedVariant ?? null)
    // show the photo that belongs to the chosen option
    const idx = product?.images.findIndex((img) => img.url === matchedVariant?.images[0]) ?? -1
    if (idx >= 0) setSelectedImageIdx(idx)
  }

  if (isLoading) {
    return (
      <div className="container pt-28 pb-16">
        <div className="grid gap-10 lg:grid-cols-2">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-5">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-5 w-1/3" />
            <Skeleton className="h-20 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) return (
    <div className="container pt-28 pb-16 text-center">
      <h1 className="text-2xl font-bold text-[#2d3444]">Product not found</h1>
      <Link to="/" className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-[#D4693A] hover:underline">
        <ArrowLeft className="size-4" /> Back to Home
      </Link>
    </div>
  )

  const smartHomeSection = getSmartHomeSection(product)
  if (smartHomeSection) return <SmartHomeProductPage key={product.slug} product={product} section={smartHomeSection} />

  const images = product.images

  return (
    <div className="min-h-screen bg-[#FAFAF8]">
      <div className="container pt-28 pb-20">

        {/* Breadcrumb */}
        <nav className="mb-8 flex items-center gap-1.5 text-xs text-[#999]">
          <Link to="/" className="hover:text-[#2d3444] transition-colors">Home</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link to={`/categories/${product.category.slug}`} className="hover:text-[#2d3444] transition-colors capitalize">
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-[#2d3444] font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        <div className="grid gap-12 lg:grid-cols-2">

          {/* ── Images ─────────────────────────────────────────────────── */}
          <div>
            <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#F7F3EE] border border-[#E8E4DF]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImageIdx}
                  src={images[selectedImageIdx]?.url}
                  alt={product.name}
                  className="size-full object-contain p-6 mix-blend-multiply"
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                />
              </AnimatePresence>

              {images.length > 1 && (
                <>
                  <button
                    className="absolute left-3 top-1/2 -translate-y-1/2 flex size-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-all"
                    onClick={() => setSelectedImageIdx((i) => (i - 1 + images.length) % images.length)}
                  >
                    <ChevronLeft className="size-4 text-[#2d3444]" />
                  </button>
                  <button
                    className="absolute right-3 top-1/2 -translate-y-1/2 flex size-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-all"
                    onClick={() => setSelectedImageIdx((i) => (i + 1) % images.length)}
                  >
                    <ChevronRight className="size-4 text-[#2d3444]" />
                  </button>
                </>
              )}
            </div>

            {/* Thumbnails */}
            {images.length > 1 && (
              <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                {images.map((img, i) => (
                  <button
                    key={img.id}
                    onClick={() => setSelectedImageIdx(i)}
                    className={`size-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                      i === selectedImageIdx
                        ? 'border-[#D4693A]'
                        : 'border-transparent hover:border-[#E8E4DF]'
                    }`}
                  >
                    <img src={img.url} alt={img.alt || product.name} className="size-full object-contain bg-[#F7F3EE] p-1" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* ── Info ───────────────────────────────────────────────────── */}
          <div className="space-y-6">
            <div>
              <p className="text-xs font-bold uppercase tracking-[.3em] text-[#D4693A] mb-2">aslitec</p>
              <h1 className="text-2xl md:text-3xl font-black text-[#2d3444] leading-tight">{product.name}</h1>

              {product.shortDescription && (
                <p className="mt-2 text-sm font-semibold text-[#777]">{product.shortDescription}</p>
              )}

              {/* Rating */}
              {product.reviewCount > 0 && (
              <div className="mt-3 flex items-center gap-2">
                <div className="flex items-center gap-0.5">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      className={`size-4 ${
                        i < Math.floor(product.averageRating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-[#E8E4DF] text-[#E8E4DF]'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-sm font-semibold text-[#2d3444]">{product.averageRating.toFixed(1)}</span>
                <span className="text-sm text-[#999]">· {product.reviewCount} reviews</span>
              </div>
              )}
            </div>

            {/* Variants */}
            {product.attributes.map((attr) => (
              <div key={attr.id}>
                <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#999]">
                  {attr.name}
                  {selectedAttributes[attr.name] && (
                    <span className="ml-2 normal-case font-semibold text-[#2d3444]">{selectedAttributes[attr.name]}</span>
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {attr.values.map((val) => {
                    const selected = selectedAttributes[attr.name] === val
                    return (
                      <button
                        key={val}
                        onClick={() => handleAttributeSelect(attr.name, val)}
                        className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-all ${
                          selected
                            ? 'border-[#D4693A] bg-[#D4693A]/8 text-[#D4693A]'
                            : 'border-[#E8E4DF] text-[#555] hover:border-[#2d3444]'
                        }`}
                      >
                        {val}
                      </button>
                    )
                  })}
                </div>
              </div>
            ))}

            {/* Tags */}
            {product.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {product.tags.map((tag) => (
                  <span key={tag} className="rounded-full border border-[#E8E4DF] px-3 py-1 text-[11px] font-semibold text-[#999] uppercase tracking-wide">
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Tabs ─────────────────────────────────────────────────────── */}
        <div className="mt-16">
          <div className="flex border-b border-[#E8E4DF]">
            {(['description', 'specs'] as const).map((t) => (
              <button
                key={t}
                onClick={() => setTab(t)}
                className={`px-6 py-3 text-sm font-bold capitalize transition-colors border-b-2 -mb-px ${
                  tab === t
                    ? 'border-[#D4693A] text-[#D4693A]'
                    : 'border-transparent text-[#999] hover:text-[#2d3444]'
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="mt-8">
            {tab === 'description' && (
              <div
                className="prose prose-sm max-w-none text-[#555] leading-relaxed"
                dangerouslySetInnerHTML={{ __html: product.description }}
              />
            )}
            {tab === 'specs' && (
              <div className="grid gap-2 sm:grid-cols-2">
                {product.specifications.map((spec) => (
                  <div key={spec.label} className="flex gap-4 rounded-xl border border-[#E8E4DF] p-4 bg-white">
                    <span className="text-xs font-bold uppercase tracking-widest text-[#999] w-28 shrink-0 pt-0.5">{spec.label}</span>
                    <span className="text-sm text-[#2d3444] font-medium">{spec.value}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* ── Related ───────────────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-20">
            <p className="text-xs font-bold uppercase tracking-[.35em] text-[#D4693A] mb-2">You might also like</p>
            <h2 className="text-2xl font-black text-[#2d3444] mb-8">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.slice(0, 8).map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${p.slug}`}
                  className="group rounded-2xl bg-white border border-[#E8E4DF] overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="aspect-square bg-[#F7F3EE] overflow-hidden">
                    {p.images[0]?.url && (
                      <img
                        src={p.images[0].url}
                        alt={p.name}
                        className="size-full object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                        loading="lazy"
                      />
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4693A] mb-1">{p.category.name}</p>
                    <h3 className="text-sm font-semibold text-[#2d3444] line-clamp-2 leading-snug">{p.name}</h3>
                    {p.reviewCount > 0 && <span className="mt-1.5 inline-block text-xs text-amber-500">★ {p.averageRating.toFixed(1)}</span>}
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
