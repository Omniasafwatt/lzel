import { Link } from 'react-router-dom'
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

const FOOTER_LINKS = {
  Shop: [
    { label: 'New Arrivals', href: '/products?sort=newest' },
    { label: 'Best Sellers', href: '/products?sort=bestselling' },
    { label: 'Sale', href: '/products?sale=true' },
    { label: 'All Products', href: '/products' },
    { label: 'Brands', href: '/brands' },
  ],
  Account: [
    { label: 'My Account', href: '/account' },
    { label: 'Orders', href: '/account/orders' },
    { label: 'Wishlist', href: '/account/wishlist' },
    { label: 'Track Order', href: '/track' },
    { label: 'Returns', href: '/support' },
  ],
  Support: [
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Live Chat', href: '/support' },
    { label: 'Shipping Info', href: '/faq#shipping' },
    { label: 'Return Policy', href: '/faq#returns' },
  ],
  Company: [
    { label: 'About Us', href: '/about' },
    { label: 'Blog', href: '/blog' },
    { label: 'Careers', href: '/careers' },
    { label: 'Privacy Policy', href: '/privacy' },
    { label: 'Terms of Service', href: '/terms' },
  ],
}

const SOCIAL = [
  { icon: Facebook, href: '#', label: 'Facebook' },
  { icon: Twitter, href: '#', label: 'Twitter' },
  { icon: Instagram, href: '#', label: 'Instagram' },
  { icon: Youtube, href: '#', label: 'YouTube' },
]

export default function Footer() {
  return (
    <footer className="border-t bg-muted/30">
      <div className="container py-12 md:py-16">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-6">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-2">
            <Link to="/" className="font-display text-2xl font-bold text-gradient">
              Lzel
            </Link>
            <p className="mt-3 text-sm text-muted-foreground leading-relaxed">
              Premium e-commerce platform delivering exceptional products and experiences worldwide.
            </p>
            <div className="mt-4 space-y-2 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Mail className="size-4 shrink-0" />
                <span>support@lzel.com</span>
              </div>
              <div className="flex items-center gap-2">
                <Phone className="size-4 shrink-0" />
                <span>+1 (800) 123-4567</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="size-4 shrink-0" />
                <span>123 Commerce St, NY 10001</span>
              </div>
            </div>
            {/* Social */}
            <div className="mt-5 flex gap-2">
              {SOCIAL.map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={label}
                  className="flex size-9 items-center justify-center rounded-lg border bg-background text-muted-foreground hover:bg-primary hover:text-primary-foreground hover:border-primary transition-all duration-200"
                >
                  <Icon className="size-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-3 text-sm font-semibold">{title}</h4>
              <ul className="space-y-2">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link
                      to={l.href}
                      className="text-sm text-muted-foreground hover:text-foreground transition-colors"
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-10 rounded-2xl bg-primary/10 p-6 dark:bg-primary/5">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h3 className="font-semibold">Subscribe to our newsletter</h3>
              <p className="mt-0.5 text-sm text-muted-foreground">
                Get exclusive deals, new arrivals, and style tips.
              </p>
            </div>
            <form
              className="flex w-full max-w-sm gap-2"
              onSubmit={(e) => e.preventDefault()}
            >
              <Input type="email" placeholder="Enter your email" className="bg-background" />
              <Button type="submit" size="sm" className="shrink-0">
                Subscribe
              </Button>
            </form>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-8 flex flex-col items-center justify-between gap-3 border-t pt-6 text-sm text-muted-foreground sm:flex-row">
          <p>© {new Date().getFullYear()} Lzel. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <Link to="/privacy" className="hover:text-foreground transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-foreground transition-colors">Terms</Link>
            <Link to="/sitemap" className="hover:text-foreground transition-colors">Sitemap</Link>
          </div>
          {/* Payment icons */}
          <div className="flex items-center gap-2 text-xs">
            <span className="rounded border px-2 py-1 font-mono font-semibold">VISA</span>
            <span className="rounded border px-2 py-1 font-mono font-semibold">MC</span>
            <span className="rounded border px-2 py-1 font-semibold">PayPal</span>
            <span className="rounded border px-2 py-1 font-semibold">Stripe</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
