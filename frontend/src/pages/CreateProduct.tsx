import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export default function CreateProduct() {
  const { addProduct } = useStore()
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    image: '',
    bgColor: '#E9D3CB',
    panelColor: '#D1B1A3',
    textColor: '#5E4032',
  })
  const navigate = useNavigate()

  const handleChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    addProduct({
      name: formData.name,
      category: formData.category,
      price: Number(formData.price),
      stock: Number(formData.stock),
      description: formData.description,
      image: formData.image,
      bgColor: formData.bgColor,
      panelColor: formData.panelColor,
      textColor: formData.textColor,
    })
    navigate('/admin')
  }

  return (
    <div className="px-4 md:px-8 py-8">
      <div className="flex gap-6">
        <aside className="w-[180px] md:w-[220px] text-sm text-gray-700 space-y-4">
          <Link to="/admin" className="block text-gray-600">
            All Products
          </Link>
          <p className="font-semibold">Create New Product</p>
        </aside>

        <div className="flex-1 max-w-3xl">
          <h1 className="text-5xl leading-none text-gray-900 mb-4">Create New Product</h1>
          <div className="border-t border-gray-300 pt-8">
            <h2 className="text-4xl leading-none text-gray-900 mb-8">Product Details</h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="url"
                  name="image"
                  value={formData.image}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded"
                  placeholder="Product Image URL"
                  required
                />
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded"
                  placeholder="Product Name"
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <input
                  type="number"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded"
                  placeholder="Product Price"
                  required
                />
                <input
                  type="number"
                  name="stock"
                  value={formData.stock}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded"
                  placeholder="Stock"
                  required
                />
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded"
                  required
                >
                  <option value="">Category</option>
                  <option value="Backpack">Backpack</option>
                  <option value="Duffel">Duffel</option>
                  <option value="Tote">Tote</option>
                  <option value="Pouch">Pouch</option>
                </select>
              </div>

              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded"
                placeholder="Description"
                rows={3}
                required
              />

              <div className="pt-6">
                <h3 className="text-4xl leading-none text-gray-900 mb-5">Panel Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <input
                    type="text"
                    name="bgColor"
                    value={formData.bgColor}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded"
                    placeholder="Background Color"
                    required
                  />
                  <input
                    type="text"
                    name="panelColor"
                    value={formData.panelColor}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded"
                    placeholder="Panel Color"
                    required
                  />
                  <input
                    type="text"
                    name="textColor"
                    value={formData.textColor}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-gray-200 text-gray-700 rounded"
                    placeholder="Text Color"
                    required
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-2">
                <button type="submit" className="bg-black text-white px-6 py-3 rounded">
                  Save Product
                </button>
                <button type="button" onClick={() => navigate('/admin')} className="bg-gray-300 text-gray-800 px-6 py-3 rounded">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  )
}
