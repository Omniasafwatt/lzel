import { useEffect } from 'react'
import Lenis from 'lenis'
import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

interface SmoothScrollProviderProps {
  children: React.ReactNode
}

export function SmoothScrollProvider({ children }: SmoothScrollProviderProps) {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    lenis.on('scroll', ScrollTrigger.update)

    gsap.ticker.add((time) => {
      lenis.raf(time * 1000)
    })

    gsap.ticker.lagSmoothing(0)

    // Pinned sections (hero, banners, horizontal rack) measure their scroll
    // positions once. When the page height changes later (images or data
    // loading, sections mounting) those positions go stale and pins overlap
    // the sections around them, so re-sort and refresh after any resize.
    let timer: ReturnType<typeof setTimeout>
    const refresh = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        ScrollTrigger.sort()
        ScrollTrigger.refresh()
      }, 150)
    }
    const observer = new ResizeObserver(refresh)
    observer.observe(document.body)
    window.addEventListener('load', refresh)

    return () => {
      clearTimeout(timer)
      observer.disconnect()
      window.removeEventListener('load', refresh)
      lenis.destroy()
    }
  }, [])

  return <>{children}</>
}
