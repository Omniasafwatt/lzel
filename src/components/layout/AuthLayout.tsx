import { Outlet, Link } from 'react-router-dom'
import { motion } from 'framer-motion'

export default function AuthLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Left — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700">
        <div className="absolute inset-0 bg-noise opacity-20" />
        {/* Floating shapes */}
        <motion.div
          className="absolute -top-20 -left-20 size-96 rounded-full bg-white/10"
          animate={{ y: [0, 30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
        />
        <motion.div
          className="absolute bottom-20 right-10 size-64 rounded-full bg-white/5"
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        />
        <div className="relative z-10 flex flex-col justify-center p-12 text-white">
          <Link to="/" className="font-display text-3xl font-bold">
            Lzel
          </Link>
          <h1 className="mt-12 text-4xl font-bold leading-tight">
            Shop smarter.<br />Live better.
          </h1>
          <p className="mt-4 text-lg text-white/80">
            Discover thousands of premium products with fast delivery and exceptional service.
          </p>
          <div className="mt-10 space-y-4">
            {[
              { icon: '🚀', text: 'Free shipping on orders over $50' },
              { icon: '🔒', text: 'Secure & encrypted payments' },
              { icon: '↩️', text: '30-day hassle-free returns' },
              { icon: '⭐', text: 'Over 1M+ satisfied customers' },
            ].map(({ icon, text }) => (
              <div key={text} className="flex items-center gap-3 text-sm text-white/90">
                <span className="text-xl">{icon}</span>
                <span>{text}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — form */}
      <div className="flex flex-1 flex-col items-center justify-center p-6 sm:p-12">
        <div className="mb-6 lg:hidden">
          <Link to="/" className="font-display text-2xl font-bold text-gradient">
            Lzel
          </Link>
        </div>
        <div className="w-full max-w-md">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4 }}
          >
            <Outlet />
          </motion.div>
        </div>
      </div>
    </div>
  )
}
