import { createContext, useState, useEffect, useContext } from 'react'
import axios from 'axios'

// Configure axios defaults
axios.defaults.headers.common['Content-Type'] = 'application/json'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [token, setToken] = useState(localStorage.getItem('token'))

  useEffect(() => {
    if (token) {
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      // Fetch user profile
      fetchUserProfile()
    } else {
      setLoading(false)
    }
  }, [token])

  const fetchUserProfile = async () => {
    try {
      const response = await axios.get('/api/auth/profile')
      setUser(response.data)
    } catch (error) {
      // If token is invalid/expired, clear it and proceed as unauthenticated
      console.warn('Failed to fetch user profile, clearing invalid token')
      setToken(null)
      setUser(null)
      localStorage.removeItem('token')
      delete axios.defaults.headers.common['Authorization']
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      // Validate inputs before sending
      if (!email || !password) {
        return {
          success: false,
          error: 'Email and password are required'
        }
      }

      const response = await axios.post('/api/auth/login', { email, password }, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      const { token, user } = response.data
      
      if (!token || !user) {
        return {
          success: false,
          error: 'Invalid response from server'
        }
      }

      setToken(token)
      setUser(user)
      localStorage.setItem('token', token)
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
      return { success: true, user }
    } catch (error) {
      console.error('Login error:', error)
      
      // Handle different error response formats
      let errorMessage = 'Login failed'
      
      if (error.response) {
        const data = error.response.data
        
        // Handle validation errors
        if (data.errors) {
          const errorMessages = Object.values(data.errors).join(', ')
          errorMessage = errorMessages || data.message || 'Validation failed'
        } 
        // Handle simple message format
        else if (data.message) {
          errorMessage = data.message
        }
        // Handle string response
        else if (typeof data === 'string') {
          errorMessage = data
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.'
      } else {
        errorMessage = error.message || 'An unexpected error occurred'
      }
      
      return {
        success: false,
        error: errorMessage
      }
    }
  }

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/auth/register', userData)
      return { success: true, data: response.data }
    } catch (error) {
      let errorMessage = 'Registration failed'

      if (error.response) {
        const data = error.response.data

        // Backend sometimes returns a plain string (e.g. "Email already exists")
        if (typeof data === 'string') {
          errorMessage = data
        } else if (data?.message) {
          errorMessage = data.message
        }
      } else if (error.request) {
        errorMessage = 'Network error. Please check your connection.'
      } else if (error.message) {
        errorMessage = error.message
      }

      return {
        success: false,
        error: errorMessage
      }
    }
  }

  const logout = () => {
    setToken(null)
    setUser(null)
    localStorage.removeItem('token')
    delete axios.defaults.headers.common['Authorization']
  }

  const value = {
    user,
    token,
    login,
    register,
    logout,
    loading,
    isAuthenticated: !!token
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

