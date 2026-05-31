import { useParams } from 'react-router-dom'
import ProductGrid from '@/features/products/components/ProductGrid'
import { useGetBrandQuery, useGetProductsQuery } from '@/data/useMockData'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { setFilters } from '@/features/search/store/searchSlice'
import { useEffect } from 'react'
import Pagination from '@/components/common/Pagination'

export default function BrandPage() {
  const { slug } = useParams<{ slug: string }>()
  const dispatch = useAppDispatch()
  const { data: brandData } = useGetBrandQuery(slug!)
  const brand = brandData?.data
  const filters = useAppSelector((s) => s.search.filters)

  useEffect(() => {
    if (brand?.id) dispatch(setFilters({ brandId: brand.id }))
  }, [brand?.id, dispatch])

  const { data, isLoading } = useGetProductsQuery(filters)
  const products = data?.data ?? []
  const meta = data?.meta

  return (
    <div className="container py-8 animate-fade-in">
      <div className="mb-6 flex items-center gap-4">
        {brand?.logo && <img src={brand.logo} alt={brand.name} className="size-16 rounded-xl object-contain bg-muted p-2" />}
        <div>
          <h1 className="text-2xl font-bold">{brand?.name ?? slug}</h1>
          {brand?.description && <p className="text-muted-foreground">{brand.description}</p>}
          {meta && <p className="text-sm text-muted-foreground">{meta.total} products</p>}
        </div>
      </div>
      <ProductGrid products={products} isLoading={isLoading} columns={4} />
      {meta && meta.totalPages > 1 && (
        <div className="mt-8"><Pagination currentPage={meta.page} totalPages={meta.totalPages} onPageChange={(p) => dispatch(setFilters({ page: p }))} /></div>
      )}
    </div>
  )
}
