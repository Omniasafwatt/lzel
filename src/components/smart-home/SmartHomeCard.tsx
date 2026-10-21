import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { getSmartHomeSection, subtitleOf, chipsOf, modelOf } from '@/data/products/smartHomeLayout'
import type { Product } from '@/types'

// EZVIZ-style product card in the aslitec palette
export default function SmartHomeCard({ product, index = 0 }: { product: Product; index?: number }) {
  const img = product.images[0]?.url
  const section = getSmartHomeSection(product)
  const tag = chipsOf(product)[0]
  const title = modelOf(product) ?? product.name

  return (
    <motion.div
      className="h-full"
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-40px' }}
      transition={{ duration: 0.7, delay: (index % 4) * 0.05, ease: [0.16, 1, 0.3, 1] }}
    >
      <Link
        to={`/products/${product.slug}`}
        className="group flex flex-col h-full bg-white px-4 pt-6 pb-6 text-center transition-shadow duration-300 hover:shadow-[0_10px_30px_rgba(45,52,68,0.12)]"
      >
        <div className="relative aspect-square">
          {img && (
            <img
              src={img}
              alt={product.name}
              className="size-full object-contain transition-transform duration-500 group-hover:scale-105"
              loading="lazy"
              decoding="async"
            />
          )}
        </div>
        <div className="h-7 mt-3 flex items-center justify-center">
          {tag && (
            <span className="max-w-full truncate rounded-full border border-[#D4693A] px-2.5 py-0.5 text-[11px] text-[#D4693A]">
              {tag}
            </span>
          )}
        </div>
        <h3 className="mt-2 text-xl md:text-2xl font-semibold text-[#2d3444] truncate" title={product.name}>
          {title}
        </h3>
        <p className="mt-1.5 text-sm text-[#777] truncate">
          {section ? subtitleOf(product, section) : product.shortDescription}
        </p>
        <span className="mt-5 mx-auto inline-flex items-center justify-center rounded-full bg-[#D4693A] px-7 py-2 text-sm font-semibold text-white transition-colors group-hover:bg-[#2d3444]">
          More
        </span>
      </Link>
    </motion.div>
  )
}
