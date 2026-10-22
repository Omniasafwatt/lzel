import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, type LucideIcon } from 'lucide-react'
import { productsByCategory } from '@/data/mockProducts'
import { groupSpecs, subtitleOf, modelOf, type SmartHomeSection } from '@/data/products/smartHomeLayout'
import { detailOf, scenesOf } from '@/data/products/smartHomeDetail'
import { storyOf } from '@/data/products/smartHomeStory'
import SmartHomeCard from '@/components/smart-home/SmartHomeCard'
import type { Product } from '@/types'

// EZVIZ-style product page (lifestyle hero, feature grid, ring diagram,
// use cases, stats, placement, specs) in the aslitec palette.
type Tab = 'detail' | 'specs'

function FadeUp({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-60px' }}
      transition={{ duration: 0.7, delay, ease: [0.16, 1, 0.3, 1] }}
    >
      {children}
    </motion.div>
  )
}

const Heading = ({ title, text, light = false }: { title: string; text?: string; light?: boolean }) => (
  <FadeUp className="mx-auto max-w-3xl text-center">
    <h2 className={`text-2xl md:text-4xl font-bold leading-tight ${light ? 'text-white' : 'text-[#2d3444]'}`}>{title}</h2>
    {text && <p className={`mt-4 text-sm md:text-base leading-relaxed ${light ? 'text-white/70' : 'text-[#666]'}`}>{text}</p>}
  </FadeUp>
)

export default function SmartHomeProductPage({ product, section }: { product: Product; section: SmartHomeSection }) {
  const [tab, setTab] = useState<Tab>('detail')
  const model = modelOf(product) ?? product.name
  const subtitle = subtitleOf(product, section)
  const content = detailOf(product)
  const scenes = scenesOf(product)
  const story = storyOf(product)
  const others = productsByCategory[product.category.slug].filter((p) => p.id !== product.id && (p.categoryId === 'cat-smart-home' || p.id.startsWith('prod-sh-')))
  const related = [...others.filter(section.match), ...others.filter((p) => !section.match(p))].slice(0, 4)

  const switchTab = (t: Tab) => {
    setTab(t)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  return (
    <div data-nav-scheme="light" className="min-h-screen bg-[#FAFAF8] pt-16 md:pt-[68px]">
      {/* Solid header backing (the site navbar is transparent) */}
      <div className="fixed inset-x-0 top-0 z-40 h-16 md:h-[68px] bg-white" />

      {/* ── Product bar ─────────────────────────────────────────────── */}
      <div className="sticky top-16 md:top-[68px] z-30 bg-white shadow-[0_1px_0_#E8E4DF]">
        <div className="mx-auto max-w-[1200px] px-4 h-12 md:h-14 flex items-center justify-between gap-4">
          <p className="truncate text-base md:text-lg font-bold text-[#2d3444]">{model}</p>
          <div className="flex items-center gap-4 md:gap-7 shrink-0">
            {(['detail', 'specs'] as const).map((t) => (
              <button
                key={t}
                onClick={() => switchTab(t)}
                className={`relative h-12 md:h-14 text-xs md:text-sm transition-colors ${
                  tab === t ? 'text-[#D4693A] font-semibold' : 'text-[#2d3444] hover:text-[#D4693A]'
                }`}
              >
                {t === 'detail' ? 'Detail' : 'Specification'}
                {tab === t && <span className="absolute inset-x-0 bottom-0 h-0.5 bg-[#D4693A]" />}
              </button>
            ))}
          </div>
        </div>
      </div>

      {tab === 'detail' ? (
        <>
          {/* ── Hero ──────────────────────────────────────────────────── */}
          <section className="relative overflow-hidden bg-[#12171f]">
            {scenes.hero ? (
              <img src={scenes.hero} alt={product.name} className="block w-full h-[440px] md:h-auto md:aspect-[1920/800] object-cover object-[72%_center]" />
            ) : (
              // No lifestyle scene yet: show the product photo on a card instead
              <div className="relative h-[440px] md:h-auto md:aspect-[1920/800]">
                {product.images[0] && (
                  <div className="absolute right-4 top-6 md:right-[10%] md:top-1/2 md:-translate-y-1/2 z-10 aspect-square h-[52%] md:h-[80%] rounded-3xl bg-white">
                    <img src={product.images[0].url} alt={product.name} className="size-full object-contain p-[8%]" />
                  </div>
                )}
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-[#12171f]/75 via-[#12171f]/30 to-transparent" />
            <div className="absolute inset-0 flex items-end md:items-center">
              <div className="mx-auto w-full max-w-[1200px] px-4 pb-10 md:pb-0">
                <motion.div
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
                  className="max-w-[520px]"
                >
                  <p className="text-[11px] font-bold uppercase tracking-[.35em] text-[#D4693A]">aslitec</p>
                  <h1 className="mt-3 text-5xl md:text-7xl font-bold text-white tracking-tight">{model}</h1>
                  <p className="mt-3 text-lg md:text-2xl text-white/90">{subtitle}</p>
                  <div className="mt-7 flex flex-wrap gap-3">
                    <button onClick={() => switchTab('specs')} className="rounded-full border border-white/70 px-7 py-3 text-sm font-semibold text-white hover:bg-white hover:text-[#2d3444] transition-colors">
                      Specifications
                    </button>
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          {/* ── Intro + feature icons ─────────────────────────────────── */}
          <section className="bg-[#F7F3EE] py-16 md:py-24">
            <div className="mx-auto max-w-[1200px] px-4">
              <Heading title={story.tagline} text={product.description} />
              <div className="mt-12 md:mt-16 divide-y divide-[#E8E4DF] rounded-3xl bg-white px-6 md:px-12 shadow-[0_8px_30px_rgba(45,52,68,0.05)]">
                {story.pillars.map((pillar, pi) => (
                  <FadeUp key={pillar.title} delay={pi * 0.06} className="grid gap-6 py-8 md:grid-cols-[200px_1fr] md:items-center">
                    <h3 className="text-2xl md:text-3xl font-bold italic text-[#D4693A]">{pillar.title}</h3>
                    <div className="grid grid-cols-2 lg:grid-cols-3 gap-x-6 gap-y-6">
                      {pillar.items.map(({ icon: Icon, label }) => (
                        <div key={label} className="flex items-center gap-3">
                          <div className="flex size-12 shrink-0 items-center justify-center rounded-full bg-[#F7F3EE] text-[#D4693A]">
                            <Icon className="size-6" strokeWidth={1.5} />
                          </div>
                          <p className="text-sm text-[#2d3444] leading-snug">{label}</p>
                        </div>
                      ))}
                    </div>
                  </FadeUp>
                ))}
              </div>
            </div>
          </section>

          {/* ── Split: text + ring diagram ────────────────────────────── */}
          <section className="bg-white py-16 md:py-24">
            <div className="mx-auto max-w-[1200px] px-4 grid gap-12 lg:grid-cols-2 items-center">
              <FadeUp>
                <p className="text-[11px] font-bold uppercase tracking-[.35em] text-[#D4693A]">{section.name}</p>
                <h2 className="mt-3 text-2xl md:text-4xl font-bold leading-tight text-[#2d3444]">{content.ringTitle}</h2>
                <p className="mt-5 text-sm md:text-base leading-relaxed text-[#666]">{content.ringText}</p>
                <button onClick={() => switchTab('specs')} className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-[#D4693A] hover:gap-2.5 transition-all">
                  View all specifications <ArrowRight className="size-4" />
                </button>
              </FadeUp>
              <FadeUp delay={0.1}>
                <RingDiagram image={product.images[0]?.url} alt={product.name} items={content.ring} />
              </FadeUp>
            </div>
          </section>

          {/* ── Numbered benefits (01–03) ─────────────────────────────── */}
          {story.steps.some((st) => st.image) && (
            <section className="bg-[#F7F3EE] py-16 md:py-24">
              <div className="mx-auto max-w-[1200px] px-4 space-y-6">
                {story.steps.map((st, i) => (
                  <FadeUp key={st.title} className="grid items-center gap-8 overflow-hidden rounded-3xl bg-white p-6 md:grid-cols-2 md:p-10">
                    <div className={i % 2 ? 'md:order-2' : ''}>
                      <p className="text-3xl md:text-4xl font-bold italic text-[#D4693A]">{String(i + 1).padStart(2, '0')}</p>
                      <h3 className="mt-3 text-2xl md:text-3xl font-bold text-[#2d3444] leading-tight">{st.title}</h3>
                      <p className="mt-4 text-sm md:text-base leading-relaxed text-[#666]">{st.text}</p>
                    </div>
                    {st.image && (
                      <div className="overflow-hidden rounded-2xl">
                        <img src={st.image} alt={st.title} loading="lazy" className="w-full aspect-[10/7] object-cover transition-transform duration-700 hover:scale-105" />
                      </div>
                    )}
                  </FadeUp>
                ))}
              </div>
            </section>
          )}

          {story.spotlights[0] && <Spotlight {...story.spotlights[0]} />}

          {/* ── Use cases ─────────────────────────────────────────────── */}
          {scenes.uses.length > 0 && (
            <section className="bg-white py-16 md:py-24">
              <div className="mx-auto max-w-[1200px] px-4">
                <Heading title={content.usesTitle} text={content.usesText} />
                <div className="mt-12 grid gap-5 md:grid-cols-3">
                  {scenes.uses.map((src, i) => (
                    <FadeUp key={src} delay={i * 0.08}>
                      <div className="overflow-hidden rounded-2xl">
                        <img src={src} alt={content.uses[i]} loading="lazy" className="w-full aspect-[10/7] object-cover transition-transform duration-700 hover:scale-105" />
                      </div>
                      <h3 className="mt-5 text-lg font-bold text-[#2d3444]">{content.uses[i]}</h3>
                      {story.useTexts[i] && <p className="mt-2 text-sm leading-relaxed text-[#666]">{story.useTexts[i]}</p>}
                    </FadeUp>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── Stats ─────────────────────────────────────────────────── */}
          {scenes.stats.length > 0 && (
            <section className="bg-[#F7F3EE] py-16 md:py-24">
              <div className="mx-auto max-w-[1200px] px-4 grid gap-6 md:grid-cols-2">
                {content.stats.map((s, i) => (
                  <FadeUp key={s.label} delay={i * 0.08}>
                    <div className="relative overflow-hidden rounded-2xl">
                      <img src={scenes.stats[i]} alt="" loading="lazy" className="w-full aspect-[10/7] object-cover" />
                      <div className="absolute left-6 top-6 md:left-8 md:top-8">
                        <p className={`text-5xl md:text-6xl font-bold tracking-tight ${i === 0 ? 'text-white' : 'text-[#2d3444]'}`}>{s.value}</p>
                        <p className={`mt-1 text-sm ${i === 0 ? 'text-[#e9a57f]' : 'text-[#D4693A]'}`}>{s.label}</p>
                      </div>
                    </div>
                    <h3 className="mt-5 text-lg md:text-xl font-bold text-[#2d3444]">{s.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-[#666]">{s.text}</p>
                  </FadeUp>
                ))}
              </div>
            </section>
          )}

          {story.spotlights[1] && <Spotlight {...story.spotlights[1]} />}

          {/* ── Placement ─────────────────────────────────────────────── */}
          {scenes.places.length > 0 && (
            <section className="bg-[#F7F3EE] py-16 md:py-24">
              <div className="mx-auto max-w-[1200px] px-4">
                <Heading title={content.placeTitle} text={content.placeText} />
                <div className="mt-12 grid gap-5 md:grid-cols-2">
                  {scenes.places.map((src, i) => (
                    <FadeUp key={src} delay={i * 0.08} className="relative overflow-hidden rounded-2xl">
                      <img src={src} alt={content.places[i]} loading="lazy" className="w-full aspect-[10/7] object-cover" />
                      <span className="absolute bottom-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-[#2d3444]/80 px-5 py-2 text-sm font-semibold text-white backdrop-blur">
                        {content.places[i]}
                      </span>
                    </FadeUp>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* ── Every angle (real product photos) ─────────────────────── */}
          {product.images.length > 1 && (
            <section className="bg-white py-16 md:py-24">
              <div className="mx-auto max-w-[1200px] px-4">
                <Heading title="Every angle" />
                <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-3">
                  {product.images.map((img, i) => (
                    <FadeUp key={img.id} delay={(i % 4) * 0.05} className="aspect-square rounded-2xl bg-[#F7F3EE] overflow-hidden">
                      <img src={img.url} alt={img.alt} loading="lazy" className="size-full object-contain p-5 mix-blend-multiply" />
                    </FadeUp>
                  ))}
                </div>
              </div>
            </section>
          )}
        </>
      ) : (
        /* ── Specifications ──────────────────────────────────────────── */
        <section className="bg-white py-14 md:py-20">
          <div className="mx-auto max-w-[960px] px-4">
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-[#2d3444]">{model}</h1>
              <p className="mt-2 text-sm text-[#666]">{subtitle}</p>
            </div>
            <div className="mt-10 flex justify-center gap-6 md:gap-12 border-b border-[#E8E4DF] pb-10">
              {product.images.slice(0, 2).map((img) => (
                <img key={img.id} src={img.url} alt={img.alt} className="h-48 md:h-64 w-auto max-w-[45%] object-contain" />
              ))}
            </div>
            <h2 className="mt-14 text-center text-2xl md:text-3xl font-semibold text-[#2d3444]">Specifications</h2>
            <div className="mx-auto mt-3 h-0.5 w-12 bg-[#D4693A]" />
            <div className="mt-10">
              {groupSpecs(product).map((g) => (
                <div key={g.name} className="mb-8">
                  <h3 className="border-b-2 border-[#2d3444] pb-3 text-base font-semibold text-[#2d3444]">{g.name}</h3>
                  <dl>
                    {g.rows.map((s, i) => (
                      <div key={s.label + i} className="grid grid-cols-[120px_1fr] md:grid-cols-[240px_1fr] gap-4 border-b border-[#E8E4DF] py-4">
                        <dt className="text-sm text-[#999]">{s.label}</dt>
                        <dd className="text-sm text-[#2d3444]">{s.value}</dd>
                      </div>
                    ))}
                  </dl>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Related ─────────────────────────────────────────────────── */}
      {related.length > 0 && (
        <section className="bg-[#FAFAF8] py-16 md:py-20">
          <div className="mx-auto max-w-[1200px] px-4">
            <div className="mb-8 flex items-end justify-between gap-4">
              <h2 className="text-2xl md:text-3xl font-bold text-[#2d3444]">You might also like</h2>
              <Link to={`/categories/${product.category.slug}`} className="shrink-0 inline-flex items-center gap-1 text-sm font-semibold text-[#D4693A]">
                All {product.category.name} <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              {related.map((p, i) => <SmartHomeCard key={p.id} product={p} index={i} />)}
            </div>
          </div>
        </section>
      )}
    </div>
  )
}

// Product in the middle, uses arranged on a ring around it
function RingDiagram({ image, alt, items }: { image?: string; alt: string; items: { icon: LucideIcon; label: string }[] }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[460px]">
      <div className="absolute inset-[4%] rounded-full border border-dashed border-[#D4693A]/40" />
      <div className="absolute inset-[20%] rounded-full bg-[#F7F3EE]" />
      <div className="absolute inset-[30%] rounded-full bg-white shadow-[0_10px_40px_rgba(212,105,58,0.18)] flex items-center justify-center">
        {image && <img src={image} alt={alt} className="size-[78%] object-contain" />}
      </div>
      {items.map(({ icon: Icon, label }, i) => {
        const a = (i / items.length) * Math.PI * 2 - Math.PI / 2
        return (
          <div
            key={label}
            className="absolute flex w-20 -translate-x-1/2 -translate-y-1/2 flex-col items-center text-center"
            style={{ left: `${50 + 46 * Math.cos(a)}%`, top: `${50 + 46 * Math.sin(a)}%` }}
          >
            <div className="flex size-11 md:size-12 items-center justify-center rounded-full bg-white text-[#D4693A] shadow-[0_4px_14px_rgba(45,52,68,0.1)]">
              <Icon className="size-5" strokeWidth={1.6} />
            </div>
            <p className="mt-1.5 text-[11px] md:text-xs font-medium text-[#2d3444] leading-tight">{label}</p>
          </div>
        )
      })}
    </div>
  )
}

// Full-width benefit scene with the headline over it (RH2 style)
function Spotlight({ title, text, image }: { title: string; text: string; image?: string }) {
  if (!image) return null
  return (
    <section className="relative overflow-hidden bg-[#12171f]">
      <img src={image} alt={title} loading="lazy" className="block w-full h-[420px] md:h-auto md:aspect-[1920/760] object-cover object-[75%_center]" />
      <div className="absolute inset-0 bg-gradient-to-r from-[#12171f]/80 via-[#12171f]/35 to-transparent" />
      <div className="absolute inset-0 flex items-end md:items-center">
        <FadeUp className="mx-auto w-full max-w-[1200px] px-4 pb-10 md:pb-0">
          <div className="max-w-[460px]">
            <span className="block h-1 w-12 rounded-full bg-[#D4693A]" />
            <h2 className="mt-5 text-3xl md:text-5xl font-bold leading-tight text-white">{title}</h2>
            <p className="mt-4 text-sm md:text-lg leading-relaxed text-white/80">{text}</p>
          </div>
        </FadeUp>
      </div>
    </section>
  )
}
