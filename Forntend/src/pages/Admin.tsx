import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export default function Admin() {
  const { products, removeProduct, clearProducts } = useStore()

  return (
    <div className="px-4 md:px-8 py-8">
      <div className="flex items-center justify-between border-b border-gray-400 pb-6 mb-6">
        <h1 className="text-5xl leading-none text-gray-900">Admin Panel.</h1>
      </div>

      <div className="flex gap-6">
        <aside className="w-[180px] md:w-[220px] text-sm text-gray-700 space-y-4">
          <p className="font-semibold">All Products</p>
          <Link to="/admin/create-product" className="block text-gray-600">
            Create New Product
          </Link>
          <button className="block text-left text-red-400 hover:text-red-600
          transition-1.5s ease-in-out  cursor-pointer" onClick={clearProducts}>
            Delete All
          </button>
        </aside>

        <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-6">
          {products.map((product) => (
            <article key={product.id}>
              <div className="h-[210px] flex items-center justify-center p-4" style={{ backgroundColor: product.bgColor }}>
                <img src={product.image} alt={product.name} className="h-full w-full object-contain" />
              </div>
              <div className="p-3" style={{ backgroundColor: product.panelColor, color: product.textColor }}>
                <p className="text-3xl leading-none">{product.name}</p>
                <div className="flex justify-between items-center mt-2">
                  <span className="text-2xl">₹ {product.price}</span>
                  <button className="text-xs text-red-700 transition-all 0.2s ease 
                  hover:text-red-900 cursor-pointer hover:bg-color-red-300 " onClick={() => removeProduct(product.id)}>
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  )
}



