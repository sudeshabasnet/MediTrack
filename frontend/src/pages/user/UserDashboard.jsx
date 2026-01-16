import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AppLayout from '../../components/layout/AppLayout'
import axios from 'axios'
import { 
  ShoppingCartIcon, 
  ClipboardDocumentListIcon,
  StarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

const UserDashboard = () => {
  const { user } = useAuth()
  const [cartSummary, setCartSummary] = useState({ itemCount: 0, totalAmount: 0 })
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchCartSummary()
    fetchOrders()
  }, [])

  const fetchCartSummary = async () => {
    try {
      const response = await axios.get('/api/cart/summary')
      setCartSummary(response.data)
    } catch (error) {
      console.error('Error fetching cart summary:', error)
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders')
      setOrders(response.data.slice(0, 5)) // Show latest 5 orders
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <AppLayout>
      <div className="bg-white">
        <main className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Hero / welcome section */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="md:col-span-2 bg-white/80 backdrop-blur rounded-2xl shadow-sm border border-blue-50 p-6 md:p-8">
              <p className="text-xs font-semibold tracking-wide text-blue-600 uppercase">
                Welcome back
              </p>
              <h2 className="mt-2 text-2xl md:text-3xl font-bold text-gray-900">
                {user?.fullName || 'MediTrack User'}
              </h2>
              <p className="mt-3 text-sm md:text-base text-gray-600">
                Continue your treatment journey by refilling prescriptions, tracking orders, and
                exploring trusted medicines from nearby pharmacies.
              </p>
              <div className="mt-5 flex flex-col sm:flex-row sm:items-center gap-3">
                <Link
                  to="/pharmacy/medicines"
                  className="inline-flex items-center justify-center rounded-full bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-blue-700 transition"
                >
                  Browse medicines
                  <ArrowRightIcon className="h-4 w-4 ml-2" />
                </Link>
                <Link
                  to="/user/orders"
                  className="inline-flex items-center justify-center rounded-full border border-blue-200 bg-white px-4 py-2 text-xs sm:text-sm font-medium text-blue-700 hover:bg-blue-50 transition"
                >
                  View my orders
                </Link>
              </div>
            </div>

            {/* Compact stats card */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <ShoppingCartIcon className="h-6 w-6 text-blue-600" />
                  <span className="text-[11px] font-medium text-blue-700 bg-blue-50 rounded-full px-2 py-0.5">
                    In cart
                  </span>
                </div>
                <p className="mt-3 text-2xl font-bold text-gray-900">{cartSummary.itemCount}</p>
                <Link
                  to="/user/cart"
                  className="mt-2 text-[11px] text-blue-600 hover:text-blue-700 inline-flex items-center"
                >
                  View cart <ArrowRightIcon className="h-3 w-3 ml-1" />
                </Link>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <ClipboardDocumentListIcon className="h-6 w-6 text-emerald-600" />
                  <span className="text-[11px] font-medium text-emerald-700 bg-emerald-50 rounded-full px-2 py-0.5">
                    Orders
                  </span>
                </div>
                <p className="mt-3 text-2xl font-bold text-gray-900">{orders.length}</p>
                <Link
                  to="/user/orders"
                  className="mt-2 text-[11px] text-emerald-700 hover:text-emerald-800 inline-flex items-center"
                >
                  Track orders <ArrowRightIcon className="h-3 w-3 ml-1" />
                </Link>
              </div>
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <StarIcon className="h-6 w-6 text-amber-500" />
                  <span className="text-[11px] font-medium text-amber-700 bg-amber-50 rounded-full px-2 py-0.5">
                    Cart total
                  </span>
                </div>
                <p className="mt-3 text-lg font-bold text-gray-900">
                  Rs. {cartSummary.totalAmount?.toFixed(2) || '0.00'}
                </p>
                <span className="mt-2 text-[11px] text-gray-500">
                  Prices may vary
                </span>
              </div>
            </div>
          </section>

          {/* Product discovery + recent orders */}
          <section className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Featured medicines */}
            <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Popular medicines</h3>
                <Link
                  to="/pharmacy/medicines"
                  className="text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  See all
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {[
                  { name: 'Paracetamol 500mg', tag: 'Pain relief', price: 'Rs. 50', color: 'from-sky-50 to-sky-100' },
                  { name: 'Amoxicillin 250mg', tag: 'Antibiotic', price: 'Rs. 150', color: 'from-emerald-50 to-emerald-100' },
                  { name: 'Vitamin C 500mg', tag: 'Immunity', price: 'Rs. 80', color: 'from-amber-50 to-amber-100' }
                ].map((item) => (
                  <div
                    key={item.name}
                    className={`group rounded-xl bg-gradient-to-b ${item.color} border border-gray-100 p-4 flex flex-col justify-between`}
                  >
                    <div>
                      <span className="inline-flex px-2 py-0.5 rounded-full bg-white/80 text-[10px] font-medium text-blue-700">
                        {item.tag}
                      </span>
                      <p className="mt-2 text-sm font-semibold text-gray-900 group-hover:text-blue-700">
                        {item.name}
                      </p>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <p className="text-sm font-bold text-gray-900">{item.price}</p>
                      <Link
                        to="/pharmacy/medicines"
                        className="text-xs font-medium text-blue-600 hover:text-blue-700"
                      >
                        View options
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent orders */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900">Recent orders</h3>
                <Link
                  to="/user/orders"
                  className="text-xs font-medium text-blue-600 hover:text-blue-700"
                >
                  View all
                </Link>
              </div>
              {loading ? (
                <div className="py-8 text-center text-sm text-gray-500">
                  Loading your recent orders...
                </div>
              ) : orders.length === 0 ? (
                <div className="py-8 text-center text-sm text-gray-500">
                  You have not placed any orders yet.
                </div>
              ) : (
                <ul className="divide-y divide-gray-100">
                  {orders.map((order) => (
                    <li key={order.id} className="py-3 first:pt-0 last:pb-0">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="text-sm font-semibold text-gray-900">
                            Order #{order.id}
                          </p>
                          <p className="mt-0.5 text-xs text-gray-500">
                            {new Date(order.createdAt).toLocaleDateString()}
                          </p>
                          <p className="mt-1 text-xs text-gray-600">
                            Status:{' '}
                            <span className="font-medium text-blue-700">
                              {order.status}
                            </span>
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">
                            Rs. {order.totalAmount?.toFixed(2) || '0.00'}
                          </p>
                          <Link
                            to={`/user/orders/${order.id}`}
                            className="mt-1 inline-flex text-xs font-medium text-blue-600 hover:text-blue-700"
                          >
                            Details
                          </Link>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>
        </main>
      </div>
    </AppLayout>
  )
}

export default UserDashboard
