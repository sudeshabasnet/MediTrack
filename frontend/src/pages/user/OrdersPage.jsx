import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AppLayout from '../../components/layout/AppLayout'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Card, Space, Typography, Spin, Tag, Empty, Button, Avatar, Row, Col, Divider, Modal, Input, Tabs, Badge, Pagination } from 'antd'
import {
  CheckCircleOutlined,
  ClockCircleOutlined,
  CloseCircleOutlined,
  TruckOutlined,
  ShoppingOutlined,
  CalendarOutlined,
  CreditCardOutlined,
  EnvironmentOutlined,
  RightOutlined,
  FileTextOutlined,
  StopOutlined,
  AppstoreOutlined,
  SyncOutlined,
  CarOutlined
} from '@ant-design/icons'
import { ConfigProvider } from 'antd'

const { Title, Text } = Typography

const OrdersPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [cancelModalVisible, setCancelModalVisible] = useState(false)
  const [selectedOrderId, setSelectedOrderId] = useState(null)
  const [cancellationReason, setCancellationReason] = useState('')
  const [cancelling, setCancelling] = useState(false)
  const [activeTab, setActiveTab] = useState('ALL')
  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 3

  useEffect(() => {
    if (!user) {
      navigate('/login')
      return
    }
    fetchOrders()
  }, [user, navigate])

  const fetchOrders = async () => {
    try {
      const response = await axios.get('/api/orders')
      setOrders(response.data)
    } catch (error) {
      console.error('Error fetching orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const canCancelOrder = (order) => {
    if (order.status === 'CANCELLED' || order.status === 'DELIVERED') {
      return false
    }
    
    const orderTime = new Date(order.createdAt)
    const now = new Date()
    const minutesSinceOrder = (now - orderTime) / (1000 * 60)
    
    return minutesSinceOrder <= 5
  }

  const getTimeRemaining = (order) => {
    const orderTime = new Date(order.createdAt)
    const now = new Date()
    const minutesSinceOrder = (now - orderTime) / (1000 * 60)
    const minutesRemaining = Math.max(0, 5 - minutesSinceOrder)
    
    return minutesRemaining.toFixed(1)
  }

  const handleCancelClick = (orderId) => {
    setSelectedOrderId(orderId)
    setCancellationReason('')
    setCancelModalVisible(true)
  }

  const handleCancelOrder = async () => {
    if (!cancellationReason.trim()) {
      toast.error('Please provide a cancellation reason')
      return
    }

    setCancelling(true)
    try {
      const response = await axios.post(`/api/orders/${selectedOrderId}/cancel`, {
        reason: cancellationReason
      })
      
      toast.success('Order cancelled successfully')
      setCancelModalVisible(false)
      setCancellationReason('')
      setSelectedOrderId(null)
      fetchOrders() // Refresh orders list
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Failed to cancel order'
      toast.error(errorMessage)
    } finally {
      setCancelling(false)
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
          border: 'none',
          margin: 0
        }}
      >
        {status}
      </Tag>
    )
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

  const getFilteredOrders = () => {
    if (activeTab === 'ALL') {
      return orders
    }
    return orders.filter(order => order.status === activeTab)
  }

  const getOrderCountByStatus = (status) => {
    if (status === 'ALL') {
      return orders.length
    }
    return orders.filter(order => order.status === status).length
  }

  const handleTabChange = (key) => {
    setActiveTab(key)
    setCurrentPage(1) // Reset to first page when switching tabs
  }

  const handlePageChange = (page) => {
    setCurrentPage(page)
    // Scroll to top when page changes
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const allFilteredOrders = getFilteredOrders()
  const totalOrders = allFilteredOrders.length
  const startIndex = (currentPage - 1) * pageSize
  const endIndex = startIndex + pageSize
  const paginatedOrders = allFilteredOrders.slice(startIndex, endIndex)

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
          <div style={{ 
            marginBottom: '24px'
          }}>
            <Title level={2} style={{ 
              margin: 0, 
              fontSize: '24px', 
              fontWeight: 600
            }}>
              My Orders
            </Title>
            <Text type="secondary" style={{ fontSize: '14px', marginTop: '4px', display: 'block' }}>
              Track and manage all your orders
            </Text>
          </div>

          {orders.length > 0 && (
            <Tabs
              activeKey={activeTab}
              onChange={handleTabChange}
              type="card"
              size="large"
              style={{ marginBottom: '24px' }}
              items={[
                {
                  key: 'ALL',
                  label: (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px' }}>
                      <AppstoreOutlined />
                      All Orders
                      <Badge count={getOrderCountByStatus('ALL')} showZero style={{ backgroundColor: '#6366f1' }} />
                    </span>
                  ),
                },
                {
                  key: 'PENDING',
                  label: (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px' }}>
                      <ClockCircleOutlined />
                      Pending
                      <Badge count={getOrderCountByStatus('PENDING')} showZero style={{ backgroundColor: '#faad14' }} />
                    </span>
                  ),
                },
                {
                  key: 'CONFIRMED',
                  label: (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px' }}>
                      <CheckCircleOutlined />
                      Confirmed
                      <Badge count={getOrderCountByStatus('CONFIRMED')} showZero style={{ backgroundColor: '#52c41a' }} />
                    </span>
                  ),
                },
                {
                  key: 'PROCESSING',
                  label: (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px' }}>
                      <SyncOutlined spin />
                      Processing
                      <Badge count={getOrderCountByStatus('PROCESSING')} showZero style={{ backgroundColor: '#1890ff' }} />
                    </span>
                  ),
                },
                {
                  key: 'SHIPPED',
                  label: (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px' }}>
                      <CarOutlined />
                      Shipped
                      <Badge count={getOrderCountByStatus('SHIPPED')} showZero style={{ backgroundColor: '#1890ff' }} />
                    </span>
                  ),
                },
                {
                  key: 'DELIVERED',
                  label: (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px' }}>
                      <CheckCircleOutlined />
                      Delivered
                      <Badge count={getOrderCountByStatus('DELIVERED')} showZero style={{ backgroundColor: '#52c41a' }} />
                    </span>
                  ),
                },
                {
                  key: 'CANCELLED',
                  label: (
                    <span style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '4px 8px' }}>
                      <CloseCircleOutlined />
                      Cancelled
                      <Badge count={getOrderCountByStatus('CANCELLED')} showZero style={{ backgroundColor: '#ff4d4f' }} />
                    </span>
                  ),
                },
              ]}
            />
          )}

          {allFilteredOrders.length === 0 && orders.length === 0 ? (
            <Card 
              style={{ 
                borderRadius: '20px', 
                boxShadow: '0 8px 24px rgba(0,0,0,0.1)',
                textAlign: 'center',
                padding: '64px 32px',
                background: 'linear-gradient(135deg, #ffffff 0%, #f8f9fa 100%)',
                border: 'none'
              }}
            >
              <Empty
                image={<ShoppingOutlined style={{ fontSize: 96, color: '#d9d9d9', opacity: 0.6 }} />}
                description={
                  <div>
                    <Title level={4} style={{ marginTop: '24px', marginBottom: '12px', fontSize: '22px', fontWeight: 600 }}>
                      No Orders Yet
                    </Title>
                    <Text type="secondary" style={{ fontSize: '16px', lineHeight: '24px' }}>
                      You haven't placed any orders yet.<br />
                      Start shopping to see your orders here.
                    </Text>
                  </div>
                }
              >
                <Link to="/pharmacy/medicines">
                  <Button 
                    type="primary" 
                    size="large" 
                    style={{ 
                      marginTop: '32px', 
                      height: '48px', 
                      padding: '0 40px',
                      fontSize: '16px',
                      fontWeight: 500,
                      borderRadius: '12px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.4)'
                    }}
                  >
                    Browse Medicines
                  </Button>
                </Link>
              </Empty>
            </Card>
          ) : allFilteredOrders.length === 0 ? (
            <Card 
              style={{ 
                borderRadius: '16px', 
                boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                textAlign: 'center',
                padding: '48px 32px',
                background: '#ffffff',
                border: '1px solid #e8e8e8'
              }}
            >
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description={
                  <div>
                    <Title level={4} style={{ marginTop: '16px', marginBottom: '8px', fontSize: '18px', fontWeight: 600 }}>
                      No {activeTab.toLowerCase()} orders found
                    </Title>
                    <Text type="secondary" style={{ fontSize: '14px' }}>
                      You don't have any orders with status: {activeTab}
                    </Text>
                  </div>
                }
              />
            </Card>
          ) : (
            <>
              <Space direction="vertical" style={{ width: '100%' }} size={16}>
                {paginatedOrders.map((order, index) => (
                <Card 
                  key={order.id} 
                  style={{ 
                    borderRadius: '12px', 
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                    transition: 'all 0.3s ease',
                    border: '1px solid #e8e8e8',
                    overflow: 'hidden',
                    background: '#ffffff'
                  }}
                  hoverable
                  onMouseEnter={(e) => {
                    e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.15)'
                    e.currentTarget.style.transform = 'translateY(-2px)'
                    e.currentTarget.style.borderColor = '#667eea'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.borderColor = '#e8e8e8'
                  }}
                >
                  {/* Order Header - Full Width */}
                  <div style={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    gap: '12px', 
                    flexWrap: 'wrap',
                    paddingBottom: '12px',
                    borderBottom: '1px solid #f0f0f0',
                    width: '100%',
                    marginBottom: '12px'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <div style={{
                        width: '3px',
                        height: '24px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '2px'
                      }} />
                      <Title level={4} style={{ margin: 0, fontSize: '18px', fontWeight: 600, color: '#1a1a1a' }}>
                        Order #{order.id}
                      </Title>
                    </div>
                    {getStatusTag(order.status)}
                  </div>

                  <Row gutter={[16, 12]} align="middle" style={{ width: '100%' }}>
                    {/* Left Section - Medicine Images */}
                    <Col xs={24} sm={8} md={6}>
                      {order.orderItems && order.orderItems.length > 0 && (
                        <div style={{ 
                          padding: '8px',
                          background: '#fafafa',
                          borderRadius: '8px',
                          border: '1px solid #f0f0f0',
                          display: 'flex',
                          justifyContent: 'center'
                        }}>
                          <Space size="small" wrap style={{ justifyContent: 'center' }}>
                            {order.orderItems.slice(0, 4).map((item, index) => (
                              <Avatar
                                key={index}
                                shape="square"
                                size={48}
                                src={item.medicineImage || item.medicine?.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=100&h=100&fit=crop'}
                                style={{ 
                                  borderRadius: '6px',
                                  border: '2px solid #ffffff',
                                  cursor: 'pointer',
                                  boxShadow: '0 1px 4px rgba(0,0,0,0.1)'
                                }}
                                icon={<ShoppingOutlined />}
                              />
                            ))}
                            {order.orderItems.length > 4 && (
                              <Avatar
                                shape="square"
                                size={48}
                                style={{ 
                                  borderRadius: '6px', 
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  color: '#fff',
                                  border: '2px solid #ffffff',
                                  fontWeight: 600,
                                  fontSize: '14px',
                                  boxShadow: '0 1px 4px rgba(102, 126, 234, 0.3)'
                                }}
                              >
                                +{order.orderItems.length - 4}
                              </Avatar>
                            )}
                          </Space>
                        </div>
                      )}
                    </Col>

                    {/* Middle Section - Order Details */}
                    <Col xs={24} sm={16} md={10}>
                      <Space direction="vertical" size={6} style={{ width: '100%' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CalendarOutlined style={{ color: '#8c8c8c', fontSize: '14px' }} />
                          <Text type="secondary" style={{ fontSize: '13px' }}>
                            <strong style={{ color: '#595959', marginRight: '4px' }}>Date:</strong>
                            {formatDate(order.createdAt)}
                          </Text>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <CreditCardOutlined style={{ color: '#8c8c8c', fontSize: '14px' }} />
                          <Text type="secondary" style={{ fontSize: '13px' }}>
                            <strong style={{ color: '#595959', marginRight: '4px' }}>Payment:</strong>
                            {order.paymentMethod?.toUpperCase() || 'N/A'}
                          </Text>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '8px' }}>
                          <EnvironmentOutlined style={{ color: '#8c8c8c', fontSize: '14px', marginTop: '2px' }} />
                          <Text type="secondary" style={{ fontSize: '13px' }}>
                            <strong style={{ color: '#595959', marginRight: '4px' }}>Address:</strong>
                            {order.address || 'N/A'}
                          </Text>
                        </div>
                        {order.transactionId && (
                          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            <FileTextOutlined style={{ color: '#8c8c8c', fontSize: '14px' }} />
                            <Text type="secondary" style={{ fontSize: '13px', fontFamily: 'monospace' }}>
                              <strong style={{ color: '#595959', marginRight: '4px' }}>Transaction ID:</strong>
                              {order.transactionId}
                            </Text>
                          </div>
                        )}
                      </Space>
                    </Col>

                    {/* Right Section - Price & Action */}
                    <Col xs={24} sm={24} md={8}>
                      <div style={{ 
                        display: 'flex', 
                        flexDirection: 'column', 
                        alignItems: 'stretch',
                        gap: '12px',
                        padding: '16px',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                        borderRadius: '12px',
                        border: 'none',
                        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                      }}>
                        <div>
                          <Text style={{ 
                            fontSize: '11px', 
                            display: 'block', 
                            marginBottom: '4px',
                            color: 'rgba(255, 255, 255, 0.9)',
                            fontWeight: 500,
                            textTransform: 'uppercase',
                            letterSpacing: '0.5px'
                          }}>
                            Total Amount
                          </Text>
                          <Title level={3} style={{ 
                            margin: 0, 
                            color: '#ffffff', 
                            fontSize: '24px', 
                            fontWeight: 700
                          }}>
                            Rs. {order.totalAmount?.toFixed(2) || '0.00'}
                          </Title>
                        </div>
                        <Link to={`/user/orders/${order.id}`}>
                          <Button 
                            type="primary" 
                            size="middle"
                            icon={<RightOutlined />}
                            style={{ 
                              width: '100%',
                              height: '36px',
                              borderRadius: '8px',
                              fontWeight: 500,
                              fontSize: '14px',
                              background: '#ffffff',
                              color: '#667eea',
                              border: 'none',
                              boxShadow: '0 2px 6px rgba(0,0,0,0.15)'
                            }}
                          >
                            View Details
                          </Button>
                        </Link>
                        {canCancelOrder(order) && (
                          <>
                            <Button 
                              danger
                              size="middle"
                              icon={<StopOutlined />}
                              onClick={() => handleCancelClick(order.id)}
                              style={{ 
                                width: '100%',
                                height: '36px',
                                borderRadius: '8px',
                                fontWeight: 500,
                                fontSize: '14px'
                              }}
                            >
                              Cancel Order
                            </Button>
                            <Text style={{ 
                              fontSize: '11px',
                              color: 'rgba(255, 255, 255, 0.9)',
                              textAlign: 'center',
                              display: 'block'
                            }}>
                              ⏱️ {getTimeRemaining(order)} min left
                            </Text>
                          </>
                        )}
                      </div>
                    </Col>
                  </Row>
                </Card>
              ))}
            </Space>
            
            {/* Pagination */}
            {totalOrders > pageSize && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'center', 
                marginTop: '32px',
                padding: '24px',
                background: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <Pagination
                  current={currentPage}
                  pageSize={pageSize}
                  total={totalOrders}
                  onChange={handlePageChange}
                  showSizeChanger={false}
                  showTotal={(total, range) => (
                    <Text type="secondary" style={{ fontSize: '14px', marginRight: '16px' }}>
                      Showing {range[0]}-{range[1]} of {total} orders
                    </Text>
                  )}
                  itemRender={(page, type, originalElement) => {
                    if (type === 'prev') {
                      return <Button>Previous</Button>
                    }
                    if (type === 'next') {
                      return <Button>Next</Button>
                    }
                    return originalElement
                  }}
                  style={{ marginTop: '8px' }}
                />
              </div>
            )}
          </>
          )}

          {/* Cancellation Reason Modal */}
          <Modal
            title={
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <div style={{
                  width: '40px',
                  height: '40px',
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #ff4d4f 0%, #ff7875 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <StopOutlined style={{ color: '#fff', fontSize: '20px' }} />
                </div>
                <div>
                  <div style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a' }}>
                    Cancel Order
                  </div>
                  <div style={{ fontSize: '13px', fontWeight: 400, color: '#8c8c8c' }}>
                    Please provide a reason for cancellation
                  </div>
                </div>
              </div>
            }
            open={cancelModalVisible}
            onCancel={() => {
              setCancelModalVisible(false)
              setCancellationReason('')
              setSelectedOrderId(null)
            }}
            onOk={handleCancelOrder}
            okText="Cancel Order"
            cancelText="Go Back"
            okButtonProps={{ 
              danger: true,
              loading: cancelling,
              disabled: !cancellationReason.trim()
            }}
            width={500}
            centered
          >
            <div style={{ padding: '24px 0' }}>
              <Text strong style={{ display: 'block', marginBottom: '8px', fontSize: '14px' }}>
                Cancellation Reason <span style={{ color: '#ff4d4f' }}>*</span>
              </Text>
              <Input.TextArea
                rows={4}
                placeholder="Please tell us why you want to cancel this order (e.g., ordered by mistake, found better price, changed mind, etc.)"
                value={cancellationReason}
                onChange={(e) => setCancellationReason(e.target.value)}
                maxLength={500}
                showCount
                style={{
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <div style={{
                marginTop: '16px',
                padding: '12px',
                background: '#fff7e6',
                border: '1px solid #ffd591',
                borderRadius: '8px'
              }}>
                <Text type="warning" style={{ fontSize: '13px' }}>
                  <strong>⚠️ Important:</strong> Once cancelled, your order cannot be restored. 
                  Medicine stock will be restored automatically. If you paid online, refund will be processed within 5-7 business days.
                </Text>
              </div>
            </div>
          </Modal>
        </div>
      </AppLayout>
    </ConfigProvider>
  )
}

export default OrdersPage
