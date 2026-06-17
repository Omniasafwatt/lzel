import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, X, Clock, TrendingUp, ArrowRight } from 'lucide-react'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setQuery, addToHistory } from '@/features/search/store/searchSlice'
import { setSearchOpen } from '@/features/ui/store/uiSlice'
import { useSearchSuggestionsQuery } from '@/data/useMockData'
import { debounce } from '@/lib/utils'

export default function SearchModal() {
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const open = useAppSelector((s) => s.ui.searchOpen)
  const history = useAppSelector((s) => s.search.history)
  const inputRef = useRef<HTMLInputElement>(null)
  const [input, setInput] = useState('')
  const [debouncedInput, setDebouncedInput] = useState('')

  const { data: suggestionsData } = useSearchSuggestionsQuery(debouncedInput, {
    skip: debouncedInput.length < 2,
  })
  const suggestions = suggestionsData?.data?.suggestions ?? []

  const debouncedUpdate = debounce((val: string) => setDebouncedInput(val), 300)

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

  const handleSearch = (q: string) => {
    if (!q.trim()) return
    dispatch(addToHistory(q))
    dispatch(setQuery(q))
    dispatch(setSearchOpen(false))
    navigate(`/search?q=${encodeURIComponent(q)}`)
  }

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm"
            onClick={() => dispatch(setSearchOpen(false))}
          />
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ type: 'spring', damping: 30, stiffness: 400 }}
            className="fixed inset-x-0 top-0 z-50 mx-auto max-w-2xl px-4 pt-4"
          >
            <div className="overflow-hidden rounded-2xl border bg-background shadow-2xl">
              {/* Input */}
              <div className="flex items-center gap-3 border-b px-4 py-3">
                <Search className="size-5 shrink-0 text-muted-foreground" />
                <input
                  ref={inputRef}
                  value={input}
                  onChange={(e) => { setInput(e.target.value); debouncedUpdate(e.target.value) }}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch(input)}
                  placeholder="Search products, categories…"
                  className="flex-1 bg-transparent text-base outline-none placeholder:text-muted-foreground"
                />
                {input && (
                  <button onClick={() => { setInput(''); inputRef.current?.focus() }}>
                    <X className="size-4 text-muted-foreground" />
                  </button>
                )}
                <button
                  className="text-xs text-muted-foreground hidden sm:block border rounded px-2 py-0.5"
                  onClick={() => dispatch(setSearchOpen(false))}
                >
                  ESC
                </button>
              </div>

              {/* Results */}
              <div className="max-h-[60vh] overflow-y-auto p-3">
                {/* Suggestions */}
                {debouncedInput.length >= 2 && suggestions.length > 0 && (
                  <div className="mb-3">
                    <p className="mb-1.5 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Suggestions
                    </p>
                    {suggestions.map((s: string) => (
                      <button
                        key={s}
                        onClick={() => handleSearch(s)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent transition-colors"
                      >
                        <Search className="size-3.5 text-muted-foreground" />
                        <span dangerouslySetInnerHTML={{
                          __html: s.replace(
                            new RegExp(debouncedInput, 'gi'),
                            (m: string) => `<strong>${m}</strong>`
                          )
                        }} />
                        <ArrowRight className="ml-auto size-3.5 text-muted-foreground" />
                      </button>
                    ))}
                  </div>
                )}

                {/* History */}
                {!debouncedInput && history.length > 0 && (
                  <div className="mb-3">
                    <div className="mb-1.5 flex items-center justify-between px-2">
                      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Recent</p>
                      <button
                        className="text-xs text-muted-foreground hover:text-foreground"
                        onClick={() => { /* clearHistory */ }}
                      >
                        Clear
                      </button>
                    </div>
                    {history.slice(0, 5).map((h) => (
                      <button
                        key={h}
                        onClick={() => handleSearch(h)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent transition-colors"
                      >
                        <Clock className="size-3.5 text-muted-foreground" />
                        {h}
                      </button>
                    ))}
                  </div>
                )}

                {/* Trending */}
                {!debouncedInput && (
                  <div>
                    <p className="mb-1.5 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                      Trending
                    </p>
                    {['Wireless Headphones', 'Smartphones', 'Smart Watch', 'Laptops'].map((t) => (
                      <button
                        key={t}
                        onClick={() => handleSearch(t)}
                        className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm hover:bg-accent transition-colors"
                      >
                        <TrendingUp className="size-3.5 text-primary" />
                        {t}
                      </button>
                    ))}
                  </div>
                )}

                {/* Empty state */}
                {debouncedInput.length >= 2 && suggestions.length === 0 && (
                  <div className="py-8 text-center text-muted-foreground">
                    <p className="text-sm">No suggestions found for "<strong>{debouncedInput}</strong>"</p>
                    <button
                      onClick={() => handleSearch(debouncedInput)}
                      className="mt-2 text-sm text-primary hover:underline"
                    >
                      Search anyway →
                    </button>
                  </div>
                )}
              </div>

              {/* Footer */}
              {input && (
                <div className="border-t px-4 py-3">
                  <button
                    onClick={() => handleSearch(input)}
                    className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary/10 px-4 py-2.5 text-sm font-medium text-primary hover:bg-primary/20 transition-colors"
                  >
                    <Search className="size-4" />
                    Search for "{input}"
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
