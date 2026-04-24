import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { cartItems } = useStore()
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)

  return (
    <nav className="w-full fixed top-0 left-0 bg-[#ececec] z-50 border-b border-gray-400">
      <div className="max-w-[1400px] mx-auto px-5 md:px-8 py-5 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2 text-gray-900">
          <span className="text-2xl">👜</span>
          <span className="text-2xl md:text-3xl leading-none">Scatch</span>
        </Link>

        <div className="hidden md:flex items-center gap-8 text-sm">
          <Link to="/" className="text-gray-800 hover:opacity-70 transition">
            Home
          </Link>
          <Link to="/shop" className="text-gray-800 hover:opacity-70 transition">
            Products
          </Link>
          <Link to="/owner-login" className="text-gray-800 hover:opacity-70 transition">
            My account
          </Link>
          <Link to="/cart" className="text-gray-800 hover:opacity-70  flex items-center gap-1 text-xl hover:text-white px-4 py-2 rounded-lg font-semibold hover:bg-sky-600 transition">
            <span>🛒</span>
            <span>Cart {cartCount > 0 ? `(${cartCount})` : ''}</span>
          </Link>
        </div>

        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {isMenuOpen && (
        <div className="md:hidden px-5 pb-4 space-y-2 border-t border-gray-300 text-sm">
          <Link to="/" className="block text-gray-800 py-2">
            Home
          </Link>
          <Link to="/shop" className="block text-gray-800 py-2">
            Products
          </Link>
          <Link to="/owner-login" className="block text-gray-800 py-2">
            My account
          </Link>
          <Link to="/cart" className="block text-gray-800 py-2">
            🛒 Cart {cartCount > 0 ? `(${cartCount})` : ''}
          </Link>
        </div>
      )}
    </nav>
  )
}
