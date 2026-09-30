import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import {
  ArrowRight,
  ShieldCheck,
  Truck,
  Sparkles,
  Layers,
  Database,
  Server,
  Code2,
  CheckCircle2,
  Star,
  Lock,
  ArrowUpRight
} from 'lucide-react'

export default function Home() {
  const [isLogin, setIsLogin] = useState(false)
  const [authData, setAuthData] = useState({
    fullName: '',
    email: '',
    password: ''
  })
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)
  const { user, login, register, products, addToCart } = useStore()
  const navigate = useNavigate()

  const handleAuthSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setAuthError('')
    setAuthLoading(true)

    try {
      if (isLogin) {
        const ok = await login(authData.email, authData.password)
        if (ok) {
          navigate('/shop')
        } else {
          setAuthError('Invalid credentials. Please try again.')
        }
      } else {
        const ok = await register(authData.fullName, authData.email, authData.password)
        if (ok) {
          navigate('/shop')
        } else {
          setAuthError('Registration failed. Email might already be taken.')
        }
      }
    } catch {
      setAuthError('An error occurred during authentication.')
    } finally {
      setAuthLoading(false)
    }
  }

  // Pick top 4 products for showcase
  const featuredBags = products.slice(0, 4)

  return (
    <div className="w-full min-h-screen bg-[#f8f9fa] text-gray-900 pt-2 md:pt-4">
      {/* HERO SECTION WITH ANIMATED ACCENTS */}
      <section className="relative overflow-hidden px-4 md:px-12 py-12 md:py-20 max-w-[1400px] mx-auto animate-fade-in-up">
        {/* Soft background ambient gradient glow blobs */}
        <div className="absolute top-10 left-1/4 w-96 h-96 bg-sky-300/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-gentle" />
        <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-indigo-400/15 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse-gentle" />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* Left Column: Brand & Hero Content */}
          <div className="lg:col-span-7 space-y-6">
            {/* Tech Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full soft-blue-card text-sky-800 text-xs font-bold shadow-2xs">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-ping" />
              <span>Full-Stack MERN E-Commerce Architecture</span>
            </div>

            {/* Main Welcome Heading matching user's Image 2 */}
            <div className="space-y-2">
              <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-gray-900 leading-none">
                Welcome to{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-sky-600 via-sky-500 to-indigo-600">
                  Scatch
                </span>
                <span className="text-sky-600 animate-pulse">.</span>
              </h1>
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-700">
                Premium Bags Collection
              </h2>
            </div>

            <p className="text-lg text-gray-600 max-w-xl leading-relaxed">
              Discover our exclusive range of stylish, ergonomic, and durable bags crafted for everyday elegance and modern travel. Handcrafted with fine materials and contemporary aesthetics.
            </p>

            {/* Action Buttons matching user's Image 3 */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                to="/shop"
                className="inline-flex items-center gap-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-lg px-8 py-4 rounded-xl shadow-lg shadow-sky-600/25 hover:shadow-sky-600/40 hover:-translate-y-1 transition-all duration-200"
              >
                <span>Shop Now</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              {user?.role === 'admin' || user?.role === 'owner' ? (
                <Link
                  to="/admin"
                  className="inline-flex items-center gap-2 soft-blue-card soft-blue-card-hover text-sky-900 font-bold text-base px-6 py-4 rounded-xl shadow-xs transition"
                >
                  <Layers className="w-5 h-5 text-sky-600" />
                  <span>Admin Dashboard</span>
                </Link>
              ) : (
                <Link
                  to="/owner-login"
                  className="inline-flex items-center gap-2 soft-blue-card soft-blue-card-hover text-gray-800 font-bold text-base px-6 py-4 rounded-xl shadow-xs transition"
                >
                  <Lock className="w-4 h-4 text-sky-600" />
                  <span>Owner Portal</span>
                </Link>
              )}
            </div>

            {/* Quick Guarantees */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-gray-200/80">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Truck className="w-4 h-4 text-sky-600 shrink-0" />
                <span>Free Express Shipping</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>100% Genuine Leather</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Sparkles className="w-4 h-4 text-indigo-600 shrink-0" />
                <span>1-Year Warranty</span>
              </div>
            </div>
          </div>

          {/* Right Column: Hero Visual Card or Quick Customer Authentication */}
          <div className="lg:col-span-5">
            {user ? (
              /* If User Already Logged In: Show Showcase Card with the User's Image */
              <div className="relative bg-gradient-to-b from-white to-gray-50 p-8 rounded-3xl border border-gray-200 shadow-xl overflow-hidden text-center group hover-elevate">
                <div className="absolute top-0 right-0 w-32 h-32 bg-sky-100 rounded-bl-full -z-0 opacity-70" />
                
                {/* 3D Bag Icon matching user's Image 3 with Float Animation */}
                <div className="relative z-10 mx-auto w-40 h-40 mb-4 flex items-center justify-center animate-float">
                  <img
                    src="/bag-logo.svg"
                    alt="Scatch Bag"
                    className="w-full h-full object-contain filter drop-shadow-md"
                  />
                </div>

                <div className="relative z-10 space-y-2">
                  <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-bold rounded-full">
                    Welcome back, {user.fullName}!
                  </span>
                  <h3 className="text-2xl font-bold text-gray-900">
                    Explore New Arrivals
                  </h3>
                  <p className="text-sm text-gray-600 max-w-sm mx-auto">
                    Fresh colors and limited edition duffels, backpacks, and totes are now available in the shop.
                  </p>
                </div>

                <div className="relative z-10 mt-6 pt-6 border-t border-gray-100 flex flex-col gap-2.5">
                  <Link
                    to="/shop"
                    className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 px-6 rounded-xl transition shadow-sm hover:shadow-md"
                  >
                    View All Products
                  </Link>
                  <Link
                    to="/cart"
                    className="w-full soft-blue-card soft-blue-card-hover text-sky-900 font-semibold py-3 px-6 rounded-xl transition"
                  >
                    Go to Cart
                  </Link>
                </div>
              </div>
            ) : (
              /* If Not Logged In: Show Elevated Account Gate (Login / Register) with Float Bag */
              <div className="bg-white rounded-3xl border border-gray-200 p-8 shadow-xl relative overflow-hidden hover-elevate">
                <div className="flex items-center justify-between border-b border-gray-100 pb-4 mb-6">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900">
                      {isLogin ? 'Login to Scatch' : 'Create an Account'}
                    </h3>
                    <p className="text-xs text-gray-500 mt-0.5">
                      {isLogin
                        ? 'Access your orders and expedited checkout'
                        : 'Join Scatch for exclusive drops and discounts'}
                    </p>
                  </div>
                  {/* Bag Icon Card in Top Right */}
                  <div className="w-12 h-12 shrink-0 animate-float">
                    <img src="/bag-logo.svg" alt="Bag" className="w-full h-full object-contain" />
                  </div>
                </div>

                {authError && (
                  <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 font-medium">
                    {authError}
                  </div>
                )}

                <form onSubmit={handleAuthSubmit} className="space-y-4">
                  {!isLogin && (
                    <div>
                      <label className="block text-xs font-semibold text-gray-700 mb-1">
                        Full Name
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ahmad Khan"
                        value={authData.fullName}
                        onChange={(e) => setAuthData({ ...authData, fullName: e.target.value })}
                        required
                        className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 transition"
                      />
                    </div>
                  )}

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Email Address
                    </label>
                    <input
                      type="email"
                      placeholder="name@example.com"
                      value={authData.email}
                      onChange={(e) => setAuthData({ ...authData, email: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 transition"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-gray-700 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      placeholder="••••••••"
                      value={authData.password}
                      onChange={(e) => setAuthData({ ...authData, password: e.target.value })}
                      required
                      className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 transition"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={authLoading}
                    className="w-full mt-2 py-3.5 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition shadow-md hover:shadow-lg disabled:opacity-50 cursor-pointer"
                  >
                    {authLoading
                      ? 'Please wait...'
                      : isLogin
                      ? 'Sign In to Account'
                      : 'Create My Account'}
                  </button>
                </form>

                <div className="mt-6 text-center text-xs text-gray-600 border-t border-gray-100 pt-4">
                  {isLogin ? (
                    <p>
                      Don&apos;t have an account yet?{' '}
                      <button
                        onClick={() => {
                          setIsLogin(false)
                          setAuthError('')
                        }}
                        className="text-sky-600 font-bold hover:underline cursor-pointer"
                      >
                        Create one free
                      </button>
                    </p>
                  ) : (
                    <p>
                      Already have an account?{' '}
                      <button
                        onClick={() => {
                          setIsLogin(true)
                          setAuthError('')
                        }}
                        className="text-sky-600 font-bold hover:underline cursor-pointer"
                      >
                        Sign in here
                      </button>
                    </p>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* MERN STACK & COMPLETE WEBSITE INFORMATION SECTION */}
      <section className="bg-white border-y border-gray-200 py-16 px-4 md:px-12">
        <div className="max-w-[1400px] mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-3">
            <span className="text-xs uppercase font-extrabold tracking-wider text-sky-700 soft-blue-card px-3.5 py-1 rounded-full inline-block">
              Full-Stack Architecture
            </span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Engineered with Modern MERN Technologies
            </h2>
            <p className="text-gray-600 text-sm md:text-base">
              Scatch is developed end-to-end with high-performance production standards, featuring strict schema validations, role-based authorization, and real-time inventory management.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* MongoDB Card */}
            <div className="p-6 rounded-2xl bg-[#fafafa] border border-gray-200/90 hover:border-emerald-300 hover-elevate transition-all group">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Database className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">MongoDB Atlas</h3>
              <p className="text-xs text-emerald-600 font-semibold mb-2">Cloud Database</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Stores catalog items, user carts, order histories, and category relations with Mongoose schema indexing.
              </p>
            </div>

            {/* Express Card */}
            <div className="p-6 rounded-2xl bg-[#fafafa] border border-gray-200/90 hover:border-sky-300 hover-elevate transition-all group">
              <div className="w-12 h-12 rounded-xl bg-sky-50 text-sky-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Server className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Express.js 5</h3>
              <p className="text-xs text-sky-600 font-semibold mb-2">Backend REST API</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Optimized controllers, async error handlers, JWT auth middlewares, and automated image pipelines via Cloudinary.
              </p>
            </div>

            {/* React Card */}
            <div className="p-6 rounded-2xl bg-[#fafafa] border border-gray-200/90 hover:border-indigo-300 hover-elevate transition-all group">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <Code2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">React 19 + Vite</h3>
              <p className="text-xs text-indigo-600 font-semibold mb-2">Modern Frontend</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Fast modular components, centralized route handling, context-driven state, and reactive cart computation.
              </p>
            </div>

            {/* Node.js Card */}
            <div className="p-6 rounded-2xl bg-[#fafafa] border border-gray-200/90 hover:border-amber-300 hover-elevate transition-all group">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-bold text-gray-900 mb-1">Secure Node.js</h3>
              <p className="text-xs text-amber-600 font-semibold mb-2">Security & Roles</p>
              <p className="text-xs text-gray-600 leading-relaxed">
                Bcrypt password hashing, HTTP-only secure cookie tokens, and strict owner authorization protection on admin endpoints.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED BAGS SPOTLIGHT SECTION */}
      <section className="px-4 md:px-12 py-16 max-w-[1400px] mx-auto">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-sky-600">Trending Now</span>
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 tracking-tight">
              Featured Luxury Bags
            </h2>
          </div>
          <Link
            to="/shop"
            className="inline-flex items-center gap-2 text-sky-600 hover:text-sky-700 font-bold text-sm group"
          >
            <span>Explore All Bags</span>
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredBags.map((product) => (
            <div
              key={product.id}
              className="rounded-3xl overflow-hidden border border-gray-200/80 shadow-xs hover-elevate transition-all duration-300 flex flex-col group bg-white"
            >
              {/* Image Frame with Bag Background Color */}
              <div
                className="h-[230px] flex items-center justify-center p-6 relative overflow-hidden transition-colors"
                style={{ backgroundColor: product.bgColor || '#E9D3CB' }}
              >
                {product.discountPercent ? (
                  <span className="absolute top-3 left-3 bg-red-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded-full shadow-xs">
                    {product.discountPercent}% OFF
                  </span>
                ) : null}

                <img
                  src={product.image}
                  alt={product.name}
                  className="h-full w-full object-contain group-hover:scale-110 transition-transform duration-300 filter drop-shadow-xs"
                />
              </div>

              {/* Panel Details */}
              <div
                className="p-4 flex-1 flex flex-col justify-between"
                style={{
                  backgroundColor: product.panelColor || '#D1B1A3',
                  color: product.textColor || '#5E4032'
                }}
              >
                <div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-[11px] font-bold uppercase tracking-wider opacity-80">
                      {product.category}
                    </span>
                    <span className="text-xs font-semibold opacity-90">
                      Stock: {product.stock}
                    </span>
                  </div>
                  <h4 className="text-2xl font-bold tracking-tight leading-tight">
                    {product.name}
                  </h4>
                </div>

                <div className="flex items-center justify-between mt-4 pt-3 border-t border-black/10">
                  <span className="text-2xl font-extrabold">₹ {product.price}</span>
                  <button
                    onClick={() => addToCart(product)}
                    className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 hover:bg-white text-gray-800 text-xs font-bold shadow-xs hover:scale-105 active:scale-95 transition-all cursor-pointer"
                    title="Add to Cart"
                  >
                    <span>Add</span>
                    <span>+</span>
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* WHY CHOOSE SCATCH PILLARS */}
      <section className="bg-gradient-to-b from-gray-900 to-black text-white py-16 px-4 md:px-12">
        <div className="max-w-[1400px] mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-sky-500/40 hover-elevate transition">
              <div className="w-12 h-12 rounded-2xl bg-sky-500/20 text-sky-400 flex items-center justify-center mb-4">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Ergonomic Luxury</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Designed with weight distribution technology to ensure all-day comfort whether commuting, gymming, or travelling.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-sky-500/40 hover-elevate transition">
              <div className="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-4">
                <Star className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Signature Aesthetic</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Unique pastel panel harmonies paired with durable metallic zippers and weatherproof protective linings.
              </p>
            </div>

            <div className="p-8 rounded-3xl bg-white/5 border border-white/10 hover:border-sky-500/40 hover-elevate transition">
              <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-4">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2">Guaranteed Durability</h3>
              <p className="text-sm text-gray-400 leading-relaxed">
                Each bag undergoes intensive stress testing to resist tears, rain, and heavy loads across thousands of journeys.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}