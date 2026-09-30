import { Link } from 'react-router-dom'
import { Heart } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="w-full bg-[#111827] text-white py-14 mt-16 border-t border-gray-800">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 mb-12">
          {/* Brand */}
          <div className="space-y-4">
            <Link to="/" className="flex items-center gap-3">
              <div className="w-9 h-9 shrink-0">
                <img src="/bag-logo.svg" alt="Scatch" className="w-full h-full object-contain" />
              </div>
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Scatch<span className="text-sky-500">.</span>
              </span>
            </Link>
            <p className="text-gray-400 text-xs leading-relaxed max-w-xs">
              Handcrafted luxury backpacks, travel duffels, and minimalist totes engineered for modern daily life.
            </p>
            <span className="inline-block text-[11px] font-bold text-sky-400 bg-sky-950/60 border border-sky-800/50 px-2.5 py-1 rounded-md">
              ⚡ Powered by MERN Stack
            </span>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-sm text-gray-200 uppercase tracking-wider mb-4">
              Explore
            </h4>
            <ul className="space-y-2.5 text-gray-400 text-xs font-medium">
              <li>
                <Link to="/" className="hover:text-sky-400 transition">
                  Home Landing
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-sky-400 transition">
                  The Collection
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-sky-400 transition">
                  My Cart
                </Link>
              </li>
            </ul>
          </div>

          {/* Admin & Owner */}
          <div>
            <h4 className="font-bold text-sm text-gray-200 uppercase tracking-wider mb-4">
              Store Owner
            </h4>
            <ul className="space-y-2.5 text-gray-400 text-xs font-medium">
              <li>
                <Link to="/owner-login" className="hover:text-sky-400 transition">
                  Owner Portal
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-sky-400 transition">
                  Sales Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/create-product" className="hover:text-sky-400 transition">
                  Add New Bag
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-bold text-sm text-gray-200 uppercase tracking-wider mb-4">
              Concierge
            </h4>
            <ul className="space-y-2 text-gray-400 text-xs font-medium">
              <li>support@scatch.com</li>
              <li>Available Mon-Sat: 9AM - 8PM</li>
              <li className="text-emerald-400 font-semibold pt-1">
                ✓ 100% Secure Checkout Guaranteed
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-gray-500 font-medium">
          <p>© {new Date().getFullYear()} Scatch Luxury Goods. All rights reserved.</p>
          <div className="flex items-center gap-1 text-gray-400">
            <span>Crafted with</span>
            <Heart className="w-3.5 h-3.5 text-red-500 inline fill-red-500" />
            <span>for bag connoisseurs worldwide</span>
          </div>
        </div>
      </div>
    </footer>
  )
}
