import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import sidebarLogo from '../../assets/sidebar logo.webp'

interface LoadingScreenProps {
  onComplete: () => void
}

export default function LoadingScreen({ onComplete }: LoadingScreenProps) {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    let current = 0
    const interval = setInterval(() => {
      const increment = Math.random() * 12 + 3
      current = Math.min(100, current + increment)
      setProgress(Math.floor(current))
      if (current >= 100) {
        clearInterval(interval)
        setTimeout(onComplete, 200)
      }
    }, 60)
    return () => clearInterval(interval)
  }, [onComplete])

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-[#FAFAF8]">
      <motion.img
        src={sidebarLogo}
        alt="Aslitec"
        className="w-36 object-contain mb-10"
        initial={{ scale: 0.85, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      />

      <div className="mb-4 text-4xl font-black text-[#2d3444] tabular-nums">
        {progress}
        <span className="text-[#D4693A]">%</span>
      </div>

      <div className="w-48 h-[3px] rounded-full bg-[#E8E4DF] overflow-hidden mb-4">
        <motion.div
          className="h-full rounded-full bg-[#D4693A]"
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.05, ease: 'linear' }}
        />
      </div>

      <p className="font-mono text-xs text-[#AAA] tracking-[0.3em] uppercase">Loading</p>
    </div>
  )
}
