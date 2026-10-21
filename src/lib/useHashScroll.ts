import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Scroll to the element named in the URL hash (e.g. from the navbar menu)
// once the page content is ready. `offset` clears the fixed header bars.
export function useHashScroll(ready: boolean, offset = 130) {
  const { hash } = useLocation()

  useEffect(() => {
    if (!ready || !hash) return
    const t = setTimeout(() => {
      const el = document.getElementById(decodeURIComponent(hash.slice(1)))
      if (el) window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - offset, behavior: 'smooth' })
    }, 120)
    return () => clearTimeout(t)
  }, [ready, hash, offset])
}
