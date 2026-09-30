import { useState } from 'react'
import type { Product } from '../types/products'
import { useStore } from '../context/StoreContext'
import {
  Search,
  Filter,
  Check,
  ShoppingBag,
  Sparkles,
  ArrowUpDown,
  Tag,
  CheckCircle2,
  X
} from 'lucide-react'

export default function Shop() {
  const { products, addToCart } = useStore()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')
  const [sortBy, setSortBy] = useState('popular')
  const [showDiscountedOnly, setShowDiscountedOnly] = useState(false)
  const [stockOnly, setStockOnly] = useState(false)
  const [addedProductId, setAddedProductId] = useState<number | string | null>(null)

  // Categories list
  const categories = ['ALL', 'Backpack', 'Duffel', 'Tote', 'Pouch']

  // Filter products
  const filteredProducts = products.filter((product) => {
    // Search query
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      const matchName = product.name.toLowerCase().includes(q)
      const matchDesc = product.description?.toLowerCase().includes(q)
      const matchCat = product.category.toLowerCase().includes(q)
      if (!matchName && !matchDesc && !matchCat) return false
    }

    // Category
    if (selectedCategory !== 'ALL' && product.category.toLowerCase() !== selectedCategory.toLowerCase()) {
      return false
    }

    // Discount
    if (showDiscountedOnly && !product.discountPercent) return false

    // Stock
    if (stockOnly && product.stock === 0) return false

    return true
  })

  // Sort products
  const sortedProducts = [...filteredProducts].sort((a: Product, b: Product) => {
    if (sortBy === 'price-low') return a.price - b.price
    if (sortBy === 'price-high') return b.price - a.price
    if (sortBy === 'name') return a.name.localeCompare(b.name)
    if (sortBy === 'newest') return Number(b.id) - Number(a.id)
    // Popular: high stock/sales
    return b.stock - a.stock
  })

  const handleQuickAdd = (product: Product) => {
    addToCart(product)
    setAddedProductId(product.id)
    setTimeout(() => {
      setAddedProductId((prev) => (prev === product.id ? null : prev))
    }, 1200)
  }

  const handleResetFilters = () => {
    setSearchQuery('')
    setSelectedCategory('ALL')
    setShowDiscountedOnly(false)
    setStockOnly(false)
    setSortBy('popular')
  }

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-6 pb-20 px-4 md:px-8 max-w-[1400px] mx-auto">
      {/* Top Banner / Heading */}
      <div className="pb-8 border-b border-gray-300 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-sky-600 mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Curated Bag Lineup</span>
          </div>
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-gray-900 tracking-tight leading-none">
            The Collection<span className="text-sky-600">.</span>
          </h1>
          <p className="text-sm md:text-base text-gray-600 mt-2 max-w-xl">
            Explore our masterfully handcrafted luxury bags engineered for everyday convenience, urban commuting, and long journeys.
          </p>
        </div>

        {/* Counter Badge */}
        <div className="soft-blue-card px-4 py-2.5 rounded-2xl flex items-center gap-3 self-start md:self-auto">
          <div className="w-8 h-8 rounded-xl bg-sky-500/20 text-sky-700 flex items-center justify-center font-bold text-sm">
            👜
          </div>
          <div>
            <p className="text-xs text-gray-500 font-semibold leading-tight">Showing</p>
            <p className="text-sm font-extrabold text-gray-900 leading-tight">
              {sortedProducts.length} of {products.length} Bags
            </p>
          </div>
        </div>
      </div>

      {/* Control Bar: Search & Category Chips */}
      <div className="space-y-4 mb-8">
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-white p-4 rounded-3xl border border-gray-200/90 shadow-2xs">
          {/* Search Box */}
          <div className="relative w-full lg:w-96">
            <Search className="w-4 h-4 text-gray-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search bags by name, style, or color..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-2.5 bg-gray-50 border border-gray-200 rounded-2xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 font-medium"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>

          {/* Category Chips */}
          <div className="flex items-center gap-2 overflow-x-auto w-full lg:w-auto pb-1 lg:pb-0">
            {categories.map((cat) => {
              const isActive = selectedCategory.toLowerCase() === cat.toLowerCase()
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer shrink-0 ${
                    isActive
                      ? 'bg-sky-600 text-white shadow-md shadow-sky-600/20 scale-105'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200/80'
                  }`}
                >
                  {cat === 'ALL' ? '🌟 All Bags' : cat}
                </button>
              )
            })}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center gap-2 w-full lg:w-auto justify-end">
            <ArrowUpDown className="w-4 h-4 text-gray-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-700 focus:outline-hidden"
            >
              <option value="popular">Popularity</option>
              <option value="newest">Newest First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name A-Z</option>
            </select>
          </div>
        </div>

        {/* Secondary Filter Toggles */}
        <div className="flex flex-wrap items-center gap-3 px-1 text-xs">
          <span className="font-bold text-gray-500 uppercase tracking-wider flex items-center gap-1.5">
            <Filter className="w-3.5 h-3.5 text-sky-600" />
            <span>Filter by:</span>
          </span>

          <button
            onClick={() => setShowDiscountedOnly((prev) => !prev)}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              showDiscountedOnly
                ? 'bg-red-50 text-red-700 border-red-200 shadow-2xs'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <Tag className="w-3 h-3 text-red-500" />
            <span>Discounted Only</span>
          </button>

          <button
            onClick={() => setStockOnly((prev) => !prev)}
            className={`px-3.5 py-1.5 rounded-full font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
              stockOnly
                ? 'bg-emerald-50 text-emerald-700 border-emerald-200 shadow-2xs'
                : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
            }`}
          >
            <CheckCircle2 className="w-3 h-3 text-emerald-500" />
            <span>In Stock Only</span>
          </button>

          {(selectedCategory !== 'ALL' || searchQuery || showDiscountedOnly || stockOnly) && (
            <button
              onClick={handleResetFilters}
              className="text-xs font-bold text-sky-600 hover:underline ml-auto cursor-pointer"
            >
              Clear All Filters
            </button>
          )}
        </div>
      </div>

      {/* PRODUCTS GRID WITH SKY BLUE HOVER ACCENT */}
      {sortedProducts.length === 0 ? (
        <div className="min-h-[40vh] bg-white rounded-3xl border border-gray-200 p-12 text-center flex flex-col items-center justify-center space-y-4">
          <div className="w-16 h-16 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center text-3xl">
            👜
          </div>
          <h3 className="text-xl font-bold text-gray-900">No bags found</h3>
          <p className="text-sm text-gray-500 max-w-md">
            We couldn&apos;t find any bags matching your filters. Try resetting the search or category filters.
          </p>
          <button
            onClick={handleResetFilters}
            className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-700 text-white font-semibold text-xs transition"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {sortedProducts.map((product) => {
            const isJustAdded = addedProductId === product.id
            return (
              <article
                key={product.id}
                className="group relative rounded-3xl overflow-hidden border border-gray-200/90 bg-white transition-all duration-300 hover:-translate-y-2 hover:border-sky-400 hover:shadow-[0_16px_36px_-6px_rgba(56,189,248,0.25)] flex flex-col justify-between"
              >
                {/* Sky-Blue Glow Overlay Backlight on Card Hover requested by user */}
                <div className="absolute inset-0 bg-gradient-to-t from-sky-100/50 via-sky-50/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-10" />

                <div>
                  {/* Bag Visual Container with pastel tone & hover zoom */}
                  <div
                    className="h-[220px] flex items-center justify-center p-6 relative overflow-hidden transition-colors"
                    style={{ backgroundColor: product.bgColor || '#E9D3CB' }}
                  >
                    {/* Discount Badge */}
                    {product.discountPercent ? (
                      <span className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs z-20">
                        {product.discountPercent}% OFF
                      </span>
                    ) : null}

                    {/* Stock pill */}
                    <span
                      className={`absolute top-3 right-3 text-[10px] font-bold px-2 py-0.5 rounded-full z-20 ${
                        product.stock > 10
                          ? 'bg-black/20 text-white'
                          : product.stock > 0
                          ? 'bg-amber-500 text-white'
                          : 'bg-red-500 text-white'
                      }`}
                    >
                      {product.stock > 0 ? `${product.stock} in stock` : 'Out of Stock'}
                    </span>

                    <img
                      src={product.image}
                      alt={product.name}
                      className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-300 filter drop-shadow-xs z-10"
                    />
                  </div>

                  {/* Panel Details Section */}
                  <div
                    className="p-4"
                    style={{
                      backgroundColor: product.panelColor || '#D1B1A3',
                      color: product.textColor || '#5E4032'
                    }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-extrabold uppercase tracking-wider opacity-85">
                        {product.category}
                      </span>
                    </div>

                    <h3 className="text-2xl font-bold tracking-tight leading-tight">
                      {product.name}
                    </h3>
                    <p className="text-xs opacity-75 line-clamp-1 mt-1 font-medium">
                      {product.description}
                    </p>
                  </div>
                </div>

                {/* Footer Section with Price & Action */}
                <div className="p-4 bg-white border-t border-gray-100 flex items-center justify-between relative z-20">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-gray-400 block leading-none">
                      Price
                    </span>
                    <span className="text-2xl font-extrabold text-gray-900 leading-tight">
                      ₹ {product.price}
                    </span>
                  </div>

                  {/* Quick Add Button with Micro-Animation */}
                  <button
                    onClick={() => handleQuickAdd(product)}
                    disabled={product.stock === 0}
                    className={`flex items-center gap-1.5 px-4 py-2.5 rounded-xl font-bold text-xs transition-all duration-200 cursor-pointer shadow-xs ${
                      isJustAdded
                        ? 'bg-emerald-600 text-white scale-105'
                        : product.stock === 0
                        ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                        : 'bg-sky-600 hover:bg-sky-700 text-white hover:scale-105 active:scale-95 hover:shadow-sky-600/30'
                    }`}
                    title="Add to cart"
                  >
                    {isJustAdded ? (
                      <>
                        <Check className="w-3.5 h-3.5 animate-bounce" />
                        <span>Added!</span>
                      </>
                    ) : (
                      <>
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>Add +</span>
                      </>
                    )}
                  </button>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}
