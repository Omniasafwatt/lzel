import { Link } from 'react-router-dom'
import { Instagram, Twitter, Youtube } from 'lucide-react'

const LINKS = {
  Products: [
    { label: 'Gaming',           href: '/categories/gaming' },
    { label: 'Accessories',      href: '/categories/accessories' },
    { label: 'Appliances',       href: '/categories/appliances' },
    { label: 'Smart Home',       href: '/categories/smart-home' },
  ],
  Company: [
    { label: 'About Us',         href: '/about' },
    { label: 'Contact',          href: '/contact' },
    { label: 'Privacy Policy',   href: '/privacy' },
    { label: 'Terms',            href: '/terms' },
  ],
  Support: [
    { label: 'FAQ',              href: '/faq' },
    { label: 'Track Order',      href: '/track-order' },
    { label: 'Returns',          href: '/support' },
    { label: 'Warranty',         href: '/faq#warranty' },
  ],
}

export default function Footer() {
  return (
    <footer className="bg-[#2d3444] text-white">
      <div className="container pt-16 pb-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 pb-12 border-b border-white/[0.07]">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="inline-block text-xl font-black tracking-tight text-white mb-4">
              aslitec
            </Link>
            <p className="text-sm text-white/35 leading-relaxed mb-6 max-w-xs">
              Premium tech accessories for gamers, creators, and everyday explorers.
            </p>
            <div className="flex gap-3">
              {([Instagram, Twitter, Youtube] as const).map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex size-9 items-center justify-center rounded-full border border-white/10 text-white/35 hover:text-white hover:border-[#D4693A]/50 hover:bg-[#D4693A]/10 transition-all duration-200"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          {Object.entries(LINKS).map(([title, links]) => (
            <div key={title}>
              <p className="text-xs font-bold uppercase tracking-widest text-white/25 mb-5">{title}</p>
              <ul className="space-y-3">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link to={l.href} className="text-sm text-white/45 hover:text-white transition-colors">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/20">© {new Date().getFullYear()} Aslitec. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}
