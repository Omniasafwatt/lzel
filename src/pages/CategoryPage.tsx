import { useEffect, useRef } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import { useGetCategoryQuery, useGetProductsQuery } from '@/data/useMockData'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setFilters } from '@/features/search/store/searchSlice'
import Pagination from '@/components/common/Pagination'
import type { Product } from '@/types'
import { useState } from 'react'

gsap.registerPlugin(ScrollTrigger)

// ── Per-category config ───────────────────────────────────────────────────
const CAT_CONFIG: Record<string, {
  tagline: string; headline: string; caption: string
  marqueeItems: string[]; features: string[]
  midHeadline: string; midCaption: string
}> = {
  gaming: {
    tagline: 'Level Up Your Setup',
    headline: 'GAME\nBOLD.',
    caption: 'aslitec G7 Pro wireless RGB controllers — engineered for PlayStation 4, PC, and mobile with 8-hour battery and 16.8M colors.',
    marqueeItems: ['GAMING', 'CONTROLLERS', 'RGB LED', 'WIRELESS', 'PS4', 'PC', 'G7 PRO', 'ASLITEC'],
    features: ['Bluetooth 5.1', 'RGB 16.8M Colors', '8h Battery', 'Multi-Platform'],
    midHeadline: 'BUILT TO\nWIN.',
    midCaption: 'Precision dual-analog sticks, haptic triggers, and RGB that sets the mood — made for players who demand more.',
  },
  accessories: {
    tagline: 'Complete Your Setup',
    headline: 'EVERY\nDETAIL.',
    caption: 'Stylus pens, GaN chargers, and premium cases — accessories engineered to match your ambition.',
    marqueeItems: ['STYLUS', 'CHARGERS', 'CASES', 'ACCESSORIES', 'ASLITEC', 'TECH', 'GaN 200W', 'PREMIUM'],
    features: ['GaN Technology', 'Active Stylus', 'MagSafe Ready', 'Universal Fit'],
    midHeadline: 'PRECISION\nCRAFTED.',
    midCaption: 'From charging at full speed to creating with total precision.',
  },
  appliances: {
    tagline: 'Home Essentials',
    headline: 'BREW\nBETTER.',
    caption: 'Kettles and appliances where flawless function meets beautiful, considered design.',
    marqueeItems: ['KETTLES', 'APPLIANCES', 'DESIGN', 'HOME', 'ASLITEC', 'PREMIUM', 'QUALITY', 'STYLE'],
    features: ['Rapid Heat', 'Premium Design', 'Safe Materials', 'Easy Clean'],
    midHeadline: 'STYLED FOR\nYOUR HOME.',
    midCaption: 'Appliances that become the centrepiece of your space.',
  },
  'smart-home': {
    tagline: 'Connected Living',
    headline: 'STAY\nCONNECTED.',
    caption: 'Security cameras, SoundPod earphones, and smart devices that protect and elevate your world.',
    marqueeItems: ['CAMERAS', 'EARPHONES', 'SMART HOME', 'SECURITY', 'ASLITEC', 'SOUNDPOD', 'AI DETECT', 'AUDIO'],
    features: ['HD Security', 'Active Noise Cancel', 'Smart Detection', 'App Control'],
    midHeadline: 'ALWAYS\nCONNECTED.',
    midCaption: 'Your home, smarter — secured and sounding incredible.',
  },
}

const DEFAULT_CONFIG = {
  tagline: 'Shop the Collection',
  headline: 'EXPLORE\nMORE.',
  caption: 'Discover our full range of premium tech accessories.',
  marqueeItems: ['ASLITEC', 'PREMIUM', 'TECH', 'QUALITY', 'STYLE', 'EXPLORE', 'DISCOVER'],
  features: ['Premium Quality', 'Premium Design'],
  midHeadline: 'MADE FOR\nTHE BOLD.',
  midCaption: 'Engineered for people who demand the best from every device they carry.',
}

// ── FadeUp helper ─────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = '' }: {
  children: React.ReactNode; delay?: number; className?: string
}) {
  return (
    <motion.div className={className}
      initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >{children}</motion.div>
  )
}

// ── Product card ──────────────────────────────────────────────────────────
function CatCard({ product, index = 0 }: { product: Product; index?: number }) {
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


  const img = product.images[0]?.url

  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: index * 0.05, ease: [0.16, 1, 0.3, 1] }}
      ref={ref}
      className="h-full"
      style={{ perspective: 800 }}
      onMouseMove={onMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => { rx.set(0); ry.set(0); setHovered(false) }}
    >
      <motion.div
        style={{ rotateX: srx, rotateY: sry, transformStyle: 'preserve-3d' }}
        className="h-full flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E8E4DF]"
        animate={{
          boxShadow: hovered
            ? '0 16px 48px rgba(0,0,0,0.10)'
            : '0 1px 4px rgba(0,0,0,0.04), 0 4px 16px rgba(0,0,0,0.05)',
        }}
        transition={{ duration: 0.3 }}
      >
        <Link to={`/products/${product.slug}`} className="flex flex-col h-full">
          <div className="relative aspect-square overflow-hidden bg-[#F7F3EE]">
            {img && (
              <motion.img src={img} alt={product.name} className="size-full object-contain"
                loading="lazy" decoding="async"
                animate={hovered ? { scale: 1.06 } : { scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
          </div>
          <div className="p-4 flex flex-col flex-1">
            <h3 className="text-sm font-semibold text-[#2d3444] line-clamp-2 leading-snug">{product.name}</h3>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────
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

  const cfg = CAT_CONFIG[slug ?? ''] ?? DEFAULT_CONFIG
  const bannerRef = useRef<HTMLDivElement>(null)
  const floatRefs  = useRef<(HTMLDivElement | null)[]>([])

  // GSAP: floating entry for scattered images in hero
  const heroImgRefs = useRef<(HTMLDivElement | null)[]>([])
  useEffect(() => {
    const ctx = gsap.context(() => {
      heroImgRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.fromTo(el,
          { y: 40, opacity: 0, scale: 0.85 },
          { y: 0, opacity: 1, scale: 1, duration: 1.1, ease: 'power3.out', delay: 0.5 + i * 0.18 }
        )
        gsap.to(el, {
          y: -12 + i * 4,
          duration: 3.5 + i * 0.6,
          ease: 'sine.inOut',
          repeat: -1, yoyo: true,
          delay: 1.5 + i * 0.4,
        })
      })
    })
    return () => ctx.revert()
  }, [products])

  // GSAP: banner scatter images
  useEffect(() => {
    if (!bannerRef.current) return
    const ctx = gsap.context(() => {
      gsap.fromTo('.banner-img-card',
        { opacity: 0, scale: 0.75, y: 60, rotate: -8 },
        {
          opacity: 1, scale: 1, y: 0, rotate: 0,
          duration: 0.9, ease: 'back.out(1.4)',
          stagger: 0.13,
          scrollTrigger: { trigger: bannerRef.current, start: 'top 72%' },
        }
      )
    }, bannerRef)
    return () => ctx.revert()
  }, [products])

  const firstGroup  = products.slice(0, 8)
  const restGroup   = products.slice(8)
  const bannerImgs  = products.slice(0, 4).map(p => p.images[0]?.url).filter(Boolean) as string[]
  const heroImgs    = products.slice(0, 3).map(p => p.images[0]?.url).filter(Boolean) as string[]

  const SCATTERED_HERO = [
    { top: '4%',  left: '8%',  rotate: '-6deg', w: 270, delay: 0.5 },
    { top: '28%', left: '38%', rotate: '4deg',  w: 240, delay: 0.65 },
    { top: '52%', left: '14%', rotate: '-2deg', w: 220, delay: 0.8  },
  ]

  const SCATTERED_BANNER = [
    { top: '0%',  left: '24%', rotate: '-5deg', w: 260 },
    { top: '18%', left: '0%',  rotate: '3deg',  w: 215 },
    { top: '48%', left: '32%', rotate: '-3deg', w: 235 },
    { top: '62%', left: '4%',  rotate: '6deg',  w: 195 },
  ]

  return (
    <div className="min-h-screen">

      {/* ── 1. HERO ─────────────────────────────────────────────────── */}
      <div className="relative min-h-[92vh] flex items-center overflow-hidden bg-[#12171f] pt-20">

        {/* Dot grid */}
        <div className="pointer-events-none absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'radial-gradient(circle,#D4693A 1px,transparent 1px)', backgroundSize: '32px 32px' }} />
        {/* Diagonal lines */}
        <div className="pointer-events-none absolute inset-0"
          style={{ background: 'repeating-linear-gradient(135deg,transparent,transparent 80px,rgba(212,105,58,0.02) 80px,rgba(212,105,58,0.02) 82px)' }} />
        {/* Glow */}
        <div className="pointer-events-none absolute top-1/2 left-1/3 -translate-y-1/2 w-[800px] h-[800px]"
          style={{ background: 'radial-gradient(circle,rgba(212,105,58,0.13) 0%,transparent 70%)', filter: 'blur(80px)' }} />
        {/* Corner marks */}
        {[['top-8 left-8 border-l-2 border-t-2'], ['top-8 right-8 border-r-2 border-t-2'], ['bottom-8 left-8 border-l-2 border-b-2'], ['bottom-8 right-8 border-r-2 border-b-2']].map(([cls], i) => (
          <div key={i} className={`pointer-events-none absolute w-10 h-10 border-[#D4693A]/25 ${cls}`} />
        ))}

        <div className="container relative z-10 flex flex-col lg:flex-row items-center gap-16 py-16">

          {/* Text */}
          <div className="flex-1 shrink-0">
            <motion.p className="text-[11px] font-bold tracking-[.45em] text-[#D4693A] uppercase mb-6"
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.15 }}
            >{cfg.tagline}</motion.p>

            <div className="overflow-hidden">
              {cfg.headline.split('\n').map((line, i) => (
                <motion.h1 key={i}
                  className={`block text-[clamp(68px,10vw,130px)] font-black leading-[.84] tracking-tight ${i % 2 === 1 ? 'text-gradient-orange' : 'text-white'}`}
                  initial={{ opacity: 0, y: 60 }} animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, delay: 0.25 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                >{line}</motion.h1>
              ))}
            </div>

            <motion.p className="mt-8 text-sm text-white/38 max-w-sm leading-relaxed"
              initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.5 }}
            >{cfg.caption}</motion.p>

            <motion.div className="mt-8 flex items-center gap-5"
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.7, delay: 0.65 }}
            >
              <a href="#products"
                onClick={e => { e.preventDefault(); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="rounded-full bg-[#D4693A] px-9 py-3.5 text-sm font-bold text-white hover:bg-white hover:text-[#2d3444] transition-colors duration-300"
              >Shop Now</a>
              <span className="text-xs text-white/20 font-semibold uppercase tracking-widest">
                {meta?.total ?? products.length} products
              </span>
            </motion.div>

            {/* Feature pills */}
            <motion.div className="mt-10 flex flex-wrap gap-2"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              transition={{ duration: 0.8, delay: 0.85 }}
            >
              {cfg.features.map((f) => (
                <span key={f} className="text-[10px] font-bold uppercase tracking-[.2em] text-white/25 border border-white/[0.09] rounded-full px-3.5 py-1.5">{f}</span>
              ))}
            </motion.div>
          </div>

          {/* Scattered floating images */}
          <div className="flex-1 relative hidden lg:flex" style={{ height: 560 }}>
            {heroImgs.map((src, i) => {
              const s = SCATTERED_HERO[i]
              if (!s) return null
              return (
                <div key={i} ref={el => { heroImgRefs.current[i] = el }}
                  className="absolute rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_32px_80px_rgba(0,0,0,0.6)]"
                  style={{ top: s.top, left: s.left, width: s.w, transform: `rotate(${s.rotate})`, zIndex: 3 - i }}
                >
                  <img src={src} alt="" className="w-full aspect-square object-cover" draggable={false} />
                  {/* Shine overlay */}
                  <div className="absolute inset-0 pointer-events-none"
                    style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 50%)' }} />
                </div>
              )
            })}
          </div>
        </div>

        {/* Scroll cue */}
        <motion.div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
        >
          <span className="text-[9px] tracking-[.5em] text-white/18 uppercase">Scroll</span>
          <motion.div className="w-px h-10 bg-gradient-to-b from-[#D4693A]/50 to-transparent"
            animate={{ scaleY: [1, 0.3, 1] }}
            transition={{ duration: 1.9, repeat: Infinity, ease: 'easeInOut' }}
          />
        </motion.div>
      </div>

      {/* ── 2. MARQUEE ──────────────────────────────────────────────── */}
      <div className="overflow-hidden bg-[#2d3444] py-3.5">
        <div className="flex whitespace-nowrap gap-10 animate-marquee">
          {[...cfg.marqueeItems, ...cfg.marqueeItems].map((t, i) => (
            <span key={i} className="flex items-center gap-10 text-xs font-bold uppercase tracking-[.25em] text-white/35">
              {t} <span className="text-[#D4693A]">·</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── 3A. EDITORIAL SPLIT BANNER ──────────────────────────────── */}
      <section className="overflow-hidden bg-[#F7F3EE]">
        <div className="flex flex-col lg:flex-row min-h-[580px]">

          {/* Image half */}
          <motion.div className="flex-1 relative overflow-hidden min-h-[340px] lg:min-h-0"
            initial={{ opacity: 0, x: -80 }} whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.1, ease: [0.16, 1, 0.3, 1] }}
          >
            {cat?.image
              ? <img src={cat.image} alt={cat.name} className="absolute inset-0 size-full object-cover" loading="lazy" decoding="async" />
              : <div className="absolute inset-0 bg-gradient-to-br from-[#D4693A]/20 to-[#2d3444]/20" />
            }
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to right, transparent 60%, #F7F3EE)' }} />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, #F7F3EE 0%, transparent 40%)' }} />
            {/* Floating tag */}
            <motion.div className="absolute top-8 left-8 bg-[#D4693A] text-white text-[10px] font-bold uppercase tracking-[.25em] px-4 py-2 rounded-full"
              initial={{ opacity: 0, y: -16 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >New Collection</motion.div>
            {/* Product count pill */}
            {meta && (
              <motion.div className="absolute bottom-8 left-8 bg-[#2d3444]/80 backdrop-blur-sm text-white text-[11px] font-bold px-4 py-2 rounded-full flex items-center gap-2"
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <span className="size-1.5 rounded-full bg-[#D4693A] inline-block" />
                {meta.total} products available
              </motion.div>
            )}
          </motion.div>

          {/* Text half */}
          <div className="flex-1 flex items-center p-10 lg:p-16 xl:p-20">
            <div className="max-w-md">
              <FadeUp delay={0.15}>
                <p className="text-[10px] font-bold tracking-[.4em] text-[#D4693A] uppercase mb-5">aslitec · {cat?.name}</p>
                <h2 className="text-[clamp(44px,5.5vw,76px)] font-black text-[#2d3444] leading-[.86] tracking-tight">
                  DESIGNED<br />TO <span className="text-gradient-orange">IMPRESS.</span>
                </h2>
                <p className="mt-6 text-sm text-[#888] leading-relaxed">{cfg.caption}</p>

                {/* Feature list */}
                <ul className="mt-8 space-y-3">
                  {cfg.features.map((f, i) => (
                    <motion.li key={f} className="flex items-center gap-3 text-sm text-[#2d3444] font-medium"
                      initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.5, delay: 0.3 + i * 0.08 }}
                    >
                      <span className="size-1.5 rounded-full bg-[#D4693A] shrink-0" />
                      {f}
                    </motion.li>
                  ))}
                </ul>

                <motion.a href="#products"
                  onClick={e => { e.preventDefault(); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }) }}
                  className="mt-10 inline-flex items-center gap-2 text-sm font-bold text-[#2d3444] hover:text-[#D4693A] transition-colors group"
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: 0.5 }}
                >
                  Browse Collection
                  <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform duration-200" />
                </motion.a>
              </FadeUp>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3B. FEATURE TRIO ────────────────────────────────────────── */}
      <section className="bg-white border-b border-[#E8E4DF]">
        <div className="container">
          <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E8E4DF]">
            {[
              { num: '01', title: 'Premium\nMaterials',   desc: 'Built with quality components chosen to outlast and outperform.' },
              { num: '02', title: 'Precision\nEngineered', desc: 'Every detail tested to meet the highest performance standards.' },
            ].map(({ num, title, desc }, i) => (
              <motion.div key={num}
                className="flex flex-col p-10 lg:p-12 relative overflow-hidden group cursor-default"
                initial={{ opacity: 0, y: 32 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.7, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              >
                {/* Hover bg */}
                <div className="absolute inset-0 bg-[#F7F3EE] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10">
                  <span className="text-[11px] font-black text-[#D4693A]/70 tracking-[.35em]">{num}</span>
                  <h3 className="mt-4 text-[clamp(28px,3vw,40px)] font-black text-[#2d3444] leading-[.88]">
                    {title.split('\n').map((l, j) => <span key={j} className="block">{l}</span>)}
                  </h3>
                  <p className="mt-4 text-sm text-[#999] leading-relaxed">{desc}</p>
                  {/* Animated underline */}
                  <motion.div className="mt-8 h-[2px] bg-[#D4693A] origin-left"
                    initial={{ scaleX: 0 }} whileInView={{ scaleX: 1 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9, delay: 0.35 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── 3C. TOP PICKS STRIP ─────────────────────────────────────── */}
      {!isLoading && products.length >= 3 && (
        <section className="bg-[#2d3444] py-16 overflow-hidden">
          <div className="container mb-10">
            <FadeUp className="flex items-end justify-between">
              <div>
                <p className="text-[10px] font-bold tracking-[.4em] text-[#D4693A] uppercase mb-2">Hand-Picked</p>
                <h2 className="text-3xl font-black text-white leading-none">TOP PICKS.</h2>
              </div>
              <Link to="#products"
                onClick={e => { e.preventDefault(); document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' }) }}
                className="text-xs font-bold text-white/30 hover:text-[#D4693A] transition-colors flex items-center gap-1"
              >See all <ArrowRight className="size-3" /></Link>
            </FadeUp>
          </div>

          <div className="flex gap-4 overflow-visible pl-[max(2rem,calc((100vw-1280px)/2+2rem))] pr-8">
            {products.slice(0, Math.min(products.length, 5)).map((p, i) => (
              <motion.div key={p.id}
                className="shrink-0 w-[260px] relative group rounded-2xl overflow-hidden border border-white/[0.07]"
                initial={{ opacity: 0, y: 48, rotate: i % 2 === 0 ? -2 : 2 }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.75, delay: i * 0.09, ease: [0.16, 1, 0.3, 1] }}
                whileHover={{ y: -10, scale: 1.03 }}
              >
                <Link to={`/products/${p.slug}`}>
                  <div className="aspect-square overflow-hidden bg-[#1e2530]">
                    {p.images[0]?.url && (
                      <motion.img src={p.images[0].url} alt={p.name}
                        className="size-full object-cover"
                        whileHover={{ scale: 1.1 }}
                        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                      />
                    )}
                  </div>
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent pointer-events-none" />
                  {/* Info */}
                  <div className="absolute bottom-0 inset-x-0 p-4">
                    <p className="text-[9px] font-bold uppercase tracking-[.3em] text-[#D4693A] mb-1">{p.category.name}</p>
                    <h3 className="text-[13px] font-bold text-white line-clamp-1 leading-snug">{p.name}</h3>
                  </div>
                  {/* Top SALE badge */}
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* ── 3. FIRST PRODUCT GRID ───────────────────────────────────── */}
      <div id="products" className="bg-[#FAFAF8] pt-20 pb-16">
        <div className="container">
          <FadeUp className="mb-12">
            <p className="text-xs font-bold tracking-[.35em] text-[#D4693A] uppercase mb-3">— Collection —</p>
            <h2 className="text-[clamp(36px,5vw,64px)] font-black tracking-tight text-[#2d3444] leading-[.88]">
              {cat?.name ?? slug}
            </h2>
          </FadeUp>

          {isLoading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="rounded-2xl bg-white border border-[#E8E4DF] aspect-[3/4] animate-pulse" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
              {firstGroup.map((p, i) => <CatCard key={p.id} product={p} index={i} />)}
            </div>
          )}
        </div>
      </div>

      {/* ── 4. MID LIFESTYLE BANNER ─────────────────────────────────── */}
      {!isLoading && bannerImgs.length > 0 && (
        <section ref={bannerRef} className="relative bg-[#12171f] py-28 overflow-hidden">

          {/* Watermark */}
          <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden">
            <span className="text-[16vw] font-black text-white/[0.03] uppercase leading-none tracking-tighter whitespace-nowrap">
              {(cat?.name ?? slug ?? '').toUpperCase()}
            </span>
          </div>

          {/* Diagonal texture */}
          <div className="pointer-events-none absolute inset-0"
            style={{ background: 'repeating-linear-gradient(135deg,transparent,transparent 80px,rgba(212,105,58,0.015) 80px,rgba(212,105,58,0.015) 82px)' }} />

          <div className="container relative z-10">
            <div className="flex flex-col lg:flex-row items-center gap-16">

              {/* Left — headline + stats + CTA */}
              <div className="flex-1">
                <FadeUp>
                  <p className="text-[11px] font-bold tracking-[.45em] text-[#D4693A] uppercase mb-5">aslitec</p>
                  <h2 className="text-[clamp(52px,7vw,96px)] font-black leading-[.84] tracking-tight">
                    {cfg.midHeadline.split('\n').map((line, i) => (
                      <span key={i} className={`block ${i % 2 === 0 ? 'text-white' : ''}`}
                        style={i % 2 === 1 ? { WebkitTextStroke: '2px rgba(255,255,255,0.18)', color: 'transparent' } : undefined}
                      >{line}</span>
                    ))}
                  </h2>
                  <p className="mt-7 text-sm text-white/35 max-w-sm leading-relaxed">{cfg.midCaption}</p>
                  <Link to="/"
                    className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#D4693A] hover:text-white transition-colors duration-200"
                  >Back to Home <ArrowRight className="size-4" /></Link>
                </FadeUp>

                {/* Stats */}
                <FadeUp delay={0.1} className="mt-12 flex gap-10 flex-wrap">
                  {[
                    { val: `${meta?.total ?? products.length}+`, label: 'Products' },
                  ].map(({ val, label }) => (
                    <div key={label}>
                      <div className="text-3xl font-black text-white tabular-nums">{val}</div>
                      <p className="text-xs text-white/28 mt-1 uppercase tracking-widest">{label}</p>
                    </div>
                  ))}
                </FadeUp>
              </div>

              {/* Right — scattered product photos */}
              <div className="flex-1 relative hidden lg:block" style={{ minHeight: 500 }}>
                {bannerImgs.map((src, i) => {
                  const s = SCATTERED_BANNER[i]
                  if (!s) return null
                  return (
                    <div key={i} className="banner-img-card absolute rounded-2xl overflow-hidden border border-white/[0.08] shadow-[0_24px_60px_rgba(0,0,0,0.5)]"
                      style={{ top: s.top, left: s.left, width: s.w, transform: `rotate(${s.rotate})`, zIndex: 4 - i }}
                    >
                      <img src={src} alt="" className="w-full aspect-square object-cover" draggable={false} loading="lazy" decoding="async" />
                      <div className="absolute inset-0 pointer-events-none"
                        style={{ background: 'linear-gradient(135deg,rgba(255,255,255,0.07) 0%,transparent 55%)' }} />
                    </div>
                  )
                })}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* ── 5. REVERSE MARQUEE ──────────────────────────────────────── */}
      {!isLoading && (
        <div className="overflow-hidden bg-[#2d3444] py-3.5">
          <div className="flex whitespace-nowrap gap-10 animate-marquee-rev">
            {[...cfg.marqueeItems, ...cfg.marqueeItems].map((t, i) => (
              <span key={i} className="flex items-center gap-10 text-xs font-bold uppercase tracking-[.25em] text-white/35">
                {t} <span className="text-[#D4693A]">·</span>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* ── 6. REMAINING PRODUCTS ───────────────────────────────────── */}
      {restGroup.length > 0 && (
        <div className="bg-[#FAFAF8] py-16">
          <div className="container">
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 items-stretch">
              {restGroup.map((p, i) => <CatCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        </div>
      )}

      {/* Pagination */}
      {meta && meta.totalPages > 1 && (
        <div className="bg-[#FAFAF8] pb-20">
          <div className="container">
            <Pagination
              currentPage={meta.page}
              totalPages={meta.totalPages}
              onPageChange={(p) => dispatch(setFilters({ page: p }))}
            />
          </div>
        </div>
      )}

      {/* ── 7. CTA BANNER ───────────────────────────────────────────── */}
      <section className="relative bg-[#D4693A] py-28 overflow-hidden">
        <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden">
          <span className="text-[18vw] font-black text-white/[0.06] uppercase leading-none tracking-tighter whitespace-nowrap">ASLITEC</span>
        </div>
        <div className="container relative z-10 text-center">
          <motion.p className="text-[11px] font-bold tracking-[.45em] text-white/50 uppercase mb-5"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          >Premium Tech Accessories</motion.p>
          <motion.h2
            className="text-[clamp(44px,7vw,90px)] font-black text-white leading-[.88] tracking-tight"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
          >EXPLORE THE<br />FULL RANGE.</motion.h2>
          <motion.div className="mt-8 flex items-center justify-center gap-4"
            initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/"
              className="rounded-full bg-white px-9 py-4 text-sm font-bold text-[#D4693A] hover:bg-[#2d3444] hover:text-white transition-colors duration-300"
            >Back to Home</Link>
            <Link to="/"
              className="rounded-full border-2 border-white/40 px-9 py-4 text-sm font-bold text-white hover:bg-white/10 transition-colors duration-300"
            >Back to Home</Link>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
