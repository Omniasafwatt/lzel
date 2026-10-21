import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useGetProductsByCategoryQuery } from '@/data/useMockData'
import type { Product } from '@/types'
import { ACCESSORY_SECTIONS as SECTIONS, accessorySectionId } from '@/data/products/accessoriesLayout'
import { useHashScroll } from '@/lib/useHashScroll'

// ── FadeUp helper ─────────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = '' }: {
  children: React.ReactNode
  delay?: number
  className?: string
}) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 36 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

// ── Colour swatches ───────────────────────────────────────────────────────────
const SWATCH: Record<string, string> = {
  Black: '#1f1f1f', Gunmetal: '#5d6670', Silver: '#cfd2d6', Titanium: '#b9ada3', Cream: '#f3dfb0',
  Plum: '#4a1f3d', Orange: '#f26b2a', Navy: '#26305a', 'Sky Blue': '#93aee0', 'Cream & Wine': '#7a1f2b',
  Pink: '#f3d3cf', Blue: '#4f74c9', 'Orange Grey': '#b8643a', Grey: '#bfc4c6', 'Berry Red': '#ee6a6a',
  'Deep Blue': '#23345f', White: '#f4f4f2',
}

function Swatches({ product }: { product: Product }) {
  const colors = product.attributes.find((a) => a.name === 'Color')?.values ?? []
  if (colors.length < 2) return null
  return (
    <div className="mt-2 flex items-center gap-1">
      {colors.slice(0, 7).map((c) => (
        <span key={c} title={c} className="size-3 rounded-full border border-black/10" style={{ background: SWATCH[c] ?? '#ddd' }} />
      ))}
      <span className="ml-1 text-[10px] font-semibold text-[#999]">{colors.length} colours</span>
    </div>
  )
}

// ── Product card ──────────────────────────────────────────────────────────────
function AccessoryCard({ product, index = 0 }: { product: Product; index?: number }) {
  const img = product.images[0]?.url

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      className="h-full"
    >
      <Link
        to={`/products/${product.slug}`}
        className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-[#E8E4DF] hover:shadow-lg transition-shadow duration-300"
      >
        <div className="relative aspect-square overflow-hidden bg-[#F7F3EE]">
          {img && (
            <img
              src={img}
              alt={product.name}
              className="size-full object-contain p-4 mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.06]"
              loading="lazy"
              decoding="async"
            />
          )}
          {product.compareAtPrice && (
            <div className="absolute top-3 left-3 rounded-full bg-[#D4693A] px-2.5 py-0.5 text-[10px] font-bold text-white">
              SALE
            </div>
          )}
          {product.tags.includes('new') && (
            <div className="absolute top-3 left-3 rounded-full bg-[#2d3444] px-2.5 py-0.5 text-[10px] font-bold text-white">
              NEW
            </div>
          )}
        </div>
        <div className="p-4 flex flex-col flex-1">
          <h3 className="text-sm font-semibold text-[#2d3444] line-clamp-2 leading-snug">
            {product.name}
          </h3>
          {product.tags.includes('new') && product.shortDescription && (
            <p className="mt-1 text-xs text-[#999] line-clamp-1">{product.shortDescription.split('·')[0].trim()}</p>
          )}
          <Swatches product={product} />
          <div className="mt-auto pt-3">
            {product.reviewCount > 0 ? (
              <span className="text-xs text-amber-500">
                ★ {product.averageRating.toFixed(1)}
              </span>
            ) : (
              <span className="text-xs font-bold text-[#2d3444] group-hover:text-[#D4693A] transition-colors">View →</span>
            )}
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function AccessoriesPage() {
  const { data, isLoading } = useGetProductsByCategoryQuery('accessories')
  const products = data?.data ?? []
  useHashScroll(!isLoading && products.length > 0, 90)

  return (
    <div className="min-h-screen">

      {/* ── HERO ─────────────────────────────────────────────────────── */}
      <div className="relative min-h-[50vh] flex items-center overflow-hidden bg-[#12171f] pt-24">
        {/* Dot grid */}
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{
            backgroundImage: 'radial-gradient(circle,#D4693A 1px,transparent 1px)',
            backgroundSize: '32px 32px',
          }}
        />
        {/* Diagonal texture */}
        <div
          className="pointer-events-none absolute inset-0"
          style={{
            background:
              'repeating-linear-gradient(135deg,transparent,transparent 80px,rgba(212,105,58,0.02) 80px,rgba(212,105,58,0.02) 82px)',
          }}
        />
        {/* Glow */}
        <div
          className="pointer-events-none absolute top-1/2 left-1/3 -translate-y-1/2 w-[700px] h-[700px]"
          style={{
            background: 'radial-gradient(circle,rgba(212,105,58,0.13) 0%,transparent 70%)',
            filter: 'blur(80px)',
          }}
        />
        {/* Corner marks */}
        {[
          'top-8 left-8 border-l-2 border-t-2',
          'top-8 right-8 border-r-2 border-t-2',
          'bottom-8 left-8 border-l-2 border-b-2',
          'bottom-8 right-8 border-r-2 border-b-2',
        ].map((cls, i) => (
          <div
            key={i}
            className={`pointer-events-none absolute w-10 h-10 border-[#D4693A]/25 ${cls}`}
          />
        ))}

        <div className="container relative z-10 py-16">
          <motion.p
            className="text-[11px] font-bold tracking-[.45em] text-[#D4693A] uppercase mb-5"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.15 }}
          >
            aslitec Collection
          </motion.p>
          <motion.h1
            className="text-[clamp(56px,9vw,120px)] font-black text-white leading-[.88] tracking-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            ACCESSORIES
          </motion.h1>
          <motion.p
            className="mt-6 text-sm text-white/40 max-w-md leading-relaxed"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Earphones, stylus pens, GaN chargers, premium cases, and powerbanks — accessories engineered to match your ambition.
          </motion.p>
        </div>
      </div>

      {/* ── MARQUEE ──────────────────────────────────────────────────── */}
      <div className="overflow-hidden bg-[#2d3444] py-3.5">
        <div className="flex whitespace-nowrap gap-10 animate-marquee">
          {['EARPHONES', 'STYLUS', 'CHARGERS', 'CASES', 'POWERBANK', 'WATERPROOF', 'ACCESSORIES', 'ASLITEC', 'GaN 200W'].concat(
            ['EARPHONES', 'STYLUS', 'CHARGERS', 'CASES', 'POWERBANK', 'WATERPROOF', 'ACCESSORIES', 'ASLITEC', 'GaN 200W']
          ).map((t, i) => (
            <span
              key={i}
              className="flex items-center gap-10 text-xs font-bold uppercase tracking-[.25em] text-white/35"
            >
              {t} <span className="text-[#D4693A]">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── SECTIONS ─────────────────────────────────────────────────── */}
      <div className="bg-[#FAFAF8] pb-24">
        {isLoading ? (
          <div className="container pt-20">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white border border-[#E8E4DF] aspect-[3/4] animate-pulse"
                />
              ))}
            </div>
          </div>
        ) : (
          SECTIONS.map((section) => {
            const sectionProducts = products.filter(section.filter)
            if (sectionProducts.length === 0) return null
            return (
              <section key={section.key} id={accessorySectionId(section.key)} className="container pt-20 scroll-mt-24">
                <FadeUp className="mb-8">
                  <p className="text-xs font-bold tracking-[.35em] text-[#D4693A] uppercase mb-3">
                    — Accessories —
                  </p>
                  <h2 className="text-2xl font-black text-[#2d3444]">{section.title}</h2>
                </FadeUp>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
                  {sectionProducts.map((p, i) => (
                    <AccessoryCard key={p.id} product={p} index={i} />
                  ))}
                </div>
              </section>
            )
          })
        )}
      </div>

      {/* ── CTA BANNER ───────────────────────────────────────────────── */}
      <section className="relative bg-[#D4693A] py-24 overflow-hidden">
        <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <span className="text-[18vw] font-black text-white/[0.06] uppercase leading-none tracking-tighter whitespace-nowrap">
            ACCESSORIES
          </span>
        </div>
        <div className="container relative z-10 text-center">
          <motion.h2
            className="text-[clamp(40px,6vw,80px)] font-black text-white leading-[.88] tracking-tight"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >
            COMPLETE<br />YOUR SETUP.
          </motion.h2>
          <motion.div
            className="mt-8 flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link
              to="/"
              className="rounded-full bg-white px-9 py-4 text-sm font-bold text-[#D4693A] hover:bg-[#2d3444] hover:text-white transition-colors duration-300"
            >
              Back to Home
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
