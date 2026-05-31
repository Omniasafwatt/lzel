import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent } from '@/components/ui/card'
import { useGetBrandsQuery } from '@/data/useMockData'
import { useCreateBrandMutation, useDeleteBrandMutation } from '@/features/products/services/brandsApi'
import { Skeleton } from '@/components/common/Skeleton'

export default function BrandsPage() {
  const { data, isLoading } = useGetBrandsQuery()
  const [createBrand] = useCreateBrandMutation()
  const [deleteBrand] = useDeleteBrandMutation()
  const [newName, setNewName] = useState('')
  const brands = data?.data ?? []

  return (
    <div className="space-y-4 animate-fade-in">
      <h1 className="text-2xl font-bold">Brands</h1>
      <Card><CardContent className="p-4 flex gap-2">
        <Input value={newName} onChange={(e) => setNewName(e.target.value)} placeholder="Brand name" className="max-w-xs" />
        <Button size="sm" onClick={async () => {
          if (!newName.trim()) return
          await createBrand({ name: newName, slug: newName.toLowerCase().replace(/\s+/g, '-'), isActive: true }).unwrap()
          toast.success('Brand created!'); setNewName('')
        }}><Plus className="mr-2 size-4" /> Add</Button>
      </CardContent></Card>
      <Card><CardContent className="p-0">
        {isLoading ? <div className="p-4 space-y-2">{Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-12 rounded-lg" />)}</div> : (
          <div className="divide-y">
            {brands.map((b) => (
              <div key={b.id} className="flex items-center justify-between p-4">
                <div className="flex items-center gap-3">
                  {b.logo && <img src={b.logo} alt="" className="size-8 rounded-lg object-contain bg-muted p-1" />}
                  <div><p className="font-medium">{b.name}</p><p className="text-xs text-muted-foreground">{b.productCount ?? 0} products</p></div>
                </div>
                <Button variant="ghost" size="icon-sm" className="text-destructive hover:text-destructive" onClick={async () => { await deleteBrand(b.id); toast.success('Deleted') }}>
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </CardContent></Card>
    </div>
  )
}
