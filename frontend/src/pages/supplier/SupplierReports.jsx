import { useState, useEffect } from 'react'
import SupplierLayout from '../../components/layout/SupplierLayout'
import { Card, Typography, Space, Row, Col, Statistic, Table, Spin, Tag, Tabs } from 'antd'
import { 
  BarChartOutlined, 
  DollarOutlined, 
  ShoppingOutlined,
  MedicineBoxOutlined,
  RiseOutlined
} from '@ant-design/icons'
import { ConfigProvider } from 'antd'
import { Bar, Line, Pie } from 'react-chartjs-2'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
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
  ArcElement,
  ChartTitle,
  Tooltip,
  Legend
)

const { Title, Text } = Typography

const SupplierReports = () => {
  const [loading, setLoading] = useState(true)
  const [medicines, setMedicines] = useState([])
  const [orders, setOrders] = useState([])
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalOrders: 0,
    totalMedicines: 0,
    avgOrderValue: 0
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

      // Calculate stats
      const totalRevenue = ords
        .filter(o => o.status !== 'CANCELLED')
        .reduce((sum, order) => {
          const orderTotal = order.orderItems?.reduce((itemSum, item) => {
            const medicineIds = meds.map(m => m.id)
            if (medicineIds.includes(item.medicineId)) {
              return itemSum + (item.subtotal || 0)
            }
            return itemSum
          }, 0) || 0
          return sum + orderTotal
        }, 0)

      const relevantOrders = ords.filter(o => 
        o.orderItems?.some(item => meds.map(m => m.id).includes(item.medicineId))
      )

      setStats({
        totalRevenue,
        totalOrders: relevantOrders.length,
        totalMedicines: meds.length,
        avgOrderValue: relevantOrders.length > 0 ? totalRevenue / relevantOrders.length : 0
      })
    } catch (error) {
      console.error('Failed to fetch data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Top selling medicines
  const topMedicines = medicines
    .map(med => {
      const sales = orders
        .filter(o => o.status !== 'CANCELLED')
        .reduce((count, order) => {
          const itemCount = order.orderItems?.filter(item => item.medicineId === med.id)
            .reduce((sum, item) => sum + (item.quantity || 0), 0) || 0
          return count + itemCount
        }, 0)
      
      const revenue = orders
        .filter(o => o.status !== 'CANCELLED')
        .reduce((total, order) => {
          const itemTotal = order.orderItems?.filter(item => item.medicineId === med.id)
            .reduce((sum, item) => sum + (item.subtotal || 0), 0) || 0
          return total + itemTotal
        }, 0)
      
      return { ...med, sales, revenue }
    })
    .sort((a, b) => b.sales - a.sales)
    .slice(0, 5)

  // Medicine status chart
  const medicineStatusData = {
    labels: ['Available', 'Low Stock', 'Out of Stock'],
    datasets: [{
      label: 'Medicines by Status',
      data: [
        medicines.filter(m => m.status === 'AVAILABLE').length,
        medicines.filter(m => m.status === 'LOW_STOCK').length,
        medicines.filter(m => m.status === 'OUT_OF_STOCK').length
      ],
      backgroundColor: [
        'rgba(75, 192, 192, 0.6)',
        'rgba(255, 206, 86, 0.6)',
        'rgba(255, 99, 132, 0.6)'
      ]
    }]
  }

  // Orders over time (last 6 months) - only count orders containing supplier's medicines
  const monthlyOrders = {}
  for (let i = 5; i >= 0; i--) {
    const month = dayjs().subtract(i, 'month').format('MMM YYYY')
    monthlyOrders[month] = 0
  }
  
  const medicineIds = medicines.map(m => m.id)
  orders
    .filter(order => order.orderItems?.some(item => medicineIds.includes(item.medicineId)))
    .forEach(order => {
      const month = dayjs(order.createdAt).format('MMM YYYY')
      if (monthlyOrders.hasOwnProperty(month)) {
        monthlyOrders[month]++
      }
    })

  const ordersOverTimeData = {
    labels: Object.keys(monthlyOrders),
    datasets: [{
      label: 'Orders',
      data: Object.values(monthlyOrders),
      borderColor: 'rgb(99, 102, 241)',
      backgroundColor: 'rgba(99, 102, 241, 0.1)',
      tension: 0.4
    }]
  }

  const topMedicinesColumns = [
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
      dataIndex: 'sales',
      key: 'sales',
      render: (sales) => <Tag color="blue">{sales} units</Tag>
    },
    {
      title: 'Stock',
      dataIndex: 'currentStock',
      key: 'currentStock',
      render: (stock, record) => (
        <Tag color={record.status === 'AVAILABLE' ? 'green' : record.status === 'LOW_STOCK' ? 'orange' : 'red'}>
          {stock}
        </Tag>
      )
    },
    {
      title: 'Revenue',
      dataIndex: 'revenue',
      key: 'revenue',
      render: (revenue) => (
        <Text strong style={{ color: '#52c41a' }}>
          Rs. {(revenue || 0).toFixed(2)}
        </Text>
      )
    }
  ]

  if (loading) {
    return (
      <SupplierLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Spin size="large" tip="Loading reports..." />
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
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '32px',
            borderRadius: '12px',
            marginBottom: '24px',
            color: '#fff'
          }}>
            <Space align="center">
              <BarChartOutlined style={{ fontSize: 40 }} />
              <div>
                <Title level={2} style={{ color: '#fff', margin: 0 }}>
                  Reports & Analytics
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>
                  Track your business performance and sales insights
                </Text>
              </div>
            </Space>
          </div>

          {/* Stats */}
          <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', border: 'none' }}>
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.9)' }}>Total Revenue</span>}
                  value={stats.totalRevenue}
                  prefix="Rs. "
                  precision={2}
                  valueStyle={{ color: '#fff', fontWeight: 700 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)', border: 'none' }}>
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.9)' }}>Total Orders</span>}
                  value={stats.totalOrders}
                  prefix={<ShoppingOutlined />}
                  valueStyle={{ color: '#fff', fontWeight: 700 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #faad14 0%, #ffc53d 100%)', border: 'none' }}>
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.9)' }}>Total Medicines</span>}
                  value={stats.totalMedicines}
                  prefix={<MedicineBoxOutlined />}
                  valueStyle={{ color: '#fff', fontWeight: 700 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card style={{ borderRadius: '12px', background: 'linear-gradient(135deg, #1890ff 0%, #40a9ff 100%)', border: 'none' }}>
                <Statistic
                  title={<span style={{ color: 'rgba(255,255,255,0.9)' }}>Avg Order Value</span>}
                  value={stats.avgOrderValue}
                  prefix="Rs. "
                  precision={2}
                  valueStyle={{ color: '#fff', fontWeight: 700 }}
                />
              </Card>
            </Col>
          </Row>

          {/* Charts Row */}
          <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
            <Col xs={24} lg={16}>
              <Card 
                title="Orders Over Time (Last 6 Months)" 
                style={{ borderRadius: '12px', height: '400px' }}
              >
                <Line data={ordersOverTimeData} options={{ responsive: true, maintainAspectRatio: false }} />
              </Card>
            </Col>
            <Col xs={24} lg={8}>
              <Card 
                title="Medicine Status Distribution" 
                style={{ borderRadius: '12px', height: '400px' }}
              >
                <Pie data={medicineStatusData} options={{ responsive: true, maintainAspectRatio: false }} />
              </Card>
            </Col>
          </Row>

          {/* Top Medicines */}
          <Card 
            title={<span style={{ fontSize: '18px', fontWeight: 600 }}>🏆 Top 5 Best Selling Medicines</span>}
            style={{ borderRadius: '12px' }}
          >
            <Table
              columns={topMedicinesColumns}
              dataSource={topMedicines}
              rowKey="id"
              pagination={false}
              locale={{ emptyText: 'No sales data available yet' }}
            />
          </Card>
        </div>
      </SupplierLayout>
    </ConfigProvider>
  )
}

export default SupplierReports
