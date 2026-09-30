import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import type { Order } from '../types/products'
import {
  TrendingUp,
  Package,
  ShoppingBag,
  PlusCircle,
  Trash2,
  Search,
  Filter,
  Clock,
  CheckCircle,
  Truck,
  AlertCircle,
  ChevronDown,
  Users,
  BarChart3
} from 'lucide-react'

// Mini bag thumbnail components matching Image 1
function BagThumbBackpack() {
  return (
    <svg viewBox="0 0 40 40" className="w-8 h-8 object-contain">
      <defs>
        <linearGradient id="bpGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2c3038" />
          <stop offset="100%" stopColor="#111317" />
        </linearGradient>
      </defs>
      <path d="M16 10 C16 7 24 7 24 10" fill="none" stroke="#4b5563" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="10" y="10" width="20" height="23" rx="6" fill="url(#bpGrad)" />
      <rect x="13" y="20" width="14" height="11" rx="3.5" fill="#1f2329" stroke="#374151" strokeWidth="1" />
      <line x1="16" y1="23" x2="24" y2="23" stroke="#9ca3af" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  )
}

function BagThumbDuffel() {
  return (
    <svg viewBox="0 0 40 40" className="w-8 h-8 object-contain">
      <defs>
        <linearGradient id="dfGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#2e333d" />
          <stop offset="100%" stopColor="#15171c" />
        </linearGradient>
      </defs>
      <path d="M14 13 C14 8 26 8 26 13" fill="none" stroke="#4b5563" strokeWidth="2.2" strokeLinecap="round" />
      <rect x="7" y="14" width="26" height="17" rx="7" fill="url(#dfGrad)" />
      <line x1="14" y1="14" x2="14" y2="31" stroke="#374151" strokeWidth="1.5" />
      <line x1="26" y1="14" x2="26" y2="31" stroke="#374151" strokeWidth="1.5" />
      <line x1="11" y1="18" x2="29" y2="18" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round" />
    </svg>
  )
}

function BagThumbTote() {
  return (
    <svg viewBox="0 0 40 40" className="w-8 h-8 object-contain">
      <defs>
        <linearGradient id="ttGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#b46a36" />
          <stop offset="100%" stopColor="#7c3a14" />
        </linearGradient>
      </defs>
      <path d="M15 14 C15 7 25 7 25 14" fill="none" stroke="#683011" strokeWidth="2" strokeLinecap="round" />
      <path d="M10 14 L30 14 L28 32 C28 33 27 34 26 34 L14 34 C13 34 12 33 12 32 Z" fill="url(#ttGrad)" />
      <line x1="16" y1="14" x2="16" y2="24" stroke="#e08e4e" strokeWidth="1" strokeDasharray="1.5 1" />
      <line x1="24" y1="14" x2="24" y2="24" stroke="#e08e4e" strokeWidth="1" strokeDasharray="1.5 1" />
    </svg>
  )
}

function BagThumbPouch() {
  return (
    <svg viewBox="0 0 40 40" className="w-8 h-8 object-contain">
      <defs>
        <linearGradient id="poGrad" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#373d49" />
          <stop offset="100%" stopColor="#1a1d23" />
        </linearGradient>
      </defs>
      <rect x="8" y="15" width="24" height="15" rx="4" fill="url(#poGrad)" />
      <path d="M8 18 L32 18" stroke="#111827" strokeWidth="1.5" />
      <line x1="12" y1="16" x2="28" y2="16" stroke="#9ca3af" strokeWidth="1" strokeLinecap="round" />
      <rect x="6" y="20" width="2.5" height="5" rx="1" fill="#4b5563" />
    </svg>
  )
}

export default function Admin() {
  const { products, removeProduct, clearProducts, orders, updateOrderStatus, user } = useStore()
  const [activeTab, setActiveTab] = useState<'analytics' | 'products' | 'orders'>('analytics')
  const [productSearch, setProductSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [orderStatusFilter, setOrderStatusFilter] = useState('ALL')
  const [showClearConfirm, setShowClearConfirm] = useState(false)

  // Chart interactivity states
  const [overviewMetric, setOverviewMetric] = useState<'revenue' | 'orders' | 'customers'>('revenue')
  const [hoveredMonthIndex, setHoveredMonthIndex] = useState<number>(4) // Default to May (index 4) matching Image 1

  // 12-month data for Revenue & Orders Overview matching Image 1
  const monthlyOverviewData = [
    { month: 'Jan', revenue: 16000, orders: 34, barHeight: '22%' },
    { month: 'Feb', revenue: 24500, orders: 58, barHeight: '48%' },
    { month: 'Mar', revenue: 18000, orders: 40, barHeight: '28%' },
    { month: 'Apr', revenue: 19500, orders: 44, barHeight: '32%' },
    { month: 'May', revenue: 32400, orders: 78, barHeight: '34%' },
    { month: 'Jun', revenue: 22000, orders: 52, barHeight: '42%' },
    { month: 'Jul', revenue: 26500, orders: 62, barHeight: '48%' },
    { month: 'Aug', revenue: 25000, orders: 58, barHeight: '52%' },
    { month: 'Sep', revenue: 29000, orders: 68, barHeight: '58%' },
    { month: 'Oct', revenue: 34000, orders: 74, barHeight: '66%' },
    { month: 'Nov', revenue: 41000, orders: 88, barHeight: '82%' },
    { month: 'Dec', revenue: 39500, orders: 82, barHeight: '86%' },
  ]

  // Filtered Products for Tab 2
  const filteredProducts = products.filter((p) => {
    const matchesSearch =
      p.name.toLowerCase().includes(productSearch.toLowerCase()) ||
      p.category.toLowerCase().includes(productSearch.toLowerCase())
    const matchesCategory =
      categoryFilter === 'ALL' || p.category.toLowerCase() === categoryFilter.toLowerCase()
    return matchesSearch && matchesCategory
  })

  // Filtered Orders for Tab 3
  const filteredOrders = orders.filter((ord) => {
    if (orderStatusFilter === 'ALL') return true
    return ord.status === orderStatusFilter
  })

  return (
    <div className="min-h-screen bg-[#f8f9fa] pt-6 pb-16 px-4 md:px-8 max-w-[1400px] mx-auto">
      {/* Top Header & Breadcrumb matching Image 2 */}
      <div className="flex flex-col md:flex-row md:items-center justify-between pb-6 mb-8 border-b border-gray-300 gap-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-sky-600 mb-1">
            <span>OWNER PORTAL</span>
            <span>•</span>
            <span>VERIFIED ADMIN: {user?.fullName?.toUpperCase() || 'MUHAMMAD'}</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Admin Dashboard<span className="text-sky-600">.</span>
          </h1>
        </div>

        {/* Action CTAs matching Image 2 */}
        <div className="flex items-center gap-3">
          <Link
            to="/admin/create-product"
            className="flex items-center gap-2 bg-black hover:bg-gray-800 text-white font-semibold px-5 py-2.5 rounded-xl shadow-xs transition"
          >
            <PlusCircle className="w-4 h-4 text-emerald-400" />
            <span>New Product</span>
          </Link>
          <button
            onClick={() => setShowClearConfirm(true)}
            className="flex items-center gap-2 bg-red-50 hover:bg-red-100 text-red-600 font-semibold px-4 py-2.5 rounded-xl border border-red-200 transition cursor-pointer"
          >
            <Trash2 className="w-4 h-4" />
            <span>Delete All</span>
          </button>
        </div>
      </div>

      {/* Navigation Tabs matching Image 2 */}
      <div className="flex items-center gap-2 border-b border-gray-200 mb-8 overflow-x-auto pb-1">
        <button
          onClick={() => setActiveTab('analytics')}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-sm rounded-t-xl transition cursor-pointer border-b-2 ${
            activeTab === 'analytics'
              ? 'border-sky-600 text-sky-600 bg-sky-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>Analytics & Sales</span>
        </button>

        <button
          onClick={() => setActiveTab('products')}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-sm rounded-t-xl transition cursor-pointer border-b-2 ${
            activeTab === 'products'
              ? 'border-sky-600 text-sky-600 bg-sky-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Product Collection ({products.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('orders')}
          className={`flex items-center gap-2 px-5 py-3 font-bold text-sm rounded-t-xl transition cursor-pointer border-b-2 ${
            activeTab === 'orders'
              ? 'border-sky-600 text-sky-600 bg-sky-50/50'
              : 'border-transparent text-gray-500 hover:text-gray-900'
          }`}
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Customer Orders ({orders.length})</span>
        </button>
      </div>

      {/* TAB 1: EXECUTIVE ANALYTICS DASHBOARD MATCHING USER'S EXACT IMAGE 1 */}
      {activeTab === 'analytics' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* 1. TOP 4 METRIC CARDS WITH SMOOTH WAVE GRAPHS */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Total Revenue */}
            <div className="bg-white rounded-2xl pt-6 px-6 pb-2 border border-gray-100 shadow-2xs hover:shadow-md transition relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100/70 text-emerald-600 flex items-center justify-center font-bold text-lg">
                    ₹
                  </div>
                  <span className="text-sm font-semibold text-gray-500">Total Revenue</span>
                </div>
                <p className="text-3xl font-extrabold text-gray-900 tracking-tight">₹ 7,630</p>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600">
                  <span className="text-sm">↗</span>
                  <span>+18.4% from last month</span>
                </div>
              </div>
              {/* Green SVG sparkline wave at bottom */}
              <div className="w-full -mx-6 -mb-2 mt-4 overflow-hidden">
                <svg viewBox="0 0 300 56" preserveAspectRatio="none" className="w-full h-12">
                  <defs>
                    <linearGradient id="waveGreen" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#10b981" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#10b981" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,38 C35,42 60,22 100,28 C140,34 175,16 215,22 C255,28 275,14 300,18 L300,56 L0,56 Z"
                    fill="url(#waveGreen)"
                  />
                  <path
                    d="M0,38 C35,42 60,22 100,28 C140,34 175,16 215,22 C255,28 275,14 300,18"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Total Orders */}
            <div className="bg-white rounded-2xl pt-6 px-6 pb-2 border border-gray-100 shadow-2xs hover:shadow-md transition relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100/70 text-sky-600 flex items-center justify-center">
                    <ShoppingBag className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-gray-500">Total Orders</span>
                </div>
                <p className="text-3xl font-extrabold text-gray-900 tracking-tight">245</p>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-sky-600">
                  <span className="text-sm">↗</span>
                  <span>+12.5% from last month</span>
                </div>
              </div>
              {/* Blue SVG sparkline wave */}
              <div className="w-full -mx-6 -mb-2 mt-4 overflow-hidden">
                <svg viewBox="0 0 300 56" preserveAspectRatio="none" className="w-full h-12">
                  <defs>
                    <linearGradient id="waveBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,45 C40,48 70,22 110,24 C150,26 170,42 210,26 C250,14 275,30 300,16 L300,56 L0,56 Z"
                    fill="url(#waveBlue)"
                  />
                  <path
                    d="M0,45 C40,48 70,22 110,24 C150,26 170,42 210,26 C250,14 275,30 300,16"
                    fill="none"
                    stroke="#3b82f6"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Total Customers */}
            <div className="bg-white rounded-2xl pt-6 px-6 pb-2 border border-gray-100 shadow-2xs hover:shadow-md transition relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-100/70 text-purple-600 flex items-center justify-center">
                    <Users className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-gray-500">Total Customers</span>
                </div>
                <p className="text-3xl font-extrabold text-gray-900 tracking-tight">890</p>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-purple-600">
                  <span className="text-sm">↗</span>
                  <span>+22.1% from last month</span>
                </div>
              </div>
              {/* Purple SVG sparkline wave */}
              <div className="w-full -mx-6 -mb-2 mt-4 overflow-hidden">
                <svg viewBox="0 0 300 56" preserveAspectRatio="none" className="w-full h-12">
                  <defs>
                    <linearGradient id="wavePurple" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#a855f7" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#a855f7" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,42 C30,44 60,18 95,36 C135,52 170,20 210,28 C250,34 275,16 300,20 L300,56 L0,56 Z"
                    fill="url(#wavePurple)"
                  />
                  <path
                    d="M0,42 C30,44 60,18 95,36 C135,52 170,20 210,28 C250,34 275,16 300,20"
                    fill="none"
                    stroke="#a855f7"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>

            {/* Conversion Rate */}
            <div className="bg-white rounded-2xl pt-6 px-6 pb-2 border border-gray-100 shadow-2xs hover:shadow-md transition relative overflow-hidden flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-3 mb-3">
                  <div className="w-10 h-10 rounded-xl bg-amber-100/70 text-amber-600 flex items-center justify-center">
                    <BarChart3 className="w-5 h-5" />
                  </div>
                  <span className="text-sm font-semibold text-gray-500">Conversion Rate</span>
                </div>
                <p className="text-3xl font-extrabold text-gray-900 tracking-tight">4.8%</p>
                <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-600">
                  <span className="text-sm">↗</span>
                  <span>+0.6% from last month</span>
                </div>
              </div>
              {/* Amber SVG sparkline wave */}
              <div className="w-full -mx-6 -mb-2 mt-4 overflow-hidden">
                <svg viewBox="0 0 300 56" preserveAspectRatio="none" className="w-full h-12">
                  <defs>
                    <linearGradient id="waveAmber" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.25" />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.0" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M0,40 C35,42 65,16 100,28 C140,40 175,12 215,22 C255,30 275,10 300,24 L300,56 L0,56 Z"
                    fill="url(#waveAmber)"
                  />
                  <path
                    d="M0,40 C35,42 65,16 100,28 C140,40 175,12 215,22 C255,30 275,10 300,24"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                  />
                </svg>
              </div>
            </div>
          </div>

          {/* 2. MIDDLE ROW: REVENUE & ORDERS OVERVIEW + SALES BY CATEGORY */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left 8 Cols: Revenue & Orders Overview */}
            <div className="lg:col-span-8 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-2xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-gray-100 gap-4">
                <div>
                  <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">
                    Revenue & Orders Overview
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">Track your business performance over time.</p>
                </div>

                <div className="flex items-center gap-3">
                  {/* Pills selector */}
                  <div className="flex items-center bg-gray-100/80 p-1 rounded-xl text-xs font-semibold">
                    <button
                      onClick={() => setOverviewMetric('revenue')}
                      className={`px-3 py-1.5 rounded-lg transition ${
                        overviewMetric === 'revenue'
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Revenue
                    </button>
                    <button
                      onClick={() => setOverviewMetric('orders')}
                      className={`px-3 py-1.5 rounded-lg transition ${
                        overviewMetric === 'orders'
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Orders
                    </button>
                    <button
                      onClick={() => setOverviewMetric('customers')}
                      className={`px-3 py-1.5 rounded-lg transition ${
                        overviewMetric === 'customers'
                          ? 'bg-sky-600 text-white shadow-xs'
                          : 'text-gray-600 hover:text-gray-900'
                      }`}
                    >
                      Customers
                    </button>
                  </div>

                  {/* Dropdown */}
                  <div className="relative">
                    <select className="appearance-none bg-white border border-gray-200 text-gray-700 text-xs font-semibold py-1.5 pl-3 pr-7 rounded-xl focus:outline-hidden cursor-pointer shadow-2xs">
                      <option>Monthly</option>
                      <option>Weekly</option>
                      <option>Yearly</option>
                    </select>
                    <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  </div>
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-end gap-5 py-4 text-xs font-semibold text-gray-600">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-600" />
                  <span>Revenue</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-blue-200" />
                  <span>Orders</span>
                </div>
              </div>

              {/* Chart Graphic Area with 12 Pillars + Smooth Bezier Spline Line */}
              <div className="relative h-64 w-full flex items-end pt-4 pb-2">
                {/* Horizontal Guide Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-8 text-[11px] font-medium text-gray-400 pr-2">
                  <div className="border-b border-gray-100 flex justify-between">
                    <span>₹50k</span>
                  </div>
                  <div className="border-b border-gray-100 flex justify-between">
                    <span>₹40k</span>
                  </div>
                  <div className="border-b border-gray-100 flex justify-between">
                    <span>₹30k</span>
                  </div>
                  <div className="border-b border-gray-100 flex justify-between">
                    <span>₹20k</span>
                  </div>
                  <div className="border-b border-gray-100 flex justify-between">
                    <span>₹10k</span>
                  </div>
                  <div className="flex justify-between">
                    <span>0</span>
                  </div>
                </div>

                {/* 12 Vertical Bars */}
                <div className="w-full h-full flex items-end justify-between pl-10 pr-2 pb-6 z-10">
                  {monthlyOverviewData.map((item, idx) => (
                    <div
                      key={item.month}
                      onMouseEnter={() => setHoveredMonthIndex(idx)}
                      className="flex-1 flex flex-col items-center h-full justify-end group cursor-pointer px-1 relative"
                    >
                      {/* Interactive Tooltip matching May bubble from Image 1 */}
                      {hoveredMonthIndex === idx && (
                        <div className="absolute -top-12 z-30 flex flex-col items-center animate-fade-in-up pointer-events-none">
                          <div className="bg-gray-950 text-white px-3 py-1.5 rounded-lg shadow-xl text-center whitespace-nowrap border border-gray-800">
                            <p className="text-xs font-black tracking-tight leading-tight">
                              ₹ {item.revenue.toLocaleString()}
                            </p>
                            <p className="text-[10px] text-gray-300 font-medium">
                              {item.orders} orders
                            </p>
                          </div>
                          <div className="w-2 h-2 bg-gray-950 rotate-45 -mt-1" />
                        </div>
                      )}

                      {/* Bar Column with Soft Blue Gradient */}
                      <div className="w-full max-w-[28px] h-full flex items-end">
                        <div
                          className={`w-full rounded-t-lg transition-all duration-300 ${
                            hoveredMonthIndex === idx
                              ? 'bg-gradient-to-t from-blue-300 to-blue-500 shadow-md'
                              : 'bg-gradient-to-t from-blue-100 to-blue-300/80 group-hover:from-blue-200 group-hover:to-blue-400'
                          }`}
                          style={{ height: item.barHeight }}
                        />
                      </div>

                      {/* Month Label */}
                      <span
                        className={`text-[11px] font-bold mt-2 transition ${
                          hoveredMonthIndex === idx ? 'text-blue-600' : 'text-gray-500'
                        }`}
                      >
                        {item.month}
                      </span>
                    </div>
                  ))}
                </div>

                {/* Overlaid Smooth Spline Blue Wave */}
                <svg
                  viewBox="0 0 1000 200"
                  preserveAspectRatio="none"
                  className="absolute inset-0 w-full h-full pointer-events-none pl-10 pr-2 pb-6 z-20"
                >
                  <path
                    d="M 40,150 
                       C 80,140 100,105 130,100
                       C 160,95 190,130 220,125
                       C 250,120 280,128 310,120
                       C 340,110 370,60 400,55
                       C 430,50 460,110 490,100
                       C 520,90 550,85 580,80
                       C 610,75 640,95 670,90
                       C 700,85 730,75 760,70
                       C 790,65 820,55 850,50
                       C 880,45 910,25 940,30"
                    fill="none"
                    stroke="#2563eb"
                    strokeWidth="3.5"
                    strokeLinecap="round"
                  />
                  {/* Circular Node Dots */}
                  {[
                    [40, 150],
                    [130, 100],
                    [220, 125],
                    [310, 120],
                    [400, 55],
                    [490, 100],
                    [580, 80],
                    [670, 90],
                    [760, 70],
                    [850, 50],
                    [940, 30],
                  ].map(([cx, cy], i) => (
                    <circle
                      key={i}
                      cx={cx}
                      cy={cy}
                      r="4.5"
                      fill="#2563eb"
                      stroke="#ffffff"
                      strokeWidth="2.5"
                    />
                  ))}
                </svg>
              </div>
            </div>

            {/* Right 4 Cols: Sales by Category Donut Chart */}
            <div className="lg:col-span-4 bg-white p-6 md:p-8 rounded-3xl border border-gray-100 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="text-xl font-extrabold text-gray-900 tracking-tight">Sales by Category</h3>
                <div className="relative">
                  <select className="appearance-none bg-white border border-gray-200 text-gray-700 text-xs font-semibold py-1.5 pl-3 pr-7 rounded-xl focus:outline-hidden cursor-pointer shadow-2xs">
                    <option>This Month</option>
                    <option>Last Month</option>
                    <option>All Time</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Donut Graphic + Legend flex layout */}
              <div className="flex flex-col sm:flex-row items-center justify-around gap-6 my-auto py-6">
                {/* SVG Donut Chart */}
                <div className="relative w-44 h-44 flex items-center justify-center shrink-0">
                  <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                    {/* Circumference for r=54 is 2*pi*54 = 339.29 */}
                    {/* Backpack 45% -> 152.68 */}
                    <circle
                      cx="80"
                      cy="80"
                      r="54"
                      fill="none"
                      stroke="#3b82f6"
                      strokeWidth="22"
                      strokeDasharray="152.68 339.29"
                      strokeDashoffset="0"
                    />
                    {/* Duffel 30% -> 101.79 */}
                    <circle
                      cx="80"
                      cy="80"
                      r="54"
                      fill="none"
                      stroke="#a855f7"
                      strokeWidth="22"
                      strokeDasharray="101.79 339.29"
                      strokeDashoffset="-152.68"
                    />
                    {/* Tote 15% -> 50.89 */}
                    <circle
                      cx="80"
                      cy="80"
                      r="54"
                      fill="none"
                      stroke="#fbbf24"
                      strokeWidth="22"
                      strokeDasharray="50.89 339.29"
                      strokeDashoffset="-254.47"
                    />
                    {/* Pouch 10% -> 33.93 */}
                    <circle
                      cx="80"
                      cy="80"
                      r="54"
                      fill="none"
                      stroke="#34d399"
                      strokeWidth="22"
                      strokeDasharray="33.93 339.29"
                      strokeDashoffset="-305.36"
                    />
                  </svg>
                  {/* Donut Center Label */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                    <span className="text-xl font-black text-gray-900 leading-tight">₹ 47,800</span>
                    <span className="text-[11px] font-semibold text-gray-400">Total Revenue</span>
                  </div>
                </div>

                {/* Donut Legend */}
                <div className="space-y-3.5 text-xs font-bold w-full sm:w-auto">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-blue-600" />
                      <span className="text-gray-700">Backpack</span>
                    </div>
                    <span className="text-gray-900 font-extrabold">45%</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-purple-500" />
                      <span className="text-gray-700">Duffel</span>
                    </div>
                    <span className="text-gray-900 font-extrabold">30%</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-amber-400" />
                      <span className="text-gray-700">Tote</span>
                    </div>
                    <span className="text-gray-900 font-extrabold">15%</span>
                  </div>
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full bg-emerald-400" />
                      <span className="text-gray-700">Pouch</span>
                    </div>
                    <span className="text-gray-900 font-extrabold">10%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* 3. ROW 3: TOP SELLING PRODUCTS + ORDER STATUS + CUSTOMERS GROWTH */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Column 1: Top Selling Products */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-4">
                <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">Top Selling Products</h3>
                <button
                  onClick={() => setActiveTab('products')}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <tr>
                      <th className="pb-3 w-8">#</th>
                      <th className="pb-3">Product</th>
                      <th className="pb-3 text-center">Sold</th>
                      <th className="pb-3 text-right">Revenue</th>
                      <th className="pb-3 text-right pl-3">Trend</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {/* Item 1 */}
                    <tr className="hover:bg-gray-50/60 transition">
                      <td className="py-3.5 font-bold text-gray-500">1</td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center p-1 shrink-0">
                            <BagThumbBackpack />
                          </div>
                          <span className="font-bold text-gray-900">Premium Backpack</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-center font-bold text-gray-900">320</td>
                      <td className="py-3.5 text-right font-extrabold text-gray-900">₹ 85,000</td>
                      <td className="py-3.5 text-right pl-3">
                        <svg viewBox="0 0 60 20" className="w-14 h-5 inline-block">
                          <path
                            d="M 2,14 Q 15,2 30,12 T 58,4"
                            fill="none"
                            stroke="#10b981"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </td>
                    </tr>

                    {/* Item 2 */}
                    <tr className="hover:bg-gray-50/60 transition">
                      <td className="py-3.5 font-bold text-gray-500">2</td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center p-1 shrink-0">
                            <BagThumbDuffel />
                          </div>
                          <span className="font-bold text-gray-900">Travel Duffel</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-center font-bold text-gray-900">210</td>
                      <td className="py-3.5 text-right font-extrabold text-gray-900">₹ 55,000</td>
                      <td className="py-3.5 text-right pl-3">
                        <svg viewBox="0 0 60 20" className="w-14 h-5 inline-block">
                          <path
                            d="M 2,15 Q 16,18 30,8 T 58,10"
                            fill="none"
                            stroke="#a855f7"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </td>
                    </tr>

                    {/* Item 3 */}
                    <tr className="hover:bg-gray-50/60 transition">
                      <td className="py-3.5 font-bold text-gray-500">3</td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center p-1 shrink-0">
                            <BagThumbTote />
                          </div>
                          <span className="font-bold text-gray-900">Leather Tote</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-center font-bold text-gray-900">150</td>
                      <td className="py-3.5 text-right font-extrabold text-gray-900">₹ 30,000</td>
                      <td className="py-3.5 text-right pl-3">
                        <svg viewBox="0 0 60 20" className="w-14 h-5 inline-block">
                          <path
                            d="M 2,12 Q 15,6 30,14 T 58,8"
                            fill="none"
                            stroke="#f59e0b"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </td>
                    </tr>

                    {/* Item 4 */}
                    <tr className="hover:bg-gray-50/60 transition">
                      <td className="py-3.5 font-bold text-gray-500">4</td>
                      <td className="py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-gray-100 flex items-center justify-center p-1 shrink-0">
                            <BagThumbPouch />
                          </div>
                          <span className="font-bold text-gray-900">Travel Pouch</span>
                        </div>
                      </td>
                      <td className="py-3.5 text-center font-bold text-gray-900">98</td>
                      <td className="py-3.5 text-right font-extrabold text-gray-900">₹ 12,400</td>
                      <td className="py-3.5 text-right pl-3">
                        <svg viewBox="0 0 60 20" className="w-14 h-5 inline-block">
                          <path
                            d="M 2,8 Q 15,16 30,6 T 58,12"
                            fill="none"
                            stroke="#f43f5e"
                            strokeWidth="2"
                            strokeLinecap="round"
                          />
                        </svg>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Column 2: Order Status */}
            <div className="lg:col-span-3 bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">Order Status</h3>
                <div className="relative">
                  <select className="appearance-none bg-white border border-gray-200 text-gray-700 text-xs font-semibold py-1.5 pl-2.5 pr-6 rounded-xl focus:outline-hidden cursor-pointer shadow-2xs">
                    <option>This Month</option>
                    <option>Last Month</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Donut */}
              <div className="relative w-40 h-40 mx-auto my-3 flex items-center justify-center">
                <svg viewBox="0 0 160 160" className="w-full h-full -rotate-90">
                  {/* Delivered 60% -> 203.57 */}
                  <circle
                    cx="80"
                    cy="80"
                    r="54"
                    fill="none"
                    stroke="#10b981"
                    strokeWidth="20"
                    strokeDasharray="203.57 339.29"
                    strokeDashoffset="0"
                  />
                  {/* Processing 20% -> 67.85 */}
                  <circle
                    cx="80"
                    cy="80"
                    r="54"
                    fill="none"
                    stroke="#0ea5e9"
                    strokeWidth="20"
                    strokeDasharray="67.85 339.29"
                    strokeDashoffset="-203.57"
                  />
                  {/* Pending 15% -> 50.89 */}
                  <circle
                    cx="80"
                    cy="80"
                    r="54"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="20"
                    strokeDasharray="50.89 339.29"
                    strokeDashoffset="-271.42"
                  />
                  {/* Cancelled 5% -> 16.96 */}
                  <circle
                    cx="80"
                    cy="80"
                    r="54"
                    fill="none"
                    stroke="#ef4444"
                    strokeWidth="20"
                    strokeDasharray="16.96 339.29"
                    strokeDashoffset="-322.31"
                  />
                </svg>
                {/* Center text */}
                <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
                  <span className="text-2xl font-black text-gray-900 leading-tight">245</span>
                  <span className="text-[10px] font-semibold text-gray-400">Total Orders</span>
                </div>
              </div>

              {/* Legend List */}
              <div className="grid grid-cols-2 gap-y-2 text-xs font-bold pt-2 border-t border-gray-100">
                <div className="flex items-center justify-between pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                    <span className="text-gray-600">Delivered</span>
                  </div>
                  <span className="text-gray-900 font-extrabold">60%</span>
                </div>
                <div className="flex items-center justify-between pl-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                    <span className="text-gray-600">Processing</span>
                  </div>
                  <span className="text-gray-900 font-extrabold">20%</span>
                </div>
                <div className="flex items-center justify-between pr-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                    <span className="text-gray-600">Pending</span>
                  </div>
                  <span className="text-gray-900 font-extrabold">15%</span>
                </div>
                <div className="flex items-center justify-between pl-2">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-red-500" />
                    <span className="text-gray-600">Cancelled</span>
                  </div>
                  <span className="text-gray-900 font-extrabold">5%</span>
                </div>
              </div>
            </div>

            {/* Column 3: Customers Growth */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">Customers Growth</h3>
                <div className="relative">
                  <select className="appearance-none bg-white border border-gray-200 text-gray-700 text-xs font-semibold py-1.5 pl-2.5 pr-6 rounded-xl focus:outline-hidden cursor-pointer shadow-2xs">
                    <option>This Year</option>
                    <option>Last Year</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Legend */}
              <div className="flex items-center justify-end gap-4 text-xs font-semibold text-gray-600 pt-3">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-sky-500" />
                  <span>New Customers</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
                  <span>Returning Customers</span>
                </div>
              </div>

              {/* Dual Grouped Bar Chart Area */}
              <div className="relative h-48 w-full flex items-end pt-4 pb-2 mt-2">
                {/* Horizontal Guide Lines */}
                <div className="absolute inset-0 flex flex-col justify-between pointer-events-none pb-6 text-[10px] font-medium text-gray-400">
                  <div className="border-b border-gray-100 flex justify-between">
                    <span>400</span>
                  </div>
                  <div className="border-b border-gray-100 flex justify-between">
                    <span>300</span>
                  </div>
                  <div className="border-b border-gray-100 flex justify-between">
                    <span>200</span>
                  </div>
                  <div className="border-b border-gray-100 flex justify-between">
                    <span>100</span>
                  </div>
                  <div className="flex justify-between">
                    <span>0</span>
                  </div>
                </div>

                {/* 6 Dual Bar Groups: Jan to Jun */}
                <div className="w-full h-full flex items-end justify-between pl-8 pr-1 pb-5 z-10">
                  {[
                    { month: 'Jan', newH: '26%', retH: '18%' },
                    { month: 'Feb', newH: '32%', retH: '38%' },
                    { month: 'Mar', newH: '36%', retH: '52%' },
                    { month: 'Apr', newH: '38%', retH: '76%' },
                    { month: 'May', newH: '38%', retH: '60%' },
                    { month: 'Jun', newH: '42%', retH: '85%' },
                  ].map((bar) => (
                    <div key={bar.month} className="flex-1 flex flex-col items-center h-full justify-end group">
                      <div className="flex items-end gap-1 h-full">
                        {/* New customers (Sky Blue) */}
                        <div
                          className="w-3 rounded-t-sm bg-sky-500 hover:bg-sky-400 transition-all duration-300"
                          style={{ height: bar.newH }}
                        />
                        {/* Returning customers (Purple) */}
                        <div
                          className="w-3 rounded-t-sm bg-indigo-500 hover:bg-indigo-400 transition-all duration-300"
                          style={{ height: bar.retH }}
                        />
                      </div>
                      <span className="text-[10px] font-bold text-gray-500 mt-2">{bar.month}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* 4. ROW 4: RECENT ORDERS + SALES BY LOCATION + INVENTORY ALERTS */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Column 1: Recent Orders */}
            <div className="lg:col-span-5 bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-3">
                <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">Recent Orders</h3>
                <button
                  onClick={() => setActiveTab('orders')}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="text-[11px] font-bold text-gray-400 uppercase tracking-wider border-b border-gray-100">
                    <tr>
                      <th className="pb-3">Order ID</th>
                      <th className="pb-3">Customer</th>
                      <th className="pb-3 text-right">Amount</th>
                      <th className="pb-3 text-center">Status</th>
                      <th className="pb-3 text-right">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {/* Order 1 */}
                    <tr className="hover:bg-gray-50/60 transition">
                      <td className="py-3 font-bold text-gray-800">#1001</td>
                      <td className="py-3 font-medium text-gray-700">Ali Khan</td>
                      <td className="py-3 text-right font-extrabold text-gray-900">₹ 4,500</td>
                      <td className="py-3 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                          Delivered
                        </span>
                      </td>
                      <td className="py-3 text-right text-gray-400 font-medium">Oct 30, 2024</td>
                    </tr>

                    {/* Order 2 */}
                    <tr className="hover:bg-gray-50/60 transition">
                      <td className="py-3 font-bold text-gray-800">#1002</td>
                      <td className="py-3 font-medium text-gray-700">Sara Ali</td>
                      <td className="py-3 text-right font-extrabold text-gray-900">₹ 2,200</td>
                      <td className="py-3 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-sky-50 text-sky-600 border border-sky-200/60">
                          Processing
                        </span>
                      </td>
                      <td className="py-3 text-right text-gray-400 font-medium">Oct 29, 2024</td>
                    </tr>

                    {/* Order 3 */}
                    <tr className="hover:bg-gray-50/60 transition">
                      <td className="py-3 font-bold text-gray-800">#1003</td>
                      <td className="py-3 font-medium text-gray-700">John Smith</td>
                      <td className="py-3 text-right font-extrabold text-gray-900">₹ 8,900</td>
                      <td className="py-3 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-50 text-amber-600 border border-amber-200/60">
                          Pending
                        </span>
                      </td>
                      <td className="py-3 text-right text-gray-400 font-medium">Oct 29, 2024</td>
                    </tr>

                    {/* Order 4 */}
                    <tr className="hover:bg-gray-50/60 transition">
                      <td className="py-3 font-bold text-gray-800">#1004</td>
                      <td className="py-3 font-medium text-gray-700">Ahmed Raza</td>
                      <td className="py-3 text-right font-extrabold text-gray-900">₹ 1,800</td>
                      <td className="py-3 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-50 text-rose-600 border border-rose-200/60">
                          Canceled
                        </span>
                      </td>
                      <td className="py-3 text-right text-gray-400 font-medium">Oct 28, 2024</td>
                    </tr>

                    {/* Order 5 */}
                    <tr className="hover:bg-gray-50/60 transition">
                      <td className="py-3 font-bold text-gray-800">#1005</td>
                      <td className="py-3 font-medium text-gray-700">Emily Clark</td>
                      <td className="py-3 text-right font-extrabold text-gray-900">₹ 6,300</td>
                      <td className="py-3 text-center">
                        <span className="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-50 text-emerald-600 border border-emerald-200/60">
                          Delivered
                        </span>
                      </td>
                      <td className="py-3 text-right text-gray-400 font-medium">Oct 28, 2024</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* Column 2: Sales by Location */}
            <div className="lg:col-span-4 bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-2">
                <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">Sales by Location</h3>
                <div className="relative">
                  <select className="appearance-none bg-white border border-gray-200 text-gray-700 text-xs font-semibold py-1.5 pl-2.5 pr-6 rounded-xl focus:outline-hidden cursor-pointer shadow-2xs">
                    <option>This Month</option>
                    <option>All Time</option>
                  </select>
                  <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Map Illustration with Radar Pins + Country List */}
              <div className="flex items-center justify-between gap-4 my-auto py-2">
                {/* Vector World Map Outline with pulsing radar dots */}
                <div className="relative w-56 h-36 shrink-0 flex items-center justify-center">
                  <svg viewBox="0 0 320 180" className="w-full h-full text-slate-200 fill-current">
                    {/* North America */}
                    <path d="M30 40 C35 25 70 20 90 35 C85 50 70 65 60 70 C45 65 35 55 30 40 Z" />
                    {/* South America */}
                    <path d="M70 85 C80 85 90 100 85 125 C78 140 68 145 62 135 C58 115 62 95 70 85 Z" />
                    {/* Europe */}
                    <path d="M140 35 C155 30 170 32 175 45 C165 55 150 55 140 48 Z" />
                    {/* Africa */}
                    <path d="M140 60 C155 58 175 68 170 100 C162 120 150 120 142 105 C138 90 135 75 140 60 Z" />
                    {/* Asia */}
                    <path d="M185 30 C220 22 260 40 255 75 C240 85 210 90 195 75 C185 60 180 45 185 30 Z" />
                    {/* Australia */}
                    <path d="M240 115 C255 110 270 120 265 135 C250 145 238 135 240 115 Z" />
                  </svg>

                  {/* Pulsing Radar Markers */}
                  {/* India Pin */}
                  <div className="absolute top-[52%] left-[64%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
                    <span className="absolute -inset-1.5 rounded-full bg-blue-500/40 animate-ping" />
                    <span className="relative block w-3 h-3 rounded-full bg-blue-600 border-2 border-white shadow-xs" />
                  </div>

                  {/* USA Pin */}
                  <div className="absolute top-[32%] left-[22%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
                    <span className="relative block w-2.5 h-2.5 rounded-full bg-purple-500 border border-white shadow-xs" />
                  </div>

                  {/* UK Pin */}
                  <div className="absolute top-[28%] left-[48%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
                    <span className="relative block w-2 h-2 rounded-full bg-rose-400 border border-white" />
                  </div>

                  {/* UAE Pin */}
                  <div className="absolute top-[48%] left-[56%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
                    <span className="relative block w-2.5 h-2.5 rounded-full bg-teal-500 border border-white" />
                  </div>

                  {/* Australia Pin */}
                  <div className="absolute top-[75%] left-[82%] -translate-x-1/2 -translate-y-1/2 group cursor-pointer">
                    <span className="relative block w-2 h-2 rounded-full bg-indigo-400 border border-white" />
                  </div>
                </div>

                {/* Country percentages */}
                <div className="space-y-2 text-xs font-bold w-full">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                      <span className="text-gray-700">India</span>
                    </div>
                    <span className="text-gray-900 font-extrabold">45%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-purple-500" />
                      <span className="text-gray-700">USA</span>
                    </div>
                    <span className="text-gray-900 font-extrabold">20%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-rose-300" />
                      <span className="text-gray-700">UK</span>
                    </div>
                    <span className="text-gray-900 font-extrabold">12%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-teal-500" />
                      <span className="text-gray-700">UAE</span>
                    </div>
                    <span className="text-gray-900 font-extrabold">10%</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-indigo-400" />
                      <span className="text-gray-700">Others</span>
                    </div>
                    <span className="text-gray-900 font-extrabold">13%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Column 3: Inventory Alerts */}
            <div className="lg:col-span-3 bg-white p-6 rounded-3xl border border-gray-100 shadow-2xs flex flex-col justify-between">
              <div className="flex items-center justify-between pb-4 border-b border-gray-100 mb-3">
                <h3 className="text-lg font-extrabold text-gray-900 tracking-tight">Inventory Alerts</h3>
                <button
                  onClick={() => setActiveTab('products')}
                  className="text-xs font-bold text-sky-600 hover:text-sky-700 cursor-pointer"
                >
                  View All
                </button>
              </div>

              <div className="space-y-3.5 my-auto">
                {/* Alert 1 */}
                <div className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50/70 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center p-1 shrink-0">
                      <BagThumbBackpack />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-gray-900">Premium Backpack</p>
                      <p className="text-[10px] text-gray-400 font-medium">SKU: BP-001</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-600 border border-rose-200/60">
                    3 left
                  </span>
                </div>

                {/* Alert 2 */}
                <div className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50/70 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center p-1 shrink-0">
                      <BagThumbDuffel />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-gray-900">Travel Duffel</p>
                      <p className="text-[10px] text-gray-400 font-medium">SKU: DF-002</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-rose-50 text-rose-600 border border-rose-200/60">
                    5 left
                  </span>
                </div>

                {/* Alert 3 */}
                <div className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50/70 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center p-1 shrink-0">
                      <BagThumbTote />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-gray-900">Leather Tote</p>
                      <p className="text-[10px] text-gray-400 font-medium">SKU: TT-003</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200/60">
                    8 left
                  </span>
                </div>

                {/* Alert 4 */}
                <div className="flex items-center justify-between p-2 rounded-xl hover:bg-gray-50/70 transition">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-gray-100 flex items-center justify-center p-1 shrink-0">
                      <BagThumbPouch />
                    </div>
                    <div>
                      <p className="font-bold text-xs text-gray-900">Travel Pouch</p>
                      <p className="text-[10px] text-gray-400 font-medium">SKU: PO-004</p>
                    </div>
                  </div>
                  <span className="px-2.5 py-1 rounded-full text-[11px] font-extrabold bg-amber-50 text-amber-700 border border-amber-200/60">
                    6 left
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: PRODUCT COLLECTION TABLE */}
      {activeTab === 'products' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Filter & Search Bar */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 flex flex-col sm:flex-row gap-4 justify-between items-center">
            {/* Search Input */}
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search products by name or category..."
                value={productSearch}
                onChange={(e) => setProductSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500"
              />
            </div>

            {/* Category Filter */}
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Filter className="w-4 h-4 text-gray-400" />
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-semibold text-gray-700"
              >
                <option value="ALL">All Categories</option>
                <option value="Backpack">Backpack</option>
                <option value="Duffel">Duffel</option>
                <option value="Tote">Tote</option>
                <option value="Pouch">Pouch</option>
              </select>
            </div>
          </div>

          {/* Responsive Products Table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f2f4f7] text-gray-700 uppercase text-[11px] font-extrabold tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="py-4 px-6">Product Details</th>
                    <th className="py-4 px-6">Category</th>
                    <th className="py-4 px-6">Price</th>
                    <th className="py-4 px-6">Stock Status</th>
                    <th className="py-4 px-6">Panel Palette</th>
                    <th className="py-4 px-6 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredProducts.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="text-center py-12 text-gray-500 font-medium">
                        No products found matching your search.
                      </td>
                    </tr>
                  ) : (
                    filteredProducts.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50/80 transition">
                        {/* Thumbnail & Name */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-3">
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center p-1.5 shrink-0 border border-black/5"
                              style={{ backgroundColor: product.bgColor || '#E9D3CB' }}
                            >
                              <img
                                src={product.image}
                                alt={product.name}
                                className="w-full h-full object-contain"
                              />
                            </div>
                            <div>
                              <p className="font-bold text-gray-900 leading-tight">{product.name}</p>
                              {product.discountPercent ? (
                                <span className="inline-block mt-0.5 text-[10px] font-extrabold text-red-600 bg-red-50 px-1.5 py-0.2 rounded">
                                  {product.discountPercent}% OFF
                                </span>
                              ) : null}
                            </div>
                          </div>
                        </td>

                        {/* Category */}
                        <td className="py-4 px-6">
                          <span className="inline-block px-2.5 py-1 rounded-lg text-xs font-semibold bg-gray-100 text-gray-800">
                            {product.category}
                          </span>
                        </td>

                        {/* Price */}
                        <td className="py-4 px-6 font-bold text-gray-900">
                          ₹ {product.price}
                        </td>

                        {/* Stock */}
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-1 rounded-full ${
                              product.stock > 10
                                ? 'bg-emerald-50 text-emerald-700'
                                : product.stock > 0
                                ? 'bg-amber-50 text-amber-700'
                                : 'bg-red-50 text-red-700'
                            }`}
                          >
                            <span
                              className={`w-1.5 h-1.5 rounded-full ${
                                product.stock > 10
                                  ? 'bg-emerald-500'
                                  : product.stock > 0
                                  ? 'bg-amber-500'
                                  : 'bg-red-500'
                              }`}
                            />
                            {product.stock} units
                          </span>
                        </td>

                        {/* Palette Swatches */}
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-1.5">
                            <span
                              className="w-4 h-4 rounded-full border border-gray-300 shadow-2xs"
                              style={{ backgroundColor: product.bgColor }}
                              title={`Background: ${product.bgColor}`}
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-gray-300 shadow-2xs"
                              style={{ backgroundColor: product.panelColor }}
                              title={`Panel: ${product.panelColor}`}
                            />
                            <span
                              className="w-4 h-4 rounded-full border border-gray-300 shadow-2xs"
                              style={{ backgroundColor: product.textColor }}
                              title={`Text: ${product.textColor}`}
                            />
                          </div>
                        </td>

                        {/* Actions */}
                        <td className="py-4 px-6 text-right">
                          <button
                            onClick={() => removeProduct(product.id)}
                            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition cursor-pointer"
                            title="Delete Product"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CUSTOMER ORDERS TABLE */}
      {activeTab === 'orders' && (
        <div className="space-y-6 animate-in fade-in duration-200">
          {/* Order Status Filters */}
          <div className="bg-white p-4 rounded-2xl border border-gray-200 flex items-center gap-2 overflow-x-auto">
            {['ALL', 'PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED'].map((st) => (
              <button
                key={st}
                onClick={() => setOrderStatusFilter(st)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer shrink-0 ${
                  orderStatusFilter === st
                    ? 'bg-sky-600 text-white shadow-xs'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {st}
              </button>
            ))}
          </div>

          {/* Orders Table */}
          <div className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead className="bg-[#f2f4f7] text-gray-700 uppercase text-[11px] font-extrabold tracking-wider border-b border-gray-200">
                  <tr>
                    <th className="py-4 px-6">Order ID</th>
                    <th className="py-4 px-6">Customer</th>
                    <th className="py-4 px-6">Items Ordered</th>
                    <th className="py-4 px-6">Total Amount</th>
                    <th className="py-4 px-6">Payment</th>
                    <th className="py-4 px-6">Status</th>
                    <th className="py-4 px-6 text-right">Update</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {filteredOrders.length === 0 ? (
                    <tr>
                      <td colSpan={7} className="text-center py-12 text-gray-500 font-medium">
                        No orders recorded for this filter.
                      </td>
                    </tr>
                  ) : (
                    filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50/80 transition">
                        <td className="py-4 px-6 font-mono font-bold text-sky-700">
                          {order.id}
                        </td>
                        <td className="py-4 px-6">
                          <p className="font-bold text-gray-900 leading-tight">{order.customerName}</p>
                          <p className="text-xs text-gray-500">{order.customerEmail}</p>
                        </td>
                        <td className="py-4 px-6">
                          <div className="flex items-center gap-2">
                            {order.items.map((item, idx) => (
                              <img
                                key={idx}
                                src={item.image}
                                alt={item.name}
                                className="w-8 h-8 rounded-lg object-contain bg-gray-100 border border-gray-200 p-0.5"
                                title={`${item.name} (x${item.quantity})`}
                              />
                            ))}
                            <span className="text-xs font-semibold text-gray-600">
                              ({order.items.reduce((s, it) => s + it.quantity, 0)} bags)
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 font-bold text-gray-900">
                          ₹ {order.totalAmount}
                        </td>
                        <td className="py-4 px-6">
                          <span className="inline-block px-2 py-0.5 rounded text-[11px] font-bold bg-gray-100 text-gray-800">
                            {order.paymentMethod}
                          </span>
                        </td>
                        <td className="py-4 px-6">
                          <span
                            className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                              order.status === 'DELIVERED'
                                ? 'bg-emerald-50 text-emerald-700'
                                : order.status === 'SHIPPED'
                                ? 'bg-sky-50 text-sky-700'
                                : order.status === 'PROCESSING'
                                ? 'bg-indigo-50 text-indigo-700'
                                : order.status === 'CANCELLED'
                                ? 'bg-red-50 text-red-700'
                                : 'bg-amber-50 text-amber-700'
                            }`}
                          >
                            {order.status === 'DELIVERED' && <CheckCircle className="w-3 h-3" />}
                            {order.status === 'SHIPPED' && <Truck className="w-3 h-3" />}
                            {order.status === 'PROCESSING' && <Clock className="w-3 h-3" />}
                            {order.status}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">
                          <select
                            value={order.status}
                            onChange={(e) =>
                              updateOrderStatus(order.id, e.target.value as Order['status'])
                            }
                            className="text-xs bg-gray-50 border border-gray-300 rounded-lg px-2 py-1 font-semibold text-gray-800 focus:outline-hidden"
                          >
                            <option value="PENDING">PENDING</option>
                            <option value="PROCESSING">PROCESSING</option>
                            <option value="SHIPPED">SHIPPED</option>
                            <option value="DELIVERED">DELIVERED</option>
                            <option value="CANCELLED">CANCELLED</option>
                          </select>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* Clear All Confirmation Modal */}
      {showClearConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4 z-50 animate-in fade-in duration-150">
          <div className="bg-white rounded-3xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-red-50 text-red-600 flex items-center justify-center">
              <AlertCircle className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-gray-900">Delete All Products?</h3>
            <p className="text-sm text-gray-600">
              Are you sure you want to clear the entire product collection? This action will remove all bags from the shop catalog.
            </p>
            <div className="flex gap-3 pt-2">
              <button
                onClick={() => {
                  clearProducts()
                  setShowClearConfirm(false)
                }}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-semibold py-2.5 rounded-xl transition cursor-pointer"
              >
                Yes, Delete All
              </button>
              <button
                onClick={() => setShowClearConfirm(false)}
                className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2.5 rounded-xl transition cursor-pointer"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
