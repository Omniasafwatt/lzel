import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ShoppingBag, ChevronDown, ExternalLink } from 'lucide-react'

// Retail partners that sell aslitec products; "Buy Now" sends shoppers to either store.
export const STORES = [
  { name: 'Mobile 2000', url: 'https://mobile2000.com/ar' },
  { name: 'Xmart Mobiles', url: 'https://xmartmobiles.com/' },
] as const

export default function BuyNowButton({ size = 'lg', up = false, className = '' }: { size?: 'sm' | 'lg'; up?: boolean; className?: string }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    const close = (e: MouseEvent | KeyboardEvent) => {
      if (e instanceof KeyboardEvent ? e.key === 'Escape' : !ref.current?.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', close)
    document.addEventListener('keydown', close)
    return () => {
      document.removeEventListener('mousedown', close)
      document.removeEventListener('keydown', close)
    }
  }, [open])

  return (
    <div ref={ref} className={`relative inline-block ${className}`}>
      <button
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="menu"
        aria-expanded={open}
        className={`inline-flex items-center gap-2 rounded-full bg-[#D4693A] font-semibold text-white hover:bg-[#bf5a2f] transition-colors ${
          size === 'lg' ? 'px-7 py-3 text-sm' : 'px-4 py-1.5 text-xs'
        }`}
      >
        <ShoppingBag className={size === 'lg' ? 'size-4' : 'size-3.5'} />
        Buy Now
        <ChevronDown className={`${size === 'lg' ? 'size-4' : 'size-3.5'} transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            role="menu"
            initial={{ opacity: 0, y: up ? 6 : -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: up ? 6 : -6 }}
            transition={{ duration: 0.15 }}
            className={`absolute ${up ? 'bottom-full mb-2' : 'top-full mt-2'} ${size === 'lg' ? 'left-0' : 'right-0'} z-50 w-56 overflow-hidden rounded-2xl border border-[#E8E4DF] bg-white p-1.5 shadow-[0_12px_40px_rgba(45,52,68,0.18)]`}
          >
            <p className="px-3 pt-2 pb-1 text-[10px] font-bold uppercase tracking-widest text-[#999]">Buy from</p>
            {STORES.map((store) => (
              <a
                key={store.name}
                role="menuitem"
                href={store.url}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold text-[#2d3444] hover:bg-[#F7F3EE] hover:text-[#D4693A] transition-colors"
              >
                {store.name}
                <ExternalLink className="size-3.5 opacity-60" />
              </a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
