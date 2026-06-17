import { useState } from 'react'
import { ChevronDown } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { cn } from '@/lib/utils'

const FAQS = [
  { q: 'How long does shipping take?', a: 'Standard shipping: 5-7 business days. Express: 1-2 business days. Free standard shipping on orders over $50.' },
  { q: 'What is your return policy?', a: 'We offer 30-day hassle-free returns. Items must be in original condition and packaging.' },
  { q: 'How do I track my order?', a: 'Once shipped, you\'ll receive a tracking number via email. You can also track via your account orders page.' },
  { q: 'What payment methods do you accept?', a: 'We accept Visa, Mastercard, Amex, PayPal, Apple Pay, Google Pay, and bank transfers.' },
  { q: 'Can I change or cancel my order?', a: 'Orders can be modified or cancelled within 1 hour of placing. After that, we may not be able to make changes.' },
  { q: 'How do I contact customer support?', a: 'Email us at support@aslitec.com, call +1 (800) 123-4567, or use live chat. Available 24/7.' },
]

export default function FaqPage() {
  const [open, setOpen] = useState<number | null>(null)
  return (
    <div className="container max-w-2xl py-12 animate-fade-in">
      <h1 className="mb-8 text-3xl font-bold text-center">Frequently Asked Questions</h1>
      <div className="space-y-2">
        {FAQS.map((faq, i) => (
          <div key={i} className="rounded-xl border overflow-hidden">
            <button className="flex w-full items-center justify-between p-4 text-left font-medium hover:bg-accent transition-colors" onClick={() => setOpen(open === i ? null : i)}>
              {faq.q}
              <ChevronDown className={cn('size-4 shrink-0 transition-transform', open === i && 'rotate-180')} />
            </button>
            <AnimatePresence>
              {open === i && (
                <motion.div initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }} className="overflow-hidden">
                  <p className="border-t px-4 py-3 text-sm text-muted-foreground">{faq.a}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  )
}
