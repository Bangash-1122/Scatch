import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="w-full bg-gray-900 text-white py-12 mt-16 border-t">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          <div>
            <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
              <span>👜</span>
              <span>Scatch</span>
            </h3>
            <p className="text-gray-400 text-sm">
              Premium bags and backpacks for every lifestyle.
            </p>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link to="/" className="hover:text-white transition">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/shop" className="hover:text-white transition">
                  Shop
                </Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-white transition">
                  Cart
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Admin</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>
                <Link to="/owner-login" className="hover:text-white transition">
                  Owner Login
                </Link>
              </li>
              <li>
                <Link to="/admin" className="hover:text-white transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/admin/create-product" className="hover:text-white transition">
                  Add Product
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-gray-400 text-sm">
              <li>Email: info@scatch.com</li>
              <li>Phone: +92 5555555555</li>
              <li>Hours: 9AM - 6PM PKT</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-400 text-sm">
              &copy; 2026 Scatch. All rights reserved.
            </p>
            <div className="flex gap-6 text-gray-400 text-sm">
              <a href="#" className="hover:text-white transition">
                Privacy
              </a>
              <a href="#" className="hover:text-white transition">
                Terms
              </a>
              <a href="#" className="hover:text-white transition">
                Cookies
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}
