import { useEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight, Truck, Shield, Zap } from 'lucide-react'
import {
  useGetFeaturedProductsQuery,
  useGetBestsellersQuery,
  useGetCategoriesQuery,
  useGetNewArrivalsQuery,
} from '@/data/useMockData'
import { useAppDispatch } from '@/app/hooks'
import { addItem } from '@/features/cart/store/cartSlice'
import { formatPrice } from '@/lib/utils'
import { toast } from 'sonner'
import type { Product } from '@/types'

// ── Waterproof cases ──────────────────────────────────────────────────────
import caseFront1 from '@/assets/accessories/WaterProof Case/front-01.png'
import caseFront2 from '@/assets/accessories/WaterProof Case/front-02.png'
import caseFront3 from '@/assets/accessories/WaterProof Case/front-03.png'
import caseFront4 from '@/assets/accessories/WaterProof Case/front-04.png'
import caseFront5 from '@/assets/accessories/WaterProof Case/front-05.png'
const caseBlack = caseFront1
const caseBlue  = caseFront2
const casePink  = caseFront3
const caseGreen = caseFront4
const caseWhite = caseFront5

// ── Powerbanks ────────────────────────────────────────────────────────────
import pbHW_gray   from '@/assets/accessories/Powerbank/HW121-灰.png'
import pbHW_purple from '@/assets/accessories/Powerbank/HW121-紫.png'
import pbHW_blue   from '@/assets/accessories/Powerbank/HW121-蓝.png'
import pbHW_silver from '@/assets/accessories/Powerbank/HW121-锖.png'
const pb01 = pbHW_gray
const pb02 = pbHW_blue
const pb03 = pbHW_purple

// ── Wave silicone grip cases ──────────────────────────────────────────────
import caseRed    from '@/assets/accessories/Cases/No.1 aslitec Wave silicone grip/E-RED 3.png'
import caseLBlue  from '@/assets/accessories/Cases/No.1 aslitec Wave silicone grip/B-LIGHT BLUE 3.png'
import caseWine   from '@/assets/accessories/Cases/No.1 aslitec Wave silicone grip/K-WINE 3.png'
import casePinkS  from '@/assets/accessories/Cases/No.1 aslitec Wave silicone grip/A-PINK 1.png'
import caseSand   from '@/assets/accessories/Cases/No.1 aslitec Wave silicone grip/C-SAND 3.png'
import caseBrown  from '@/assets/accessories/Cases/No.1 aslitec Wave silicone grip/G-BROWN 2.png'
import caseFGreen from '@/assets/accessories/Cases/No.1 aslitec Wave silicone grip/F-GREEN 3.png'
import caseYellow from '@/assets/accessories/Cases/No.1 aslitec Wave silicone grip/D-YELLOW 1.png'
import caseMint   from '@/assets/accessories/Cases/No.1 aslitec Wave silicone grip/J-MINT 1.png'
import caseIBlue  from '@/assets/accessories/Cases/No.1 aslitec Wave silicone grip/I-BLUE 2.png'
import caseBlack1 from '@/assets/accessories/Cases/No.1 aslitec Wave silicone grip/BLACK 1.png'
import caseRed5   from '@/assets/accessories/Cases/No.1 aslitec Wave silicone grip/E-RED 5.png'
import caseLBlue5 from '@/assets/accessories/Cases/No.1 aslitec Wave silicone grip/B-LIGHT BLUE 5.png'
import caseSand5  from '@/assets/accessories/Cases/No.1 aslitec Wave silicone grip/C-SAND 5.png'
import caseBrown5 from '@/assets/accessories/Cases/No.1 aslitec Wave silicone grip/G-BROWN 5.png'

// ── PC Maze cases (No.10) ─────────────────────────────────────────────────
import mazeBrown   from '@/assets/accessories/Cases/No.10 asltitec PC Maze Case/B-BROWN 3.png'
import mazeRed     from '@/assets/accessories/Cases/No.10 asltitec PC Maze Case/C-RED 3.png'
import mazeBlack   from '@/assets/accessories/Cases/No.10 asltitec PC Maze Case/I-BLACK 3.png'
import mazeDesert  from '@/assets/accessories/Cases/No.10 asltitec PC Maze Case/E-DESERT 3.png'
import mazePeach   from '@/assets/accessories/Cases/No.10 asltitec PC Maze Case/D-PEACH 3.png'
import mazeDeepBl  from '@/assets/accessories/Cases/No.10 asltitec PC Maze Case/K-DEEP BLUE 3.png'
import mazePurple  from '@/assets/accessories/Cases/No.10 asltitec PC Maze Case/A-PURPLE 2.png'
import mazeDeepRed from '@/assets/accessories/Cases/No.10 asltitec PC Maze Case/F-DEEP RED 3.png'
import mazeDeepBrn from '@/assets/accessories/Cases/No.10 asltitec PC Maze Case/G-DEEP BROWN 3.png'
import mazeLPurple from '@/assets/accessories/Cases/No.10 asltitec PC Maze Case/H-LIGHT PURPLE 3.png'
import mazeBlkGold from '@/assets/accessories/Cases/No.10 asltitec PC Maze Case/J-BLACK GOLD 3.png'

// ── Coordinate PC case (No.11) ────────────────────────────────────────────
import coord11Purple from '@/assets/accessories/Cases/No.11 asliec Coordinate PC case (update)/机器紫.png'
import coord11Blue   from '@/assets/accessories/Cases/No.11 asliec Coordinate PC case (update)/深蓝色.png'
import coord11Gray   from '@/assets/accessories/Cases/No.11 asliec Coordinate PC case (update)/灰色.png'
import coord11Black  from '@/assets/accessories/Cases/No.11 asliec Coordinate PC case (update)/黑色.png'

// ── Cyber Mech case (No.12) ───────────────────────────────────────────────
import cyber12Blue   from '@/assets/accessories/Cases/No.12 aslitec Cyber Mech case/深蓝色 (1).png'
import cyber12Gray   from '@/assets/accessories/Cases/No.12 aslitec Cyber Mech case/灰色 (1).png'
import cyber12Purple from '@/assets/accessories/Cases/No.12 aslitec Cyber Mech case/紫色 (1).png'
import cyber12Black  from '@/assets/accessories/Cases/No.12 aslitec Cyber Mech case/黑色 (1).png'

// ── Leather Coordinate case (No.17) ──────────────────────────────────────
import leather17Gray   from '@/assets/accessories/Cases/No.17 Leather Coordinate case (updated)/灰色 拷贝.png'
import leather17Purple from '@/assets/accessories/Cases/No.17 Leather Coordinate case (updated)/紫色 拷贝.png'
import leather17Blue   from '@/assets/accessories/Cases/No.17 Leather Coordinate case (updated)/蓝色 拷贝.png'
import leather17Black  from '@/assets/accessories/Cases/No.17 Leather Coordinate case (updated)/黑色 拷贝.png'

// ── Silicone Coordinate case (No.20) ─────────────────────────────────────
import sil20Orange from '@/assets/accessories/Cases/No.20 aslitec Silicone Coordinate case (updated)/橙色.png'
import sil20Pink   from '@/assets/accessories/Cases/No.20 aslitec Silicone Coordinate case (updated)/粉色.png'
import sil20Blue   from '@/assets/accessories/Cases/No.20 aslitec Silicone Coordinate case (updated)/深蓝色.png'
import sil20Purple from '@/assets/accessories/Cases/No.20 aslitec Silicone Coordinate case (updated)/机器紫.png'
import sil20Gray   from '@/assets/accessories/Cases/No.20 aslitec Silicone Coordinate case (updated)/浅灰色.png'
import sil20Black  from '@/assets/accessories/Cases/No.20 aslitec Silicone Coordinate case (updated)/黑色.png'

// ── Leather Kickstand case B (No.5) ──────────────────────────────────────
import kick5Pink   from '@/assets/accessories/Cases/No.5 aslitec Leather Kickstand case B/晶灵腕带双料实色-粉色 (1).png'
import kick5Blue   from '@/assets/accessories/Cases/No.5 aslitec Leather Kickstand case B/晶灵腕带双料实色-蓝色 (1) - 副本.png'
import kick5Sand   from '@/assets/accessories/Cases/No.5 aslitec Leather Kickstand case B/晶灵腕带双料实色-杏色 (1).png'
import kick5Yellow from '@/assets/accessories/Cases/No.5 aslitec Leather Kickstand case B/晶灵腕带双料实色-黄色 (1).png'

// ── Leather Kickstand case D (No.7) ──────────────────────────────────────
import kick7a from '@/assets/accessories/Cases/No.7 aslitec Leather Kickstand case D (updated)/001.5652 拷贝.png'
import kick7b from '@/assets/accessories/Cases/No.7 aslitec Leather Kickstand case D (updated)/001.5653 拷贝.png'
import kick7c from '@/assets/accessories/Cases/No.7 aslitec Leather Kickstand case D (updated)/001.5656 拷贝.png'
import kick7d from '@/assets/accessories/Cases/No.7 aslitec Leather Kickstand case D (updated)/001.5657 拷贝.png'

// ── Leather Kickstand case E (No.8) ──────────────────────────────────────
import kick8Gray   from '@/assets/accessories/Cases/No.8 aslitec Leather Kickstand case E (updated)/晶灵腕带双料肤感-浅灰色 (1).png'
import kick8Purple from '@/assets/accessories/Cases/No.8 aslitec Leather Kickstand case E (updated)/晶灵腕带双料肤感-紫色 (1).png'
import kick8Blue   from '@/assets/accessories/Cases/No.8 aslitec Leather Kickstand case E (updated)/晶灵腕带双料肤感-蓝色 (1).png'
import kick8Black  from '@/assets/accessories/Cases/No.8 aslitec Leather Kickstand case E (updated)/晶灵腕带双料肤感-黑色 (1).png'

// ── Lanyard (No.21) ───────────────────────────────────────────────────────
import lanyard1 from '@/assets/accessories/Cases/No.21 aslitec Lanyard/3 (1).png'
import lanyard2 from '@/assets/accessories/Cases/No.21 aslitec Lanyard/3 (2).png'
import lanyard3 from '@/assets/accessories/Cases/No.21 aslitec Lanyard/3 (3).png'
import lanyard4 from '@/assets/accessories/Cases/No.21 aslitec Lanyard/3 (4).png'

// ── Pencils ───────────────────────────────────────────────────────────────
import pencil1  from '@/assets/accessories/pencil aslitec/1 (2).png'
import pencil2  from '@/assets/accessories/pencil aslitec/2 (2).png'
import pencil3  from '@/assets/accessories/pencil aslitec/3 (2).png'
import pencil22 from '@/assets/accessories/pencil aslitec/22 (2).png'
import pencil23 from '@/assets/accessories/pencil aslitec/23 (2).png'
import pencil26 from '@/assets/accessories/pencil aslitec/26 (2).png'
import pencil28 from '@/assets/accessories/pencil aslitec/28 (2).png'
import pencil29 from '@/assets/accessories/pencil aslitec/29.png'
import pencil30 from '@/assets/accessories/pencil aslitec/30.png'

// ── Gaming ────────────────────────────────────────────────────────────────
import g1a from '@/assets/gaming/1/1 (1).jpg'
import g2a from '@/assets/gaming/2/1 (1).jpg'
import g3a from '@/assets/gaming/3/1 (1).jpg'
import g4a from '@/assets/gaming/4/1 (1).jpg'
import g5a from '@/assets/gaming/5/1 (1).jpg'
const g1b = g1a, g1c = g1a, g1d = g1a
const g2b = g2a, g2c = g2a, g2d = g2a
const g3b = g3a, g3c = g3a, g3d = g3a
const g4b = g4a, g4c = g4a, g4d = g4a
const g5b = g5a, g5c = g5a, g5d = g5a

gsap.registerPlugin(ScrollTrigger)

// ── Hero data ─────────────────────────────────────────────────────────────
const HERO_IMGS = [
  caseBlue, pb02, pbHW_blue, caseMint, mazePurple,
  coord11Blue, cyber12Black, leather17Purple, sil20Orange, kick5Pink, pencil2,
]

const SLOTS = [
  { ry: -62, rz: -20, scale: 0.90, opacity: 0.44 },
  { ry: -50, rz: -16, scale: 0.70, opacity: 1.00 },
  { ry: -38, rz: -12, scale: 0.95, opacity: 0.44 },
  { ry: -25, rz:  -7, scale: 1.00, opacity: 1.00 },
  { ry: -12, rz:  -3, scale: 0.90, opacity: 0.80 },
  { ry:   0, rz:   0, scale: 1.50, opacity: 1.00 },
  { ry:  12, rz:   3, scale: 0.90, opacity: 0.80 },
  { ry:  25, rz:   7, scale: 0.70, opacity: 1.00 },
  { ry:  38, rz:  12, scale: 1.20, opacity: 0.44 },
  { ry:  50, rz:  16, scale: 0.80, opacity: 1.00 },
  { ry:  62, rz:  20, scale: 0.60, opacity: 0.80 },
]

const FLOAT_PHASES = [0.0, 1.4, 2.7, 0.5, 1.9, 0.2, 1.6, 3.0, 0.8, 2.3, 1.0]
const FLOAT_AMPS   = [12,  10,   8,  14,  10,  18,  10,  14,   8,  10,  12 ]

// ── Gaming collage images ─────────────────────────────────────────────────
const GAMING_IMGS = [g1a, g1b, g1c, g1d, g2a, g2b, g2c, g2d, g3a, g3b, g3c, g3d, g4a, g4b, g4c, g4d, g5a, g5b, g5c, g5d]

// ── Showcase images (floating gallery) ───────────────────────────────────
const SHOWCASE = [
  { src: pb02,         label: 'Powerbank Pro',      sub: '20,000mAh · Fast Charge' },
  { src: caseBlue,     label: 'WaterProof Case',     sub: 'IP68 Military Grade' },
  { src: pbHW_blue,    label: 'HW121 Series',        sub: 'Triple Output 65W' },
  { src: caseMint,     label: 'Wave Grip Case',      sub: 'Silicone Premium' },
  { src: mazePurple,   label: 'PC Maze Case',        sub: 'Hard Shell Protection' },
  { src: pencil2,      label: 'Smart Pencil',        sub: 'Palm Rejection Active' },
  { src: kick5Pink,    label: 'Kickstand Case B',    sub: 'Leather · Stand Ready' },
  { src: coord11Blue,  label: 'Coordinate Case',     sub: 'PC Precision Fit' },
  { src: cyber12Black, label: 'Cyber Mech Case',     sub: 'Tactical Edition' },
]

// ── 3D Hero ───────────────────────────────────────────────────────────────
function Hero3DScene() {
  const heroRef   = useRef<HTMLDivElement>(null)
  const innerRef  = useRef<HTMLDivElement>(null)
  const textRef   = useRef<HTMLDivElement>(null)
  const floatRefs = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      floatRefs.current.forEach((el, i) => {
        if (!el) return
        const idx = i % SLOTS.length
        gsap.fromTo(el,
          { opacity: 0 },
          { opacity: 1, duration: 1.2, ease: 'power2.out', delay: 0.3 + idx * 0.07 }
        )
        gsap.to(el, {
          y: FLOAT_AMPS[idx],
          duration: 4.5 + idx * 0.28,
          ease: 'sine.inOut',
          repeat: -1, yoyo: true,
          delay: 1.8 + FLOAT_PHASES[idx],
        })
      })

      gsap.to([innerRef.current, textRef.current], {
        y: -90, opacity: 0, ease: 'power1.in',
        scrollTrigger: {
          trigger: heroRef.current,
          start: 'top top', end: '+=560',
          scrub: true, pin: true, pinSpacing: true,
        },
      })
    }, heroRef)

    const handleMouse = (e: MouseEvent) => {
      if (!heroRef.current || !innerRef.current) return
      const r = heroRef.current.getBoundingClientRect()
      const px = ((e.clientX - r.left) / r.width  - 0.5) * 2
      const py = ((e.clientY - r.top)  / r.height - 0.5) * 2
      gsap.to(innerRef.current, {
        rotateX: py * -4, rotateY: px * 6,
        duration: 1.8, ease: 'power2.out', overwrite: 'auto',
      })
    }

    const heroEl = heroRef.current
    heroEl?.addEventListener('mousemove', handleMouse)
    return () => { ctx.revert(); heroEl?.removeEventListener('mousemove', handleMouse) }
  }, [])

  const ROW = [...HERO_IMGS, ...HERO_IMGS]

  return (
    <div ref={heroRef} data-nav-scheme="light" className="relative min-h-screen overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 50% 100%, #fff5ee 0%, #ffffff 55%, #ffffff 100%)' }}>

      <div className="pointer-events-none absolute bottom-0 left-1/2 -translate-x-1/2 w-[1000px] h-[380px]"
        style={{ background: 'radial-gradient(ellipse at 50% 100%, rgba(212,105,58,0.38) 0%, transparent 70%)', filter: 'blur(60px)' }} />
      <div className="pointer-events-none absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px]"
        style={{ background: 'radial-gradient(ellipse, rgba(212,105,58,0.10) 0%, transparent 65%)' }} />
      <div className="pointer-events-none absolute inset-0 opacity-[0.05]"
        style={{ backgroundImage: 'radial-gradient(circle, #D4693A 1px, transparent 1px)', backgroundSize: '32px 32px' }} />
      <div className="pointer-events-none absolute top-8 left-8  w-8 h-8 border-l border-t border-[#D4693A]/30" />
      <div className="pointer-events-none absolute top-8 right-8 w-8 h-8 border-r border-t border-[#D4693A]/30" />
      <div className="pointer-events-none absolute bottom-8 left-8  w-8 h-8 border-l border-b border-[#D4693A]/30" />
      <div className="pointer-events-none absolute bottom-8 right-8 w-8 h-8 border-r border-b border-[#D4693A]/30" />

      <div className="pointer-events-none absolute inset-y-0 left-0 w-48 z-20"
        style={{ background: 'linear-gradient(to right, #ffffff 15%, transparent)' }} />
      <div className="pointer-events-none absolute inset-y-0 right-0 w-48 z-20"
        style={{ background: 'linear-gradient(to left, #ffffff 15%, transparent)' }} />

      <div style={{ position: 'absolute', inset: 0, perspective: '1300px', perspectiveOrigin: '50% 38%' }}>
        <div ref={innerRef} style={{ position: 'relative', width: '100%', height: '100%', transformStyle: 'preserve-3d' }}>
          <div style={{ position: 'absolute', left: 0, right: 0, top: '40%', transform: 'translateY(-50%)', overflow: 'visible' }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: '35px',
              animation: 'marquee 45s linear infinite',
              width: 'max-content', willChange: 'transform',
            }}>
              {ROW.map((src, i) => {
                const slot = SLOTS[i % SLOTS.length]
                return (
                  <div key={i} style={{
                    width: 280, flexShrink: 0,
                    transform: `rotateY(${slot.ry}deg) rotateZ(${slot.rz}deg) scale(${slot.scale})`,
                    opacity: slot.opacity,
                  }}>
                    <div ref={(el) => { floatRefs.current[i] = el }}>
                      <img src={src} alt="" draggable={false}
                        style={{
                          width: '100%', userSelect: 'none', pointerEvents: 'none',
                          filter: 'drop-shadow(0 32px 12px rgba(45,52,68,0.22)) drop-shadow(0 16px 4px rgba(45,52,68,0.14))',
                        }}
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </div>

      <div ref={textRef} className="absolute inset-x-0 bottom-[8%] z-20 text-center px-6 pointer-events-none">
        <motion.p
          className="text-[11px] font-bold tracking-[.45em] text-[#D4693A] uppercase mb-5"
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 1.6 }}
        >
          Premium Tech Accessories
        </motion.p>
        <motion.h1
          className="text-[clamp(48px,7.5vw,108px)] font-black leading-[.86] tracking-tight text-[#2d3444]"
          initial={{ opacity: 0, y: 32 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.0, delay: 1.8, ease: [0.16, 1, 0.3, 1] }}
        >
          GEAR UP.<br />
          <span className="text-gradient-orange">STAND OUT.</span>
        </motion.h1>
        <motion.div
          className="mt-8 flex items-center justify-center gap-5 pointer-events-auto"
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 2.2 }}
        >
          <Link to="/products"
            className="rounded-full bg-[#2d3444] px-9 py-3.5 text-sm font-bold text-white hover:bg-[#D4693A] transition-colors duration-300"
          >Shop All</Link>
          <Link to="/categories/gaming"
            className="flex items-center gap-2 text-sm font-semibold text-[#2d3444]/60 hover:text-[#D4693A] transition-colors duration-200"
          >Explore Gaming <ArrowRight className="size-4" /></Link>
        </motion.div>
      </div>
    </div>
  )
}

// ── Product card (3D tilt) ────────────────────────────────────────────────
function Card({ product, index = 0 }: { product: Product; index?: number }) {
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
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: index * 0.06, ease: [0.16, 1, 0.3, 1] }}
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
              <motion.img src={img} alt={product.name} className="size-full object-cover"
                animate={hovered ? { scale: 1.06 } : { scale: 1 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              />
            )}
            {product.compareAtPrice && (
              <div className="absolute top-3 left-3 rounded-full bg-[#D4693A] px-2.5 py-0.5 text-[10px] font-bold text-white">SALE</div>
            )}
            <AnimatePresence>
              {hovered && (
                <motion.div
                  initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }}
                  className="absolute inset-x-3 bottom-3"
                >
                  <button onClick={addToCart}
                    className="w-full rounded-xl bg-[#2d3444] py-2.5 text-sm font-bold text-white hover:bg-[#D4693A] transition-colors duration-200"
                  >Add to Cart</button>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <div className="p-4 flex flex-col flex-1">
            <p className="text-[10px] text-[#D4693A] font-semibold uppercase tracking-widest mb-1">{product.category.name}</p>
            <h3 className="text-sm font-semibold text-[#2d3444] line-clamp-2 leading-snug">{product.name}</h3>
            <div className="mt-auto pt-3 flex items-center justify-between">
              <span className="font-bold text-[#2d3444]">{formatPrice(product.price)}</span>
              <span className="text-xs text-amber-500">★ {product.averageRating.toFixed(1)}</span>
            </div>
          </div>
        </Link>
      </motion.div>
    </motion.div>
  )
}

// ── Marquee strip ─────────────────────────────────────────────────────────
function Marquee({ reverse = false }) {
  const items = ['GAMING', 'POWERBANKS', 'CHARGERS', 'CASES', 'ACCESSORIES', 'ASLITEC', 'TECH']
  const rep = [...items, ...items]
  return (
    <div data-nav-scheme="dark" className="overflow-hidden bg-[#2d3444] py-3.5">
      <div className={`flex whitespace-nowrap gap-10 ${reverse ? 'animate-marquee-rev' : 'animate-marquee'}`}>
        {rep.map((t, i) => (
          <span key={i} className="flex items-center gap-10 text-xs font-bold uppercase tracking-[.25em] text-white/40">
            {t} <span className="text-[#D4693A]">·</span>
          </span>
        ))}
      </div>
    </div>
  )
}

// ── Fade-up reveal ────────────────────────────────────────────────────────
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className}
      initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >{children}</motion.div>
  )
}

// ── Horizontal rack (GSAP pinned) ─────────────────────────────────────────
function HorizontalRack({ tag, title, products }: { tag: string; title: string; products: Product[] }) {
  const trackRef   = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const dispatch   = useAppDispatch()

  useEffect(() => {
    if (!products.length) return
    const ctx = gsap.context(() => {
      const track = trackRef.current, section = sectionRef.current
      if (!track || !section) return
      const dist = track.scrollWidth - window.innerWidth + 96
      if (dist <= 0) return
      gsap.to(track, {
        x: -dist, ease: 'none',
        scrollTrigger: {
          trigger: section, start: 'top top',
          end: () => `+=${dist}`,
          pin: true, scrub: 1, anticipatePin: 1,
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [products])

  return (
    <section ref={sectionRef} data-nav-scheme="light" className="overflow-hidden bg-[#FAFAF8]">
      <div className="pt-20 pb-4" style={{ paddingLeft: 'max(2rem, calc((100vw - 1280px) / 2 + 2rem))' }}>
        <p className="text-xs font-bold tracking-[.3em] text-[#D4693A] uppercase mb-2">{tag}</p>
        <h2 className="text-4xl font-black text-[#2d3444] tracking-tight">{title}</h2>
      </div>
      <div ref={trackRef} className="flex gap-5 pb-16 pt-6 w-max"
        style={{ paddingLeft: 'max(2rem, calc((100vw - 1280px) / 2 + 2rem))', paddingRight: '4rem' }}>
        {products.map((p, i) => (
          <motion.div key={p.id} className="w-[270px] shrink-0"
            initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: i * 0.04, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to={`/products/${p.slug}`}
              className="group block bg-white rounded-2xl overflow-hidden border border-[#E8E4DF] hover:shadow-lg transition-shadow duration-300"
            >
              <div className="aspect-square overflow-hidden bg-[#F7F3EE]">
                {p.images[0]?.url && (
                  <img src={p.images[0].url} alt={p.name}
                    className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-4">
                <h3 className="text-sm font-semibold text-[#2d3444] line-clamp-2 mb-2">{p.name}</h3>
                <div className="flex items-center justify-between">
                  <span className="font-bold text-[#2d3444] text-sm">{formatPrice(p.price)}</span>
                  <button
                    onClick={(e) => { e.preventDefault(); dispatch(addItem({ product: p })); toast.success('Added to cart') }}
                    className="text-xs font-bold text-[#D4693A] hover:underline"
                  >+ Cart</button>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  )
}

// ── Count-up stat ─────────────────────────────────────────────────────────
function CountStat({ value, suffix = '', label }: { value: number; suffix?: string; label: string }) {
  const [count, setCount] = useState(0)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      const dur = 1400, start = Date.now()
      const tick = () => {
        const p = Math.min((Date.now() - start) / dur, 1)
        setCount(Math.round((1 - Math.pow(1 - p, 3)) * value))
        if (p < 1) requestAnimationFrame(tick)
      }
      tick()
    }, { threshold: 0.5 })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [value])

  return (
    <div ref={ref} className="text-center">
      <div className="text-5xl font-black text-white tabular-nums">{count.toLocaleString()}{suffix}</div>
      <p className="mt-2 text-sm text-white/40">{label}</p>
    </div>
  )
}

// ── SCRAPBOOK CATEGORIES ──────────────────────────────────────────────────
const SCRAP_ANGLES = [-16, 10, -5, 13, -9]
const SCRAP_FROM   = [
  { x: -700, y: -300, r: -45 },
  { x:  700, y: -400, r:  40 },
  { x:    0, y: -600, r:  20 },
  { x: -600, y:  300, r: -35 },
  { x:  650, y:  350, r:  50 },
]

function ScrapbookCategories({ categories }: { categories: any[] }) {
  const sectionRef = useRef<HTMLDivElement>(null)
  const cardRefs   = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      cardRefs.current.forEach((el, i) => {
        if (!el) return
        const from = SCRAP_FROM[i]
        gsap.fromTo(el,
          { x: from.x, y: from.y, rotate: from.r, opacity: 0, scale: 0.5 },
          {
            x: 0, y: 0, rotate: SCRAP_ANGLES[i], opacity: 1, scale: 1,
            duration: 1.3, ease: 'back.out(1.4)',
            delay: i * 0.12,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 65%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [categories])

  return (
    <section ref={sectionRef} data-nav-scheme="light" className="relative bg-[#FAFAF8] py-32 overflow-hidden min-h-[780px]">
      {/* Watermark */}
      <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center">
        <span className="text-[22vw] font-black text-[#2d3444]/[0.03] uppercase leading-none tracking-tighter">
          SHOP
        </span>
      </div>

      <div className="container relative z-10">
        <FadeUp className="mb-20 text-center">
          <p className="text-xs font-bold tracking-[.35em] text-[#D4693A] uppercase mb-3">— Collections —</p>
          <h2 className="text-[clamp(40px,6vw,80px)] font-black tracking-tight text-[#2d3444] leading-[.9]">
            Shop by<br />Category
          </h2>
        </FadeUp>

        {/* Scattered Polaroid cards */}
        <div className="relative flex flex-wrap justify-center items-center gap-8 md:gap-0 md:min-h-[480px]">
          {categories.slice(0, 5).map((cat, i, arr) => {
            const count = arr.length
            const step  = 100 / (count + 1)
            const leftVal = `calc(${step * (i + 1)}% - 100px)`
            return (
            <div
              key={cat.id}
              ref={(el) => { cardRefs.current[i] = el }}
              className="md:absolute w-[230px] shrink-0 group cursor-pointer"
              style={{
                rotate: `${SCRAP_ANGLES[i]}deg`,
                left: leftVal,
                top:  ['10%', '28%', '5%', '30%', '12%'][i],
                zIndex: [2, 4, 5, 3, 1][i],
              }}
            >
              <Link to={`/categories/${cat.slug}`}>
                {/* Polaroid frame */}
                <div className="bg-white p-3 pb-10 shadow-[0_8px_40px_rgba(45,52,68,0.18)] transition-all duration-300 group-hover:shadow-[0_20px_60px_rgba(45,52,68,0.28)] group-hover:-translate-y-2">
                  <div className="aspect-[3/4] overflow-hidden bg-[#F0EDE9]">
                    {cat.image
                      ? <img src={cat.image} alt={cat.name} className="size-full object-cover transition-transform duration-700 group-hover:scale-110" />
                      : <div className="size-full bg-gradient-to-br from-[#D4693A]/20 to-[#2d3444]/20" />
                    }
                  </div>
                  <p className="mt-3 text-center text-[11px] font-black text-[#2d3444] uppercase tracking-[.2em]">{cat.name}</p>
                </div>
              </Link>
            </div>
            )
          })}
        </div>

        <div className="mt-16 text-center">
          <Link to="/products"
            className="inline-flex items-center gap-2 text-sm font-bold text-[#2d3444] hover:text-[#D4693A] transition-colors"
          >Browse All Categories <ArrowRight className="size-4" /></Link>
        </div>
      </div>
    </section>
  )
}

// ── THE DROP — featured on dark bg ───────────────────────────────────────
function TheDropSection({ products }: { products: Product[] }) {
  const sectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Each card blasts in from a random edge
      const cards = sectionRef.current?.querySelectorAll('.drop-card')
      cards?.forEach((el, i) => {
        const fromLeft = i % 2 === 0
        gsap.fromTo(el,
          { x: fromLeft ? -800 : 800, y: 150 + (i % 3) * 60, rotate: fromLeft ? -30 : 30, opacity: 0, scale: 0.6 },
          {
            x: 0, y: 0, rotate: 0, opacity: 1, scale: 1,
            duration: 1.1, ease: 'power4.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 90%',
              toggleActions: 'play none none reverse',
            },
            delay: (i % 4) * 0.08,
          }
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [products])

  return (
    <section ref={sectionRef} data-nav-scheme="dark" className="bg-[#2d3444] py-28 overflow-hidden relative">
      {/* Massive background text */}
      <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center overflow-hidden">
        <span className="text-[20vw] font-black text-white/[0.03] uppercase leading-none tracking-tighter whitespace-nowrap">
          FEATURED
        </span>
      </div>

      <div className="container relative z-10">
        <FadeUp className="mb-16">
          <p className="text-xs font-bold tracking-[.35em] text-[#D4693A] uppercase mb-3">Hand-picked</p>
          <div className="flex items-end justify-between gap-4">
            <h2 className="text-[clamp(52px,8vw,110px)] font-black text-white leading-[.85] tracking-tight">
              THE<br /><span className="text-gradient-orange">DROP.</span>
            </h2>
            <Link to="/products?sort=featured"
              className="hidden sm:flex items-center gap-2 text-sm font-bold text-white/40 hover:text-[#D4693A] transition-colors shrink-0 mb-2"
            >View All <ArrowRight className="size-4" /></Link>
          </div>
        </FadeUp>

        {/* Two rows, offset diagonally */}
        <div className="space-y-4">
          {[0, 1].map(row => (
            <div
              key={row}
              className="flex gap-4 overflow-visible"
              style={{ transform: `translateX(${row % 2 === 0 ? '-2rem' : '2rem'})` }}
            >
              {products.slice(row * 4, row * 4 + 4).map((p, i) => (
                <div key={p.id} className="drop-card flex-1 min-w-0">
                  <Link to={`/products/${p.slug}`}
                    className="group block rounded-2xl overflow-hidden border border-white/10 bg-white/5 hover:bg-white/10 hover:border-[#D4693A]/40 transition-all duration-300"
                  >
                    <div className="aspect-square overflow-hidden bg-white/5 relative">
                      {p.images[0]?.url && (
                        <img src={p.images[0].url} alt={p.name}
                          className="size-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                      )}
                      {p.compareAtPrice && (
                        <div className="absolute top-2 left-2 rounded-full bg-[#D4693A] px-2 py-0.5 text-[9px] font-bold text-white">SALE</div>
                      )}
                    </div>
                    <div className="p-3">
                      <h3 className="text-[11px] font-bold text-white/70 line-clamp-1 group-hover:text-white transition-colors">{p.name}</h3>
                    </div>
                  </Link>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── GAMING COLLAGE ────────────────────────────────────────────────────────
const COLLAGE_TILTS = [-3, 2, -1.5, 3, -2, 1.5, -2.5, 2, -1, 2.5, -1.5, 2]

function GamingCollage() {
  const sectionRef = useRef<HTMLDivElement>(null)
  const imgRefs    = useRef<(HTMLDivElement | null)[]>([])

  useEffect(() => {
    const ctx = gsap.context(() => {
      imgRefs.current.forEach((el, i) => {
        if (!el) return
        gsap.fromTo(el,
          { opacity: 0, scale: 0.6, y: (i % 2 === 0 ? -60 : 60) },
          {
            opacity: 1, scale: 1, y: 0,
            duration: 0.8, ease: 'back.out(1.3)',
            delay: i * 0.07,
            scrollTrigger: {
              trigger: sectionRef.current,
              start: 'top 65%',
              toggleActions: 'play none none reverse',
            },
          }
        )
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} data-nav-scheme="dark" className="relative bg-[#12171f] py-24 overflow-hidden">
      {/* GAMING watermark */}
      <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center">
        <span className="text-[16vw] font-black text-white/[0.03] uppercase leading-none tracking-tighter">GAMING</span>
      </div>

      {/* Diagonal stripe */}
      <div className="pointer-events-none absolute inset-0"
        style={{ background: 'repeating-linear-gradient(135deg, transparent, transparent 80px, rgba(212,105,58,0.015) 80px, rgba(212,105,58,0.015) 82px)' }} />

      <div className="container relative z-10">
        <div className="flex flex-col lg:flex-row gap-12 items-start">

          {/* Left sticky text */}
          <div className="lg:w-64 lg:sticky lg:top-1/3 shrink-0">
            <motion.div
              initial={{ opacity: 0, x: -60 }} whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            >
              <p className="text-xs font-bold tracking-[.35em] text-[#D4693A] uppercase mb-4">Level Up</p>
              <h2 className="text-[clamp(48px,6vw,80px)] font-black text-white leading-[.88] tracking-tight">
                GAME<br />ON.
              </h2>
              <p className="mt-5 text-sm text-white/35 leading-relaxed max-w-[200px]">
                Next-level gaming gear. Built for champions.
              </p>
              <Link to="/categories/gaming"
                className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-[#D4693A] hover:text-white transition-colors"
              >Shop Gaming <ArrowRight className="size-4" /></Link>
            </motion.div>
          </div>

          {/* Collage — 3 columns, cards exactly 150×150 */}
          <div className="flex-1 flex gap-5 justify-center">
            {/* Column A */}
            <div className="flex flex-col gap-5 items-center">
              {[0, 1, 2].map((slot) => (
                <div key={slot} ref={(el) => { imgRefs.current[slot] = el }}
                  className="rounded-xl bg-white p-2 shadow-[0_6px_24px_rgba(0,0,0,0.28)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.38)] transition-shadow duration-300 w-fit"
                  style={{ transform: `rotate(${COLLAGE_TILTS[slot]}deg)` }}
                >
                  <img src={GAMING_IMGS[slot % GAMING_IMGS.length]} alt="" className="w-[150px] h-[150px] object-contain" draggable={false} />
                </div>
              ))}
            </div>

            {/* Column B */}
            <div className="flex flex-col gap-5 items-center">
              {[3, 4, 5].map((slot) => (
                <div key={slot} ref={(el) => { imgRefs.current[slot] = el }}
                  className="rounded-xl bg-white p-2 shadow-[0_6px_24px_rgba(0,0,0,0.28)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.38)] transition-shadow duration-300 w-fit"
                  style={{ transform: `rotate(${COLLAGE_TILTS[slot]}deg)` }}
                >
                  <img src={GAMING_IMGS[slot % GAMING_IMGS.length]} alt="" className="w-[150px] h-[150px] object-contain" draggable={false} />
                </div>
              ))}
            </div>

            {/* Column C */}
            <div className="flex flex-col gap-5 items-center">
              {[6, 7, 8].map((slot) => (
                <div key={slot} ref={(el) => { imgRefs.current[slot] = el }}
                  className="rounded-xl bg-white p-2 shadow-[0_6px_24px_rgba(0,0,0,0.28)] hover:shadow-[0_12px_36px_rgba(0,0,0,0.38)] transition-shadow duration-300 w-fit"
                  style={{ transform: `rotate(${COLLAGE_TILTS[slot]}deg)` }}
                >
                  <img src={GAMING_IMGS[slot % GAMING_IMGS.length]} alt="" className="w-[150px] h-[150px] object-contain" draggable={false} />
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom strip — 4 controllers */}
        <div className="mt-6 flex gap-5 justify-center flex-wrap">
          {[9, 10, 11, 12].map((slot, i) => (
            <motion.div
              key={slot}
              className="rounded-xl bg-white p-2 shadow-[0_6px_24px_rgba(0,0,0,0.28)] w-fit"
              style={{ transform: `rotate(${COLLAGE_TILTS[slot % COLLAGE_TILTS.length]}deg)` }}
              initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: i * 0.1, ease: [0.16, 1, 0.3, 1] }}
            >
              <img src={GAMING_IMGS[slot % GAMING_IMGS.length]} alt="" className="w-[150px] h-[150px] object-contain" draggable={false} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}

// ── FLOATING SHOWCASE ─────────────────────────────────────────────────────
function FloatingShowcase() {
  return (
    <section data-nav-scheme="light" className="bg-white py-28 overflow-hidden">
      <div className="container">
        <FadeUp className="mb-20 text-center">
          <p className="text-xs font-bold tracking-[.35em] text-[#D4693A] uppercase mb-3">Our Arsenal</p>
          <h2 className="text-[clamp(44px,6.5vw,90px)] font-black tracking-tight text-[#2d3444] leading-[.88]">
            BUILT<br />DIFFERENT.
          </h2>
        </FadeUp>

        <div className="grid grid-cols-3 gap-x-6 gap-y-0">
          {SHOWCASE.map(({ src, label, sub }, i) => {
            const col = i % 3
            const offsetY = col === 1 ? 80 : col === 2 ? 40 : 0
            return (
              <motion.div
                key={i}
                className="flex flex-col items-center"
                style={{ marginTop: offsetY }}
                initial={{ opacity: 0, y: 80 + offsetY * 0.5, rotate: (i % 2 === 0 ? -6 : 6) }}
                whileInView={{ opacity: 1, y: offsetY, rotate: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 1.0, delay: col * 0.1 + Math.floor(i / 3) * 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <motion.div
                  className="w-full aspect-square relative"
                  whileHover={{ scale: 1.06, y: -12, rotate: (i % 2 === 0 ? 3 : -3) }}
                  transition={{ type: 'spring', stiffness: 180, damping: 18 }}
                >
                  <img src={src} alt={label} className="size-full object-contain" draggable={false}
                    style={{ filter: 'drop-shadow(0 28px 14px rgba(45,52,68,0.18)) drop-shadow(0 10px 4px rgba(45,52,68,0.10))' }}
                  />
                </motion.div>
                <motion.div
                  className="mt-4 text-center"
                  initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: col * 0.1 + 0.3 }}
                >
                  <h3 className="font-black text-[#2d3444] text-xs uppercase tracking-[.15em]">{label}</h3>
                  <p className="text-[11px] text-[#999] mt-0.5">{sub}</p>
                </motion.div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

// ── ACCESSORIES CHAOS STRIP ───────────────────────────────────────────────
const CHAOS_IMGS = [
  caseLBlue, caseRed, caseSand, caseWine, caseFGreen, caseYellow, caseBrown, casePinkS, caseIBlue, caseBlack1,
  lanyard1, lanyard2, lanyard3, lanyard4,
  kick7a, kick7b, kick7c, kick7d,
  kick8Gray, kick8Purple, kick8Blue, kick8Black,
  sil20Orange, sil20Pink, sil20Blue, sil20Purple, sil20Gray,
  mazeRed, mazeBrown, mazeDesert, mazePeach, mazeDeepBl, mazeDeepRed, mazeLPurple, mazeBlkGold,
  coord11Purple, coord11Gray, coord11Black,
  cyber12Blue, cyber12Gray, cyber12Purple,
  leather17Gray, leather17Purple, leather17Blue, leather17Black,
  pb01, pb03, pbHW_gray, pbHW_purple, pbHW_silver,
  pencil1, pencil3, pencil22, pencil23, pencil26, pencil28, pencil29, pencil30,
  caseFront1, caseFront2, caseFront3, caseBlack, casePink, caseGreen, caseWhite,
  caseRed5, caseLBlue5, caseSand5, caseBrown5,
  kick5Blue, kick5Sand, kick5Yellow,
]

const CHAOS_SIZES = [80, 120, 100, 90, 140, 75, 110, 95, 130, 85, 105, 115]
const CHAOS_TOPS  = [10, 30, 5,  40, 15, 50, 8, 35, 20, 45, 12, 38]
const CHAOS_TILTS = [-8, 12, -3, 15, -10, 6, -14, 9, -5, 13, -7, 11]

function AccessoriesChaos() {
  const trackRef   = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)
  const ALL = [...CHAOS_IMGS, ...CHAOS_IMGS]

  useEffect(() => {
    const ctx = gsap.context(() => {
      const track = trackRef.current, section = sectionRef.current
      if (!track || !section) return
      const dist = track.scrollWidth - window.innerWidth
      if (dist <= 0) return
      gsap.to(track, {
        x: -dist * 0.6, ease: 'none',
        scrollTrigger: {
          trigger: section, start: 'top bottom',
          end: 'bottom top', scrub: 2,
        },
      })
    }, sectionRef)
    return () => ctx.revert()
  }, [])

  return (
    <section ref={sectionRef} data-nav-scheme="light" className="relative bg-[#F7F3EE] py-24 overflow-hidden">
      <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center">
        <span className="text-[14vw] font-black text-[#2d3444]/[0.04] uppercase leading-none tracking-tighter whitespace-nowrap">
          ACCESSORIES
        </span>
      </div>

      <FadeUp className="container relative z-10 mb-12">
        <p className="text-xs font-bold tracking-[.35em] text-[#D4693A] uppercase mb-3">Everything You Need</p>
        <h2 className="text-[clamp(40px,6vw,80px)] font-black tracking-tight text-[#2d3444] leading-[.9]">
          THE<br />FULL RANGE.
        </h2>
      </FadeUp>

      {/* Scrolling chaos strip */}
      <div ref={trackRef} className="flex items-end gap-4 w-max px-8" style={{ paddingBottom: '2rem', paddingTop: '1rem' }}>
        {ALL.map((src, i) => {
          const size = CHAOS_SIZES[i % CHAOS_SIZES.length]
          const top  = CHAOS_TOPS[i % CHAOS_TOPS.length]
          const tilt = CHAOS_TILTS[i % CHAOS_TILTS.length]
          return (
            <div key={i} className="shrink-0 relative"
              style={{ width: size, marginTop: `${top}px`, transform: `rotate(${tilt}deg)` }}
            >
              <img src={src} alt="" draggable={false}
                className="w-full object-contain transition-transform duration-300 hover:scale-110 hover:-translate-y-2"
                style={{ filter: 'drop-shadow(0 16px 8px rgba(45,52,68,0.12))' }}
              />
            </div>
          )
        })}
      </div>

      <div className="container relative z-10 mt-10 text-right">
        <Link to="/products"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#2d3444] hover:text-[#D4693A] transition-colors"
        >Shop All Accessories <ArrowRight className="size-4" /></Link>
      </div>
    </section>
  )
}

// ── Page ──────────────────────────────────────────────────────────────────
export default function HomePage() {
  const { data: featuredData }    = useGetFeaturedProductsQuery()
  const { data: bestsellersData } = useGetBestsellersQuery({})
  const { data: categoriesData }  = useGetCategoriesQuery()
  const { data: newArrivalsData } = useGetNewArrivalsQuery({})

  const featured    = featuredData?.data    ?? []
  const bestsellers = bestsellersData?.data ?? []
  const categories  = categoriesData?.data  ?? []
  const newArrivals = newArrivalsData?.data  ?? []

  const BENEFITS = [
    { icon: Truck,  title: 'Free Shipping',  desc: 'On all orders over $50. Fast and reliable.' },
    { icon: Shield, title: '1-Year Warranty', desc: 'Every product backed by our quality promise.' },
    { icon: Zap,    title: 'Premium Quality', desc: 'Engineered for performance, built to last.' },
  ]

  return (
    <div>
      {/* 1 — 3D Hero */}
      <Hero3DScene />

      {/* 2 — Marquee */}
      <Marquee />

      {/* 3 — Scrapbook Categories */}
      <ScrapbookCategories categories={categories} />

      {/* 4 — Featured "THE DROP" on dark */}
      <TheDropSection products={featured} />

      {/* 5 — Gaming Collage */}
      <GamingCollage />

      {/* 6 — New Arrivals horizontal rack */}
      {newArrivals.length > 0 && (
        <HorizontalRack tag="Fresh Drops" title="New Arrivals" products={newArrivals} />
      )}

      {/* 7 — Floating product showcase */}
      <FloatingShowcase />

      {/* 8 — All accessories chaos scroll */}
      <AccessoriesChaos />

      {/* 9 — Benefits */}
      <section data-nav-scheme="light" className="bg-[#F7F3EE] py-20">
        <div className="container">
          <div className="grid md:grid-cols-3 gap-5">
            {BENEFITS.map(({ icon: Icon, title, desc }, i) => (
              <FadeUp key={title} delay={i * 0.1}>
                <div className="bg-white rounded-2xl p-8 border border-[#E8E4DF] h-full">
                  <div className="size-12 rounded-xl bg-[#D4693A]/10 flex items-center justify-center mb-5">
                    <Icon className="size-5 text-[#D4693A]" />
                  </div>
                  <h3 className="text-lg font-bold text-[#2d3444] mb-2">{title}</h3>
                  <p className="text-sm text-[#777] leading-relaxed">{desc}</p>
                </div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* 10 — Stats */}
      <section data-nav-scheme="dark" className="bg-[#2d3444] py-20">
        <div className="container">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <CountStat value={5000} suffix="+" label="Happy Customers" />
            <CountStat value={200}  suffix="+" label="Products Available" />
            <CountStat value={50}   suffix="+" label="Brands Stocked" />
            <CountStat value={99}   suffix="%" label="Satisfaction Rate" />
          </div>
        </div>
      </section>

      {/* 11 — CTA Banner */}
      <section data-nav-scheme="orange" className="bg-[#D4693A] py-28">
        <div className="container text-center">
          <motion.h2
            className="text-[clamp(40px,7vw,90px)] font-black text-white leading-[.9] tracking-tight"
            initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          >BUILT FOR<br />THE BOLD.</motion.h2>
          <motion.p
            className="mt-5 text-base text-white/70 max-w-sm mx-auto leading-relaxed"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
          >Discover the full range of premium tech accessories.</motion.p>
          <motion.div className="mt-8"
            initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
          >
            <Link to="/products"
              className="inline-flex items-center gap-2 rounded-full bg-white px-9 py-4 text-sm font-bold text-[#D4693A] hover:bg-[#2d3444] hover:text-white transition-colors duration-300"
            >Shop All Products <ArrowRight className="size-4" /></Link>
          </motion.div>
        </div>
      </section>

      {/* 12 — Bestsellers */}
      <section data-nav-scheme="light" className="bg-white py-24">
        <div className="container">
          <FadeUp className="mb-12 flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-bold tracking-[.3em] text-[#D4693A] uppercase mb-3">Most Loved</p>
              <h2 className="text-5xl font-black tracking-tight text-[#2d3444]">Bestsellers</h2>
            </div>
            <Link to="/products?sort=bestsellers"
              className="hidden sm:flex items-center gap-2 text-sm font-semibold text-[#2d3444] hover:text-[#D4693A] transition-colors shrink-0"
            >View All <ArrowRight className="size-4" /></Link>
          </FadeUp>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {bestsellers.slice(0, 8).map((p, i) => <Card key={p.id} product={p} index={i} />)}
          </div>
        </div>
      </section>

      {/* 13 — Final marquee */}
      <Marquee reverse />
    </div>
  )
}
