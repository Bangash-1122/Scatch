import { useState } from "react";
import { Link } from "react-router-dom";

export default function Home() {
    const [isLogin, setIsLogin] = useState(false)
  
    return (
        <div className="flex flex-1 px-8 md:px-20 pt-32 pb-20 gap-8">
          {/* Signup Section */}
          {!isLogin && (
            <div className="w-full md:w-1/2 flex items-center justify-center">
              <div className="w-full max-w-md">
                <h3 className="text-4xl mb-2">
                  Welcome to <span className="text-sky-600 font-semibold">Scatch</span>
                </h3>
                <h4 className="text-2xl mb-8 text-gray-700">Create your account</h4>
  
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <input
                    className="bg-gray-100 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    type="text"
                    placeholder="Full Name"
                    name="fullname"
                    required
                  />
                  <input
                    className="bg-gray-100 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    type="email"
                    placeholder="Email"
                    name="email"
                    required
                  />
                  <input
                    className="bg-gray-100 block w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    type="password"
                    placeholder="Password"
                    name="password"
                    required
                  />
                  <button
                    type="submit"
                    className="px-5 rounded-lg py-3 mt-4 bg-sky-600 text-white w-full font-semibold hover:bg-sky-700 transition"
                  >
                    Create My Account
                  </button>
                </form>
  
                <p className="text-center mt-6 text-gray-600">
                  Already have an account?{' '}
                  <button
                    onClick={() => setIsLogin(true)}
                    className="text-sky-600 font-semibold hover:underline"
                  >
                    Login here
                  </button>
                </p>
              </div>
            </div>
          )}
  
          {/* Login Section */}
          {isLogin && (
            <div className="w-full md:w-1/2 flex items-center justify-center">
              <div className="w-full max-w-md">
                <h4 className="text-2xl capitalize mb-8 text-gray-700">Login your account</h4>
                
                <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
                  <input
                    className="block bg-gray-100 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    type="email"
                    placeholder="Email"
                    name="email"
                    required
                  />
                  <input
                    className="block bg-gray-100 w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500"
                    type="password"
                    placeholder="Password"
                    name="password"
                    required
                  />
                  <button
                    type="submit"
                    className="px-5 block rounded-lg py-3 mt-4 bg-sky-600 text-white w-full font-semibold hover:bg-sky-700 transition"
                  >
                    Login
                  </button>
                </form>
  
                <p className="text-center mt-6 text-gray-600">
                  Don&apos;t have an account?{' '}
                  <button
                    onClick={() => setIsLogin(false)}
                    className="text-sky-600 font-semibold hover:underline"
                  >
                    Sign up here
                  </button>
                </p>
              </div>
            </div>
          )}
  
          {/* Featured Section */}
          <div className="hidden md:flex md:w-1/2 items-center justify-center">
            <div className="text-center">
              <div className="text-7xl mb-4">👜</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Premium Bags Collection</h3>
              <p className="text-gray-600 mb-6">Discover our exclusive range of stylish and durable bags</p>
              <Link
                to="/shop"
                className="inline-block bg-sky-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-sky-700 transition"
              >
                Shop Now
              </Link>
            </div>
          </div>
        </div>
    )
  }
  