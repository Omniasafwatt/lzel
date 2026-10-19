import { useEffect, useMemo, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { ArrowRight } from 'lucide-react'
import {
  useGetFeaturedProductsQuery,
  useGetCategoriesQuery,
  useGetNewArrivalsQuery,
  useGetProductsByCategoryQuery,
} from '@/data/useMockData'
import type { Product } from '@/types'
import { mockProducts } from '@/data/mockProducts'
import { newAccessories } from '@/data/products/newAccessories'
import CampaignBanners from '@/components/home/CampaignBanners'

// â”€â”€ Waterproof cases â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import caseFront1 from '@/assets/accessories/WaterProof Case/front-01.webp'
import caseFront2 from '@/assets/accessories/WaterProof Case/front-02.webp'
import caseFront3 from '@/assets/accessories/WaterProof Case/front-03.webp'
import caseFront4 from '@/assets/accessories/WaterProof Case/front-04.webp'
import caseFront5 from '@/assets/accessories/WaterProof Case/front-05.webp'
const caseBlack = caseFront1
const caseBlue  = caseFront2
const casePink  = caseFront3
const caseGreen = caseFront4
const caseWhite = caseFront5

// â”€â”€ Powerbanks â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import pbHW_gray   from '@/assets/accessories/Powerbank/HW121-gray.webp'
import pbHW_purple from '@/assets/accessories/Powerbank/HW121-purple.webp'
import pbHW_blue   from '@/assets/accessories/Powerbank/HW121-blue.webp'
import pbHW_silver from '@/assets/accessories/Powerbank/HW121-silver.webp'
const pb01 = pbHW_gray
const pb02 = pbHW_blue
const pb03 = pbHW_purple

// â”€â”€ Wave silicone grip cases â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import caseRed    from '@/assets/accessories/Cases/No.1 aslitec Wave silicone grip/E-RED 3.webp'
import caseLBlue  from '@/assets/accessories/Cases/No.1 aslitec Wave silicone grip/B-LIGHT BLUE 3.webp'
import caseWine   from '@/assets/accessories/Cases/No.1 aslitec Wave silicone grip/K-WINE 3.webp'
import casePinkS  from '@/assets/accessories/Cases/No.1 aslitec Wave silicone grip/A-PINK 1.webp'
import caseSand   from '@/assets/accessories/Cases/No.1 aslitec Wave silicone grip/C-SAND 3.webp'
import caseBrown  from '@/assets/accessories/Cases/No.1 aslitec Wave silicone grip/G-BROWN 2.webp'
import caseFGreen from '@/assets/accessories/Cases/No.1 aslitec Wave silicone grip/F-GREEN 3.webp'
import caseYellow from '@/assets/accessories/Cases/No.1 aslitec Wave silicone grip/D-YELLOW 1.webp'
import caseMint   from '@/assets/accessories/Cases/No.1 aslitec Wave silicone grip/J-MINT 1.webp'
import caseIBlue  from '@/assets/accessories/Cases/No.1 aslitec Wave silicone grip/I-BLUE 2.webp'
import caseBlack1 from '@/assets/accessories/Cases/No.1 aslitec Wave silicone grip/BLACK 1.webp'
import caseRed5   from '@/assets/accessories/Cases/No.1 aslitec Wave silicone grip/E-RED 5.webp'
import caseLBlue5 from '@/assets/accessories/Cases/No.1 aslitec Wave silicone grip/B-LIGHT BLUE 5.webp'
import caseSand5  from '@/assets/accessories/Cases/No.1 aslitec Wave silicone grip/C-SAND 5.webp'
import caseBrown5 from '@/assets/accessories/Cases/No.1 aslitec Wave silicone grip/G-BROWN 5.webp'

// â”€â”€ PC Maze cases (No.10) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import mazeBrown   from '@/assets/accessories/Cases/No.10 asltitec PC Maze Case/B-BROWN 3.webp'
import mazeRed     from '@/assets/accessories/Cases/No.10 asltitec PC Maze Case/C-RED 3.webp'
import mazeBlack   from '@/assets/accessories/Cases/No.10 asltitec PC Maze Case/I-BLACK 3.webp'
import mazeDesert  from '@/assets/accessories/Cases/No.10 asltitec PC Maze Case/E-DESERT 3.webp'
import mazePeach   from '@/assets/accessories/Cases/No.10 asltitec PC Maze Case/D-PEACH 3.webp'
import mazeDeepBl  from '@/assets/accessories/Cases/No.10 asltitec PC Maze Case/K-DEEP BLUE 3.webp'
import mazePurple  from '@/assets/accessories/Cases/No.10 asltitec PC Maze Case/A-PURPLE 2.webp'
import mazeDeepRed from '@/assets/accessories/Cases/No.10 asltitec PC Maze Case/F-DEEP RED 3.webp'
import mazeDeepBrn from '@/assets/accessories/Cases/No.10 asltitec PC Maze Case/G-DEEP BROWN 3.webp'
import mazeLPurple from '@/assets/accessories/Cases/No.10 asltitec PC Maze Case/H-LIGHT PURPLE 3.webp'
import mazeBlkGold from '@/assets/accessories/Cases/No.10 asltitec PC Maze Case/J-BLACK GOLD 3.webp'

// â”€â”€ Coordinate PC case (No.11) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import coord11Purple from '@/assets/accessories/Cases/No.11 asliec Coordinate PC case (update)/robot-purple.webp'
import coord11Blue   from '@/assets/accessories/Cases/No.11 asliec Coordinate PC case (update)/deep-blue.webp'
import coord11Gray   from '@/assets/accessories/Cases/No.11 asliec Coordinate PC case (update)/gray.webp'
import coord11Black  from '@/assets/accessories/Cases/No.11 asliec Coordinate PC case (update)/black.webp'

// â”€â”€ Cyber Mech case (No.12) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import cyber12Blue   from '@/assets/accessories/Cases/No.12 aslitec Cyber Mech case/deep-blue.webp'
import cyber12Gray   from '@/assets/accessories/Cases/No.12 aslitec Cyber Mech case/gray.webp'
import cyber12Purple from '@/assets/accessories/Cases/No.12 aslitec Cyber Mech case/purple.webp'
import cyber12Black  from '@/assets/accessories/Cases/No.12 aslitec Cyber Mech case/black.webp'

// â”€â”€ Leather Coordinate case (No.17) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import leather17Gray   from '@/assets/accessories/Cases/No.17 Leather Coordinate case (updated)/gray.webp'
import leather17Purple from '@/assets/accessories/Cases/No.17 Leather Coordinate case (updated)/purple.webp'
import leather17Blue   from '@/assets/accessories/Cases/No.17 Leather Coordinate case (updated)/blue.webp'
import leather17Black  from '@/assets/accessories/Cases/No.17 Leather Coordinate case (updated)/black.webp'

// â”€â”€ Silicone Coordinate case (No.20) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import sil20Orange from '@/assets/accessories/Cases/No.20 aslitec Silicone Coordinate case (updated)/orange.webp'
import sil20Pink   from '@/assets/accessories/Cases/No.20 aslitec Silicone Coordinate case (updated)/pink.webp'
import sil20Blue   from '@/assets/accessories/Cases/No.20 aslitec Silicone Coordinate case (updated)/deep-blue.webp'
import sil20Purple from '@/assets/accessories/Cases/No.20 aslitec Silicone Coordinate case (updated)/robot-purple.webp'
import sil20Gray   from '@/assets/accessories/Cases/No.20 aslitec Silicone Coordinate case (updated)/light-gray.webp'
import sil20Black  from '@/assets/accessories/Cases/No.20 aslitec Silicone Coordinate case (updated)/black.webp'

// â”€â”€ Leather Kickstand case B (No.5) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import kick5Pink   from '@/assets/accessories/Cases/No.5 aslitec Leather Kickstand case B/pink.webp'
import kick5Blue   from '@/assets/accessories/Cases/No.5 aslitec Leather Kickstand case B/blue.webp'
import kick5Sand   from '@/assets/accessories/Cases/No.5 aslitec Leather Kickstand case B/sand.webp'
import kick5Yellow from '@/assets/accessories/Cases/No.5 aslitec Leather Kickstand case B/yellow.webp'

// â”€â”€ Leather Kickstand case D (No.7) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import kick7a from '@/assets/accessories/Cases/No.7 aslitec Leather Kickstand case D (updated)/5652.webp'
import kick7b from '@/assets/accessories/Cases/No.7 aslitec Leather Kickstand case D (updated)/5653.webp'
import kick7c from '@/assets/accessories/Cases/No.7 aslitec Leather Kickstand case D (updated)/5656.webp'
import kick7d from '@/assets/accessories/Cases/No.7 aslitec Leather Kickstand case D (updated)/5657.webp'

// â”€â”€ Leather Kickstand case E (No.8) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import kick8Gray   from '@/assets/accessories/Cases/No.8 aslitec Leather Kickstand case E (updated)/light-gray.webp'
import kick8Purple from '@/assets/accessories/Cases/No.8 aslitec Leather Kickstand case E (updated)/purple.webp'
import kick8Blue   from '@/assets/accessories/Cases/No.8 aslitec Leather Kickstand case E (updated)/blue.webp'
import kick8Black  from '@/assets/accessories/Cases/No.8 aslitec Leather Kickstand case E (updated)/black.webp'

// â”€â”€ Lanyard (No.21) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import lanyard1 from '@/assets/accessories/Cases/No.21 aslitec Lanyard/3 (1).webp'
import lanyard2 from '@/assets/accessories/Cases/No.21 aslitec Lanyard/3 (2).webp'
import lanyard3 from '@/assets/accessories/Cases/No.21 aslitec Lanyard/3 (3).webp'
import lanyard4 from '@/assets/accessories/Cases/No.21 aslitec Lanyard/3 (4).webp'

// â”€â”€ Pencils â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
import pencil1  from '@/assets/accessories/pencil aslitec/1 (2).webp'
import pencil2  from '@/assets/accessories/pencil aslitec/2 (2).webp'
import pencil3  from '@/assets/accessories/pencil aslitec/3 (2).webp'
import pencil22 from '@/assets/accessories/pencil aslitec/22 (2).webp'
import pencil23 from '@/assets/accessories/pencil aslitec/23 (2).webp'
import pencil26 from '@/assets/accessories/pencil aslitec/26 (2).webp'
import pencil28 from '@/assets/accessories/pencil aslitec/28 (2).webp'
import pencil29 from '@/assets/accessories/pencil aslitec/29.webp'
import pencil30 from '@/assets/accessories/pencil aslitec/30.webp'

gsap.registerPlugin(ScrollTrigger)

// â”€â”€ Hero data â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
const HERO_IMGS = [
  caseBlue, caseMint, mazePurple, coord11Blue, cyber12Black,
  leather17Purple, sil20Orange, kick5Pink, kick7a, kick8Blue, caseGreen,
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

// â”€â”€ Showcase images (floating gallery) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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

// â”€â”€ 3D Hero â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
        // float animation removed — infinite repeat caused GPU jank
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
        </motion.div>
      </div>
    </div>
  )
}

function BigCard({ product }: { product: Product }) {
  const img = product.images[0]?.url
  return (
    <div className="group h-full flex flex-col bg-white rounded-2xl overflow-hidden border border-[#E8E4DF] hover:shadow-xl transition-shadow duration-300">
      <Link to={`/products/${product.slug}`} className="flex flex-col h-full">
        <div className="relative flex-1 overflow-hidden bg-[#F7F3EE] min-h-[280px]">
          {img && (
            <img src={img} alt={product.name}
              className="size-full object-contain p-6 transition-transform duration-500 group-hover:scale-[1.05]"
              loading="lazy" decoding="async"
            />
          )}
          {product.compareAtPrice && (
            <div className="absolute top-3 left-3 rounded-full bg-[#D4693A] px-2.5 py-0.5 text-[10px] font-bold text-white">SALE</div>
          )}
        </div>
        <div className="p-5">
          <p className="text-[10px] text-[#D4693A] font-semibold uppercase tracking-widest mb-1">{product.category.name}</p>
          <h3 className="text-base font-bold text-[#2d3444] line-clamp-2 leading-snug">{product.name}</h3>
          <div className="mt-2">
            {product.reviewCount > 0 && <span className="text-xs text-amber-500">★ {product.averageRating.toFixed(1)}</span>}
          </div>
        </div>
      </Link>
    </div>
  )
}

// â”€â”€ Marquee strip â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function Marquee({ reverse = false }) {
  const items = ['POWERBANKS', 'GAN CHARGERS', 'CASES', 'GRIP RINGS', 'SMART HOME', 'ACCESSORIES', 'ASLITEC', 'TECH']
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

// â”€â”€ Fade-up reveal â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div className={className}
      initial={{ opacity: 0, y: 36 }} whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.8, delay, ease: [0.16, 1, 0.3, 1] }}
    >{children}</motion.div>
  )
}

// â”€â”€ Horizontal rack (GSAP pinned) â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function HorizontalRack({ tag, title, products }: { tag: string; title: string; products: Product[] }) {
  const trackRef   = useRef<HTMLDivElement>(null)
  const sectionRef = useRef<HTMLDivElement>(null)

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
        {products.map((p) => (
          <Link key={p.id} to={`/products/${p.slug}`}
            className="group flex flex-col w-[270px] shrink-0 bg-white rounded-2xl overflow-hidden border border-[#E8E4DF] hover:shadow-lg transition-shadow duration-300"
          >
            <div className="aspect-square overflow-hidden bg-[#F7F3EE] shrink-0">
              {p.images[0]?.url && (
                <img src={p.images[0].url} alt={p.name}
                  className="size-full object-contain mix-blend-multiply transition-transform duration-500 group-hover:scale-105"
                  loading="lazy" decoding="async"
                />
              )}
            </div>
            <div className="p-4 flex flex-col flex-1">
              <h3 className="text-sm font-semibold text-[#2d3444] mb-2 overflow-hidden" style={{ display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', minHeight: '2.625rem' }}>{p.name}</h3>
            </div>
          </Link>
        ))}
      </div>
    </section>
  )
}

// â”€â”€ Count-up stat â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
function CountStat({ value, suffix = '', label, labelClass }: { value: number; suffix?: string; label: string; labelClass?: string }) {
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
    <div ref={ref}>
      <div className="text-[clamp(40px,5vw,56px)] font-black text-white tabular-nums leading-none">{count.toLocaleString()}{suffix}</div>
      <p className={`mt-2 text-sm font-semibold ${labelClass ?? 'text-white/40'}`}>{label}</p>
    </div>
  )
}

// â”€â”€ SCRAPBOOK CATEGORIES â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
      <div className="pointer-events-none select-none absolute inset-0 flex items-center justify-center">
        <span className="text-[22vw] font-black text-[#2d3444]/[0.03] uppercase leading-none tracking-tighter">
          SHOP
        </span>
      </div>

      <div className="container relative z-10">
        <FadeUp className="mb-20 text-center">
          <p className="text-xs font-bold tracking-[.35em] text-[#D4693A] uppercase mb-3"> -  Collections  - </p>
          <h2 className="text-[clamp(40px,6vw,80px)] font-black tracking-tight text-[#2d3444] leading-[.9]">
            Shop by<br />Category
          </h2>
        </FadeUp>

        {/* Scattered Polaroid cards */}
        <div className="relative flex flex-wrap justify-center items-center gap-8 md:gap-0 md:min-h-[480px]">
          {categories.slice(0, 5).map((cat: any, i: number, arr: any[]) => {
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
                      ? <img
                          src={cat.image}
                          alt={cat.name}
                          className={`size-full transition-transform duration-700 group-hover:scale-110 ${cat.slug === 'appliances'||'gaming' ? 'object-contain p-3' : 'object-cover'}`}
                          style={undefined}
                        />
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

      </div>
    </section>
  )
}

// â”€â”€ THE DROP  -  featured on dark bg â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
                    <div className="aspect-square overflow-hidden bg-[#1e2530] relative">
                      {p.images[0]?.url && (
                        <img src={p.images[0].url} alt={p.name}
                          className="size-full object-contain transition-transform duration-700 group-hover:scale-110"
                          loading="lazy" decoding="async"
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

// ── Just landed (latest drop, filterable) ─────────────────────────────────────
const LANDED_TABS = [
  { key: 'all',         label: 'All' },
  { key: 'smart-home',  label: 'Smart Home' },
  { key: 'accessories', label: 'Accessories' },
] as const

function JustLandedSection() {
  const [tab, setTab] = useState<(typeof LANDED_TABS)[number]['key']>('all')
  // round-robin across product families so the grid doesn't open with six chargers
  const all = useMemo(() => {
    const families = new Map<string, Product[]>()
    for (const p of mockProducts.filter((x) => x.tags.includes('new'))) {
      const key = p.tags[3] ?? p.id
      families.set(key, [...(families.get(key) ?? []), p])
    }
    const lists = [...families.values()]
    const out: Product[] = []
    for (let i = 0; out.length < lists.flat().length; i++) lists.forEach((l) => l[i] && out.push(l[i]))
    return out
  }, [])
  const shown = tab === 'all' ? all : all.filter((p) => p.category.slug === tab)

  return (
    <section data-nav-scheme="light" className="bg-[#FAFAF8] py-24">
      <div className="container">
        <FadeUp className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <p className="text-xs font-bold tracking-[.35em] text-[#D4693A] uppercase mb-3">Just Landed · {all.length} new products</p>
            <h2 className="text-[clamp(40px,6vw,80px)] font-black tracking-tight text-[#2d3444] leading-[.9]">
              NEW IN<span className="text-[#D4693A]">.</span>
            </h2>
          </div>
          <div className="flex gap-1 rounded-full bg-white border border-[#E8E4DF] p-1 self-start md:self-auto">
            {LANDED_TABS.map((t) => (
              <button
                key={t.key}
                onClick={() => setTab(t.key)}
                className={`rounded-full px-4 py-2 text-[11px] font-black uppercase tracking-[.15em] transition-colors ${
                  tab === t.key ? 'bg-[#2d3444] text-white' : 'text-[#555] hover:text-[#D4693A]'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </FadeUp>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {shown.map((p, i) => {
            const colors = p.attributes.find((a) => a.name === 'Color')?.values ?? []
            return (
              <motion.div
                key={p.id}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-40px' }}
                transition={{ duration: 0.6, delay: (i % 4) * 0.05, ease: [0.16, 1, 0.3, 1] }}
              >
                <Link
                  to={`/products/${p.slug}`}
                  className="group flex flex-col h-full bg-white rounded-2xl overflow-hidden border border-[#E8E4DF] hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="relative aspect-square overflow-hidden bg-[#F7F3EE]">
                    <img src={p.images[0]?.url} alt={p.name}
                      className="size-full object-contain p-5 mix-blend-multiply transition-transform duration-500 group-hover:scale-[1.06]"
                      loading="lazy" decoding="async"
                    />
                    <span className="absolute top-3 left-3 rounded-full bg-[#2d3444] px-2.5 py-0.5 text-[10px] font-bold text-white">NEW</span>
                  </div>
                  <div className="p-4 flex flex-col flex-1">
                    <p className="text-[10px] text-[#D4693A] font-semibold uppercase tracking-widest mb-1">{p.category.name}</p>
                    <h3 className="text-sm font-semibold text-[#2d3444] line-clamp-2 leading-snug">{p.name}</h3>
                    <p className="mt-1 text-xs text-[#999] line-clamp-1">{p.shortDescription?.split('·')[0].trim()}</p>
                    <div className="mt-auto pt-3 flex items-center justify-between">
                      <span className="text-[10px] font-semibold text-[#999]">
                        {colors.length > 1 ? `${colors.length} colours` : ''}
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-bold text-[#2d3444] group-hover:text-[#D4693A] transition-colors">
                        View <ArrowRight className="size-3" />
                      </span>
                    </div>
                  </div>
                </Link>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

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
                className="group flex flex-col items-center"
                style={{ marginTop: offsetY }}
                initial={{ opacity: 0, y: 50, rotate: (i % 2 === 0 ? -6 : 6) }}
                whileInView={{ opacity: 1, y: 0, rotate: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ duration: 1.0, delay: col * 0.1 + Math.floor(i / 3) * 0.15, ease: [0.16, 1, 0.3, 1] }}
              >
                <div className="w-full aspect-square relative transition-transform duration-500 group-hover:-translate-y-3 group-hover:scale-[1.06]">
                  <img src={src} alt={label} className="size-full object-contain" draggable={false}
                    loading="lazy" decoding="async"
                    style={{ filter: 'drop-shadow(0 28px 14px rgba(45,52,68,0.18)) drop-shadow(0 10px 4px rgba(45,52,68,0.10))' }}
                  />
                </div>
                <div className="mt-4 text-center">
                  <h3 className="font-black text-[#2d3444] text-xs uppercase tracking-[.15em]">{label}</h3>
                  <p className="text-[11px] text-[#999] mt-0.5">{sub}</p>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}

const NEW_ACC_IMGS = newAccessories
  .filter((p) => !p.tags.includes('lens protector'))
  .flatMap((p) => p.variants.map((v) => v.images[0]))

// â”€â”€ ACCESSORIES CHAOS STRIP â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
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
  // October 2026 drop – one shot per colour, interleaved with the cases
].flatMap((src, i, all) => {
  const extra = NEW_ACC_IMGS[i]
  return extra && i < all.length ? [src, extra] : [src]
})

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
                loading="lazy" decoding="async"
                style={{ filter: 'drop-shadow(0 16px 8px rgba(45,52,68,0.12))' }}
              />
            </div>
          )
        })}
      </div>

      <div className="container relative z-10 mt-10 text-right">
        <Link to="/categories/accessories"
          className="inline-flex items-center gap-2 text-sm font-bold text-[#2d3444] hover:text-[#D4693A] transition-colors"
        >Shop Accessories <ArrowRight className="size-4" /></Link>
      </div>
    </section>
  )
}

// â”€â”€ Page â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
export default function HomePage() {
  const { data: featuredData }    = useGetFeaturedProductsQuery()
  const { data: categoriesData }  = useGetCategoriesQuery()
  const { data: newArrivalsData } = useGetNewArrivalsQuery({})

  const featured    = featuredData?.data    ?? []
  const categories  = categoriesData?.data  ?? []
  const newArrivals = newArrivalsData?.data  ?? []

  const PROMISES = [
    { icon: '*', title: 'Premium Quality',      desc: 'Every product is hand-picked and held to an uncompromising standard before it ever reaches you.',  highlight: true  },
    { icon: '+', title: 'Satisfaction Focused', desc: 'Your happiness is the measure of our success  -  we stand behind everything we sell, no exceptions.',  highlight: false },
    { icon: '>', title: 'Curated Selection',    desc: 'Not just stocked, but chosen. Each product earns its place through real-world performance.',        highlight: false },
    { icon: '=', title: 'Built to Last',        desc: 'We source products engineered for durability  -  because great gear should go the distance.',          highlight: false },
  ]

  return (
    <div>
      {/* 1  -  3D Hero */}
      <Hero3DScene />

      {/* 2  -  Marquee */}
      <Marquee />

      {/* 3  -  Scrapbook Categories */}
      <ScrapbookCategories categories={categories} />

      {/* 3b -  Campaign banners, stacked on scroll */}
      <CampaignBanners />

      {/* 4  -  Featured "THE DROP" on dark */}
      <TheDropSection products={featured} />

      {/* 5  -  New Arrivals horizontal rack */}
      {newArrivals.length > 0 && (
        <HorizontalRack tag="Fresh Drops" title="New Arrivals" products={newArrivals} />
      )}

      {/* 6  -  Just landed: every product from the latest drop */}
      <JustLandedSection />

      {/* 7  -  Floating product showcase */}
      <FloatingShowcase />

      {/* 8  -  All accessories chaos scroll */}
      <AccessoriesChaos />

      {/* 9  -  Premium Promise + Stats */}
      <section data-nav-scheme="dark" className="relative bg-[#2d3444] py-28 overflow-hidden">
        {/* Dot grid background */}
        <div className="absolute inset-0 pointer-events-none opacity-[0.055]"
          style={{ backgroundImage: 'radial-gradient(#fff 1px, transparent 1px)', backgroundSize: '36px 36px' }}
        />
        {/* Orange glow */}
        <div className="absolute -top-48 -right-48 w-[500px] h-[500px] rounded-full bg-[#D4693A]/25 blur-[130px] pointer-events-none" />
        <div className="absolute -bottom-32 -left-32 w-72 h-72 rounded-full bg-[#D4693A]/10 blur-[100px] pointer-events-none" />

        <div className="container relative">
          {/* Header */}
          <FadeUp>
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-20">
              <div>
                <p className="text-[10px] font-black tracking-[.45em] text-[#D4693A] uppercase mb-5">Why Lzel</p>
                <h2 className="text-[clamp(44px,8vw,96px)] font-black text-white leading-[.9] tracking-tight">
                  PREMIUM<br />QUALITY<span className="text-[#D4693A]">.</span>
                </h2>
              </div>
              <p className="max-w-[320px] text-sm text-white/35 leading-relaxed lg:mb-3">
                Every product in our catalog is hand-selected and held to an uncompromising standard  -  because your experience should be nothing short of exceptional.
              </p>
            </div>
          </FadeUp>

          {/* Promise tiles */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {PROMISES.map(({ icon, title, desc, highlight }, i) => (
              <FadeUp key={title} delay={i * 0.09}>
                <motion.div
                  className={`rounded-2xl p-7 h-full flex flex-col gap-6 min-h-[220px] border cursor-default ${
                    highlight
                      ? 'bg-[#D4693A] border-[#D4693A]'
                      : 'bg-white/[0.04] border-white/[0.08]'
                  }`}
                  whileHover={{ scale: 1.03, transition: { duration: 0.25, ease: [0.16, 1, 0.3, 1] } }}
                >
                  <span className={`text-2xl ${highlight ? 'text-white' : 'text-[#D4693A]'}`}>{icon}</span>
                  <div>
                    <h3 className="text-base font-black text-white mb-2">{title}</h3>
                    <p className={`text-xs leading-relaxed ${highlight ? 'text-white/70' : 'text-white/35'}`}>{desc}</p>
                  </div>
                </motion.div>
              </FadeUp>
            ))}
          </div>
        </div>
      </section>

      {/* 11  -  CTA Banner */}
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
            <Link to="/categories/gaming"
              className="inline-flex items-center gap-2 rounded-full bg-white px-9 py-4 text-sm font-bold text-[#D4693A] hover:bg-[#2d3444] hover:text-white transition-colors duration-300"
            >Explore Gaming <ArrowRight className="size-4" /></Link>
          </motion.div>
        </div>
      </section>

    </div>
  )
}

