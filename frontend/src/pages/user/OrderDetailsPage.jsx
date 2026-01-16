import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'
import toast from 'react-hot-toast'
import AppLayout from '../../components/layout/AppLayout'
import { Card, Space, Typography, Spin, Tag, Button, Divider, Avatar, Row, Col, Empty } from 'antd'
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  TruckOutlined,
  ShoppingOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  EnvironmentOutlined,
  UserOutlined,
  PhoneOutlined,
  FileTextOutlined
} from '@ant-design/icons'
import { ConfigProvider } from 'antd'

const { Title, Text } = Typography

const OrderDetailsPage = () => {
  const { id } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const [order, setOrder] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchOrderDetails()
  }, [id, user, navigate])

  const fetchOrderDetails = async () => {
    try {
      const response = await axios.get(`/api/orders/${id}`)
      setOrder(response.data)
    } catch (error) {
      console.error('Error fetching order details:', error)
      toast.error('Failed to load order details')
      navigate('/user/orders')
    } finally {
      setLoading(false)
    }
  }

  const getStatusTag = (status) => {
    const statusConfig = {
      CONFIRMED: { color: 'success', icon: <CheckCircleOutlined /> },
      DELIVERED: { color: 'success', icon: <CheckCircleOutlined /> },
      PENDING: { color: 'warning', icon: <ClockCircleOutlined /> },
      CANCELLED: { color: 'error', icon: <CloseCircleOutlined /> },
      SHIPPED: { color: 'processing', icon: <TruckOutlined /> },
      PROCESSING: { color: 'processing', icon: <TruckOutlined /> },
    }
    const config = statusConfig[status] || { color: 'default', icon: <ClockCircleOutlined /> }
    return (
      <Tag 
        color={config.color} 
        icon={config.icon}
        style={{ 
          fontSize: '12px',
          padding: '2px 8px',
          borderRadius: '4px',
          fontWeight: 500,
          border: 'none'
        }}
      >
        {status}
      </Tag>
    )
  }

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
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

  if (!order) {
    return (
      <AppLayout>
        <Card>
          <Empty
            description={
              <div>
                <Text type="secondary">Order not found</Text>
                <br />
                <Link to="/user/orders">
                  <Button type="link">Back to Orders</Button>
                </Link>
              </div>
            }
          />
        </Card>
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
        <div style={{ 
          padding: '24px', 
          background: '#f5f5f5', 
          minHeight: '100vh',
          maxWidth: '1200px',
          margin: '0 auto',
          width: '100%'
        }}>
          <Link to="/user/orders" style={{ marginBottom: '20px', display: 'inline-block' }}>
            <Button 
              icon={<ArrowLeftOutlined />} 
              style={{ 
                borderRadius: '8px',
                height: '36px',
                fontWeight: 500
              }}
            >
              Back to Orders
            </Button>
          </Link>

          <div style={{ marginBottom: '24px' }}>
            <Title level={2} style={{ margin: 0, fontSize: '24px', fontWeight: 600 }}>
              Order Details
            </Title>
          </div>

          <Row gutter={[16, 16]}>
            {/* Left Column - Order Info & Items */}
            <Col xs={24} lg={16}>
              <Space direction="vertical" style={{ width: '100%' }} size={16}>
                {/* Order Header Card */}
                <Card
                  style={{ 
                    borderRadius: '12px', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: '1px solid #e8e8e8'
                  }}
                >
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px',
                    marginBottom: '16px',
                    paddingBottom: '16px',
                    borderBottom: '1px solid #f0f0f0'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '3px',
                        height: '24px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '2px'
                      }} />
                      <Title level={4} style={{ margin: 0, fontSize: '18px', fontWeight: 600 }}>
                        Order #{order.id}
                      </Title>
                    </div>
                    {getStatusTag(order.status)}
                  </div>

                  <Row gutter={[16, 12]}>
                    <Col xs={24} sm={12}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CalendarOutlined style={{ color: '#8c8c8c', fontSize: '16px' }} />
                        <div>
                          <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Order Date</Text>
                          <Text style={{ fontSize: '14px', fontWeight: 500 }}>{formatDate(order.createdAt)}</Text>
                        </div>
                      </div>
                    </Col>
                    <Col xs={24} sm={12}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <CreditCardOutlined style={{ color: '#8c8c8c', fontSize: '16px' }} />
                        <div>
                          <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Payment Method</Text>
                          <Text style={{ fontSize: '14px', fontWeight: 500 }}>{order.paymentMethod?.toUpperCase() || 'N/A'}</Text>
                        </div>
                      </div>
                    </Col>
                    {order.transactionId && (
                      <Col xs={24}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FileTextOutlined style={{ color: '#8c8c8c', fontSize: '16px' }} />
                          <div>
                            <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Transaction ID</Text>
                            <Text style={{ fontSize: '14px', fontWeight: 500, fontFamily: 'monospace' }}>{order.transactionId}</Text>
                          </div>
                        </div>
                      </Col>
                    )}
                  </Row>
                </Card>

                {/* Order Items Card */}
                <Card 
                  title={
                    <span style={{ fontSize: '16px', fontWeight: 600 }}>
                      Order Items ({order.orderItems?.length || 0})
                    </span>
                  }
                  style={{ 
                    borderRadius: '12px', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: '1px solid #e8e8e8'
                  }}
                >
                  {order.orderItems && order.orderItems.length > 0 ? (
                    <div>
                      {order.orderItems.map((item, index) => (
                        <div
                          key={index}
                          style={{
                            display: 'flex',
                            gap: '16px',
                            padding: '16px',
                            marginBottom: index < order.orderItems.length - 1 ? '12px' : 0,
                            background: '#fafafa',
                            borderRadius: '8px',
                            border: '1px solid #f0f0f0',
                            transition: 'all 0.2s ease'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#ffffff'
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#fafafa'
                            e.currentTarget.style.boxShadow = 'none'
                          }}
                        >
                          <Avatar
                            shape="square"
                            size={64}
                            src={item.medicineImage || item.medicine?.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop'}
                            style={{ borderRadius: '8px', border: '2px solid #ffffff', flexShrink: 0 }}
                            icon={<ShoppingOutlined />}
                          />
                          <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
                            <div style={{ flex: 1, minWidth: '200px' }}>
                              <Text strong style={{ fontSize: '15px', display: 'block', marginBottom: '4px' }}>
                                {item.medicineName || item.medicine?.name || 'Medicine'}
                              </Text>
                              <Space size="small" split={<Divider type="vertical" style={{ margin: 0 }} />}>
                                <Text type="secondary" style={{ fontSize: '13px' }}>
                                  Qty: {item.quantity}
                                </Text>
                                <Text type="secondary" style={{ fontSize: '13px' }}>
                                  Rs. {item.unitPrice?.toFixed(2) || '0.00'} each
                                </Text>
                              </Space>
                            </div>
                            <div style={{ textAlign: 'right' }}>
                              <Text strong style={{ fontSize: '16px', color: '#1890ff' }}>
                                Rs. {item.subtotal?.toFixed(2) || '0.00'}
                              </Text>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <Empty description="No items found" />
                  )}
                </Card>
              </Space>
            </Col>

            {/* Right Column - Shipping & Summary */}
            <Col xs={24} lg={8}>
              <Space direction="vertical" style={{ width: '100%' }} size={16}>
                {/* Shipping Information */}
                <Card 
                  title={
                    <span style={{ fontSize: '16px', fontWeight: 600 }}>
                      Shipping Information
                    </span>
                  }
                  style={{ 
                    borderRadius: '12px', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: '1px solid #e8e8e8'
                  }}
                >
                  <Space direction="vertical" size={12} style={{ width: '100%' }}>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <UserOutlined style={{ color: '#8c8c8c', fontSize: '16px', marginTop: '2px' }} />
                      <div>
                        <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Name</Text>
                        <Text style={{ fontSize: '14px', fontWeight: 500 }}>{order.fullName || 'N/A'}</Text>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <PhoneOutlined style={{ color: '#8c8c8c', fontSize: '16px' }} />
                      <div>
                        <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Phone</Text>
                        <Text style={{ fontSize: '14px', fontWeight: 500 }}>{order.phoneNumber || 'N/A'}</Text>
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
                      <EnvironmentOutlined style={{ color: '#8c8c8c', fontSize: '16px', marginTop: '2px' }} />
                      <div>
                        <Text type="secondary" style={{ fontSize: '12px', display: 'block' }}>Address</Text>
                        <Text style={{ fontSize: '14px', fontWeight: 500 }}>{order.address || 'N/A'}</Text>
                      </div>
                    </div>
                  </Space>
                </Card>

                {/* Order Summary */}
                <Card 
                  style={{ 
                    borderRadius: '12px', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    border: '1px solid #e8e8e8',
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    color: '#ffffff'
                  }}
                >
                  <Title level={5} style={{ color: '#ffffff', marginBottom: '16px', fontSize: '16px', fontWeight: 600 }}>
                    Order Summary
                  </Title>
                  <Space direction="vertical" style={{ width: '100%' }} size={12}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px' }}>Subtotal</Text>
                      <Text style={{ color: '#ffffff', fontSize: '14px', fontWeight: 500 }}>
                        Rs. {order.totalAmount?.toFixed(2) || '0.00'}
                      </Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '14px' }}>Shipping</Text>
                      <Text style={{ color: '#ffffff', fontSize: '14px', fontWeight: 500 }}>Free</Text>
                    </div>
                    <Divider style={{ borderColor: 'rgba(255, 255, 255, 0.2)', margin: '12px 0' }} />
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <Text strong style={{ color: '#ffffff', fontSize: '18px', fontWeight: 700 }}>Total</Text>
                      <Text strong style={{ color: '#ffffff', fontSize: '20px', fontWeight: 700 }}>
                        Rs. {order.totalAmount?.toFixed(2) || '0.00'}
                      </Text>
                    </div>
                  </Space>
                </Card>
              </Space>
            </Col>
          </Row>
        </div>
      </AppLayout>
    </ConfigProvider>
  )
}

export default OrderDetailsPage
