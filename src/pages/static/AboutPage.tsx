import { motion } from 'framer-motion'
import { Shield, Cpu, Smartphone, Users } from 'lucide-react'

const STATS = [
  { label: 'Satisfied Customers', value: '1M+',  icon: Users      },
  { label: 'Devices Sold',        value: '5M+',  icon: Smartphone },
  { label: 'Countries Shipped',   value: '40+',  icon: Shield     },
  { label: 'Years of Innovation', value: '10+',  icon: Cpu        },
]

const VALUES = [
  {
    title: 'Innovation First',
    body:  'We design every product from the ground up — pushing the boundaries of what technology can do for everyday life.',
  },
  {
    title: 'Built to Last',
    body:  'Premium materials, rigorous quality control, and a two-year warranty on every device we make.',
  },
  {
    title: 'Global Service',
    body:  'Official service centers in 40+ countries, with same-day support for all aslitec products.',
  },
]

export default function AboutPage() {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="py-20 text-white text-center"
        style={{ background: 'linear-gradient(135deg, #2D3A4A 0%, #1e2d3d 60%, #182436 100%)' }}>
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-4xl font-bold">About aslitec</h1>
          <p className="mt-4 text-xl max-w-xl mx-auto" style={{ color: 'rgba(255,255,255,0.75)' }}>
            We are a technology company that designs, engineers, and manufactures premium devices — from smartphones and laptops to audio gear and wearables.
          </p>
        </motion.div>
      </section>

      {/* Stats */}
      <section className="container py-16">
        <div className="grid grid-cols-2 gap-6 sm:grid-cols-4 text-center">
          {STATS.map(({ label, value, icon: Icon }, i) => (
            <motion.div
              key={label}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <div className="flex size-14 mx-auto items-center justify-center rounded-2xl bg-primary/10 mb-3">
                <Icon className="size-7 text-primary" />
              </div>
              <p className="text-3xl font-bold text-gradient">{value}</p>
              <p className="text-sm text-muted-foreground mt-1">{label}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Values */}
      <section className="border-t">
        <div className="container py-16">
          <h2 className="text-2xl font-bold text-center mb-10">What drives us</h2>
          <div className="grid gap-8 sm:grid-cols-3">
            {VALUES.map(({ title, body }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="rounded-2xl border p-6"
              >
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-sm text-muted-foreground leading-relaxed">{body}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  )
}
