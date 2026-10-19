import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronLeft, ChevronRight, Star } from 'lucide-react'
import { productsByCategory } from '@/data/mockProducts'
import { groupSpecs, highlightsOf, subtitleOf, chipsOf, type SmartHomeSection } from '@/data/products/smartHomeLayout'
import type { Product } from '@/types'

type Tab = 'overview' | 'specs'

export default function SmartHomeProductPage({ product, section }: { product: Product; section: SmartHomeSection }) {
  const [tab, setTab] = useState<Tab>('overview')
  const [imgIdx, setImgIdx] = useState(0)
  const images = product.images
  const highlights = highlightsOf(product)
  const model = product.specifications.find((s) => s.label === 'Model')?.value
  // same section first, then the rest of Smart Home
  const others = productsByCategory['smart-home'].filter((p) => p.id !== product.id)
  const related = [...others.filter(section.match), ...others.filter((p) => !section.match(p))].slice(0, 8)

  const switchTab = (t: Tab) => {
    setTab(t)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div className="min-h-screen bg-[#FAFAF8]">

      {/* ── Product bar: name + Detail / Specifications ──────────────── */}
      <div data-nav-scheme="light" className="sticky top-16 md:top-[68px] z-30 mt-16 md:mt-[68px] bg-white/90 backdrop-blur border-y border-[#E8E4DF]">
        <div className="container flex items-center justify-between gap-4 h-12">
          <p className="truncate text-sm font-black text-[#2d3444]">{product.name}</p>
          <div className="flex items-center gap-1 shrink-0">
            {(['overview', 'specs'] as const).map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`px-3 md:px-4 py-1.5 text-xs font-bold rounded-full transition-colors ${
                  tab === t ? 'bg-[#2d3444] text-white' : 'text-[#555] hover:text-[#D4693A]'
                }`}
              >
                {t === 'overview' ? 'Detail' : 'Specifications'}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="container pt-8 pb-20">
        {/* Breadcrumb */}
        <nav className="mb-8 flex flex-wrap items-center gap-1.5 text-xs text-[#999]">
          <Link to="/" className="hover:text-[#2d3444] transition-colors">Home</Link>
          <span>/</span>
          <Link to="/categories/smart-home" className="hover:text-[#2d3444] transition-colors">Smart Home</Link>
          <span>/</span>
          <span>{section.name}</span>
          <span>/</span>
          <span className="text-[#2d3444] font-medium truncate max-w-[200px]">{product.name}</span>
        </nav>

        {tab === 'overview' ? (
          <>
            {/* ── Hero ─────────────────────────────────────────────────── */}
            <div className="grid gap-10 lg:gap-16 lg:grid-cols-2 items-center">
              <div>
                <div className="relative aspect-square overflow-hidden rounded-3xl bg-[#F7F3EE] border border-[#E8E4DF]">
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={imgIdx}
                      src={images[imgIdx]?.url}
                      alt={images[imgIdx]?.alt ?? product.name}
                      className="size-full object-contain p-8 mix-blend-multiply"
                      initial={{ opacity: 0, scale: 0.97 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      transition={{ duration: 0.25 }}
                    />
                  </AnimatePresence>
                  {images.length > 1 && (
                    <>
                      <button
                        aria-label="Previous image"
                        className="absolute left-3 top-1/2 -translate-y-1/2 flex size-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-all"
                        onClick={() => setImgIdx((i) => (i - 1 + images.length) % images.length)}
                      >
                        <ChevronLeft className="size-4 text-[#2d3444]" />
                      </button>
                      <button
                        aria-label="Next image"
                        className="absolute right-3 top-1/2 -translate-y-1/2 flex size-9 items-center justify-center rounded-full bg-white/80 backdrop-blur-sm shadow-md hover:bg-white transition-all"
                        onClick={() => setImgIdx((i) => (i + 1) % images.length)}
                      >
                        <ChevronRight className="size-4 text-[#2d3444]" />
                      </button>
                    </>
                  )}
                </div>
                {images.length > 1 && (
                  <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
                    {images.map((img, i) => (
                      <button
                        key={img.id}
                        onClick={() => setImgIdx(i)}
                        className={`size-16 shrink-0 overflow-hidden rounded-xl border-2 transition-all ${
                          i === imgIdx ? 'border-[#D4693A]' : 'border-transparent hover:border-[#E8E4DF]'
                        }`}
                      >
                        <img src={img.url} alt={img.alt} className="size-full object-contain bg-[#F7F3EE] p-1" />
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <p className="text-xs font-bold uppercase tracking-[.3em] text-[#D4693A] mb-3">aslitec</p>
                <h1 className="text-[clamp(36px,5vw,64px)] font-black text-[#2d3444] leading-[.95] tracking-tight">{product.name}</h1>
                <p className="mt-4 text-lg font-semibold text-[#555]">{subtitleOf(product, section)}</p>

                {product.reviewCount > 0 && (
                <div className="mt-3 flex items-center gap-2">
                  <div className="flex items-center gap-0.5">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`size-4 ${
                          i < Math.floor(product.averageRating) ? 'fill-amber-400 text-amber-400' : 'fill-[#E8E4DF] text-[#E8E4DF]'
                        }`}
                      />
                    ))}
                  </div>
                  <span className="text-sm font-semibold text-[#2d3444]">{product.averageRating.toFixed(1)}</span>
                  <span className="text-sm text-[#999]">· {product.reviewCount} reviews</span>
                </div>
                )}

                <p className="mt-5 text-sm text-[#777] leading-relaxed max-w-lg">{product.description}</p>

                {chipsOf(product).length > 0 && (
                  <div className="mt-6 flex flex-wrap gap-2">
                    {chipsOf(product).map((o) => (
                      <span key={o} className="rounded-xl border border-[#E8E4DF] bg-white px-4 py-2 text-sm font-semibold text-[#2d3444]">
                        {o}
                      </span>
                    ))}
                  </div>
                )}

                {product.attributes.map((attr) => (
                  <div key={attr.id} className="mt-6">
                    <p className="mb-2 text-xs font-bold uppercase tracking-widest text-[#999]">{attr.name}</p>
                    <div className="flex flex-wrap gap-2">
                      {attr.values.map((val) => {
                        const variantImg = product.variants.find((v) => v.attributes[attr.name] === val)?.images[0]
                        const idx = images.findIndex((img) => img.url === variantImg)
                        const selected = idx >= 0 && idx === imgIdx
                        return (
                          <button
                            key={val}
                            onClick={() => idx >= 0 && setImgIdx(idx)}
                            className={`rounded-xl border px-4 py-2 text-sm font-semibold transition-all ${
                              selected ? 'border-[#D4693A] text-[#D4693A]' : 'border-[#E8E4DF] bg-white text-[#555] hover:border-[#2d3444]'
                            }`}
                          >
                            {val}
                          </button>
                        )
                      })}
                    </div>
                  </div>
                ))}

                {model && (
                  <p className="mt-6 text-xs text-[#999]">
                    Model <span className="font-mono text-[#555]">{model}</span>
                  </p>
                )}

                <div className="mt-8 flex flex-wrap gap-3">
                  <button
                    onClick={() => switchTab('specs')}
                    className="rounded-full bg-[#2d3444] px-7 py-3 text-sm font-bold text-white hover:bg-[#D4693A] transition-colors"
                  >
                    View Specifications
                  </button>
                  <Link
                    to="/contact"
                    className="rounded-full border border-[#2d3444] px-7 py-3 text-sm font-bold text-[#2d3444] hover:border-[#D4693A] hover:text-[#D4693A] transition-colors"
                  >
                    Ask About This Product
                  </Link>
                </div>
              </div>
            </div>

            {/* ── Highlights ───────────────────────────────────────────── */}
            {highlights.length > 0 && (
              <section className="mt-20">
                <p className="text-xs font-bold uppercase tracking-[.35em] text-[#D4693A] mb-2">Key Features</p>
                <h2 className="text-2xl font-black text-[#2d3444] mb-8">At a glance</h2>
                <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
                  {highlights.map((h) => (
                    <div key={h.label} className="rounded-2xl border border-[#E8E4DF] bg-white p-5">
                      <p className="text-[10px] font-bold uppercase tracking-widest text-[#999]">{h.label}</p>
                      <p className="mt-2 text-sm md:text-base font-bold text-[#2d3444] leading-snug">{h.value}</p>
                    </div>
                  ))}
                </div>
              </section>
            )}

            {/* ── Gallery ──────────────────────────────────────────────── */}
            {images.length > 1 && (
              <section className="mt-20">
                <p className="text-xs font-bold uppercase tracking-[.35em] text-[#D4693A] mb-2">Gallery</p>
                <h2 className="text-2xl font-black text-[#2d3444] mb-8">Every angle</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  {images.map((img) => (
                    <div key={img.id} className="aspect-[4/3] rounded-3xl bg-[#F7F3EE] border border-[#E8E4DF] overflow-hidden">
                      <img src={img.url} alt={img.alt} loading="lazy" className="size-full object-contain p-6 mix-blend-multiply" />
                    </div>
                  ))}
                </div>
              </section>
            )}
          </>
        ) : (
          /* ── Specifications ─────────────────────────────────────────── */
          <section>
            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[.35em] text-[#D4693A] mb-2">{product.name}</p>
              <h1 className="text-3xl md:text-4xl font-black text-[#2d3444]">Specifications</h1>
            </div>
            {images[0] && (
              <div className="mx-auto mt-8 max-w-md aspect-[4/3] rounded-3xl bg-white border border-[#E8E4DF] overflow-hidden">
                <img src={images[0].url} alt={product.name} className="size-full object-contain p-6 mix-blend-multiply" />
              </div>
            )}

            <div className="mx-auto mt-12 max-w-4xl space-y-8">
              {groupSpecs(product).map((g) => (
                <div key={g.name} className="overflow-hidden rounded-2xl border border-[#E8E4DF] bg-white">
                  <h2 className="bg-[#F7F3EE] px-5 py-3 text-xs font-black uppercase tracking-[.2em] text-[#2d3444]">{g.name}</h2>
                  <dl>
                    {g.rows.map((s, i) => (
                      <div key={s.label + i} className="grid sm:grid-cols-[200px_1fr] gap-1 sm:gap-6 px-5 py-3.5 border-t border-[#F0ECE7] first:border-t-0">
                        <dt className="text-xs font-bold uppercase tracking-wider text-[#999] pt-0.5">{s.label}</dt>
                        <dd className="text-sm text-[#2d3444]">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── Related ─────────────────────────────────────────────────── */}
        {related.length > 0 && (
          <section className="mt-24">
            <p className="text-xs font-bold uppercase tracking-[.35em] text-[#D4693A] mb-2">More Smart Home</p>
            <h2 className="text-2xl font-black text-[#2d3444] mb-8">You might also like</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((p) => (
                <Link
                  key={p.id}
                  to={`/products/${p.slug}`}
                  className="group rounded-2xl bg-white border border-[#E8E4DF] overflow-hidden hover:shadow-lg transition-shadow duration-300"
                >
                  <div className="aspect-square bg-[#F7F3EE] overflow-hidden">
                    <img
                      src={p.images[0]?.url}
                      alt={p.name}
                      className="size-full object-contain p-4 transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                  </div>
                  <div className="p-4">
                    <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4693A] mb-1">aslitec</p>
                    <h3 className="text-sm font-semibold text-[#2d3444] line-clamp-2 leading-snug">{p.name}</h3>
                    {p.reviewCount > 0 && (
                      <span className="mt-1.5 inline-block text-xs text-amber-500">★ {p.averageRating.toFixed(1)}</span>
                    )}
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
