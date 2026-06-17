import { useParams } from 'react-router-dom'
import ProductGrid from '@/features/products/components/ProductGrid'
import ProductFilters from '@/features/products/components/ProductFilters'
import { useGetCategoryQuery, useGetProductsQuery } from '@/data/useMockData'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setFilters } from '@/features/search/store/searchSlice'
import { useEffect } from 'react'
import Pagination from '@/components/common/Pagination'

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>()
  const dispatch = useAppDispatch()
  const { data: catData } = useGetCategoryQuery(slug!)
  const cat = catData?.data
  const filters = useAppSelector((s) => s.search.filters)

  useEffect(() => {
    if (cat?.id) dispatch(setFilters({ categoryId: cat.id }))
  }, [cat?.id, dispatch])

  const { data, isLoading } = useGetProductsQuery(filters)
  const products = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="container py-8 animate-fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-bold">{cat?.name ?? slug}</h1>
        {cat?.description && <p className="mt-1 text-muted-foreground">{cat.description}</p>}
        {meta && <p className="mt-1 text-sm text-muted-foreground">{meta.total} products</p>}
      </div>
      <div className="flex gap-6">
        <aside className="hidden lg:block w-60 shrink-0 sticky top-20 self-start">
          <div className="rounded-xl border bg-card p-4"><ProductFilters /></div>
        </aside>
        <div className="flex-1 min-w-0">
          <ProductGrid products={products} isLoading={isLoading} columns={3} />
          {meta && meta.totalPages > 1 && (
            <div className="mt-8"><Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={(p) => dispatch(setFilters({ page: p }))} /></div>
          )}
        </div>
      </div>
    </div>
  )
}
