import { useState, useRef, useEffect } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'
import toast from 'react-hot-toast'
import {
  ChatBubbleLeftRightIcon,
  XMarkIcon,
  PaperAirplaneIcon,
  SparklesIcon
} from '@heroicons/react/24/outline'

const Chatbot = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState([])
  const [inputValue, setInputValue] = useState('')
  const messagesEndRef = useRef(null)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages])

  useEffect(() => {
    // Set welcome message based on user status
    const welcomeMessage = user
      ? {
        type: 'bot',
        text: `Hello ${user.fullName}! 👋 I'm your MediTrack Assistant. I can help you with orders, medicines, account settings, and more. How can I assist you today?`,
        timestamp: new Date()
      }
      : {
        type: 'bot',
        text: 'Welcome to MediTrack! 👋 I\'m here to help you learn about our platform, registration, medicines, and more. Feel free to ask me anything!',
        timestamp: new Date()
      }
    setMessages([welcomeMessage])
  }, [user])

  // FAQ for non-logged-in users
  const publicFAQData = [
    {
      keywords: ['register', 'sign up', 'create account', 'join'],
      answer: '📝 **Registration Process:**\n\n1. Click "Register" in the navigation\n2. Choose your account type (User/Pharmacy/Supplier)\n3. Fill in your details\n4. Verify your email\n5. For pharmacy/supplier: Upload verification documents\n\nWant to register now?',
      action: { text: 'Go to Register', path: '/register' }
    },
    {
      keywords: ['login', 'sign in', 'access'],
      answer: '🔐 **Login:**\n\nClick "Login" in the top-right corner and enter your email and password. Make sure your email is verified!\n\nNeed help?',
      action: { text: 'Go to Login', path: '/login' }
    },
    {
      keywords: ['medicine', 'drug', 'browse', 'products', 'available'],
      answer: '💊 **Browse Medicines:**\n\nYou can browse our extensive medicine catalog even without logging in!\n\n• Search by name\n• Filter by category\n• View detailed information\n• See prices and availability',
      action: { text: 'Browse Medicines', path: '/pharmacy/medicines' }
    },
    {
      keywords: ['payment', 'pay', 'esewa', 'online payment'],
      answer: '💳 **Payment Methods:**\n\n• eSewa (Secure online payment)\n• Cash on Delivery\n\nAll online payments are encrypted and secure!',
    },
    {
      keywords: ['delivery', 'shipping', 'charge', 'cost'],
      answer: '🚚 **Delivery Information:**\n\n• Kathmandu Valley: Rs. 100\n• Nearby cities: Rs. 200\n• Mid-range cities: Rs. 300\n• Far regions: Rs. 500\n\nDelivery within 2-5 business days!',
    },
    {
      keywords: ['email', 'verification', 'verify', 'confirm'],
      answer: '📧 **Email Verification:**\n\n1. Check your inbox (and spam folder)\n2. Click the verification link\n3. If not received, use "Resend Verification" on login page\n\nStill having issues? Contact support@meditrack.com',
    },
    {
      keywords: ['pharmacy', 'supplier', 'business'],
      answer: '🏥 **For Pharmacies & Suppliers:**\n\n• Register as Pharmacy/Supplier\n• Upload business documents\n• Wait for admin verification (24-48 hours)\n• Start selling once verified\n\nBenefits: Inventory management, order tracking, analytics!',
    },
    {
      keywords: ['about', 'what is', 'meditrack'],
      answer: '🏥 **About MediTrack:**\n\nMediTrack is a comprehensive medicine stock and distribution system connecting:\n\n• Customers - Buy medicines easily\n• Pharmacies - Manage inventory\n• Suppliers - Distribute products\n• Admins - Oversee operations\n\nSafe, secure, and reliable!',
    },
    {
      keywords: ['help', 'support', 'contact', 'assist'],
      answer: '💬 **Need More Help?**\n\nContact our support team:\n\n📧 Email: support@meditrack.com\n📱 Phone: +977-1-1234567\n📍 Location: Kathmandu, Nepal\n\nWe\'re here to help! 😊',
    },
  ]

  // FAQ for logged-in users
  const userFAQData = [
    {
      keywords: ['order', 'place order', 'buy', 'purchase'],
      answer: '🛒 **Placing an Order:**\n\n1. Browse medicines\n2. Add to cart (max 5 per item)\n3. Go to checkout\n4. Fill delivery details\n5. Choose payment method\n6. Complete order\n\nYou can track orders in "My Orders"!',
      action: { text: 'Browse Medicines', path: '/pharmacy/medicines' }
    },
    {
      keywords: ['cart', 'shopping cart', 'basket'],
      answer: '🛒 **Shopping Cart:**\n\nYour cart shows:\n• Items and quantities\n• Prices and subtotal\n• Delivery charges\n\n**Limits:** Max 5 units per medicine, 20 items total',
      action: { text: 'View Cart', path: '/user/cart' }
    },
    {
      keywords: ['track', 'status', 'delivery', 'my orders'],
      answer: '📦 **Order Tracking:**\n\nTrack your orders with statuses:\n• Pending ⏳\n• Confirmed ✅\n• Processing 📦\n• Shipped 🚚\n• Delivered ✨\n• Cancelled ❌',
      action: { text: 'View My Orders', path: '/user/orders' }
    },
    {
      keywords: ['cancel', 'cancel order', 'refund'],
      answer: '❌ **Order Cancellation:**\n\nYou can cancel orders within **5 minutes** of placement!\n\n1. Go to "My Orders"\n2. Click "Cancel Order"\n3. Provide reason\n4. Confirm cancellation\n\nRefunds processed in 5-7 business days for online payments.',
      action: { text: 'My Orders', path: '/user/orders' }
    },
    {
      keywords: ['profile', 'account', 'settings', 'update'],
      answer: '👤 **Profile Management:**\n\n• Update personal info\n• Change avatar\n• View verification status\n• Update address\n\nKeep your profile updated!',
      action: { text: 'View Profile', path: '/user/profile' }
    },
    {
      keywords: ['password', 'change password', 'reset', 'forgot'],
      answer: '🔐 **Password Management:**\n\n**Forgot Password?**\nUse "Forgot Password" on login page\n\n**Change Password?**\nContact support for assistance.',
      action: { text: 'Go to Login', path: '/login' }
    },
    {
      keywords: ['payment', 'pay', 'esewa'],
      answer: '💳 **Payment Options:**\n\n1. **eSewa** - Secure online payment\n2. **Cash on Delivery** - Pay when you receive\n\nAll transactions are encrypted and secure!',
    },
    {
      keywords: ['inventory', 'stock', 'manage medicines'],
      answer: '📦 **For Pharmacies:**\n\n• View inventory\n• Update stock levels\n• Set expiry dates\n• Track batch numbers\n• Get low stock alerts',
      action: { text: 'Inventory Dashboard', path: '/pharmacy/inventory' }
    },
    {
      keywords: ['logout', 'sign out'],
      answer: '👋 **Logout:**\n\nClick your profile icon in the top-right corner and select "Logout".\n\nSee you soon!',
    },
  ]

  const getQuickActions = () => {
    if (!user) {
      return [
        { text: '📝 Register', action: () => navigate('/register') },
        { text: '🔐 Login', action: () => navigate('/login') },
        { text: '❓ Help', action: () => handleQuickMessage('help') },
      ]
    }

    if (user.role === 'USER' || user.role === 'PHARMACY') {
      return [
        { text: '🛒 My Cart', action: () => navigate('/user/cart') },
        { text: '📦 My Orders', action: () => navigate('/user/orders') },
      ]
    }

    return []
  }

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const userMessage = {
      type: 'user',
      text: inputValue,
      timestamp: new Date()
    }

    setMessages(prev => [...prev, userMessage])
    const userQuestion = inputValue.toLowerCase()
    setInputValue('')

    // Simulate bot response
    setTimeout(() => {
      let botResponse = ''
      let action = null

      const faqData = user ? userFAQData : publicFAQData

      // Check for FAQ matches
      const matchedFAQ = faqData.find(faq =>
        faq.keywords.some(keyword => userQuestion.includes(keyword))
      )

      if (matchedFAQ) {
        botResponse = matchedFAQ.answer
        action = matchedFAQ.action
      } else if (userQuestion.includes('hello') || userQuestion.includes('hi') || userQuestion.includes('hey')) {
        botResponse = user
          ? `Hello ${user.fullName}! 👋 How can I assist you today? Ask me about orders, medicines, or your account!`
          : 'Hello! 👋 Welcome to MediTrack! I can help you learn about our platform, registration, and available medicines. What would you like to know?'
      } else if (userQuestion.includes('thank')) {
        botResponse = 'You\'re welcome! 😊 Feel free to ask if you need anything else. I\'m always here to help!'
      } else {
        botResponse = user
          ? 'I\'m here to help! I can assist you with:\n\n• Orders and tracking\n• Shopping cart\n• Medicines and browsing\n• Profile settings\n• Payments and delivery\n\nWhat would you like to know?'
          : 'I can help you with:\n\n• Registration\n• Login\n• Browsing medicines\n• Payment methods\n• Delivery information\n• General questions\n\nWhat interests you?'
      }

      const botMessage = {
        type: 'bot',
        text: botResponse,
        timestamp: new Date(),
        action
      }

      setMessages(prev => [...prev, botMessage])
    }, 500)
  }

  const handleQuickMessage = (query) => {
    setInputValue(query)
    setTimeout(() => handleSendMessage(), 100)
  }

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  return (
    <>
      {/* Chat Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 w-16 h-16 bg-gradient-to-br from-blue-600 to-purple-600 text-white rounded-full shadow-xl hover:shadow-2xl transition-all hover:scale-110 flex items-center justify-center z-50 animate-pulse"
          aria-label="Open chat"
        >
          <ChatBubbleLeftRightIcon className="h-7 w-7" />
          <span className="absolute -top-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-white"></span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-6 right-6 w-[380px] h-[550px] max-h-[80vh] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-5 flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-white/20 backdrop-blur rounded-full flex items-center justify-center relative">
                <ChatBubbleLeftRightIcon className="h-5 w-5" />
                <SparklesIcon className="h-3 w-3 absolute -top-1 -right-1 text-yellow-300" />
              </div>
              <div>
                <h3 className="font-bold text-lg">MediTrack Assistant</h3>
                <p className="text-xs text-blue-100">
                  {user ? `Helping ${user.fullName}` : 'Here to help you 24/7'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:bg-white/20 p-2 rounded-lg transition"
            >
              <XMarkIcon className="h-6 w-6" />
            </button>
          </div>

          {/* Quick Actions */}
          <div className="p-3 bg-gradient-to-r from-blue-50 to-purple-50 border-b border-gray-200">
            <div className="flex flex-wrap gap-2">
              {getQuickActions().map((action, index) => (
                <button
                  key={index}
                  onClick={action.action}
                  className="px-3 py-1.5 bg-white text-sm text-gray-700 rounded-full hover:bg-blue-600 hover:text-white transition-all shadow-sm hover:shadow-md"
                >
                  {action.text}
                </button>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gradient-to-b from-gray-50 to-white">
            {messages.map((message, index) => (
              <div key={index} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[80%] ${message.type === 'user' ? 'order-2' : 'order-1'}`}>
                  <div
                    className={`px-4 py-3 rounded-2xl shadow-sm ${message.type === 'user'
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-br-none'
                        : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                      }`}
                  >
                    <p className="text-sm whitespace-pre-line leading-relaxed">{message.text}</p>
                    {message.action && (
                      <button
                        onClick={() => navigate(message.action.path)}
                        className="mt-3 w-full px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700 transition-colors font-medium"
                      >
                        {message.action.text} →
                      </button>
                    )}
                  </div>
                  <p className={`text-xs text-gray-400 mt-1 ${message.type === 'user' ? 'text-right' : 'text-left'}`}>
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 bg-white">
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputValue.trim()}
                className="p-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:shadow-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <PaperAirplaneIcon className="h-5 w-5" />
              </button>
            </div>
            <p className="text-xs text-gray-400 mt-2 text-center">
              💬 Powered by MediTrack AI Assistant
            </p>
          </div>
        </div>
      )}
    </>
  )
}

export default Chatbot
