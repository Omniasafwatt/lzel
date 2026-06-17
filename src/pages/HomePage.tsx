import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ArrowRight, Sparkles, Shield, Truck, RotateCcw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import ProductGrid from '@/features/products/components/ProductGrid'
import {
  useGetFeaturedProductsQuery,
  useGetBestsellersQuery,
  useGetNewArrivalsQuery,
  useGetCategoriesQuery,
} from '@/data/useMockData'
import { formatPrice } from '@/lib/utils'

const FEATURES = [
  { icon: Truck, label: 'Free Shipping', desc: 'On orders over $50' },
  { icon: Shield, label: 'Secure Payments', desc: 'SSL encrypted checkout' },
  { icon: RotateCcw, label: '30-Day Returns', desc: 'Hassle-free policy' },
  { icon: Sparkles, label: 'Premium Quality', desc: 'Curated products' },
]

function SectionTitle({ title, subtitle, href }: { title: string; subtitle?: string; href?: string }) {
  return (
    <div className="mb-6 flex items-end justify-between">
      <div>
        <h2 className="text-2xl font-bold tracking-tight">{title}</h2>
        {subtitle && <p className="mt-1 text-muted-foreground">{subtitle}</p>}
      </div>
      {href && (
        <Link
          to={href}
          className="flex items-center gap-1 text-sm font-medium text-primary hover:gap-2 transition-all"
        >
          View all <ArrowRight className="size-4" />
        </Link>
      )}
    </div>
  )
}

export default function HomePage() {
  const { data: featuredData, isLoading: featuredLoading } = useGetFeaturedProductsQuery()
  const { data: bestsellersData, isLoading: bestsellersLoading } = useGetBestsellersQuery({ limit: 8 })
  const { data: newArrivalsData, isLoading: newArrivalsLoading } = useGetNewArrivalsQuery({ limit: 8 })
  const { data: categoriesData } = useGetCategoriesQuery()

  const featured = featuredData?.data ?? []
  const bestsellers = bestsellersData?.data ?? []
  const newArrivals = newArrivalsData?.data ?? []
  const categories = categoriesData?.data?.slice(0, 8) ?? []

  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative flex min-h-[90vh] items-center overflow-hidden bg-[#1C2838]">
        {/* Ambient orbs */}
        <div className="pointer-events-none absolute -left-40 -top-40 size-[500px] rounded-full bg-[#D4693A]/20 blur-[120px]" />
        <div className="pointer-events-none absolute right-0 top-20 size-[400px] rounded-full bg-[#D4693A]/15 blur-[100px]" />
        <div className="pointer-events-none absolute bottom-0 left-1/2 size-[300px] rounded-full bg-[#D4693A]/10 blur-[80px]" />

        {/* Dot grid overlay */}
        <div
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage: 'radial-gradient(circle, rgba(255,255,255,0.15) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        <div className="container relative z-10 py-20 lg:py-28">
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-2">

            {/* Left: Text */}
            <div className="order-2 lg:order-1">
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                className="mb-6 inline-flex items-center gap-2 rounded-full border border-[#D4693A]/40 bg-[#D4693A]/10 px-4 py-1.5 text-sm text-[#f0a070]"
              >
                <Sparkles className="size-3.5" />
                New arrivals just dropped
              </motion.div>

              <motion.h1
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="text-5xl font-bold leading-[1.1] tracking-tight text-white lg:text-6xl xl:text-7xl"
              >
                Next-Gen<br />
                <span className="bg-gradient-to-r from-[#D4693A] via-[#f09050] to-[#fbbf24] bg-clip-text text-transparent">
                  Mobile Tech
                </span><br />
                Awaits You
              </motion.h1>

              <motion.p
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
                className="mt-6 max-w-lg text-lg text-white/60"
              >
                Premium phones, accessories, and audio gear — all in one place. Free shipping on orders over $50.
              </motion.p>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
                className="mt-8 flex flex-wrap gap-3"
              >
                <Button
                  size="lg"
                  asChild
                  className="border-0 bg-[#D4693A] text-white shadow-lg shadow-[#D4693A]/30 hover:bg-[#c0582a]"
                >
                  <Link to="/products">Shop Now <ArrowRight className="size-4" /></Link>
                </Button>
                <Button size="lg" variant="outline" asChild className="border-0 bg-[#D4693A] text-white shadow-lg shadow-[#D4693A]/30 hover:bg-[#c0582a]">
                  <Link to="/products?featured=true">View Featured</Link>
                </Button>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.4, ease: [0.22, 1, 0.36, 1] }}
                className="mt-10 flex gap-8"
              >
                {[
                  { value: '50K+', label: 'Happy Customers' },
                  { value: '1,200+', label: 'Products' },
                  { value: '4.9★', label: 'Avg Rating' },
                ].map(({ value, label }) => (
                  <div key={label}>
                    <div className="text-2xl font-bold text-white">{value}</div>
                    <div className="text-xs text-white/50">{label}</div>
                  </div>
                ))}
              </motion.div>
            </div>

            {/* Right: Animated phone */}
            <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
              <div className="relative">
                {/* Pulsing rings */}
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={i}
                    className="absolute inset-0 rounded-[3rem] border border-[#D4693A]/20"
                    style={{ margin: `${-i * 18}px` }}
                    animate={{ opacity: [0.6, 0, 0.6], scale: [1, 1.05, 1] }}
                    transition={{ duration: 3, repeat: Infinity, delay: i * 0.8, ease: 'easeInOut' }}
                  />
                ))}

                {/* Core glow */}
                <div className="absolute inset-[-20px] rounded-[4rem] bg-[#D4693A]/20 blur-3xl" />

                {/* Phone entrance + float */}
                <motion.div
                  initial={{ opacity: 0, y: 80, scale: 0.75 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
                >
                  <motion.div
                    animate={{ y: [0, -18, 0], rotate: [-0.8, 0.8, -0.8] }}
                    transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                    className="relative"
                    style={{ width: 268, height: 572 }}
                  >
                    {/* Phone frame */}
                    <div
                      className="relative overflow-hidden border border-white/10 bg-[#111] shadow-2xl shadow-black/80"
                      style={{ width: 268, height: 572, borderRadius: '3.5rem' }}
                    >
                      {/* Screen bg */}
                      <div className="absolute inset-0 bg-gradient-to-b from-[#1a2535] via-[#151f2e] to-[#0f1821]" />

                      {/* Dynamic Island */}
                      <div className="absolute left-1/2 top-3 z-20 -translate-x-1/2">
                        <motion.div
                          className="h-[30px] rounded-full bg-black"
                          animate={{ width: [100, 120, 100] }}
                          transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
                        />
                      </div>

                      {/* Screen content */}
                      <div className="absolute inset-0 flex flex-col overflow-hidden px-3 pb-3 pt-14">
                        {/* Status bar */}
                        <div className="mb-3 flex justify-between px-1 text-[9px] text-white/60">
                          <span>9:41</span>
                          <div className="flex items-center gap-1">
                            <span>●●●●</span>
                            <span>WiFi</span>
                            <span>⚡</span>
                          </div>
                        </div>

                        {/* App header */}
                        <div className="mb-3 flex items-center justify-between">
                          <div>
                            <div className="text-[8px] text-white/40">Good morning</div>
                            <div className="text-[11px] font-bold text-white">aslitec Store ✦</div>
                          </div>
                          <div className="flex size-6 items-center justify-center rounded-full bg-[#D4693A]/80 text-[9px]">👤</div>
                        </div>

                        {/* Search bar */}
                        <div className="mb-3 flex items-center gap-1.5 rounded-xl border border-white/10 bg-white/[0.08] px-2 py-1.5">
                          <span className="text-[9px] text-white/30">🔍</span>
                          <span className="text-[9px] text-white/30">Search phones & accessories...</span>
                        </div>

                        {/* Featured banner */}
                        <div className="mb-3 rounded-2xl bg-gradient-to-r from-[#D4693A] to-[#a83c16] p-3">
                          <div className="text-[8px] font-medium text-white/70">FLASH SALE</div>
                          <div className="text-[12px] font-bold text-white">iPhone 16 Pro</div>
                          <div className="text-[9px] text-white/80">Starting at $999</div>
                          <div className="mt-1.5 inline-block rounded-full bg-white/20 px-2 py-0.5 text-[8px] text-white">Shop →</div>
                        </div>

                        {/* Category chips */}
                        <div className="mb-3 flex gap-1.5 overflow-hidden">
                          {['📱 Phones', '🎧 Audio', '🔌 Cables', '⌚ Watches'].map((c) => (
                            <div key={c} className="flex-shrink-0 rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[8px] text-white/70">{c}</div>
                          ))}
                        </div>

                        {/* Product grid */}
                        <div className="grid grid-cols-2 gap-1.5">
                          {[
                            { name: 'Galaxy S25', price: '$799', emoji: '📱', color: 'from-blue-900' },
                            { name: 'AirPods Pro', price: '$249', emoji: '🎧', color: 'from-gray-800' },
                            { name: 'Watch S10', price: '$399', emoji: '⌚', color: 'from-[#1C2838]' },
                            { name: 'Pixel 9 Pro', price: '$899', emoji: '📸', color: 'from-green-900' },
                          ].map(({ name, price, emoji, color }) => (
                            <div key={name} className={`rounded-xl border border-white/[0.08] bg-gradient-to-b ${color} to-black/50 p-2`}>
                              <div className="mb-1 text-center text-xl">{emoji}</div>
                              <div className="text-[8px] font-semibold leading-tight text-white">{name}</div>
                              <div className="text-[8px] text-[#f09060]">{price}</div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Home indicator */}
                      <div className="absolute bottom-2 left-1/2 h-1 w-20 -translate-x-1/2 rounded-full bg-white/30" />

                      {/* Glass reflection */}
                      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/5 via-transparent to-transparent" />
                    </div>

                    {/* Side buttons */}
                    <div className="absolute -right-[3px] top-28 h-8 w-[3px] rounded-r-sm bg-white/10" />
                    <div className="absolute -left-[3px] top-24 h-6 w-[3px] rounded-l-sm bg-white/10" />
                    <div className="absolute -left-[3px] top-32 h-10 w-[3px] rounded-l-sm bg-white/10" />
                    <div className="absolute -left-[3px] top-44 h-10 w-[3px] rounded-l-sm bg-white/10" />
                  </motion.div>
                </motion.div>

                {/* Floating badges */}
                <motion.div
                  className="absolute -left-16 top-12 flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 shadow-xl backdrop-blur-md"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  <span className="text-base">🔥</span>
                  <div>
                    <div className="text-[10px] font-semibold leading-none text-white">New Arrival</div>
                    <div className="text-[9px] text-white/50">iPhone 16 Pro Max</div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -right-14 top-32 flex items-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-2 shadow-xl backdrop-blur-md"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.4, duration: 0.5 }}
                >
                  <span className="text-base">🛒</span>
                  <div>
                    <div className="text-[10px] font-semibold leading-none text-white">Added to Cart</div>
                    <div className="text-[9px] text-white/50">Galaxy S25 Ultra</div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -left-12 top-1/2 flex items-center gap-1.5 rounded-2xl border border-amber-400/25 bg-amber-500/20 px-3 py-2 shadow-xl backdrop-blur-md"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.6, duration: 0.5 }}
                >
                  <span className="text-sm">⭐</span>
                  <div>
                    <div className="text-[10px] font-semibold leading-none text-amber-200">4.9 / 5.0</div>
                    <div className="text-[9px] text-white/50">50K reviews</div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -right-12 bottom-32 flex items-center gap-2 rounded-2xl border border-emerald-400/25 bg-emerald-500/15 px-3 py-2 shadow-xl backdrop-blur-md"
                  initial={{ opacity: 0, x: 30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.8, duration: 0.5 }}
                >
                  <span className="text-sm">🚚</span>
                  <div>
                    <div className="text-[10px] font-semibold leading-none text-emerald-200">Free Shipping</div>
                    <div className="text-[9px] text-white/50">Orders over $50</div>
                  </div>
                </motion.div>

                <motion.div
                  className="absolute -left-10 bottom-16 flex items-center gap-2 rounded-2xl border border-rose-400/25 bg-rose-500/15 px-3 py-2 shadow-xl backdrop-blur-md"
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 2.0, duration: 0.5 }}
                >
                  <span className="text-sm">⚡</span>
                  <div>
                    <div className="text-[10px] font-semibold leading-none text-rose-200">-30% Flash Sale</div>
                    <div className="text-[9px] text-white/50">Today only</div>
                  </div>
                </motion.div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* Features */}
      <section className="border-b bg-card">
        <div className="container py-8">
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {FEATURES.map(({ icon: Icon, label, desc }, i) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-center gap-3 p-3"
              >
                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="size-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-semibold">{label}</p>
                  <p className="text-xs text-muted-foreground">{desc}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container py-12">
          <SectionTitle title="Shop by Category" href="/products" />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-8">
            {categories.map((cat, i) => (
              <motion.div
                key={cat.id}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
              >
                <Link
                  to={`/categories/${cat.slug}`}
                  className="group flex flex-col items-center gap-2 rounded-xl border bg-card p-3 text-center transition-all duration-200 hover:-translate-y-1 hover:border-primary hover:shadow-md"
                >
                  <div className="flex size-12 items-center justify-center overflow-hidden rounded-full bg-muted">
                    {cat.image ? (
                      <img src={cat.image} alt={cat.name} className="size-full object-cover" />
                    ) : (
                      <span className="text-2xl">🛍️</span>
                    )}
                  </div>
                  <span className="text-xs font-medium leading-tight group-hover:text-primary">
                    {cat.name}
                  </span>
                </Link>
              </motion.div>
            ))}
          </div>
        </section>
      )}

      {/* Featured */}
      {(featured.length > 0 || featuredLoading) && (
        <section className="container py-12">
          <SectionTitle
            title="Featured Products"
            subtitle="Handpicked selections just for you"
            href="/products?featured=true"
          />
          <ProductGrid products={featured} isLoading={featuredLoading} columns={4} />
        </section>
      )}

      {/* Promo banner */}
      <section className="container py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-brand-600 to-brand-400 p-8 text-white md:p-12"
        >
          <div className="absolute inset-0 bg-noise opacity-20" />
          <div className="relative z-10 flex flex-col items-start gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="text-sm font-medium text-white/70">Limited Time Offer</div>
              <h2 className="mt-1 text-3xl font-bold">Up to 50% off</h2>
              <p className="mt-1 text-white/80">On selected categories. Use code SAVE50 at checkout.</p>
            </div>
            <Button size="lg" variant="secondary" asChild className="shrink-0 shadow-xl">
              <Link to="/products?sale=true">Shop the Sale →</Link>
            </Button>
          </div>
        </motion.div>
      </section>

      {/* New Arrivals */}
      {(newArrivals.length > 0 || newArrivalsLoading) && (
        <section className="container py-12">
          <SectionTitle
            title="New Arrivals"
            subtitle="Fresh products added this week"
            href="/products?sort=newest"
          />
          <ProductGrid products={newArrivals} isLoading={newArrivalsLoading} columns={4} />
        </section>
      )}

      {/* Bestsellers */}
      {(bestsellers.length > 0 || bestsellersLoading) && (
        <section className="container py-12">
          <SectionTitle
            title="Best Sellers"
            subtitle="Our most popular products"
            href="/products?sort=bestselling"
          />
          <ProductGrid products={bestsellers} isLoading={bestsellersLoading} columns={4} />
        </section>
      )}
    </div>
  )
}
