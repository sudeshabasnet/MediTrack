import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'
import { Card, Row, Col, Statistic, Button, Space, Typography, Spin, Alert } from 'antd'
import { 
  MedicineBoxOutlined, 
  ShoppingCartOutlined, 
  SearchOutlined,
  InboxOutlined,
  FileTextOutlined,
  ExclamationCircleOutlined
} from '@ant-design/icons'
import { ConfigProvider } from 'antd'

const { Title, Text } = Typography

const PharmacyDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    availableMedicines: 0,
    myOrders: 0,
    pendingOrders: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/pharmacy/dashboard')
      setStats(response.data.stats)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <AppLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Spin size="large" />
        </div>
      </AppLayout>
    )
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4F46E5',
          borderRadius: 8,
        },
      }}
    >
      <AppLayout>
        <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
          <div style={{ marginBottom: 24 }}>
            <Title level={2} style={{ margin: 0, color: '#1a1a1a', fontWeight: 600 }}>
              Inventory Dashboard
            </Title>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              Welcome back, {user?.fullName || 'Pharmacy'}! Monitor your inventory and manage your pharmacy operations.
            </Text>
          </div>

          {/* Verification Status Alert */}
          {user?.verificationStatus === 'PENDING' && (
            <Alert
              message="Account Verification Pending"
              description="Your account is pending admin verification. Some features may be limited until your account is verified."
              type="warning"
              icon={<ExclamationCircleOutlined />}
              style={{ 
                marginBottom: 24,
                borderRadius: '12px',
                border: '1px solid #ffe58f',
                background: '#fffbe6'
              }}
              showIcon
            />
          )}
          {user?.verificationStatus === 'REJECTED' && (
            <Alert
              message="Account Verification Rejected"
              description="Your account verification was rejected. Please contact support for more information."
              type="error"
              icon={<ExclamationCircleOutlined />}
              style={{ 
                marginBottom: 24,
                borderRadius: '12px',
                border: '1px solid #ffccc7',
                background: '#fff1f0'
              }}
              showIcon
            />
          )}

          {/* Stats Cards */}
          <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={8}>
              <Card
                hoverable
                style={{
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  border: '1px solid #e8e8e8',
                  background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
                  transition: 'all 0.3s ease'
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <Statistic
                  title={<span style={{ color: '#595959', fontSize: '14px' }}>Available Medicines</span>}
                  value={stats.availableMedicines}
                  prefix={<MedicineBoxOutlined style={{ color: '#1890ff', fontSize: '24px' }} />}
                  valueStyle={{ color: '#1890ff', fontSize: '32px', fontWeight: 700 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card
                hoverable
                style={{
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  border: '1px solid #e8e8e8',
                  background: 'linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%)',
                  transition: 'all 0.3s ease'
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <Statistic
                  title={<span style={{ color: '#595959', fontSize: '14px' }}>My Orders</span>}
                  value={stats.myOrders}
                  prefix={<ShoppingCartOutlined style={{ color: '#52c41a', fontSize: '24px' }} />}
                  valueStyle={{ color: '#52c41a', fontSize: '32px', fontWeight: 700 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card
                hoverable
                style={{
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  border: '1px solid #e8e8e8',
                  background: 'linear-gradient(135deg, #fff3e0 0%, #ffffff 100%)',
                  transition: 'all 0.3s ease'
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <Statistic
                  title={<span style={{ color: '#595959', fontSize: '14px' }}>Pending Orders</span>}
                  value={stats.pendingOrders}
                  prefix={<InboxOutlined style={{ color: '#faad14', fontSize: '24px' }} />}
                  valueStyle={{ color: '#faad14', fontSize: '32px', fontWeight: 700 }}
                />
              </Card>
            </Col>
          </Row>

          {/* Quick Actions */}
          <Card 
            title={<span style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a' }}>Quick Actions</span>}
            style={{ 
              borderRadius: '16px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              border: '1px solid #e8e8e8'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={8}>
                <Link to="/pharmacy/medicines">
                  <Button 
                    type="primary" 
                    icon={<SearchOutlined />}
                    block
                    size="large"
                    style={{ 
                      height: 64,
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: 500,
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-2px)'
                      e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = 'translateY(0)'
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    Browse Medicines
                  </Button>
                </Link>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Link to="/pharmacy/inventory/management">
                  <Button 
                    type="default" 
                    icon={<MedicineBoxOutlined />}
                    block
                    size="large"
                    style={{ 
                      height: 64,
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: 500,
                      border: '2px solid #e8e8e8',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#667eea'
                      e.currentTarget.style.color = '#667eea'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e8e8e8'
                      e.currentTarget.style.color = 'inherit'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    Manage Inventory
                  </Button>
                </Link>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Link to="/user/orders">
                  <Button 
                    type="default" 
                    icon={<FileTextOutlined />}
                    block
                    size="large"
                    style={{ 
                      height: 64,
                      borderRadius: '12px',
                      fontSize: '16px',
                      fontWeight: 500,
                      border: '2px solid #e8e8e8',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#667eea'
                      e.currentTarget.style.color = '#667eea'
                      e.currentTarget.style.transform = 'translateY(-2px)'
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#e8e8e8'
                      e.currentTarget.style.color = 'inherit'
                      e.currentTarget.style.transform = 'translateY(0)'
                    }}
                  >
                    View Orders
                  </Button>
                </Link>
              </Col>
            </Row>
          </Card>
        </div>
      </AppLayout>
    </ConfigProvider>
  )
}

export default PharmacyDashboard
