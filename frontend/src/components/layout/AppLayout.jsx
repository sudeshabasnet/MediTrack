import { useState, useEffect } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'
import Chatbot from '../chatbot/Chatbot'
import { Layout, Dropdown, Avatar, Badge, Space, Button, Typography, Row, Col, Divider } from 'antd'
import { 
  HomeOutlined, 
  ShoppingCartOutlined, 
  UserOutlined, 
  LogoutOutlined,
  FileTextOutlined,
  InfoCircleOutlined,
  DownOutlined
} from '@ant-design/icons'
import { ConfigProvider } from 'antd'

const { Header, Content, Footer } = Layout
const { Text } = Typography

const AppLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [cartCount, setCartCount] = useState(0)

  const getDashboardPath = () => {
    if (user?.role === 'ADMIN') return '/admin/dashboard'
    if (user?.role === 'PHARMACY') return '/pharmacy/dashboard'
    if (user?.role === 'SUPPLIER') return '/supplier/dashboard'
    return '/pharmacy/medicines'
  }

  const fetchCartCount = async () => {
    try {
      const response = await axios.get('/api/cart/summary')
      setCartCount(response.data.itemCount || 0)
    } catch (error) {
      setCartCount(0)
    }
  }

  useEffect(() => {
    if (user?.role === 'USER' || user?.role === 'PHARMACY') {
      fetchCartCount()
      const handleCartUpdate = (event) => {
        setCartCount(event.detail.itemCount || 0)
      }
      window.addEventListener('cartUpdated', handleCartUpdate)
      window.addEventListener('cartChanged', fetchCartCount)
      return () => {
        window.removeEventListener('cartUpdated', handleCartUpdate)
        window.removeEventListener('cartChanged', fetchCartCount)
      }
    }
  }, [user?.role])

  const getAvatarUrl = () => {
    if (!user?.id) return null
    const stored = localStorage.getItem(`avatar_${user.id}`)
    if (stored) {
      try {
        const parsed = JSON.parse(stored)
        return parsed.imageUrl
      } catch (e) {
        return null
      }
    }
    return null
  }

  const avatarUrl = getAvatarUrl()

  const userMenuItems = [
    ...(user?.role === 'PHARMACY' ? [{
      key: 'dashboard',
      icon: <HomeOutlined />,
      label: <Link to="/pharmacy/dashboard">Dashboard</Link>,
    }] : []),
    ...(user?.role === 'USER' || user?.role === 'PHARMACY' ? [{
      key: 'profile',
      icon: <UserOutlined />,
      label: <Link to="/user/profile">Profile</Link>,
    }] : []),
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Logout',
      danger: true,
      onClick: () => logout(),
    },
  ]

  const menuItems = (user?.role === 'USER' || user?.role === 'PHARMACY') ? [
    {
      key: '/pharmacy/medicines',
      icon: <HomeOutlined />,
      label: 'Browse Medicines',
      path: '/pharmacy/medicines',
    },
    {
      key: '/user/orders',
      icon: <FileTextOutlined />,
      label: 'Orders',
      path: '/user/orders',
    },
    {
      key: '/about',
      icon: <InfoCircleOutlined />,
      label: 'About Us',
      path: '/about',
    },
    {
      key: '/user/cart',
      icon: (
        <Badge count={cartCount} overflowCount={99} size="small">
          <ShoppingCartOutlined />
        </Badge>
      ),
      label: 'Cart',
      path: '/user/cart',
    },
  ] : [
    {
      key: getDashboardPath(),
      icon: <HomeOutlined />,
      label: 'Dashboard',
      path: getDashboardPath(),
    },
  ]

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4F46E5',
          borderRadius: 8,
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: '#fff' }}>
        <Header 
          style={{ 
            background: '#fff', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            padding: '0 50px',
            height: '80px',
            lineHeight: '80px',
            position: 'sticky',
            top: 0,
            zIndex: 1000
          }}
        >
          <Row align="middle" style={{ height: '100%' }}>
            <Col flex="auto" style={{ display: 'flex', justifyContent: 'flex-start' }}>
              <Link to={(user?.role === 'USER' || user?.role === 'PHARMACY') ? '/pharmacy/medicines' : getDashboardPath()}>
                <Space>
                  <div style={{ 
                    width: 40, 
                    height: 40, 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Text strong style={{ color: '#fff', fontSize: 20 }}>M</Text>
                  </div>
                  <Text strong style={{ fontSize: 20, color: '#1890ff' }}>MediTrack</Text>
                </Space>
              </Link>
            </Col>

            <Col flex="auto" style={{ display: 'flex', justifyContent: 'center' }}>
              <Space size="large" style={{ height: '100%', display: 'flex', alignItems: 'center' }}>
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path || location.pathname.startsWith(item.path + '/')
                  return (
                    <Link
                      key={item.key}
                      to={item.path}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px',
                        color: isActive ? '#1890ff' : 'rgba(0, 0, 0, 0.88)',
                        fontWeight: isActive ? 500 : 400,
                        textDecoration: 'none',
                        padding: '8px 12px',
                        borderRadius: '6px',
                        transition: 'all 0.2s',
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = 'rgba(0, 0, 0, 0.04)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = 'transparent'
                      }}
                    >
                      <span style={{ fontSize: '16px' }}>{item.icon}</span>
                      <span>{item.label}</span>
                    </Link>
                  )
                })}
              </Space>
            </Col>

            <Col flex="auto" style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
                <Space style={{ cursor: 'pointer' }}>
                  <Avatar 
                    src={avatarUrl}
                    icon={!avatarUrl && <UserOutlined />}
                    style={{ backgroundColor: '#1890ff' }}
                  >
                    {!avatarUrl && user?.fullName?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <Text>{user?.fullName || 'User'}</Text>
                  <DownOutlined />
                </Space>
              </Dropdown>
            </Col>
          </Row>
        </Header>

        <Content style={{ flex: 1 }}>
          {children}
        </Content>

        <Footer style={{ background: '#f5f5f5', padding: '48px 50px' }}>
          <Row gutter={[48, 32]}>
            <Col xs={24} sm={12} md={6}>
              <Space orientation="vertical" size="small">
                <Space>
                  <div style={{ 
                    width: 32, 
                    height: 32, 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Text strong style={{ color: '#fff', fontSize: 16 }}>M</Text>
                  </div>
                  <Text strong style={{ fontSize: 16 }}>MediTrack</Text>
                </Space>
                <Text type="secondary" style={{ fontSize: 12 }}>
                  Your trusted partner for medicine management and distribution.
                </Text>
              </Space>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Text strong style={{ display: 'block', marginBottom: 16 }}>Quick Links</Text>
              <Space orientation="vertical" size="small">
                {user?.role === 'USER' || user?.role === 'PHARMACY' ? (
                  <>
                    <Link to="/pharmacy/medicines" style={{ color: '#666' }}>Browse Medicines</Link>
                    <Link to="/user/orders" style={{ color: '#666' }}>My Orders</Link>
                    <Link to="/user/profile" style={{ color: '#666' }}>Profile</Link>
                    <Link to="/about" style={{ color: '#666' }}>About Us</Link>
                  </>
                ) : (
                  <Link to={getDashboardPath()} style={{ color: '#666' }}>Dashboard</Link>
                )}
              </Space>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Text strong style={{ display: 'block', marginBottom: 16 }}>Support</Text>
              <Space orientation="vertical" size="small">
                <a href="#" style={{ color: '#666' }}>Help Center</a>
                <a href="#" style={{ color: '#666' }}>Contact Us</a>
                <a href="#" style={{ color: '#666' }}>Privacy Policy</a>
                <a href="#" style={{ color: '#666' }}>Terms of Service</a>
              </Space>
            </Col>
            <Col xs={24} sm={12} md={6}>
              <Text strong style={{ display: 'block', marginBottom: 16 }}>Contact</Text>
              <Space direction="vertical" size="small" style={{ color: '#666', fontSize: 12 }}>
                <Text type="secondary">Email: support@meditrack.com</Text>
                <Text type="secondary">Phone: +977-1-1234567</Text>
                <Text type="secondary">Address: Kathmandu, Nepal</Text>
              </Space>
            </Col>
          </Row>
          <Divider />
          <Row justify="space-between" align="middle">
            <Col>
              <Text type="secondary" style={{ fontSize: 12 }}>
                © {new Date().getFullYear()} MediTrack. All rights reserved.
              </Text>
            </Col>
            <Col>
              <Space>
                <a href="#" style={{ color: '#666', fontSize: 12 }}>Facebook</a>
                <a href="#" style={{ color: '#666', fontSize: 12 }}>Twitter</a>
                <a href="#" style={{ color: '#666', fontSize: 12 }}>LinkedIn</a>
              </Space>
            </Col>
          </Row>
        </Footer>

        <Chatbot />
      </Layout>
    </ConfigProvider>
  )
}

export default AppLayout
