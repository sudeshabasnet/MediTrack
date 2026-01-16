import { useState, useEffect } from 'react'
import SupplierLayout from '../../components/layout/SupplierLayout'
import { Card, Typography, Space, Row, Col, Statistic, Table, Spin, Tag, Select, DatePicker } from 'antd'
import { 
  DollarOutlined, 
  RiseOutlined,
  FallOutlined,
  WalletOutlined,
  LineChartOutlined
} from '@ant-design/icons'
import { ConfigProvider } from 'antd'
import { Line, Bar } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title as ChartTitle,
  Tooltip,
  Legend
} from 'chart.js'
import axios from 'axios'
import dayjs from 'dayjs'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ChartTitle,
  Tooltip,
  Legend
)

const { Title, Text } = Typography
const { RangePicker } = DatePicker

const SupplierRevenue = () => {
  const [loading, setLoading] = useState(true)
  const [medicines, setMedicines] = useState([])
  const [orders, setOrders] = useState([])
  const [period, setPeriod] = useState('all') // all, month, week
  const [revenueStats, setRevenueStats] = useState({
    totalRevenue: 0,
    thisMonthRevenue: 0,
    lastMonthRevenue: 0,
    growthRate: 0,
    pendingRevenue: 0
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [medicinesRes, ordersRes] = await Promise.all([
        axios.get('/api/supplier/medicines'),
        axios.get('/api/supplier/orders')
      ])

      const meds = medicinesRes.data || []
      const ords = ordersRes.data || []

      setMedicines(meds)
      setOrders(ords)

      calculateRevenue(meds, ords)
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateRevenue = (meds, ords) => {
    const medicineIds = meds.map(m => m.id)

    // Total revenue (delivered orders only)
    const totalRevenue = ords
      .filter(o => o.status === 'DELIVERED')
      .reduce((sum, order) => {
        const orderRevenue = order.items?.reduce((itemSum, item) => {
          if (medicineIds.includes(item.medicine?.id)) {
            return itemSum + (item.subtotal || 0)
          }
          return itemSum
        }, 0) || 0
        return sum + orderRevenue
      }, 0)

    // This month revenue
    const thisMonthStart = dayjs().startOf('month')
    const thisMonthRevenue = ords
      .filter(o => o.status === 'DELIVERED' && dayjs(o.updatedAt).isAfter(thisMonthStart))
      .reduce((sum, order) => {
        const orderRevenue = order.items?.reduce((itemSum, item) => {
          if (medicineIds.includes(item.medicine?.id)) {
            return itemSum + (item.subtotal || 0)
          }
          return itemSum
        }, 0) || 0
        return sum + orderRevenue
      }, 0)

    // Last month revenue
    const lastMonthStart = dayjs().subtract(1, 'month').startOf('month')
    const lastMonthEnd = dayjs().subtract(1, 'month').endOf('month')
    const lastMonthRevenue = ords
      .filter(o => 
        o.status === 'DELIVERED' && 
        dayjs(o.updatedAt).isAfter(lastMonthStart) &&
        dayjs(o.updatedAt).isBefore(lastMonthEnd)
      )
      .reduce((sum, order) => {
        const orderRevenue = order.items?.reduce((itemSum, item) => {
          if (medicineIds.includes(item.medicine?.id)) {
            return itemSum + (item.subtotal || 0)
          }
          return itemSum
        }, 0) || 0
        return sum + orderRevenue
      }, 0)

    // Pending revenue (orders not delivered yet)
    const pendingRevenue = ords
      .filter(o => ['PENDING', 'CONFIRMED', 'PROCESSING', 'SHIPPED'].includes(o.status))
      .reduce((sum, order) => {
        const orderRevenue = order.items?.reduce((itemSum, item) => {
          if (medicineIds.includes(item.medicine?.id)) {
            return itemSum + (item.subtotal || 0)
          }
          return itemSum
        }, 0) || 0
        return sum + orderRevenue
      }, 0)

    const growthRate = lastMonthRevenue > 0 
      ? ((thisMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100 
      : 0

    setRevenueStats({
      totalRevenue,
      thisMonthRevenue,
      lastMonthRevenue,
      growthRate,
      pendingRevenue
    })
  }

  // Monthly revenue chart (last 6 months)
  const monthlyRevenue = {}
  for (let i = 5; i >= 0; i--) {
    const month = dayjs().subtract(i, 'month').format('MMM YYYY')
    monthlyRevenue[month] = 0
  }

  const medicineIds = medicines.map(m => m.id)
  orders.filter(o => o.status === 'DELIVERED').forEach(order => {
    const month = dayjs(order.updatedAt).format('MMM YYYY')
    if (monthlyRevenue.hasOwnProperty(month)) {
      const orderRevenue = order.items?.reduce((sum, item) => {
        if (medicineIds.includes(item.medicine?.id)) {
          return sum + (item.subtotal || 0)
        }
        return sum
      }, 0) || 0
      monthlyRevenue[month] += orderRevenue
    }
  })

  const revenueChartData = {
    labels: Object.keys(monthlyRevenue),
    datasets: [{
      label: 'Revenue (Rs)',
      data: Object.values(monthlyRevenue),
      borderColor: 'rgb(52, 211, 153)',
      backgroundColor: 'rgba(52, 211, 153, 0.1)',
      fill: true,
      tension: 0.4
    }]
  }

  // Top revenue medicines
  const medicineRevenue = medicines.map(med => {
    const revenue = orders
      .filter(o => o.status === 'DELIVERED')
      .reduce((sum, order) => {
        const itemRevenue = order.items
          ?.filter(item => item.medicine?.id === med.id)
          .reduce((itemSum, item) => itemSum + (item.subtotal || 0), 0) || 0
        return sum + itemRevenue
      }, 0)
    
    const unitsSold = orders
      .filter(o => o.status === 'DELIVERED')
      .reduce((count, order) => {
        const itemCount = order.items
          ?.filter(item => item.medicine?.id === med.id)
          .reduce((sum, item) => sum + (item.quantity || 0), 0) || 0
        return count + itemCount
      }, 0)

    return { ...med, revenue, unitsSold }
  }).sort((a, b) => b.revenue - a.revenue).slice(0, 10)

  const revenueColumns = [
    {
      title: 'Rank',
      key: 'rank',
      render: (_, __, index) => (
        <Text strong style={{ 
          color: index === 0 ? '#faad14' : index === 1 ? '#bfbfbf' : index === 2 ? '#d4773a' : '#8c8c8c'
        }}>
          #{index + 1}
        </Text>
      ),
      width: 70
    },
    {
      title: 'Medicine Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Units Sold',
      dataIndex: 'unitsSold',
      key: 'unitsSold',
      render: (units) => <Tag color="blue">{units}</Tag>
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (price) => `Rs. ${price.toFixed(2)}`
    },
    {
      title: 'Total Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue) => (
        <Text strong style={{ color: '#52c41a', fontSize: '15px' }}>
          Rs. {revenue.toFixed(2)}
        </Text>
      )
    }
  ]

  if (loading) {
    return (
      <SupplierLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Spin size="large" tip="Loading revenue data..." />
        </div>
      </SupplierLayout>
    )
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#6366f1',
          borderRadius: 8,
        },
      }}
    >
      <SupplierLayout>
        <div style={{ padding: '24px', background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            padding: '32px',
            borderRadius: '12px',
            marginBottom: '24px',
            color: '#fff'
          }}>
            <Space align="center">
              <DollarOutlined style={{ fontSize: 40 }} />
              <div>
                <Title level={2} style={{ color: '#fff', margin: 0 }}>
                  Revenue Analytics
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>
                  Track your earnings and financial performance
                </Text>
              </div>
            </Space>
          </div>

          {/* Revenue Stats */}
          <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card style={{ borderRadius: '12px' }}>
                <Statistic
                  title="Total Revenue (All Time)"
                  value={revenueStats.totalRevenue}
                  prefix="Rs. "
                  precision={2}
                  valueStyle={{ color: '#52c41a', fontWeight: 700 }}
                  suffix={<WalletOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card style={{ borderRadius: '12px' }}>
                <Statistic
                  title="This Month"
                  value={revenueStats.thisMonthRevenue}
                  prefix="Rs. "
                  precision={2}
                  valueStyle={{ color: '#1890ff', fontWeight: 700 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card style={{ borderRadius: '12px' }}>
                <Statistic
                  title="Last Month"
                  value={revenueStats.lastMonthRevenue}
                  prefix="Rs. "
                  precision={2}
                  valueStyle={{ color: '#8c8c8c', fontWeight: 700 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card style={{ borderRadius: '12px' }}>
                <Statistic
                  title="Growth Rate"
                  value={Math.abs(revenueStats.growthRate)}
                  precision={1}
                  suffix="%"
                  valueStyle={{ 
                    color: revenueStats.growthRate >= 0 ? '#52c41a' : '#ff4d4f',
                    fontWeight: 700 
                  }}
                  prefix={revenueStats.growthRate >= 0 ? <RiseOutlined /> : <FallOutlined />}
                />
              </Card>
            </Col>
          </Row>

          {/* Pending Revenue Alert */}
          {revenueStats.pendingRevenue > 0 && (
            <Card 
              style={{ 
                marginBottom: 24,
                borderRadius: '12px',
                background: '#fff7e6',
                border: '1px solid #ffd591'
              }}
            >
              <Space>
                <LineChartOutlined style={{ fontSize: 24, color: '#faad14' }} />
                <div>
                  <Text strong style={{ fontSize: 16 }}>Pending Revenue</Text>
                  <br />
                  <Text type="secondary">
                    You have <Text strong style={{ color: '#faad14' }}>Rs. {revenueStats.pendingRevenue.toFixed(2)}</Text> in pending orders (not yet delivered)
                  </Text>
                </div>
              </Space>
            </Card>
          )}

          {/* Revenue Chart */}
          <Card 
            title="Monthly Revenue Trend (Last 6 Months)" 
            style={{ borderRadius: '12px', marginBottom: 24 }}
          >
            <Line 
              data={revenueChartData} 
              options={{ 
                responsive: true, 
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    ticks: {
                      callback: (value) => `Rs. ${value}`
                    }
                  }
                }
              }} 
              height={80}
            />
          </Card>

          {/* Top Revenue Medicines */}
          <Card 
            title={<span style={{ fontSize: '18px', fontWeight: 600 }}>💰 Top 10 Revenue Generating Medicines</span>}
            style={{ borderRadius: '12px' }}
          >
            <Table
              columns={revenueColumns}
              dataSource={medicineRevenue}
              rowKey="id"
              pagination={false}
              locale={{ emptyText: 'No revenue data available yet' }}
              scroll={{ x: true }}
            />
          </Card>
        </div>
      </SupplierLayout>
    </ConfigProvider>
  )
}

export default SupplierRevenue
