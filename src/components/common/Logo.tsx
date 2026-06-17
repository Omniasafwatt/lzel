import { cn } from '@/lib/utils'
import logoImg from '../../assets/logo.png'
import sidebarLogoImg from '../../assets/sidebar logo.png'

// ─── Size → height in px ─────────────────────────────────────────────────────
const SIZES = {
  sm : 32,
  md : 40,
  lg : 48,
  xl : 60,
} as const

interface LogoProps {
  size?     : keyof typeof SIZES
  className?: string
}

/** Full logo image — navbar, footer, auth, etc. */
export function Logo({ size = 'md', className }: LogoProps) {
  return (
    <img
      src={logoImg}
      alt="aslitec"
      draggable={false}
      style={{ height: SIZES[size], width: 'auto', display: 'block' }}
      className={cn('object-contain shrink-0 rounded-lg', className)}
    />
  )
}

/** Logo for dark / gradient backgrounds */
export function LogoWhite({ size = 'md', className }: LogoProps) {
  return (
    <img
      src={logoImg}
      alt="aslitec"
      draggable={false}
      style={{ height: SIZES[size], width: 'auto', display: 'block' }}
      className={cn('object-contain shrink-0 rounded-lg', className)}
    />
  )
}

/** Icon-only mark — for collapsed admin sidebar */
export function LogoMark({
  size      = 36,
  className,
}: {
  size?     : number
  className?: string
}) {
  return (
    <img
      src={sidebarLogoImg}
      alt="aslitec"
      draggable={false}
      style={{ width: size, height: size, display: 'block' }}
      className={cn('object-contain shrink-0', className)}
    />
  )
}
