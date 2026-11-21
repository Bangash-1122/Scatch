import { Suspense } from 'react'
import { ShoppingBag, Sparkles } from 'lucide-react'
import type { Product } from '@/types/products'
import { Modal, Button, Spinner } from '@/components/ui'
import ProductViewer from './ProductViewer'
import { bagColorsFromProduct } from './productColors'
import { SceneFallback } from './SceneFallback'
import { use3DSupport } from '@/hooks/use3DSupport'
import { formatPrice } from '@/lib/format'

export interface ProductViewerModalProps {
  product: Product | null
  open: boolean
  onClose: () => void
  onAddToCart: (product: Product) => void
}

export default function ProductViewerModal({
  product,
  open,
  onClose,
  onAddToCart,
}: ProductViewerModalProps) {
  const support = use3DSupport()
  if (!product) return null

  const colors = bagColorsFromProduct(product)
  const price = product.price

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={`${product.name} — 3D preview`}
      description="Live 3D model · drag to rotate · scroll to zoom"
      size="xl"
    >
      <div className="grid grid-cols-1 gap-0 md:grid-cols-5">
        <div
          className="relative h-[320px] md:col-span-3 md:h-[460px]"
          style={{ backgroundColor: product.bgColor }}
        >
          <div className="absolute inset-0 bg-gradient-to-b from-white/40 via-transparent to-black/5" />
          {support.enabled ? (
            <Suspense
              fallback={
                <div className="flex h-full items-center justify-center">
                  <Spinner size="lg" label="Loading 3D viewer" />
                </div>
              }
            >
              <ProductViewer colors={colors} straps={product.category !== 'Pouch'} />
            </Suspense>
          ) : (
            <SceneFallback
              image={product.image}
              alt={product.name}
              note="3D preview needs a capable device"
              className="p-6"
            />
          )}
        </div>

        <div className="flex flex-col justify-between gap-5 p-6 md:col-span-2">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 rounded-full bg-scatch-50 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider text-scatch-700">
              <Sparkles className="h-3 w-3" />
              {product.category}
            </span>
            <h3 className="text-2xl font-extrabold leading-tight text-gray-900">{product.name}</h3>
            <p className="text-sm leading-relaxed text-gray-600">{product.description}</p>

            <dl className="grid grid-cols-2 gap-3 pt-1 text-xs">
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <dt className="font-semibold text-gray-400">Material</dt>
                <dd className="font-bold text-gray-800">Full-grain leather</dd>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <dt className="font-semibold text-gray-400">In stock</dt>
                <dd className="font-bold text-gray-800">{product.stock} units</dd>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <dt className="font-semibold text-gray-400">Hardware</dt>
                <dd className="font-bold text-gray-800">Brushed brass</dd>
              </div>
              <div className="rounded-xl border border-gray-100 bg-gray-50 p-3">
                <dt className="font-semibold text-gray-400">Warranty</dt>
                <dd className="font-bold text-gray-800">1 year</dd>
              </div>
            </dl>
          </div>

          <div className="space-y-3">
            <div className="flex items-end justify-between border-t border-gray-100 pt-4">
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400">Price</span>
                <p className="text-3xl font-extrabold text-gray-900">{formatPrice(price)}</p>
              </div>
              {product.discountPercent ? (
                <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600">
                  {product.discountPercent}% OFF
                </span>
              ) : null}
            </div>

            <Button
              size="lg"
              className="w-full"
              leftIcon={<ShoppingBag className="h-4 w-4" />}
              disabled={product.stock <= 0}
              onClick={() => {
                onAddToCart(product)
                onClose()
              }}
            >
              {product.stock > 0 ? 'Add to cart' : 'Out of stock'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
