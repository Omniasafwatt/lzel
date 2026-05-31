import { motion } from 'framer-motion'
import { Shield, Truck, Star, Users } from 'lucide-react'

const STATS = [
  { label: 'Happy Customers', value: '1M+', icon: Users },
  { label: 'Products', value: '50K+', icon: Star },
  { label: 'Countries', value: '40+', icon: Truck },
  { label: 'Years of Service', value: '10+', icon: Shield },
]

export default function AboutPage() {
  return (
    <div className="animate-fade-in">
      <section className="bg-gradient-to-br from-brand-700 to-brand-500 py-20 text-white text-center">
        <h1 className="text-4xl font-bold">About Lzel</h1>
        <p className="mt-4 text-xl text-white/80 max-w-xl mx-auto">Premium e-commerce platform delivering exceptional products and experiences worldwide since 2014.</p>
      </section>
      <section className="container py-16">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 text-center">
          {STATS.map(({ label, value, icon: Icon }, i) => (
            <motion.div key={label} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
              <div className="flex size-14 mx-auto items-center justify-center rounded-2xl bg-primary/10 mb-3"><Icon className="size-7 text-primary" /></div>
              <p className="text-3xl font-bold text-gradient">{value}</p>
              <p className="text-sm text-muted-foreground mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  )
}
