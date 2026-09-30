import { useState } from 'react'
import type { FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import {
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Lock,
  Truck,
  CreditCard,
  Banknote,
  Smartphone,
  Trash2,
  UserCheck
} from 'lucide-react'

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart, user, login, register, placeOrder } =
    useStore()

  const [address, setAddress] = useState('Flat 402, Royal Residency, Main Blvd')
  const [contactPhone, setContactPhone] = useState('+92 300 1234567')
  const [paymentMethod, setPaymentMethod] = useState<'COD' | 'ONLINE' | 'CARD'>('COD')

  // Auth Modal State (When non-logged-in user tries to pay)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [isLoginTab, setIsLoginTab] = useState(true)
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authFullName, setAuthFullName] = useState('')
  const [authError, setAuthError] = useState('')
  const [authLoading, setAuthLoading] = useState(false)

  // Order Success Screen State
  const [placedOrderId, setPlacedOrderId] = useState<string | null>(null)
  const [isPlacingOrder, setIsPlacingOrder] = useState(false)

  const totalMrp = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = cartItems.reduce((sum, item) => {
    const discount = item.discountPercent
      ? Math.round((item.price * item.discountPercent) / 100)
      : 0
    return sum + discount * item.quantity
  }, 0)
  const platformFee = cartItems.length > 0 ? 20 : 0
  const shippingFee = 0
  const totalAmount = totalMrp - discountAmount + platformFee + shippingFee

  const handleCheckoutClick = () => {
    if (!user) {
      setShowAuthModal(true)
      return
    }
    handleExecuteOrder()
  }

  const handleExecuteOrder = async () => {
    if (!address.trim()) {
      alert('Please provide your complete delivery address.')
      return
    }

    setIsPlacingOrder(true)
    const result = await placeOrder(
      `${address} (Phone: ${contactPhone})`,
      paymentMethod
    )
    setIsPlacingOrder(false)

    if (result.success && result.orderId) {
      setPlacedOrderId(result.orderId)
    } else {
      alert(result.message || 'Failed to place order. Please try again.')
    }
  }

  const handleModalAuth = async (e: FormEvent) => {
    e.preventDefault()
    setAuthError('')
    setAuthLoading(true)

    try {
      if (isLoginTab) {
        const ok = await login(authEmail, authPassword)
        if (ok) {
          setShowAuthModal(false)
        } else {
          setAuthError('Invalid credentials. Please verify your email and password.')
        }
      } else {
        const ok = await register(authFullName, authEmail, authPassword)
        if (ok) {
          setShowAuthModal(false)
        } else {
          setAuthError('Registration failed. Please try a different email.')
        }
      }
    } catch {
      setAuthError('Authentication error. Please try again.')
    } finally {
      setAuthLoading(false)
    }
  }

  // ORDER SUCCESS SCREEN
  if (placedOrderId) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 pt-24 pb-16">
        <div className="max-w-md w-full bg-white rounded-3xl p-8 border border-gray-200 shadow-2xl text-center space-y-6 animate-in zoom-in-95 duration-200">
          <div className="w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-inner">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <div className="space-y-2">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Order Confirmed
            </span>
            <h2 className="text-3xl font-extrabold text-gray-900">Thank You!</h2>
            <p className="text-sm text-gray-600">
              Your order has been recorded and is now being packaged with utmost care.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-gray-50 border border-gray-200 text-left space-y-2 text-xs">
            <div className="flex justify-between">
              <span className="text-gray-500 font-semibold">Order Tracking ID:</span>
              <span className="font-mono font-bold text-sky-600">{placedOrderId}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-semibold">Customer:</span>
              <span className="font-bold text-gray-900">{user?.fullName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-semibold">Total Paid:</span>
              <span className="font-bold text-emerald-600">₹ {totalAmount}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-semibold">Payment Method:</span>
              <span className="font-bold text-gray-900">{paymentMethod}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-500 font-semibold">Estimated Delivery:</span>
              <span className="font-bold text-gray-900">2-3 Business Days</span>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-2">
            <Link
              to="/shop"
              className="w-full bg-sky-600 hover:bg-sky-700 text-white font-semibold py-3 rounded-xl transition shadow-md"
            >
              Continue Shopping
            </Link>
            {user?.role === 'admin' || user?.role === 'owner' ? (
              <Link
                to="/admin"
                className="w-full bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 rounded-xl transition text-xs"
              >
                View in Admin Dashboard
              </Link>
            ) : null}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 md:px-8 pt-24 pb-16 max-w-[1400px] mx-auto min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-300 pb-6 mb-8">
        <div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight leading-none">
            Shopping Cart<span className="text-sky-600">.</span>
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Review your chosen luxury bags and complete your purchase
          </p>
        </div>
        <span className="text-sm font-semibold bg-gray-100 text-gray-700 px-3.5 py-1.5 rounded-full">
          {cartItems.reduce((s, it) => s + it.quantity, 0)} Items
        </span>
      </div>

      {cartItems.length === 0 ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center space-y-4 max-w-sm">
            <div className="w-20 h-20 bg-sky-50 text-sky-600 rounded-3xl flex items-center justify-center mx-auto text-4xl shadow-inner">
              👜
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Your cart is empty</h2>
            <p className="text-sm text-gray-500">
              Looks like you haven&apos;t added any luxury bags to your bag collection yet.
            </p>
            <Link
              to="/shop"
              className="inline-flex items-center gap-2 rounded-xl bg-black hover:bg-gray-800 text-white px-6 py-3 font-semibold text-sm transition shadow-md"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Cart Items List */}
          <div className="lg:col-span-7 space-y-4">
            {cartItems.map((item) => (
              <article
                key={item.id}
                className="rounded-2xl border border-gray-200 bg-white p-4 shadow-2xs hover:shadow-md transition flex flex-col sm:flex-row gap-4 items-center"
              >
                {/* Product Thumbnail */}
                <div
                  className="w-full sm:w-44 h-36 rounded-xl flex items-center justify-center p-3 relative shrink-0"
                  style={{ backgroundColor: item.bgColor || '#E9D3CB' }}
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="h-full w-full object-contain filter drop-shadow-xs"
                  />
                  {item.discountPercent ? (
                    <span className="absolute top-2 left-2 text-[10px] font-extrabold bg-red-600 text-white px-1.5 py-0.5 rounded">
                      -{item.discountPercent}%
                    </span>
                  ) : null}
                </div>

                {/* Info & Quantity Controls */}
                <div className="flex-1 w-full flex flex-col justify-between h-full space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <span className="text-[11px] font-extrabold uppercase tracking-wider text-sky-600">
                        {item.category}
                      </span>
                      <h3 className="text-xl font-bold text-gray-900 leading-tight">
                        {item.name}
                      </h3>
                      <p className="text-xs text-gray-500 line-clamp-1">{item.description}</p>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-gray-400 hover:text-red-600 p-1.5 rounded-lg hover:bg-red-50 transition cursor-pointer"
                      title="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                    {/* Quantity Picker */}
                    <div className="flex items-center gap-2 bg-gray-100 rounded-xl p-1">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-7 h-7 rounded-lg bg-white shadow-2xs text-gray-700 font-bold hover:bg-gray-200 transition flex items-center justify-center cursor-pointer"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-sm font-bold text-gray-900">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-7 h-7 rounded-lg bg-white shadow-2xs text-gray-700 font-bold hover:bg-gray-200 transition flex items-center justify-center cursor-pointer"
                      >
                        +
                      </button>
                    </div>

                    {/* Net Price */}
                    <div className="text-right">
                      <span className="text-xs text-gray-400 block font-medium">Subtotal</span>
                      <span className="text-xl font-extrabold text-gray-900">
                        ₹ {item.price * item.quantity}
                      </span>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          {/* Right Column: Order Summary & Checkout Form */}
          <div className="lg:col-span-5 space-y-6">
            <aside className="bg-white rounded-3xl border border-gray-200 p-6 md:p-8 shadow-md space-y-6">
              <h3 className="text-2xl font-bold text-gray-900 border-b border-gray-100 pb-4">
                Price Breakdown
              </h3>

              {/* Breakdown List */}
              <div className="space-y-3 text-sm border-b border-gray-100 pb-5">
                <div className="flex justify-between text-gray-600">
                  <span>Total MRP</span>
                  <span className="font-semibold text-gray-900">₹ {totalMrp}</span>
                </div>
                <div className="flex justify-between text-emerald-600 font-semibold">
                  <span>Discount on MRP</span>
                  <span>- ₹ {discountAmount}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Platform Fee</span>
                  <span className="font-semibold text-gray-900">₹ {platformFee}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping Fee</span>
                  <span className="font-bold text-emerald-600">FREE</span>
                </div>
              </div>

              {/* Total Payable */}
              <div className="flex justify-between items-center py-2">
                <div>
                  <span className="text-lg font-bold text-gray-900 block">Total Amount</span>
                  <span className="text-xs text-gray-400">Inclusive of all taxes</span>
                </div>
                <span className="text-3xl font-extrabold text-emerald-600">
                  ₹ {totalAmount}
                </span>
              </div>

              {/* Delivery Details Form */}
              <div className="space-y-3 pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-bold text-gray-700 uppercase tracking-wider flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5 text-sky-600" />
                    <span>Shipping Address</span>
                  </label>
                  {user && (
                    <span className="text-[11px] text-emerald-600 font-bold flex items-center gap-1">
                      <UserCheck className="w-3 h-3" />
                      <span>{user.fullName}</span>
                    </span>
                  )}
                </div>
                <input
                  type="text"
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Enter house no, street, city..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  required
                />
                <input
                  type="text"
                  value={contactPhone}
                  onChange={(e) => setContactPhone(e.target.value)}
                  placeholder="Contact phone number..."
                  className="w-full px-3.5 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-xs font-medium focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Payment Methods */}
              <div className="space-y-2">
                <label className="text-xs font-bold text-gray-700 uppercase tracking-wider block">
                  Select Payment Method
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('COD')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                      paymentMethod === 'COD'
                        ? 'border-sky-600 bg-sky-50 text-sky-700 shadow-xs'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Banknote className="w-4 h-4 mb-1" />
                    <span>Cash (COD)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('CARD')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                      paymentMethod === 'CARD'
                        ? 'border-sky-600 bg-sky-50 text-sky-700 shadow-xs'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <CreditCard className="w-4 h-4 mb-1" />
                    <span>Credit Card</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('ONLINE')}
                    className={`flex flex-col items-center justify-center p-3 rounded-xl border text-xs font-semibold transition cursor-pointer ${
                      paymentMethod === 'ONLINE'
                        ? 'border-sky-600 bg-sky-50 text-sky-700 shadow-xs'
                        : 'border-gray-200 bg-gray-50 text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <Smartphone className="w-4 h-4 mb-1" />
                    <span>UPI / Online</span>
                  </button>
                </div>
              </div>

              {/* Checkout Trigger Button */}
              <button
                onClick={handleCheckoutClick}
                disabled={isPlacingOrder}
                className="w-full bg-black hover:bg-gray-800 text-white font-bold py-4 rounded-xl text-base shadow-lg hover:shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>
                  {isPlacingOrder
                    ? 'Processing Order...'
                    : user
                    ? `Place Order • ₹ ${totalAmount}`
                    : 'Sign In & Place Order'}
                </span>
              </button>

              <div className="flex items-center justify-center gap-2 text-xs text-gray-400 pt-1">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <span>256-Bit SSL Encrypted & Secure Checkout</span>
              </div>
            </aside>
          </div>
        </div>
      )}

      {/* CUSTOMER LOGIN MODAL (Triggered when non-logged-in user tries to pay) */}
      {showAuthModal && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 md:p-8 max-w-md w-full shadow-2xl space-y-6 relative">
            <button
              onClick={() => setShowAuthModal(false)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 p-2 text-sm font-bold"
            >
              ✕
            </button>

            <div className="text-center space-y-1">
              <div className="w-12 h-12 rounded-2xl bg-sky-50 text-sky-600 flex items-center justify-center mx-auto mb-2 text-2xl">
                👜
              </div>
              <h3 className="text-2xl font-bold text-gray-900">
                {isLoginTab ? 'Customer Login Required' : 'Create Customer Account'}
              </h3>
              <p className="text-xs text-gray-500">
                Please login to confirm your identity and complete payment for your order.
              </p>
            </div>

            {authError && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
                {authError}
              </div>
            )}

            <form onSubmit={handleModalAuth} className="space-y-4">
              {!isLoginTab && (
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Your Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Zainab Fatima"
                    value={authFullName}
                    onChange={(e) => setAuthFullName(e.target.value)}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@example.com"
                  value={authEmail}
                  onChange={(e) => setAuthEmail(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Password
                </label>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  value={authPassword}
                  onChange={(e) => setAuthPassword(e.target.value)}
                  className="w-full px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <button
                type="submit"
                disabled={authLoading}
                className="w-full py-3 bg-sky-600 hover:bg-sky-700 text-white font-semibold rounded-xl transition shadow-md cursor-pointer disabled:opacity-50"
              >
                {authLoading ? 'Verifying...' : isLoginTab ? 'Login & Continue' : 'Sign Up & Continue'}
              </button>
            </form>

            <div className="text-center text-xs text-gray-500 pt-2 border-t border-gray-100">
              {isLoginTab ? (
                <p>
                  New customer?{' '}
                  <button
                    onClick={() => {
                      setIsLoginTab(false)
                      setAuthError('')
                    }}
                    className="text-sky-600 font-bold hover:underline cursor-pointer"
                  >
                    Register here
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button
                    onClick={() => {
                      setIsLoginTab(true)
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
        </div>
      )}
    </div>
  )
}
