import { useState } from 'react'
import { useParams } from 'react-router-dom'
import { Package, Truck, CheckCircle, MapPin, Clock } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { formatDate } from '@/lib/utils'

export default function TrackOrderPage() {
  const { orderNumber } = useParams<{ orderNumber: string }>()
  const [input, setInput] = useState(orderNumber ?? '')

  return (
    <div className="container max-w-2xl py-12">
      <h1 className="mb-6 text-2xl font-bold text-center">Track Your Order</h1>
      <div className="flex gap-2 mb-8">
        <Input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter order number or tracking ID"
          startIcon={<Package className="size-4" />}
        />
        <Button>Track</Button>
      </div>
      <Card>
        <CardContent className="p-6 text-center text-muted-foreground">
          <Truck className="mx-auto size-12 opacity-30 mb-3" />
          <p>Enter your order number above to track your shipment.</p>
        </CardContent>
      </Card>
    </div>
  )
}
