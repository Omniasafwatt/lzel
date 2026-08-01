import { useEffect, useRef, useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, ArrowRight } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setSearchOpen } from '@/features/ui/store/uiSlice'
import { useGetProductsQuery } from '@/data/useMockData'
import { debounce } from '@/lib/utils'

export default function SearchModal() {
  const dispatch = useAppDispatch()
  const open = useAppSelector((s) => s.ui.searchOpen)
  const inputRef = useRef<HTMLInputElement>(null)
  const [input, setInput] = useState('')
  const [debouncedInput, setDebouncedInput] = useState('')

  const debouncedUpdate = useMemo(
    () => debounce((val: string) => setDebouncedInput(val), 300),
    []
  )

  useEffect(() => {
    if (open) setTimeout(() => inputRef.current?.focus(), 100)
    else { setInput(''); setDebouncedInput('') }
  }, [open])

  useEffect(() => {
    if (!open) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') dispatch(setSearchOpen(false))
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open, dispatch])

  const { data } = useGetProductsQuery({ query: debouncedInput, limit: 6 })
  const results = debouncedInput.length >= 2 ? (data?.data ?? []) : []

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-[#2d3444]/50 backdrop-blur-sm"
            onClick={() => dispatch(setSearchOpen(false))}
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="fixed inset-x-0 top-0 z-50 mx-auto max-w-2xl px-4 pt-4"
          >
            <div className="overflow-hidden rounded-2xl border border-[#E8E4DF] bg-white shadow-2xl">

              {/* Input */}
              <div className="flex items-center gap-3 border-b border-[#E8E4DF] px-4 py-3.5">
                <Search className="size-5 shrink-0 text-[#999]" />
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => { setInput(e.target.value); debouncedUpdate(e.target.value) }}
                  placeholder="Search products, categories..."
                  className="flex-1 bg-transparent text-base text-[#2d3444] outline-none placeholder:text-[#bbb]"
                />
                {input && (
                  <button onClick={() => { setInput(''); setDebouncedInput(''); inputRef.current?.focus() }}>
                    <X className="size-4 text-[#bbb] hover:text-[#2d3444] transition-colors" />
                  </button>
                )}
                <button
                  className="text-xs text-[#bbb] hidden sm:block border border-[#E8E4DF] rounded px-2 py-0.5"
                  onClick={() => dispatch(setSearchOpen(false))}
                >ESC</button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto">
                {results.length > 0 ? (
                  <div className="p-3">
                    <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-[#bbb]">
                      Results
                    </p>
                    {results.map((p) => (
                      <Link
                        key={p.id}
                        to={`/products/${p.slug}`}
                        onClick={() => dispatch(setSearchOpen(false))}
                        className="flex items-center gap-3 rounded-xl px-3 py-2.5 hover:bg-[#F7F3EE] transition-colors group"
                      >
                        {p.images[0]?.url && (
                          <img
                            src={p.images[0].url}
                            alt={p.name}
                            className="size-12 rounded-lg object-contain bg-[#F7F3EE] p-1 shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[10px] font-bold uppercase tracking-widest text-[#D4693A] mb-0.5">
                            {p.category.name}
                          </p>
                          <p className="text-sm font-medium text-[#2d3444] truncate">{p.name}</p>
                        </div>
                        <ArrowRight className="size-4 text-[#bbb] group-hover:text-[#D4693A] transition-colors shrink-0" />
                      </Link>
                    ))}
                  </div>
                ) : debouncedInput.length >= 2 ? (
                  <div className="py-10 text-center text-[#bbb]">
                    <p className="text-sm">No products found for "<strong className="text-[#2d3444]">{debouncedInput}</strong>"</p>
                  </div>
                ) : (
                  <div className="p-4">
                    <p className="mb-2 px-2 text-[10px] font-bold uppercase tracking-widest text-[#bbb]">Browse Categories</p>
                    <div className="flex flex-wrap gap-2 px-2">
                      {[
                        { label: 'Gaming', href: '/categories/gaming' },
                        { label: 'Accessories', href: '/categories/accessories' },
                        { label: 'Appliances', href: '/categories/appliances' },
                        { label: 'Smart Home', href: '/categories/smart-home' },
                      ].map((c) => (
                        <Link
                          key={c.href}
                          to={c.href}
                          onClick={() => dispatch(setSearchOpen(false))}
                          className="rounded-full border border-[#E8E4DF] px-4 py-1.5 text-xs font-semibold text-[#2d3444] hover:border-[#D4693A] hover:text-[#D4693A] transition-colors"
                        >{c.label}</Link>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
