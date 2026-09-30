import { useState, useRef, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../../context/StoreContext'
import { LogOut, ShoppingBag, LayoutDashboard, PlusCircle, ShieldCheck, ChevronDown, UserCircle } from 'lucide-react'

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isProfileOpen, setIsProfileOpen] = useState(false)
  const { cartItems, user, logout } = useStore()
  const cartCount = cartItems.reduce((sum, item) => sum + item.quantity, 0)
  const profileRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  // Close profile dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (profileRef.current && !profileRef.current.contains(event.target as Node)) {
        setIsProfileOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleLogout = () => {
    logout()
    setIsProfileOpen(false)
    navigate('/')
  }

  const isOwnerOrAdmin = user?.role === 'admin' || user?.role === 'owner'

  return (
    <nav className="w-full fixed top-0 left-0 bg-[#f8f9fa]/90 backdrop-blur-md z-50 transition-all duration-300">
      <div className="max-w-[1400px] mx-auto px-4 md:px-8 py-2.5 flex justify-between items-center">
        {/* Brand Logo with the User's Exact 3D Bag in Soft-Blue Container (Old dark background removed) */}
        <Link to="/" className="flex items-center gap-3 text-gray-900 group">
          <div className="w-11 h-11 transition-transform duration-300 group-hover:scale-105 animate-float shrink-0">
            <img
              src="/bag-logo.svg"
              alt="Scatch Bag Logo"
              className="w-full h-full object-contain filter drop-shadow-xs"
            />
          </div>
          <div className="flex items-baseline gap-1">
            <span className="text-2xl md:text-3xl font-extrabold tracking-tight text-gray-900 group-hover:text-sky-600 transition-colors">
              Scatch
            </span>
            <span className="w-2 h-2 rounded-full bg-sky-600 animate-pulse" />
          </div>
        </Link>

        {/* Center / Right Navigation Links */}
        <div className="hidden md:flex items-center gap-6 text-sm font-medium">
          <Link
            to="/"
            className="text-gray-700 hover:text-sky-600 px-3 py-1.5 rounded-xl hover:bg-sky-50/60 transition-all font-semibold"
          >
            Home
          </Link>
          <Link
            to="/shop"
            className="text-gray-700 hover:text-sky-600 px-3 py-1.5 rounded-xl hover:bg-sky-50/60 transition-all font-semibold"
          >
            Collection
          </Link>
          {isOwnerOrAdmin && (
            <Link
              to="/admin"
              className="text-gray-700 hover:text-sky-600 px-3 py-1.5 rounded-xl hover:bg-white/60 transition-all flex items-center gap-1.5 font-semibold"
            >
              <LayoutDashboard className="w-4 h-4 text-sky-600" />
              <span>Dashboard</span>
            </Link>
          )}

          {/* Cart Icon & Badge */}
          <Link
            to="/cart"
            className="relative flex items-center gap-2 bg-white/90 hover:bg-white text-gray-800 px-4 py-2 rounded-xl border border-gray-300 shadow-2xs hover:shadow-xs hover:border-sky-300 transition-all duration-200"
          >
            <ShoppingBag className="w-4 h-4 text-gray-700" />
            <span className="font-semibold text-xs">Cart</span>
            {cartCount > 0 && (
              <span className="inline-flex items-center justify-center px-2 py-0.5 text-xs font-bold leading-none text-white bg-sky-600 rounded-full animate-pulse-gentle">
                {cartCount}
              </span>
            )}
          </Link>

          {/* User / Admin Profile Card with Soft Icy-Blue Container requested by user */}
          {user ? (
            <div className="relative" ref={profileRef}>
              <div className="flex items-center gap-2">
                {/* Admin Card in the Soft-Blue Card style */}
                <button
                  onClick={() => setIsProfileOpen((prev) => !prev)}
                  className="soft-blue-card soft-blue-card-hover flex items-center gap-2.5 px-3 py-1.5 rounded-2xl cursor-pointer text-left focus:outline-hidden"
                  title="Admin Profile & Settings"
                >
                  {/* Avatar */}
                  <div className="relative shrink-0">
                    {user.avatar ? (
                      <img
                        src={user.avatar}
                        alt={user.fullName}
                        className="w-9 h-9 rounded-xl object-cover ring-2 ring-sky-400/40 shadow-xs"
                      />
                    ) : (
                      <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-sky-700 to-indigo-800 flex items-center justify-center text-white font-bold text-xs shadow-xs">
                        {user.fullName.charAt(0).toUpperCase()}
                      </div>
                    )}
                    {/* Active Green Dot */}
                    <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-emerald-500 border-2 border-white rounded-full"></span>
                  </div>

                  {/* Name and Role text matching Image 1 */}
                  <div className="flex flex-col pr-0.5">
                    <span className="text-xs font-extrabold text-gray-900 leading-tight">
                      {user.fullName}
                    </span>
                    <span className="text-[10px] font-bold text-sky-600 capitalize flex items-center gap-0.5 tracking-tight">
                      {isOwnerOrAdmin && <ShieldCheck className="w-3 h-3 inline text-sky-600" />}
                      {user.role === 'owner' ? 'Owner' : user.role === 'admin' ? 'Admin' : 'Customer'}
                    </span>
                  </div>

                  <ChevronDown className="w-3.5 h-3.5 text-sky-700/60" />
                </button>

                {/* Direct Exit / Logout Icon button matching screenshot */}
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-2 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all cursor-pointer"
                >
                  <LogOut className="w-4 h-4" />
                </button>
              </div>

              {/* Profile Dropdown Menu */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2.5 w-60 bg-white/95 backdrop-blur-md rounded-2xl shadow-xl border border-sky-100 py-2.5 z-50 animate-fade-in-up">
                  <div className="px-4 py-2 border-b border-gray-100">
                    <p className="text-[11px] text-gray-500 font-medium">Verified Active Session</p>
                    <p className="text-sm font-bold text-gray-900 truncate">{user.fullName}</p>
                    <p className="text-xs text-gray-500 truncate">{user.email}</p>
                  </div>

                  <div className="py-1">
                    {isOwnerOrAdmin && (
                      <>
                        <Link
                          to="/admin"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-sky-50 hover:text-sky-700 transition"
                        >
                          <LayoutDashboard className="w-4 h-4 text-sky-600" />
                          <span>Owner Dashboard</span>
                        </Link>
                        <Link
                          to="/admin/create-product"
                          onClick={() => setIsProfileOpen(false)}
                          className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-sky-50 hover:text-sky-700 transition"
                        >
                          <PlusCircle className="w-4 h-4 text-emerald-600" />
                          <span>Add New Bag</span>
                        </Link>
                      </>
                    )}
                    <Link
                      to="/shop"
                      onClick={() => setIsProfileOpen(false)}
                      className="flex items-center gap-2.5 px-4 py-2 text-xs font-semibold text-gray-700 hover:bg-sky-50 hover:text-sky-700 transition"
                    >
                      <ShoppingBag className="w-4 h-4 text-gray-500" />
                      <span>Browse Products</span>
                    </Link>
                  </div>

                  <div className="border-t border-gray-100 pt-1">
                    <button
                      onClick={handleLogout}
                      className="w-full flex items-center gap-2.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 transition cursor-pointer text-left"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <Link
                to="/owner-login"
                className="flex items-center gap-1.5 text-gray-700 hover:text-sky-600 px-3 py-1.5 rounded-xl font-medium text-xs transition"
              >
                <UserCircle className="w-4 h-4" />
                <span>Sign In</span>
              </Link>
              <Link
                to="/owner-login"
                className="soft-blue-card soft-blue-card-hover text-sky-700 px-4 py-2 rounded-xl text-xs font-bold transition shadow-xs"
              >
                Owner Portal
              </Link>
            </div>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          className="md:hidden p-2 rounded-xl hover:bg-gray-200 transition"
          aria-label="Toggle menu"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile Menu Drawer */}
      {isMenuOpen && (
        <div className="md:hidden px-5 py-4 space-y-3 bg-white/95 backdrop-blur-md border-t border-gray-200 text-sm shadow-md animate-fade-in-up">
          {user && (
            <div className="soft-blue-card p-3 rounded-2xl flex items-center justify-between">
              <div className="flex items-center gap-3">
                {user.avatar ? (
                  <img src={user.avatar} alt={user.fullName} className="w-10 h-10 rounded-xl object-cover" />
                ) : (
                  <div className="w-10 h-10 rounded-xl bg-gray-900 text-white flex items-center justify-center font-bold">
                    {user.fullName.charAt(0)}
                  </div>
                )}
                <div>
                  <p className="font-bold text-gray-900">{user.fullName}</p>
                  <p className="text-xs text-sky-600 font-semibold">{user.role.toUpperCase()}</p>
                </div>
              </div>
              <button
                onClick={handleLogout}
                className="text-red-600 p-2 rounded-lg hover:bg-red-50"
                title="Logout"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

          <Link
            to="/"
            onClick={() => setIsMenuOpen(false)}
            className="block text-gray-800 font-medium py-1.5"
          >
            Home
          </Link>
          <Link
            to="/shop"
            onClick={() => setIsMenuOpen(false)}
            className="block text-gray-800 font-medium py-1.5"
          >
            Collection
          </Link>
          {isOwnerOrAdmin && (
            <Link
              to="/admin"
              onClick={() => setIsMenuOpen(false)}
              className="block text-gray-800 font-medium py-1.5 text-sky-600"
            >
              Admin Dashboard
            </Link>
          )}
          <Link
            to="/cart"
            onClick={() => setIsMenuOpen(false)}
            className="flex items-center justify-between text-gray-800 font-medium py-1.5"
          >
            <span>Cart</span>
            {cartCount > 0 && (
              <span className="bg-sky-600 text-white text-xs px-2 py-0.5 rounded-full font-bold">
                {cartCount}
              </span>
            )}
          </Link>

          {!user && (
            <Link
              to="/owner-login"
              onClick={() => setIsMenuOpen(false)}
              className="block soft-blue-card text-sky-700 text-center py-2.5 rounded-xl font-bold mt-2"
            >
              Owner Login
            </Link>
          )}
        </div>
      )}
    </nav>
  )
}
