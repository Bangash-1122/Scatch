import { useState } from 'react'
import type { ChangeEvent, FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useStore } from '../context/StoreContext'
import { ShieldCheck, Lock, ArrowRight, Sparkles } from 'lucide-react'

export default function OwnerLogin() {
  const [formData, setFormData] = useState({
    email: 'owner@example.com',
    password: 'password123'
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const { login } = useStore()
  const navigate = useNavigate()

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const ok = await login(formData.email, formData.password, true)
      if (ok) {
        navigate('/admin')
      } else {
        setError('Invalid owner credentials. Please verify your email and password.')
      }
    } catch {
      setError('An error occurred during authentication. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex flex-col min-h-screen bg-[#f5f6f8] pt-20">
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {/* Header */}
          <div className="text-center mb-8 space-y-2">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-sky-600 to-indigo-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-sky-600/20 mb-3">
              <ShieldCheck className="w-8 h-8" />
            </div>
            <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
              Owner & Admin Login
            </h1>
            <p className="text-sm text-gray-600">
              Access the Scatch store management dashboard
            </p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-3xl shadow-xl border border-gray-200/80 p-8 space-y-6">
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 font-medium">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Admin Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-gray-50 font-medium"
                  placeholder="owner@example.com"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1.5">
                  Password
                </label>
                <input
                  type="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-hidden focus:ring-2 focus:ring-sky-500 bg-gray-50 font-medium"
                  placeholder="••••••••"
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-sky-600 hover:bg-sky-700 text-white py-3.5 rounded-xl font-bold text-sm shadow-md hover:shadow-lg transition-all cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Lock className="w-4 h-4" />
                <span>{loading ? 'Authenticating...' : 'Login as Owner / Admin'}</span>
              </button>
            </form>

            {/* Quick Demo Access Badge */}
            <div className="p-4 rounded-2xl bg-sky-50 border border-sky-100 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-sky-600 shrink-0" />
                <span className="text-gray-700">Pre-configured with Demo Owner account</span>
              </div>
              <button
                type="button"
                onClick={() => {
                  setFormData({ email: 'owner@example.com', password: 'password123' })
                }}
                className="text-sky-700 font-bold hover:underline"
              >
                Auto-fill
              </button>
            </div>
          </div>

          <p className="text-center mt-6 text-sm text-gray-600">
            Looking to browse bags instead?{' '}
            <Link to="/shop" className="text-sky-600 font-bold hover:underline inline-flex items-center gap-1">
              <span>Go to Shop</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
