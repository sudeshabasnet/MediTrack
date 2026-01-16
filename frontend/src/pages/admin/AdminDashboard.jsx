import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'
import { Card, Row, Col, Statistic, Button, Space, Typography, Spin, Table, Tag } from 'antd'
import { 
  MedicineBoxOutlined,
  ShopOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  SafetyOutlined,
  UserOutlined,
  FileTextOutlined,
  BarChartOutlined
} from '@ant-design/icons'
import { Bar, Line } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js'
import { ConfigProvider } from 'antd'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

const { Title: AntTitle, Text } = Typography

const AdminDashboard = () => {
  const { user } = useAuth()
  const [stats, setStats] = useState({
    totalMedicines: 0,
    totalSuppliers: 0,
    totalPharmacies: 0,
    lowStockMedicines: 0,
    nearExpiryMedicines: 0,
    pendingVerifications: 0
  })
  const [recentActivities, setRecentActivities] = useState([])
  const [topMedicines, setTopMedicines] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchDashboardData()
  }, [])

  const fetchDashboardData = async () => {
    try {
      const response = await axios.get('/api/admin/dashboard')
      setStats(response.data.stats)
      setRecentActivities(response.data.recentActivities || [])
      setTopMedicines(response.data.topMedicines || [])
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
    } finally {
      setLoading(false)
    }
  }

  const stockLevelData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Stock Level',
        data: [65, 59, 80, 81, 56, 55],
        backgroundColor: 'rgba(79, 70, 229, 0.5)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 2
      }
    ]
  }

  const distributionTrendsData = {
    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Distribution Trends',
        data: [120, 190, 300, 500, 200, 300],
        fill: true,
        backgroundColor: 'rgba(79, 70, 229, 0.2)',
        borderColor: 'rgba(79, 70, 229, 1)',
        borderWidth: 2,
        tension: 0.4
      }
    ]
  }

  const activityColumns = [
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
    },
  ]

  const medicineColumns = [
    {
      title: 'Medicine',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Usage',
      dataIndex: 'usage',
      key: 'usage',
    },
  ]

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Spin size="large" />
        </div>
      </AdminLayout>
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
      <AdminLayout>
        <div style={{ 
          background: '#f5f5f5', 
          padding: '24px', 
          borderRadius: '12px', 
          minHeight: 'calc(100vh - 112px)',
          maxWidth: '100%',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{ marginBottom: 32 }}>
            <AntTitle level={2} style={{ margin: 0, color: '#1a1a1a', fontWeight: 700, fontSize: '28px' }}>
              Dashboard Overview
            </AntTitle>
            <Text type="secondary" style={{ fontSize: '15px', marginTop: '8px', display: 'block' }}>
              Monitor and manage your MediTrack system at a glance
            </Text>
          </div>

          {/* Stats Cards */}
          <Row gutter={[20, 20]} style={{ marginBottom: 32 }}>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card
                hoverable
                style={{
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  border: 'none',
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer'
                }}
                bodyStyle={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '140px' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(102, 126, 234, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
                }}
              >
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontWeight: 500 }}>Total Medicines</span>}
                  value={stats.totalMedicines}
                  prefix={<MedicineBoxOutlined style={{ color: '#fff', fontSize: '22px', marginRight: '8px' }} />}
                  valueStyle={{ color: '#fff', fontSize: '26px', fontWeight: 700 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card
                hoverable
                style={{
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  border: 'none',
                  background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  height: '100%'
                }}
                bodyStyle={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '140px' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(82, 196, 26, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
                }}
              >
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontWeight: 500 }}>Total Suppliers</span>}
                  value={stats.totalSuppliers}
                  prefix={<ShopOutlined style={{ color: '#fff', fontSize: '22px', marginRight: '8px' }} />}
                  valueStyle={{ color: '#fff', fontSize: '26px', fontWeight: 700 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card
                hoverable
                style={{
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  border: 'none',
                  background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  height: '100%'
                }}
                bodyStyle={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '140px' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(24, 144, 255, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
                }}
              >
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontWeight: 500 }}>Total Pharmacies</span>}
                  value={stats.totalPharmacies}
                  prefix={<ShopOutlined style={{ color: '#fff', fontSize: '22px', marginRight: '8px' }} />}
                  valueStyle={{ color: '#fff', fontSize: '26px', fontWeight: 700 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card
                hoverable
                style={{
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  border: 'none',
                  background: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  height: '100%'
                }}
                bodyStyle={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '140px' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(250, 173, 20, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
                }}
              >
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontWeight: 500 }}>Low Stock</span>}
                  value={stats.lowStockMedicines}
                  prefix={<WarningOutlined style={{ color: '#fff', fontSize: '22px', marginRight: '8px' }} />}
                  valueStyle={{ color: '#fff', fontSize: '26px', fontWeight: 700 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Card
                hoverable
                style={{
                  borderRadius: '16px',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                  border: 'none',
                  background: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  height: '100%'
                }}
                bodyStyle={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '140px' }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-4px)'
                  e.currentTarget.style.boxShadow = '0 8px 20px rgba(255, 77, 79, 0.3)'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)'
                  e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
                }}
              >
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontWeight: 500 }}>Near Expiry</span>}
                  value={stats.nearExpiryMedicines}
                  prefix={<ExclamationCircleOutlined style={{ color: '#fff', fontSize: '22px', marginRight: '8px' }} />}
                  valueStyle={{ color: '#fff', fontSize: '26px', fontWeight: 700 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} md={8} lg={6} xl={4}>
              <Link to="/admin/users?tab=pending" style={{ textDecoration: 'none' }}>
                <Card
                  hoverable
                  style={{
                    borderRadius: '16px',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                    border: 'none',
                    background: 'linear-gradient(135deg, #fa8c16 0%, #ffa940 100%)',
                    transition: 'all 0.3s ease',
                    cursor: 'pointer',
                    height: '100%'
                  }}
                  bodyStyle={{ padding: '20px', height: '100%', display: 'flex', flexDirection: 'column', justifyContent: 'center', minHeight: '140px' }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-4px)'
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(250, 140, 22, 0.3)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.08)'
                  }}
                >
                  <Statistic
                    title={<span style={{ color: 'rgba(255,255,255,0.9)', fontSize: '13px', fontWeight: 500 }}>Pending Verifications</span>}
                    value={stats.pendingVerifications || 0}
                    prefix={<SafetyOutlined style={{ color: '#fff', fontSize: '22px', marginRight: '8px' }} />}
                    valueStyle={{ color: '#fff', fontSize: '26px', fontWeight: 700 }}
                  />
                </Card>
              </Link>
            </Col>
          </Row>

          {/* Quick Actions */}
          <Card 
            title={<span style={{ fontSize: '20px', fontWeight: 600, color: '#1a1a1a' }}>Quick Actions</span>}
            style={{ 
              borderRadius: '16px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              border: 'none',
              marginBottom: 32,
              background: '#ffffff'
            }}
            bodyStyle={{ padding: '28px' }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} lg={8}>
                <Link to="/admin/medicines">
                  <Button 
                    type="primary" 
                    icon={<MedicineBoxOutlined />}
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
                    View Medicines
                  </Button>
                </Link>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Link to="/admin/users">
                  <Button 
                    type="primary" 
                    icon={<UserOutlined />}
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
                    Manage Users
                  </Button>
                </Link>
              </Col>
              <Col xs={24} sm={12} lg={8}>
                <Link to="/admin/reports">
                  <Button 
                    type="primary" 
                    icon={<BarChartOutlined />}
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
                    View Reports
                  </Button>
                </Link>
              </Col>
            </Row>
          </Card>

          {/* Charts */}
          <Row gutter={[20, 20]} style={{ marginBottom: 32 }}>
            <Col xs={24} lg={12}>
              <Card 
                title={<span style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a' }}>Stock Level Chart</span>}
                style={{
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  border: 'none',
                  background: '#ffffff'
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <div style={{ height: '300px' }}>
                  <Bar data={stockLevelData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card 
                title={<span style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a' }}>Distribution Trends</span>}
                style={{
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  border: 'none',
                  background: '#ffffff'
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <div style={{ height: '300px' }}>
                  <Line data={distributionTrendsData} options={{ responsive: true, maintainAspectRatio: false }} />
                </div>
              </Card>
            </Col>
          </Row>

          {/* Recent Activities and Top Medicines */}
          <Row gutter={[20, 20]}>
            <Col xs={24} lg={12}>
              <Card 
                title={<span style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a' }}>Recent Activity</span>}
                style={{
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  border: 'none',
                  background: '#ffffff'
                }}
                bodyStyle={{ padding: '24px' }}
              >
                {recentActivities.length > 0 ? (
                  <Table
                    columns={activityColumns}
                    dataSource={recentActivities.map((activity, index) => ({
                      key: index,
                      action: activity.action,
                      timestamp: activity.timestamp
                    }))}
                    pagination={false}
                    size="small"
                  />
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Text type="secondary">No recent activities</Text>
                  </div>
                )}
              </Card>
            </Col>
            <Col xs={24} lg={12}>
              <Card 
                title={<span style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a' }}>Top 10 Most Used Medicines</span>}
                style={{
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  border: 'none',
                  background: '#ffffff'
                }}
                bodyStyle={{ padding: '24px' }}
              >
                {topMedicines.length > 0 ? (
                  <Table
                    columns={medicineColumns}
                    dataSource={topMedicines.map((medicine, index) => ({
                      key: index,
                      name: medicine.name,
                      usage: medicine.usage
                    }))}
                    pagination={false}
                    size="small"
                  />
                ) : (
                  <div style={{ textAlign: 'center', padding: '40px 0' }}>
                    <Text type="secondary">No data available</Text>
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </div>
      </AdminLayout>
    </ConfigProvider>
  )
}

export default AdminDashboard
