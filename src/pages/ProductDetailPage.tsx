import { useState } from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import {
  ShoppingCart, Heart, Share2, Star, Truck, Shield, RotateCcw,
  ChevronLeft, ChevronRight, Minus, Plus, Check, ZoomIn
} from 'lucide-react'
import { toast } from 'sonner'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { useGetProductQuery, useGetRelatedProductsQuery } from '@/data/useMockData'
import { useAppDispatch, useAppSelector } from '@/app/hooks'
import { addItem } from '@/features/cart/store/cartSlice'
import { addToWishlist, removeFromWishlist } from '@/features/wishlist/store/wishlistSlice'
import { addToRecentlyViewed } from '@/features/search/store/searchSlice'
import ProductGrid from '@/features/products/components/ProductGrid'
import ProductReviews from '@/features/reviews/components/ProductReviews'
import { Skeleton } from '@/components/common/Skeleton'
import { formatPrice, getDiscountPercentage } from '@/lib/utils'
import type { ProductVariant } from '@/types'

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>()
  const dispatch = useAppDispatch()
  const { data, isLoading } = useGetProductQuery(slug!)
  const product = data?.data

  const [selectedImageIdx, setSelectedImageIdx] = useState(0)
  const [selectedVariant, setSelectedVariant] = useState<ProductVariant | null>(null)
  const [selectedAttributes, setSelectedAttributes] = useState<Record<string, string>>({})
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [tab, setTab] = useState<'description' | 'specs' | 'reviews'>('description')

  const isWishlisted = useAppSelector((s) =>
    s.wishlist.items.some((i) => i.productId === product?.id)
  )

  const { data: relatedData } = useGetRelatedProductsQuery(product?.id ?? '', {
    skip: !product?.id,
  })
  const related = relatedData?.data ?? []

  if (product && !isWishlisted) {
    dispatch(addToRecentlyViewed(product.id))
  }

  const effectivePrice = selectedVariant?.price ?? product?.price ?? 0
  const effectiveCompare = selectedVariant?.compareAtPrice ?? product?.compareAtPrice
  const effectiveStock = selectedVariant?.stock ?? product?.stock ?? 0
  const discountPct = effectiveCompare ? getDiscountPercentage(effectivePrice, effectiveCompare) : 0

  const handleAttributeSelect = (attrName: string, value: string) => {
    const newAttrs = { ...selectedAttributes, [attrName]: value }
    setSelectedAttributes(newAttrs)
    const matchedVariant = product?.variants.find((v) =>
      Object.entries(newAttrs).every(([k, val]) => v.attributes[k] === val)
    )
    setSelectedVariant(matchedVariant ?? null)
  }

  const handleAddToCart = async () => {
    if (!product) return
    setAddingToCart(true)
    await new Promise((r) => setTimeout(r, 400))
    dispatch(addItem({ product, variant: selectedVariant ?? undefined, quantity }))
    toast.success('Added to cart!', { description: product.name })
    setAddingToCart(false)
  }

  const handleWishlist = () => {
    if (!product) return
    if (isWishlisted) {
      dispatch(removeFromWishlist(product.id))
      toast.success('Removed from wishlist')
    } else {
      dispatch(addToWishlist(product))
      toast.success('Added to wishlist')
    }
  }

  if (isLoading) {
    return (
      <div className="container py-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <Skeleton className="aspect-square rounded-2xl" />
          <div className="space-y-4">
            <Skeleton className="h-8 w-3/4" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-12 w-1/3" />
            <Skeleton className="h-24 w-full" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) return (
    <div className="container py-20 text-center">
      <h1 className="text-2xl font-bold">Product not found</h1>
      <Button className="mt-4" asChild><Link to="/products">Browse Products</Link></Button>
    </div>
  )

  const images = product.images

  return (
    <div className="container py-8 animate-fade-in">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-muted-foreground">
        <Link to="/" className="hover:text-foreground">Home</Link>
        {' / '}
        <Link to="/products" className="hover:text-foreground">Products</Link>
        {product.category && (
          <>
            {' / '}
            <Link to={`/categories/${product.category.slug}`} className="hover:text-foreground">
              {product.category.name}
            </Link>
          </>
        )}
        {' / '}
        <span className="text-foreground font-medium">{product.name}</span>
      </nav>

      <div className="grid gap-8 lg:grid-cols-2">
        {/* Images */}
        <div>
          <div className="relative aspect-square overflow-hidden rounded-2xl bg-muted">
            <AnimatePresence mode="wait">
              <motion.img
                key={selectedImageIdx}
                src={images[selectedImageIdx]?.url}
                alt={product.name}
                className="size-full object-cover"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
              />
            </AnimatePresence>

            {/* Nav arrows */}
            {images.length > 1 && (
              <>
                <button
                  className="absolute left-3 top-1/2 -translate-y-1/2 flex size-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm shadow hover:bg-background transition-all"
                  onClick={() => setSelectedImageIdx((i) => (i - 1 + images.length) % images.length)}
                >
                  <ChevronLeft className="size-4" />
                </button>
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2 flex size-9 items-center justify-center rounded-full bg-background/80 backdrop-blur-sm shadow hover:bg-background transition-all"
                  onClick={() => setSelectedImageIdx((i) => (i + 1) % images.length)}
                >
                  <ChevronRight className="size-4" />
                </button>
              </>
            )}

            {discountPct > 0 && (
              <Badge variant="destructive" className="absolute left-3 top-3 text-sm px-2">
                -{discountPct}%
              </Badge>
            )}
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto">
              {images.map((img, i) => (
                <button
                  key={img.id}
                  onClick={() => setSelectedImageIdx(i)}
                  className={`size-16 shrink-0 overflow-hidden rounded-lg border-2 transition-all ${
                    i === selectedImageIdx ? 'border-primary' : 'border-transparent hover:border-muted-foreground/30'
                  }`}
                >
                  <img src={img.url} alt={img.alt || product.name} className="size-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Info */}
        <div className="space-y-5">
          <span className="text-sm font-semibold text-primary">aslitec</span>

          <div>
            <h1 className="text-2xl font-bold leading-tight md:text-3xl">{product.name}</h1>
            <div className="mt-2 flex items-center gap-3">
              <div className="flex items-center gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${
                      i < Math.floor(product.averageRating)
                        ? 'fill-amber-400 text-amber-400'
                        : 'fill-muted text-muted'
                    }`}
                  />
                ))}
              </div>
              <span className="text-sm font-medium">{product.averageRating.toFixed(1)}</span>
              <button
                className="text-sm text-muted-foreground hover:text-foreground underline-offset-2 hover:underline"
                onClick={() => setTab('reviews')}
              >
                {product.reviewCount} reviews
              </button>
            </div>
          </div>

          {/* Price */}
          <div className="flex items-baseline gap-3">
            <span className="text-3xl font-bold">{formatPrice(effectivePrice)}</span>
            {effectiveCompare && effectiveCompare > effectivePrice && (
              <span className="text-lg text-muted-foreground line-through">
                {formatPrice(effectiveCompare)}
              </span>
            )}
            {discountPct > 0 && (
              <Badge variant="destructive">{discountPct}% off</Badge>
            )}
          </div>

          {/* Stock status */}
          <div className="flex items-center gap-2">
            {effectiveStock > 0 ? (
              <>
                <Check className="size-4 text-emerald-500" />
                <span className="text-sm font-medium text-emerald-600">
                  {effectiveStock <= 10 ? `Only ${effectiveStock} left!` : 'In Stock'}
                </span>
              </>
            ) : (
              <span className="text-sm font-medium text-destructive">Out of Stock</span>
            )}
          </div>

          {/* Variants */}
          {product.attributes.map((attr) => (
            <div key={attr.id}>
              <label className="mb-2 block text-sm font-semibold">
                {attr.name}:{' '}
                <span className="font-normal text-muted-foreground">
                  {selectedAttributes[attr.name] || 'Select'}
                </span>
              </label>
              <div className="flex flex-wrap gap-2">
                {attr.values.map((val) => {
                  const selected = selectedAttributes[attr.name] === val
                  return (
                    <button
                      key={val}
                      onClick={() => handleAttributeSelect(attr.name, val)}
                      className={`rounded-lg border px-3 py-1.5 text-sm font-medium transition-all ${
                        selected
                          ? 'border-primary bg-primary/10 text-primary'
                          : 'border-border hover:border-foreground'
                      }`}
                    >
                      {val}
                    </button>
                  )
                })}
              </div>
            </div>
          ))}

          {/* Quantity */}
          <div>
            <label className="mb-2 block text-sm font-semibold">Quantity</label>
            <div className="flex items-center gap-2">
              <div className="flex items-center rounded-lg border">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="flex size-10 items-center justify-center hover:bg-accent transition-colors"
                >
                  <Minus className="size-4" />
                </button>
                <span className="w-12 text-center text-sm font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(Math.min(effectiveStock, quantity + 1))}
                  className="flex size-10 items-center justify-center hover:bg-accent transition-colors"
                  disabled={quantity >= effectiveStock}
                >
                  <Plus className="size-4" />
                </button>
              </div>
              <span className="text-xs text-muted-foreground">{effectiveStock} available</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button
              size="lg"
              className="flex-1 gap-2"
              onClick={handleAddToCart}
              loading={addingToCart}
              disabled={effectiveStock === 0}
            >
              <ShoppingCart className="size-5" />
              {effectiveStock === 0 ? 'Out of Stock' : 'Add to Cart'}
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={handleWishlist}
              className={isWishlisted ? 'border-primary text-primary' : ''}
            >
              <Heart className={isWishlisted ? 'fill-primary size-5' : 'size-5'} />
            </Button>
            <Button size="lg" variant="outline" onClick={() => {
              navigator.share?.({ title: product.name, url: window.location.href })
                .catch(() => {
                  navigator.clipboard?.writeText(window.location.href)
                  toast.success('Link copied!')
                })
            }}>
              <Share2 className="size-5" />
            </Button>
          </div>

          {/* Shipping info */}
          <div className="rounded-xl border bg-muted/30 p-4 space-y-2">
            {[
              { icon: Truck, text: 'Free shipping on orders over $50' },
              { icon: Shield, text: '2-year manufacturer warranty' },
              { icon: RotateCcw, text: '30-day hassle-free returns' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-sm">
                <Icon className="size-4 text-muted-foreground" />
                <span>{text}</span>
              </div>
            ))}
          </div>

          {/* Tags */}
          {product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {product.tags.map((tag) => (
                <Badge key={tag} variant="secondary">{tag}</Badge>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Tabs */}
      <div className="mt-12">
        <div className="flex border-b">
          {(['description', 'specs', 'reviews'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setTab(t)}
              className={`px-6 py-3 text-sm font-medium capitalize transition-colors border-b-2 -mb-px ${
                tab === t
                  ? 'border-primary text-primary'
                  : 'border-transparent text-muted-foreground hover:text-foreground'
              }`}
            >
              {t === 'reviews' ? `Reviews (${product.reviewCount})` : t}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {tab === 'description' && (
            <div
              className="prose prose-sm dark:prose-invert max-w-none"
              dangerouslySetInnerHTML={{ __html: product.description }}
            />
          )}
          {tab === 'specs' && (
            <div className="grid gap-2 sm:grid-cols-2">
              {product.specifications.map((spec) => (
                <div key={spec.label} className="flex gap-4 rounded-lg border p-3">
                  <span className="text-sm font-medium text-muted-foreground w-32 shrink-0">{spec.label}</span>
                  <span className="text-sm">{spec.value}</span>
                </div>
              ))}
            </div>
          )}
          {tab === 'reviews' && <ProductReviews productId={product.id} />}
        </div>
      </div>

      {/* Related */}
      {related.length > 0 && (
        <section className="mt-16">
          <h2 className="mb-6 text-xl font-bold">You might also like</h2>
          <ProductGrid products={related} columns={4} />
        </section>
      )}
    </div>
  )
}
