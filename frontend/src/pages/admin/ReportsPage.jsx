import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import axios from 'axios'
import { Card, Row, Col, Statistic, Typography, Spin, Table, Tag, Tabs, Select, Space, Button } from 'antd'
import { 
  Bar, 
  Line, 
  Pie, 
  Doughnut 
} from 'react-chartjs-2'
import { ConfigProvider } from 'antd'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js'
import {
  UserOutlined,
  MedicineBoxOutlined,
  ShoppingCartOutlined,
  DollarOutlined,
  RiseOutlined,
  DownloadOutlined,
  TeamOutlined,
  ShopOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import dayjs from 'dayjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
)

const { Title: AntTitle, Text } = Typography

const ReportsPage = () => {
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  
  // Stats
  const [userStats, setUserStats] = useState(null)
  const [medicineStats, setMedicineStats] = useState(null)
  const [orderStats, setOrderStats] = useState(null)
  const [revenueStats, setRevenueStats] = useState(null)
  
  // Data for tables
  const [topMedicines, setTopMedicines] = useState([])
  const [recentOrders, setRecentOrders] = useState([])
  const [topCustomers, setTopCustomers] = useState([])

  useEffect(() => {
    fetchAllReports()
  }, [])

  const fetchAllReports = async () => {
    try {
      setLoading(true)
      const [
        usersRes,
        medicinesRes,
        ordersRes,
        stockRes
      ] = await Promise.all([
        axios.get('/api/admin/users'),
        axios.get('/api/admin/medicines'),
        axios.get('/api/admin/orders'),
        axios.get('/api/admin/reports/stock-summary')
      ])

      const users = usersRes.data
      const medicines = medicinesRes.data
      const orders = ordersRes.data

      // Process user stats
      const userStatsData = {
        total: users.length,
        active: users.filter(u => u.active).length,
        suppliers: users.filter(u => u.role === 'SUPPLIER').length,
        pharmacies: users.filter(u => u.role === 'PHARMACY').length,
        customers: users.filter(u => u.role === 'USER').length,
        verified: users.filter(u => u.emailVerified).length
      }
      setUserStats(userStatsData)

      // Process medicine stats
      const medicineStatsData = {
        total: medicines.length,
        available: medicines.filter(m => m.status === 'AVAILABLE').length,
        lowStock: medicines.filter(m => m.status === 'LOW_STOCK').length,
        outOfStock: medicines.filter(m => m.status === 'OUT_OF_STOCK').length,
        totalValue: medicines.reduce((sum, m) => sum + (m.unitPrice * m.currentStock), 0)
      }
      setMedicineStats(medicineStatsData)

      // Process order stats
      const orderStatsData = {
        total: orders.length,
        pending: orders.filter(o => o.status === 'PENDING').length,
        confirmed: orders.filter(o => o.status === 'CONFIRMED').length,
        processing: orders.filter(o => o.status === 'PROCESSING').length,
        shipped: orders.filter(o => o.status === 'SHIPPED').length,
        delivered: orders.filter(o => o.status === 'DELIVERED').length,
        cancelled: orders.filter(o => o.status === 'CANCELLED').length,
        totalRevenue: orders
          .filter(o => o.status !== 'CANCELLED')
          .reduce((sum, o) => sum + o.totalAmount, 0)
      }
      setOrderStats(orderStatsData)

      // Top medicines by stock value
      const topMeds = medicines
        .map(m => ({
          ...m,
          value: m.unitPrice * m.currentStock
        }))
        .sort((a, b) => b.value - a.value)
        .slice(0, 10)
      setTopMedicines(topMeds)

      // Recent orders
      const recent = orders
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 10)
      setRecentOrders(recent)

      // Top customers (by order count)
      const customerOrders = orders.reduce((acc, order) => {
        const userId = order.user?.id
        if (userId) {
          if (!acc[userId]) {
            acc[userId] = {
              id: userId,
              name: order.user.fullName,
              email: order.user.email,
              orderCount: 0,
              totalSpent: 0
            }
          }
          acc[userId].orderCount++
          if (order.status !== 'CANCELLED') {
            acc[userId].totalSpent += order.totalAmount
          }
        }
        return acc
      }, {})
      const topCust = Object.values(customerOrders)
        .sort((a, b) => b.totalSpent - a.totalSpent)
        .slice(0, 10)
      setTopCustomers(topCust)

    } catch (error) {
      console.error('Failed to fetch reports:', error)
    } finally {
      setLoading(false)
    }
  }

  // Chart configurations
  const userRoleChartData = userStats ? {
    labels: ['Customers', 'Suppliers', 'Pharmacies'],
    datasets: [{
      label: 'Users by Role',
      data: [userStats.customers, userStats.suppliers, userStats.pharmacies],
      backgroundColor: [
        'rgba(54, 162, 235, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 206, 86, 0.6)'
      ],
      borderColor: [
        'rgba(54, 162, 235, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)'
      ],
      borderWidth: 2
    }]
  } : null

  const medicineStatusChartData = medicineStats ? {
    labels: ['Available', 'Low Stock', 'Out of Stock'],
    datasets: [{
      label: 'Medicine Status',
      data: [medicineStats.available, medicineStats.lowStock, medicineStats.outOfStock],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(255, 99, 132, 0.6)'
      ],
      borderColor: [
        'rgba(75, 192, 192, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(255, 99, 132, 1)'
      ],
      borderWidth: 2
    }]
  } : null

  const orderStatusChartData = orderStats ? {
    labels: ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    datasets: [{
      label: 'Orders by Status',
      data: [
        orderStats.pending,
        orderStats.confirmed,
        orderStats.processing,
        orderStats.shipped,
        orderStats.delivered,
        orderStats.cancelled
      ],
      backgroundColor: [
        'rgba(255, 206, 86, 0.6)',
        'rgba(54, 162, 235, 0.6)',
        'rgba(153, 102, 255, 0.6)',
        'rgba(255, 159, 64, 0.6)',
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 99, 132, 0.6)'
      ],
      borderWidth: 2
    }]
  } : null

  const topMedicinesColumns = [
    {
      title: '#',
      key: 'index',
      width: 60,
      render: (_, __, index) => index + 1
    },
    {
      title: 'Medicine Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Stock',
      dataIndex: 'currentStock',
      key: 'currentStock',
      render: (stock) => <Tag color="blue">{stock} units</Tag>
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (price) => `Rs. ${price?.toFixed(2)}`
    },
    {
      title: 'Total Value',
      dataIndex: 'value',
      key: 'value',
      render: (value) => <Text strong style={{ color: '#52c41a' }}>Rs. {value?.toFixed(2)}</Text>
    }
  ]

  const recentOrdersColumns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      render: (id) => `#${id}`
    },
    {
      title: 'Customer',
      key: 'customer',
      render: (record) => record.user?.fullName || record.fullName || 'Guest'
    },
    {
      title: 'Amount',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      render: (amount) => `Rs. ${amount?.toFixed(2)}`
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={
          status === 'DELIVERED' ? 'green' :
          status === 'CANCELLED' ? 'red' :
          status === 'SHIPPED' ? 'purple' :
          status === 'PROCESSING' ? 'cyan' :
          status === 'CONFIRMED' ? 'blue' : 'gold'
        }>
          {status}
        </Tag>
      )
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('MMM DD, YYYY')
    }
  ]

  const topCustomersColumns = [
    {
      title: 'Rank',
      key: 'rank',
      width: 70,
      render: (_, __, index) => (
        <Text strong style={{ 
          color: index === 0 ? '#faad14' : index === 1 ? '#bfbfbf' : index === 2 ? '#d4773a' : '#8c8c8c'
        }}>
          #{index + 1}
        </Text>
      )
    },
    {
      title: 'Customer Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email'
    },
    {
      title: 'Total Orders',
      dataIndex: 'orderCount',
      key: 'orderCount',
      render: (count) => <Tag color="blue">{count}</Tag>
    },
    {
      title: 'Total Spent',
      dataIndex: 'totalSpent',
      key: 'totalSpent',
      render: (amount) => <Text strong style={{ color: '#52c41a' }}>Rs. {amount?.toFixed(2)}</Text>
    }
  ]

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Spin size="large" tip="Loading Reports..." />
        </div>
      </AdminLayout>
    )
  }

  const OverviewTab = () => (
    <div>
      {/* Key Metrics */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.9)' }}>Total Users</span>}
              value={userStats?.total || 0}
              prefix={<UserOutlined />}
              valueStyle={{ color: '#fff', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)', border: 'none' }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.9)' }}>Total Medicines</span>}
              value={medicineStats?.total || 0}
              prefix={<MedicineBoxOutlined />}
              valueStyle={{ color: '#fff', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)', border: 'none' }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.9)' }}>Total Orders</span>}
              value={orderStats?.total || 0}
              prefix={<ShoppingCartOutlined />}
              valueStyle={{ color: '#fff', fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)', border: 'none' }}>
            <Statistic
              title={<span style={{ color: 'rgba(255,255,255,0.9)' }}>Total Revenue</span>}
              value={orderStats?.totalRevenue || 0}
              prefix="Rs. "
              precision={2}
              valueStyle={{ color: '#fff', fontWeight: 700, fontSize: '24px' }}
            />
          </Card>
        </Col>
      </Row>

      {/* Charts Row */}
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={12}>
          <Card title="Users by Role" style={{ borderRadius: '12px', height: '400px' }}>
            {userRoleChartData && <Pie data={userRoleChartData} options={{ responsive: true, maintainAspectRatio: true }} />}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Medicine Status Distribution" style={{ borderRadius: '12px', height: '400px' }}>
            {medicineStatusChartData && <Doughnut data={medicineStatusChartData} options={{ responsive: true, maintainAspectRatio: true }} />}
          </Card>
        </Col>
      </Row>

      {/* Order Status Chart */}
      <Row gutter={[20, 20]}>
        <Col xs={24}>
          <Card title="Orders by Status" style={{ borderRadius: '12px' }}>
            {orderStatusChartData && <Bar data={orderStatusChartData} options={{ responsive: true, maintainAspectRatio: false }} height={80} />}
          </Card>
        </Col>
      </Row>
    </div>
  )

  const UsersTab = () => (
    <div>
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="Total Users"
              value={userStats?.total || 0}
              prefix={<TeamOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="Active Users"
              value={userStats?.active || 0}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="Verified Users"
              value={userStats?.verified || 0}
              prefix={<CheckCircleOutlined style={{ color: '#faad14' }} />}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} lg={12}>
          <Card title="User Role Distribution" style={{ borderRadius: '12px', height: '400px' }}>
            {userRoleChartData && <Pie data={userRoleChartData} />}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Top Customers" style={{ borderRadius: '12px' }}>
            <Table
              columns={topCustomersColumns}
              dataSource={topCustomers}
              rowKey="id"
              pagination={false}
              size="small"
            />
          </Card>
        </Col>
      </Row>
    </div>
  )

  const MedicinesTab = () => (
    <div>
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="Total Medicines"
              value={medicineStats?.total || 0}
              prefix={<MedicineBoxOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="Available"
              value={medicineStats?.available || 0}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="Low Stock"
              value={medicineStats?.lowStock || 0}
              prefix={<ClockCircleOutlined style={{ color: '#faad14' }} />}
              valueStyle={{ color: '#faad14' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="Total Inventory Value"
              value={medicineStats?.totalValue || 0}
              prefix="Rs. "
              precision={2}
              valueStyle={{ color: '#52c41a', fontSize: '20px' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24} lg={12}>
          <Card title="Medicine Status" style={{ borderRadius: '12px', height: '400px' }}>
            {medicineStatusChartData && <Doughnut data={medicineStatusChartData} />}
          </Card>
        </Col>
        <Col xs={24} lg={12}>
          <Card title="Top 10 Medicines by Stock Value" style={{ borderRadius: '12px' }}>
            <Table
              columns={topMedicinesColumns}
              dataSource={topMedicines}
              rowKey="id"
              pagination={false}
              size="small"
              scroll={{ x: true }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )

  const OrdersTab = () => (
    <div>
      <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={8}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="Total Orders"
              value={orderStats?.total || 0}
              prefix={<ShoppingCartOutlined style={{ color: '#1890ff' }} />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="Delivered Orders"
              value={orderStats?.delivered || 0}
              prefix={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              valueStyle={{ color: '#52c41a' }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={8}>
          <Card style={{ borderRadius: '12px', textAlign: 'center' }}>
            <Statistic
              title="Total Revenue"
              value={orderStats?.totalRevenue || 0}
              prefix="Rs. "
              precision={2}
              valueStyle={{ color: '#52c41a', fontSize: '20px' }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]}>
        <Col xs={24}>
          <Card title="Orders by Status" style={{ borderRadius: '12px' }}>
            {orderStatusChartData && <Bar data={orderStatusChartData} options={{ responsive: true }} height={80} />}
          </Card>
        </Col>
      </Row>

      <Row gutter={[20, 20]} style={{ marginTop: 24 }}>
        <Col xs={24}>
          <Card title="Recent Orders" style={{ borderRadius: '12px' }}>
            <Table
              columns={recentOrdersColumns}
              dataSource={recentOrders}
              rowKey="id"
              pagination={false}
              scroll={{ x: true }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )

  const FlowchartTab = () => (
    <div>
      <Row gutter={[20, 20]}>
        <Col xs={24}>
          <Card title="🔄 System Workflow" style={{ borderRadius: '12px', marginBottom: 20 }}>
            <div style={{ 
              padding: '30px', 
              background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
              borderRadius: '12px',
              fontFamily: 'monospace'
            }}>
              <pre style={{ fontSize: '14px', lineHeight: '2', margin: 0 }}>
{`
┌─────────────────────────────────────────────────────────────┐
│                    MEDITRACK SYSTEM FLOW                    │
└─────────────────────────────────────────────────────────────┘

1️⃣  USER REGISTRATION & VERIFICATION
    ┌──────────┐
    │   USER   │
    └────┬─────┘
         │ Register
         ▼
    ┌──────────┐       ┌─────────────┐
    │  SYSTEM  │──────▶│  Email Sent │
    └────┬─────┘       └─────────────┘
         │
         │ Email Verification
         ▼
    ┌──────────┐
    │  ACTIVE  │
    └──────────┘

2️⃣  SUPPLIER MEDICINE MANAGEMENT
    ┌──────────┐
    │ SUPPLIER │
    └────┬─────┘
         │ Add Medicine
         ▼
    ┌──────────┐       ┌─────────────┐
    │ MEDICINE │──────▶│   ACTIVE    │
    │ DATABASE │       │  LOW_STOCK  │
    └──────────┘       │ OUT_OF_STOCK│
                       └─────────────┘

3️⃣  ORDER PROCESSING WORKFLOW
    ┌──────────┐
    │ CUSTOMER │
    └────┬─────┘
         │ Browse & Add to Cart
         ▼
    ┌──────────┐
    │   CART   │
    └────┬─────┘
         │ Checkout
         ▼
    ┌──────────┐       ┌─────────────┐
    │  ORDER   │──────▶│   PENDING   │
    │  CREATED │       └──────┬──────┘
    └──────────┘              │
                              ▼
                       ┌─────────────┐
                       │  CONFIRMED  │──▶ Email to Customer
                       └──────┬──────┘
                              │
                              ▼
                       ┌─────────────┐
                       │ PROCESSING  │──▶ Email to Customer
                       └──────┬──────┘
                              │
                              ▼
                       ┌─────────────┐
                       │   SHIPPED   │──▶ Email to Customer
                       └──────┬──────┘
                              │
                              ▼
                       ┌─────────────┐
                       │  DELIVERED  │──▶ Email to Customer
                       └─────────────┘   (FINAL STATE ✅)

    Alternative Path:
                       ┌─────────────┐
                       │  CANCELLED  │──▶ Stock Restored
                       └─────────────┘   (FINAL STATE ❌)

4️⃣  STOCK MANAGEMENT
    ┌──────────────┐
    │ Order Placed │
    └──────┬───────┘
           │
           ▼
    ┌──────────────┐
    │Stock Reduced │
    └──────────────┘

    ┌──────────────┐
    │Order Cancelled│
    └──────┬────────┘
           │
           ▼
    ┌──────────────┐
    │Stock Restored│
    └──────────────┘

5️⃣  ADMIN OPERATIONS
    ┌─────────┐
    │  ADMIN  │
    └────┬────┘
         │
         ├─▶ Manage Users
         │   ├─ Activate/Deactivate
         │   ├─ Verify Email
         │   └─ Delete User
         │
         ├─▶ Manage Medicines
         │   ├─ View All
         │   └─ Delete
         │
         ├─▶ Manage Orders
         │   ├─ View Details
         │   └─ Update Status
         │
         └─▶ View Reports
             ├─ User Analytics
             ├─ Medicine Stats
             └─ Order Reports
`}
              </pre>
            </div>
          </Card>
        </Col>
      </Row>
    </div>
  )

  const tabItems = [
    {
      key: 'overview',
      label: '📊 Overview',
      children: <OverviewTab />
    },
    {
      key: 'users',
      label: '👥 Users Report',
      children: <UsersTab />
    },
    {
      key: 'medicines',
      label: '💊 Medicines Report',
      children: <MedicinesTab />
    },
    {
      key: 'orders',
      label: '🛒 Orders Report',
      children: <OrdersTab />
    },
    {
      key: 'flowchart',
      label: '🔄 System Flowchart',
      children: <FlowchartTab />
    }
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
      <AdminLayout>
        <div style={{ 
          background: '#f5f5f5', 
          padding: '24px', 
          minHeight: 'calc(100vh - 64px)'
        }}>
          <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px' }}>
            <div>
              <AntTitle level={2} style={{ margin: 0, color: '#1a1a1a', fontWeight: 700 }}>
                📈 Reports & Analytics
              </AntTitle>
              <Text type="secondary" style={{ fontSize: '15px', marginTop: '8px', display: 'block' }}>
                Comprehensive system reports and analytics dashboard
              </Text>
            </div>
            <Button 
              type="primary" 
              icon={<DownloadOutlined />}
              size="large"
              style={{ borderRadius: '8px' }}
            >
              Export Reports
            </Button>
          </div>

          <Card 
            style={{ 
              borderRadius: '16px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              border: 'none'
            }}
          >
            <Tabs
              activeKey={activeTab}
              onChange={setActiveTab}
              items={tabItems}
              size="large"
            />
          </Card>
        </div>
      </AdminLayout>
    </ConfigProvider>
  )
}

export default ReportsPage
