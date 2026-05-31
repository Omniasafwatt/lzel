import { useState } from 'react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Mail, Phone, MapPin } from 'lucide-react'

export default function ContactPage() {
  const [loading, setLoading] = useState(false)
  return (
    <div className="container max-w-3xl py-12 animate-fade-in">
      <h1 className="text-3xl font-bold mb-8 text-center">Contact Us</h1>
      <div className="grid gap-8 md:grid-cols-2">
        <div className="space-y-6">
          {[{ icon: Mail, label: 'Email', val: 'support@lzel.com' }, { icon: Phone, label: 'Phone', val: '+1 (800) 123-4567' }, { icon: MapPin, label: 'Address', val: '123 Commerce St, NY 10001' }].map(({ icon: Icon, label, val }) => (
            <div key={label} className="flex gap-3"><div className="flex size-10 items-center justify-center rounded-xl bg-primary/10"><Icon className="size-5 text-primary" /></div><div><p className="text-sm text-muted-foreground">{label}</p><p className="font-medium">{val}</p></div></div>
          ))}
        </div>
        <form className="space-y-4" onSubmit={async (e) => { e.preventDefault(); setLoading(true); await new Promise(r => setTimeout(r, 1000)); setLoading(false); toast.success('Message sent!') }}>
          <Input placeholder="Your name" required />
          <Input type="email" placeholder="Your email" required />
          <Input placeholder="Subject" required />
          <textarea rows={5} placeholder="Your message…" className="w-full rounded-xl border border-input bg-background px-3 py-2 text-sm resize-none focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring" required />
          <Button type="submit" className="w-full" loading={loading}>Send Message</Button>
        </form>
      </div>
    </div>
  )
}
