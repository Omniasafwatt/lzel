import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { useGetProductsByCategoryQuery } from '@/data/useMockData'
import { SMART_HOME_SECTIONS, getSmartHomeSection, subtitleOf, chipsOf } from '@/data/products/smartHomeLayout'
import type { Product } from '@/types'

// ── Section config ────────────────────────────────────────────────────────────
const sectionId = (name: string) => 'sh-' + name.toLowerCase().replace(/[^a-z0-9]+/g, '-')

const NAV_ITEMS = SMART_HOME_SECTIONS.map((s) => ({ id: sectionId(s.name), label: s.name }))

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

// ── Product card ──────────────────────────────────────────────────────────────
function SmartHomeCard({ product, index = 0 }: { product: Product; index?: number }) {
  const img = product.images[0]?.url
  const section = getSmartHomeSection(product)
  const chips = chipsOf(product)

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.05, ease: [0.16, 1, 0.3, 1] }}
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
        </div>
        <div className="p-4 flex flex-col flex-1">
          <p className="text-[10px] font-bold uppercase tracking-[.2em] text-[#D4693A] mb-1">aslitec</p>
          <h3 className="text-sm font-semibold text-[#2d3444] line-clamp-2 leading-snug">{product.name}</h3>
          {section && <p className="mt-1 text-xs text-[#999] line-clamp-1">{subtitleOf(product, section)}</p>}
          {chips.length > 0 && (
            <div className="mt-3 flex flex-wrap gap-1">
              {chips.map((c) => (
                <span key={c} className="rounded-full border border-[#E8E4DF] px-2 py-0.5 text-[10px] font-semibold text-[#555]">
                  {c}
                </span>
              ))}
            </div>
          )}
          <div className="mt-auto pt-3 flex items-center justify-between">
            {product.reviewCount > 0 ? (
              <span className="text-xs text-amber-500">★ {product.averageRating.toFixed(1)}</span>
            ) : <span />}
            <span className="inline-flex items-center gap-1 text-xs font-bold text-[#2d3444] group-hover:text-[#D4693A] transition-colors">
              More <ArrowRight className="size-3 transition-transform group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </motion.div>
  )
}

function ProductRow({ products }: { products: Product[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
      {products.map((p, i) => (
        <SmartHomeCard key={p.id} product={p} index={i} />
      ))}
    </div>
  )
}

// ── Sticky section bar ────────────────────────────────────────────────────────
function SectionBar() {
  const [active, setActive] = useState(NAV_ITEMS[0].id)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting)
        if (visible.length) setActive(visible[0].target.id)
      },
      { rootMargin: '-140px 0px -60% 0px' }
    )
    NAV_ITEMS.forEach(({ id }) => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const go = (id: string) => {
    const el = document.getElementById(id)
    if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 130, behavior: 'smooth' })
  }

  return (
    <div data-nav-scheme="light" className="sticky top-16 md:top-[68px] z-30 bg-white/90 backdrop-blur border-b border-[#E8E4DF]">
      <div className="container">
        <div className="flex gap-1 overflow-x-auto py-2.5" style={{ scrollbarWidth: 'none' }}>
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              onClick={() => go(item.id)}
              className={`shrink-0 rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[.15em] transition-colors ${
                active === item.id ? 'bg-[#2d3444] text-white' : 'text-[#555] hover:text-[#D4693A]'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────────
export default function SmartHomePage() {
  const { data, isLoading } = useGetProductsByCategoryQuery('smart-home')
  const products = data?.data ?? []

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
            aslitec Connected Living
          </motion.p>
          <motion.h1
            className="text-[clamp(46px,8vw,110px)] font-black text-white leading-[.88] tracking-tight"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            SMART HOME
          </motion.h1>
          <motion.p
            className="mt-6 text-sm text-white/40 max-w-md leading-relaxed"
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            Security cameras and smart devices that protect and monitor your world, anywhere, anytime.
          </motion.p>
        </div>
      </div>

      {/* ── MARQUEE ──────────────────────────────────────────────────── */}
      <div className="overflow-hidden bg-[#2d3444] py-3.5">
        <div className="flex whitespace-nowrap gap-10 animate-marquee">
          {['CAMERAS', 'SMART HOME', 'SECURITY', 'ASLITEC', 'EVA CAM', 'AI DETECT', '2K QHD', 'WIFI'].concat(
            ['CAMERAS', 'SMART HOME', 'SECURITY', 'ASLITEC', 'EVA CAM', 'AI DETECT', '2K QHD', 'WIFI']
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

      <SectionBar />

      {/* ── SECTIONS ─────────────────────────────────────────────────── */}
      <div data-nav-scheme="light" className="bg-[#FAFAF8] pb-24">
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
          <>
            {SMART_HOME_SECTIONS.map((section) => {
              const inSection = products.filter(section.match)
              if (inSection.length === 0) return null
              const banner = inSection[0].images[0]?.url

              return (
                <section key={section.name} id={sectionId(section.name)} className="pt-20">
                  <div className="container">
                    <FadeUp>
                      <div className="relative overflow-hidden rounded-3xl bg-[#12171f] min-h-[180px] md:min-h-[260px] flex items-end">
                        <div
                          className="pointer-events-none absolute inset-0 opacity-[0.05]"
                          style={{ backgroundImage: 'radial-gradient(circle,#D4693A 1px,transparent 1px)', backgroundSize: '28px 28px' }}
                        />
                        {banner && (
                          <img
                            src={banner}
                            alt=""
                            className="absolute right-4 md:right-12 top-1/2 -translate-y-1/2 h-[85%] w-1/2 object-contain object-right"
                            loading="lazy"
                          />
                        )}
                        <div className="relative p-6 md:p-10">
                          <p className="text-[11px] font-bold tracking-[.35em] text-[#D4693A] uppercase mb-2">
                            aslitec · {inSection.length} {inSection.length === 1 ? 'product' : 'products'}
                          </p>
                          <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight">{section.name}</h2>
                        </div>
                      </div>
                    </FadeUp>

                    <div className="mt-10">
                      <ProductRow products={inSection} />
                    </div>
                  </div>
                </section>
              )
            })}
          </>
        )}
      </div>

      {/* ── CTA BANNER ───────────────────────────────────────────────── */}
      <section className="relative bg-[#D4693A] py-24 overflow-hidden">
        <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <span className="text-[18vw] font-black text-white/[0.06] uppercase leading-none tracking-tighter whitespace-nowrap">
            SMART
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
            ALWAYS<br />CONNECTED.
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
