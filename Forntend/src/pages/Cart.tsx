import { Link } from 'react-router-dom'
import { useStore } from '../context/StoreContext'

export default function Cart() {
  const { cartItems, updateQuantity, removeFromCart } = useStore()

  const totalMrp = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0)
  const discountAmount = cartItems.reduce((sum, item) => {
    const discount = item.discountPercent ? Math.round((item.price * item.discountPercent) / 100) : 0
    return sum + discount * item.quantity
  }, 0)
  const platformFee = cartItems.length > 0 ? 20 : 0
  const shippingFee = 0
  const totalAmount = totalMrp - discountAmount + platformFee + shippingFee

  return (
    <div className="px-4 md:px-8 py-8">
      <div className="flex items-center justify-between border-b border-gray-400 pb-6 mb-6">
        <h1 className="text-5xl leading-none text-gray-900">Cart.</h1>
      </div>

      {cartItems.length === 0 ? (
        <div className="min-h-[50vh] flex items-center justify-center">
          <div className="text-center">
            <p className="text-2xl text-gray-700 mb-6">Your cart is empty.</p>
            <Link
              to="/shop"
              className="inline-block rounded bg-black text-white px-5 py-3"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_1fr] gap-6">
          <div className="space-y-6">
            {cartItems.map((item) => (
              <article key={item.id} className="border border-[#cfb3a7] bg-[#E9D3CB]">
                <div className="p-3 flex flex-col sm:flex-row gap-4">
                  <div className="w-full sm:w-[58%] bg-[#E9D3CB] flex items-center justify-center">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="h-[190px] w-full object-contain"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-end">
                    <div className="flex items-center justify-between border-t border-black/10 pt-3">
                      <h2 className="text-4xl leading-none text-[#5E4032]">{item.name}</h2>
                      <div className="flex items-center gap-2">
                        <button
                          className="w-6 h-6 rounded-full bg-white"
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        >
                          +
                        </button>
                        <span className="min-w-7 text-center">{String(item.quantity).padStart(2, '0')}</span>
                        <button
                          className="w-6 h-6 rounded-full bg-white"
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        >
                          -
                        </button>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3 text-[#5E4032]">
                      <p className="text-4xl leading-none">Net Total</p>
                      <p className="text-4xl leading-none">₹ {item.price * item.quantity}</p>
                    </div>
                    <button
                      className="text-left text-sm text-red-700 mt-2"
                      onClick={() => removeFromCart(item.id)}
                    >
                      Remove item
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="border border-gray-300 p-5 h-fit">
            <h3 className="text-4xl leading-none mb-6">Price Breakdown</h3>

            <div className="space-y-3 text-[28px] leading-none border-b border-gray-300 pb-4">
              <div className="flex justify-between">
                <span>Total MRP</span>
                <span>₹ {totalMrp}</span>
              </div>
              <div className="flex justify-between">
                <span>Discount on MRP</span>
                <span>₹ {discountAmount}</span>
              </div>
              <div className="flex justify-between">
                <span>Platform Fee</span>
                <span>₹ {platformFee}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping Fee</span>
                <span>FREE</span>
              </div>
            </div>

            <div className="flex justify-between items-center mt-4 mb-5">
              <span className="text-[34px] leading-none">Total Amount</span>
              <span className="text-[34px] leading-none text-emerald-500">₹ {totalAmount}</span>
            </div>

            <button className="w-full bg-black text-white py-3 text-xl">
              Place Order
            </button>
          </aside>
        </div>
      )}
    </div>
  )
}
