import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import SupplierLayout from '../../components/layout/SupplierLayout'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'
import { Card, Row, Col, Statistic, Button, Space, Typography, Spin, Alert } from 'antd'
import { 
  MedicineBoxOutlined, 
  WarningOutlined, 
  ExclamationCircleOutlined,
  PlusOutlined,
  DollarOutlined,
  FileTextOutlined
} from '@ant-design/icons'
import { ConfigProvider } from 'antd'

const { Title, Text } = Typography

const SupplierDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalMedicines: 0,
    lowStockMedicines: 0,
    nearExpiryMedicines: 0,
    totalStockValue: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/supplier/dashboard')
      setStats(response.data.stats)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <SupplierLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Spin size="large" />
        </div>
      </SupplierLayout>
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
      <SupplierLayout>
        <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
          <div style={{ marginBottom: 24 }}>
            <Title level={2} style={{ margin: 0, color: '#1a1a1a', fontWeight: 600 }}>
              Supplier Dashboard
            </Title>
            <Text type="secondary" style={{ fontSize: '14px' }}>
              Welcome back, {user?.fullName || 'Supplier'}! Manage your inventory and stock levels.
            </Text>
          </div>

          {/* Verification Status Alert */}
          {user?.verificationStatus === 'PENDING' && (
            <Alert
              message="Account Verification Pending"
              description="Your account is pending admin verification. You will be able to list medicines once your account is verified."
              type="warning"
              icon={<ExclamationCircleOutlined />}
              style={{ 
                marginBottom: 16,
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
                marginBottom: 16,
                borderRadius: '12px',
                border: '1px solid #ffccc7',
                background: '#fff1f0'
              }}
              showIcon
            />
          )}

          {/* Alerts */}
          {stats.lowStockMedicines > 0 && (
            <Alert
              message={`You have ${stats.lowStockMedicines} medicine(s) with low stock`}
              type="warning"
              icon={<WarningOutlined />}
              style={{ 
                marginBottom: 16,
                borderRadius: '12px',
                border: '1px solid #ffe58f',
                background: '#fffbe6'
              }}
              showIcon
            />
          )}
          {stats.nearExpiryMedicines > 0 && (
            <Alert
              message={`You have ${stats.nearExpiryMedicines} medicine(s) expiring within 30 days`}
              type="error"
              icon={<ExclamationCircleOutlined />}
              style={{ 
                marginBottom: 16,
                borderRadius: '12px',
                border: '1px solid #ffccc7',
                background: '#fff1f0'
              }}
              showIcon
            />
          )}

          {/* Stats Cards */}
          <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
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
                  title={<span style={{ color: '#595959', fontSize: '14px' }}>Total Medicines</span>}
                  value={stats.totalMedicines}
                  prefix={<MedicineBoxOutlined style={{ color: '#1890ff', fontSize: '24px' }} />}
                  valueStyle={{ color: '#1890ff', fontSize: '32px', fontWeight: 700 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card
                hoverable
                style={{
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  border: '1px solid #e8e8e8',
                  borderLeft: '4px solid #faad14',
                  background: 'linear-gradient(135deg, #fff3e0 0%, #ffffff 100%)',
                  transition: 'all 0.3s ease'
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <Statistic
                  title={<span style={{ color: '#595959', fontSize: '14px' }}>Low Stock</span>}
                  value={stats.lowStockMedicines}
                  prefix={<WarningOutlined style={{ color: '#faad14', fontSize: '24px' }} />}
                  valueStyle={{ color: '#faad14', fontSize: '32px', fontWeight: 700 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card
                hoverable
                style={{
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  border: '1px solid #e8e8e8',
                  borderLeft: '4px solid #ff4d4f',
                  background: 'linear-gradient(135deg, #fff1f0 0%, #ffffff 100%)',
                  transition: 'all 0.3s ease'
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <Statistic
                  title={<span style={{ color: '#595959', fontSize: '14px' }}>Near Expiry</span>}
                  value={stats.nearExpiryMedicines}
                  prefix={<ExclamationCircleOutlined style={{ color: '#ff4d4f', fontSize: '24px' }} />}
                  valueStyle={{ color: '#ff4d4f', fontSize: '32px', fontWeight: 700 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
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
                  title={<span style={{ color: '#595959', fontSize: '14px' }}>Total Stock Value</span>}
                  value={stats.totalStockValue}
                  prefix={<DollarOutlined style={{ color: '#52c41a', fontSize: '24px' }} />}
                  precision={2}
                  valueStyle={{ color: '#52c41a', fontSize: '28px', fontWeight: 700 }}
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
                <Link to="/supplier/medicines">
                  <Button 
                    type="primary" 
                    icon={<PlusOutlined />}
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
                    Add Medicine
                  </Button>
                </Link>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Link to="/supplier/medicines">
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
                    View Medicines
                  </Button>
                </Link>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Link to="/supplier/medicines">
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
                    Manage Stock
                  </Button>
                </Link>
              </Col>
            </Row>
          </Card>
        </div>
      </SupplierLayout>
    </ConfigProvider>
  )
}

export default SupplierDashboard
