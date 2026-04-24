import { useState } from 'react'
import type { Product } from '../types/products'
import { useStore } from '../context/StoreContext'

export default function Shop() {
  const { products, addToCart } = useStore()
  const [sortBy, setSortBy] = useState('popular')
  const [showDiscountedOnly, setShowDiscountedOnly] = useState(false)
  const [stockOnly, setStockOnly] = useState(false)

  const filteredProducts = products.filter((product) => {
    if (showDiscountedOnly && !product.discountPercent) return false
    if (stockOnly && product.stock === 0) return false
    return true
  })

  const sortedProducts = [...filteredProducts].sort((a: Product, b: Product) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    return 0
  })

  return (
    <div className="px-4 md:px-8 py-8">
      <div className="flex items-center justify-between border-b border-gray-400 pb-6 mb-6">
        <h1 className="text-5xl leading-none text-gray-900">Shop.</h1>
      </div>

      <div className="flex gap-6">
        <aside className="w-[180px] md:w-[220px] text-sm text-gray-700">
          <div className="mb-12">
            <label className="flex items-center gap-2 mb-4 text-3xl leading-none text-gray-700">
              <span>sort by :</span>
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="w-full border border-gray-300 px-2 py-1 rounded bg-white"
            >
              <option value="popular">Popular</option>
              <option value="newest">Newest</option>
              <option value="price-low">Price Low to High</option>
              <option value="price-high">Price High to Low</option>
              <option value="name">Name A-Z</option>
            </select>

            <div className="mt-8 space-y-1">
              <button className="block text-left">New Collection</button>
              <button className="block text-left font-semibold">All Products</button>
              <button
                className="block text-left text-gray-500"
                onClick={() => setShowDiscountedOnly((prev) => !prev)}
              >
                Discounted Products
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <p>Filter by :</p>
            <button
              className={`block text-left ${stockOnly ? 'font-semibold text-gray-900' : 'text-gray-600'}`}
              onClick={() => setStockOnly((prev) => !prev)}
            >
              Availability
            </button>
            <button
              className={`block text-left ${showDiscountedOnly ? 'font-semibold text-gray-900' : 'text-gray-600'}`}
              onClick={() => setShowDiscountedOnly((prev) => !prev)}
            >
              Discount
            </button>
          </div>
        </aside>

        <section className="flex-1">
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
            {sortedProducts.map((product) => (
              <article key={product.id} className="w-full">
                <div
                  className="h-[210px] flex items-center justify-center p-4"
                  style={{ backgroundColor: product.bgColor }}
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-contain"
                  />
                </div>

                <div
                  className="p-3"
                  style={{ backgroundColor: product.panelColor, color: product.textColor }}
                >
                  <p className="text-3xl leading-none">{product.name}</p>
                  <div className="flex items-center justify-between mt-3">
                    <span className="text-2xl">₹ {product.price}</span>
                    <button
                      onClick={() => addToCart(product)}
                      className="w-7 h-7 rounded-full bg-white/85 text-gray-700 text-lg leading-none"
                    >
                      +
                    </button>
                  </div>

                  {product.discountPercent ? (
                    <span className="inline-block mt-1 px-2 rounded-full text-[11px] bg-black/20 text-white">
                      -{product.discountPercent}%
                    </span>
                  ) : null}
                </div>
              </article>
            ))}
          </div>
        </section>
      </div>
    </div>
  )
}
