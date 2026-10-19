import { useRef } from 'react'
import { Link } from 'react-router-dom'
import {
  motion, useMotionTemplate, useMotionValue, useScroll, useSpring, useTransform,
  type MotionValue,
} from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'

import cameraWide  from '@/assets/banners/security-camera-wide.jpg'
import cameraPhone from '@/assets/banners/security-camera-mobile.jpg'
import chargerWide  from '@/assets/banners/wall-charger-wide.jpg'
import chargerPhone from '@/assets/banners/wall-charger-mobile.jpg'
import cablesWide  from '@/assets/banners/cables-wide.jpg'
import cablesPhone from '@/assets/banners/cables-mobile.jpg'
import lanyardWide  from '@/assets/banners/lanyard-wide.jpg'
import lanyardPhone from '@/assets/banners/lanyard-mobile.jpg'

// One design per campaign folder: the wide artboard on desktop, the taller one on phones
const BANNERS = [
  { wide: cameraWide,  phone: cameraPhone,  label: 'Security Cameras', alt: 'aslitec security cameras – Monitor every detail with clarity', href: '/categories/smart-home',  glow: '#d9a46a' },
  { wide: chargerWide, phone: chargerPhone, label: 'Wall Chargers',    alt: 'aslitec wall chargers – Faster charging, stronger performance',  href: '/categories/accessories', glow: '#f26b2a' },
  { wide: cablesWide,  phone: cablesPhone,  label: 'Cables',           alt: 'aslitec cables – Faster charging, easier data transfer',        href: '/categories/accessories', glow: '#6fa86a' },
  { wide: lanyardWide, phone: lanyardPhone, label: 'Phone Lanyards',   alt: 'aslitec phone lanyard straps – Your phone, always within reach', href: '/categories/accessories', glow: '#b8643a' },
]

// ── One stacked card: shrinks and dims as the next card slides over it ───────
function BannerCard({
  banner, index, total, progress,
}: {
  banner: (typeof BANNERS)[number]
  index: number
  total: number
  progress: MotionValue<number>
}) {
  const start = index / total
  const scale = useTransform(progress, [start, 1], [1, 1 - (total - 1 - index) * 0.06])
  const dim = useTransform(progress, [start, 1], [0, (total - 1 - index) * 0.18])

  // mouse tilt + glare
  const mx = useMotionValue(0.5)
  const my = useMotionValue(0.5)
  const rotX = useSpring(useTransform(my, [0, 1], [7, -7]), { stiffness: 180, damping: 18 })
  const rotY = useSpring(useTransform(mx, [0, 1], [-9, 9]), { stiffness: 180, damping: 18 })
  const gx = useTransform(mx, (v) => `${v * 100}%`)
  const gy = useTransform(my, (v) => `${v * 100}%`)
  const glare = useMotionTemplate`radial-gradient(520px circle at ${gx} ${gy}, rgba(255,255,255,0.28), transparent 45%)`

  const onMove = (e: React.PointerEvent<HTMLAnchorElement>) => {
    if (e.pointerType !== 'mouse') return
    const r = e.currentTarget.getBoundingClientRect()
    mx.set((e.clientX - r.left) / r.width)
    my.set((e.clientY - r.top) / r.height)
  }
  const onLeave = () => { mx.set(0.5); my.set(0.5) }

  return (
    <div
      className="sticky flex justify-center"
      style={{ top: `calc(clamp(84px, 14vh, 140px) + ${index * 22}px)`, marginBottom: index < total - 1 ? '18vh' : 0 }}
    >
      <motion.div
        style={{ scale, transformOrigin: 'top center', perspective: 1400 }}
        className="w-full"
        initial={{ opacity: 0, y: 120, rotate: index % 2 ? 4 : -4 }}
        whileInView={{ opacity: 1, y: 0, rotate: 0 }}
        viewport={{ once: true, margin: '-80px' }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
      >
        <Link to={banner.href} onPointerMove={onMove} onPointerLeave={onLeave} className="group block" aria-label={`Shop ${banner.label}`}>
          <motion.div
            style={{ rotateX: rotX, rotateY: rotY, transformStyle: 'preserve-3d' }}
            className="relative overflow-hidden rounded-[22px] md:rounded-[32px] ring-1 ring-[#E8E4DF] shadow-[0_30px_60px_-25px_rgba(45,52,68,0.35)]"
          >
            {/* coloured halo behind the card */}
            <div
              className="pointer-events-none absolute -inset-10 -z-10 opacity-60 blur-3xl transition-opacity duration-500 group-hover:opacity-100"
              style={{ background: `radial-gradient(closest-side, ${banner.glow}, transparent)` }}
            />

            <picture>
              <source media="(max-width: 767px)" srcSet={banner.phone} />
              <img
                src={banner.wide}
                alt={banner.alt}
                className="block w-full h-auto transition-transform duration-[1.2s] ease-[cubic-bezier(.16,1,.3,1)] group-hover:scale-[1.04]"
                loading={index === 0 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
              />
            </picture>

            {/* glare + depth shade */}
            <motion.div className="pointer-events-none absolute inset-0 mix-blend-soft-light opacity-0 transition-opacity duration-300 group-hover:opacity-100" style={{ background: glare }} />
            <motion.div className="pointer-events-none absolute inset-0 bg-black" style={{ opacity: dim }} />

            {/* index chip */}
            <div className="absolute top-3 left-3 md:top-5 md:left-5 flex items-center gap-2 rounded-full bg-black/45 backdrop-blur-md px-3 py-1.5 ring-1 ring-white/15">
              <span className="text-[10px] md:text-xs font-black text-[#D4693A] tabular-nums">{String(index + 1).padStart(2, '0')}</span>
              <span className="h-3 w-px bg-white/25" />
              <span className="text-[10px] md:text-[11px] font-bold uppercase tracking-[.2em] text-white/85">{banner.label}</span>
            </div>

            {/* shop pill */}
            <div className="absolute bottom-3 right-3 md:bottom-5 md:right-5 flex items-center gap-1.5 rounded-full bg-white px-3.5 py-2 md:px-5 md:py-2.5 text-[11px] md:text-sm font-black text-[#2d3444] shadow-xl transition-all duration-300 group-hover:bg-[#D4693A] group-hover:text-white group-hover:pr-6 ring-1 ring-[#E8E4DF]">
              Shop now <ArrowUpRight className="size-3.5 md:size-4 transition-transform duration-300 group-hover:rotate-45" />
            </div>
          </motion.div>
        </Link>
      </motion.div>
    </div>
  )
}

// ── Section ───────────────────────────────────────────────────────────────────
export default function CampaignBanners() {
  const stackRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({ target: stackRef, offset: ['start start', 'end end'] })

  // giant outline word drifting sideways behind the stack
  const sectionRef = useRef<HTMLElement>(null)
  const { scrollYProgress: sectionProgress } = useScroll({ target: sectionRef, offset: ['start end', 'end start'] })
  const drift = useTransform(sectionProgress, [0, 1], ['10%', '-45%'])

  return (
    <section ref={sectionRef} data-nav-scheme="light" className="relative bg-[#F7F3EE] pt-24 pb-32 overflow-clip">
      {/* backdrop */}
      <div className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: 'radial-gradient(circle,#D4693A 1px,transparent 1px)', backgroundSize: '30px 30px', opacity: 0.12 }} />
      <div className="pointer-events-none absolute -top-40 -left-40 w-[520px] h-[520px] rounded-full bg-[#D4693A]/25 blur-[140px]" />
      <div className="pointer-events-none absolute bottom-0 -right-40 w-[520px] h-[520px] rounded-full bg-[#E8C7A8]/60 blur-[140px]" />
      <motion.div
        aria-hidden
        style={{ x: drift, WebkitTextStroke: '1px rgba(45,52,68,0.08)' }}
        className="pointer-events-none select-none absolute top-[38%] left-0 whitespace-nowrap text-[26vw] font-black uppercase leading-none tracking-tighter text-transparent"
      >
        aslitec campaigns · aslitec campaigns
      </motion.div>

      <div className="container relative">
        <motion.div
          className="mb-14 md:mb-20 flex flex-col md:flex-row md:items-end justify-between gap-6"
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
        >
          <div>
            <p className="text-xs font-bold tracking-[.4em] text-[#D4693A] uppercase mb-4">Campaigns · {BANNERS.length} stories</p>
            <h2 className="text-[clamp(48px,9vw,128px)] font-black text-[#2d3444] leading-[.85] tracking-tight">
              BIG<br />
              <span className="text-transparent" style={{ WebkitTextStroke: '2px #D4693A' }}>MOOD</span>
              <span className="text-[#D4693A]">.</span>
            </h2>
          </div>
          <p className="max-w-xs text-sm text-[#777] leading-relaxed">
            Our latest campaigns, stacked. Keep scrolling and each one slides over the last.
          </p>
        </motion.div>

        <div ref={stackRef} className="relative">
          {BANNERS.map((b, i) => (
            <BannerCard key={b.label} banner={b} index={i} total={BANNERS.length} progress={scrollYProgress} />
          ))}
        </div>
      </div>
    </section>
  )
}
