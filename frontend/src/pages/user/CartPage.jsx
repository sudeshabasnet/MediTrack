import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Card, Row, Col, Button, Space, Typography, Spin, InputNumber, Empty, Avatar } from 'antd'
import { showDeleteConfirm, showConfirmModal } from '../../utils/modalConfig.jsx'
import { DeleteOutlined, ShoppingCartOutlined, PlusOutlined, MinusOutlined } from '@ant-design/icons'
import { ConfigProvider } from 'antd'

const { Title, Text } = Typography

const CartPage = () => {
  const [cartItems, setCartItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [summary, setSummary] = useState({ itemCount: 0, totalAmount: 0 })
  const navigate = useNavigate()

  useEffect(() => {
    fetchCart()
  }, [])

  const fetchCart = async () => {
    try {
      const [itemsResponse, summaryResponse] = await Promise.all([
        axios.get('/api/cart'),
        axios.get('/api/cart/summary')
      ])
      setCartItems(itemsResponse.data)
      setSummary(summaryResponse.data)
      window.dispatchEvent(new CustomEvent('cartUpdated', { detail: summaryResponse.data }))
    } catch (error) {
      toast.error('Failed to load cart')
    } finally {
      setLoading(false)
    }
  }

  const updateQuantity = async (id, newQuantity) => {
    if (newQuantity <= 0) {
      removeItem(id)
      return
    }

    try {
      await axios.put(`/api/cart/${id}`, { quantity: newQuantity })
      fetchCart()
      toast.success('Cart updated')
      window.dispatchEvent(new CustomEvent('cartChanged'))
    } catch (error) {
      toast.error('Failed to update cart')
    }
  }

  const removeItem = async (id) => {
    try {
      await axios.delete(`/api/cart/${id}`)
      fetchCart()
      toast.success('Item removed from cart')
      window.dispatchEvent(new CustomEvent('cartChanged'))
    } catch (error) {
      toast.error('Failed to remove item')
    }
  }

  const clearCart = async () => {
    try {
      await axios.delete('/api/cart')
      fetchCart()
      toast.success('Cart cleared')
      window.dispatchEvent(new CustomEvent('cartChanged'))
    } catch (error) {
      toast.error('Failed to clear cart')
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
        <div style={{ padding: '32px 24px', background: '#f5f5f5', minHeight: '100vh' }}>
          <Title level={2} style={{ marginBottom: 32, color: '#1a1a1a', fontWeight: 600 }}>Shopping Cart</Title>

          {cartItems.length === 0 ? (
            <Card 
              style={{ 
                borderRadius: '16px', 
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                border: '1px solid #e8e8e8'
              }}
              bodyStyle={{ padding: '60px 24px' }}
            >
              <Empty
                image={<ShoppingCartOutlined style={{ fontSize: 80, color: '#d9d9d9' }} />}
                description={
                  <div>
                    <Text type="secondary" style={{ fontSize: 18, fontWeight: 500 }}>Your cart is empty</Text>
                    <Text type="secondary" style={{ fontSize: 14, display: 'block', marginTop: 8 }}>
                      Start adding medicines to your cart
                    </Text>
                  </div>
                }
              >
                <Link to="/pharmacy/medicines">
                  <Button 
                    type="primary" 
                    size="large"
                    style={{
                      borderRadius: '10px',
                      height: '48px',
                      fontSize: '16px',
                      fontWeight: 500,
                      boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                    }}
                  >
                    Browse Medicines
                  </Button>
                </Link>
              </Empty>
            </Card>
          ) : (
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={16}>
                <Card 
                  style={{ 
                    borderRadius: '16px', 
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    border: '1px solid #e8e8e8'
                  }}
                  bodyStyle={{ padding: '24px' }}
                >
                  <Space direction="vertical" style={{ width: '100%' }} size="large">
                    {cartItems.map((item) => (
                      <Card 
                        key={item.id} 
                        style={{ 
                          marginBottom: 16, 
                          borderRadius: '12px', 
                          transition: 'all 0.3s ease',
                          border: '1px solid #f0f0f0',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                        }}
                        bodyStyle={{ padding: '20px' }}
                        hoverable
                      >
                        <Row gutter={[16, 16]} align="middle">
                          <Col>
                            <Avatar
                              shape="square"
                              size={100}
                              src={item.medicineImage || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=200&h=200&fit=crop'}
                              style={{ borderRadius: '12px', border: '2px solid #f0f0f0' }}
                              icon={<ShoppingCartOutlined />}
                            />
                          </Col>
                          <Col flex="auto">
                            <Title level={5} style={{ margin: 0, color: '#1a1a1a', fontWeight: 600 }}>
                              {item.medicineName}
                            </Title>
                            <Text type="secondary" style={{ fontSize: '14px', display: 'block', marginTop: 4 }}>
                              {item.medicineCategory}
                            </Text>
                            <div style={{ marginTop: 12 }}>
                              <Text strong style={{ color: '#667eea', fontSize: '16px' }}>
                                Rs. {item.unitPrice?.toFixed(2) || '0.00'} each
                              </Text>
                            </div>
                          </Col>
                          <Col>
                            <Space size="middle">
                              <InputNumber
                                min={1}
                                value={item.quantity}
                                onChange={(value) => updateQuantity(item.id, value)}
                                addonBefore={<Button icon={<MinusOutlined />} onClick={() => updateQuantity(item.id, item.quantity - 1)} />}
                                addonAfter={<Button icon={<PlusOutlined />} onClick={() => updateQuantity(item.id, item.quantity + 1)} />}
                                style={{ borderRadius: '8px' }}
                              />
                              <Text strong style={{ minWidth: 100, textAlign: 'right', fontSize: '16px', color: '#1a1a1a' }}>
                                Rs. {item.subtotal?.toFixed(2) || '0.00'}
                              </Text>
                              <Button 
                                danger 
                                icon={<DeleteOutlined />}
                                style={{ borderRadius: '8px' }}
                                onClick={() => {
                                  showConfirmModal({
                                    title: 'Remove Item from Cart?',
                                    content: `Are you sure you want to remove "${item.medicineName}" from your cart?`,
                                    okText: 'Yes, Remove',
                                    cancelText: 'No, Keep It',
                                    type: 'warning',
                                    onOk: () => removeItem(item.id)
                                  })
                                }}
                              />
                            </Space>
                          </Col>
                        </Row>
                      </Card>
                    ))}
                    <Button 
                      danger
                      style={{
                        borderRadius: '10px',
                        height: '40px',
                        fontSize: '14px'
                      }}
                      onClick={() => {
                        showDeleteConfirm({
                          title: 'Clear Cart?',
                          itemName: 'all items from your cart',
                          onConfirm: clearCart
                        })
                      }}
                    >
                      Clear Cart
                    </Button>
                  </Space>
                </Card>
              </Col>

              <Col xs={24} lg={8}>
                <Card 
                  title={<span style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a' }}>Order Summary</span>}
                  style={{ 
                    position: 'sticky', 
                    top: 24, 
                    borderRadius: '16px', 
                    boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                    border: '1px solid #e8e8e8'
                  }}
                  bodyStyle={{ padding: '24px' }}
                >
                  <Space direction="vertical" style={{ width: '100%' }} size="middle">
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12 }}>
                      <Text type="secondary" style={{ fontSize: '14px' }}>Items ({summary.itemCount})</Text>
                      <Text style={{ fontSize: '14px', fontWeight: 500 }}>Rs. {summary.totalAmount?.toFixed(2) || '0.00'}</Text>
                    </div>
                    <div style={{ 
                      borderTop: '2px solid #f0f0f0', 
                      paddingTop: 16, 
                      display: 'flex', 
                      justifyContent: 'space-between',
                      marginTop: 8
                    }}>
                      <Text strong style={{ fontSize: 18, color: '#1a1a1a' }}>Total</Text>
                      <Text strong style={{ fontSize: 20, color: '#667eea', fontWeight: 700 }}>
                        Rs. {summary.totalAmount?.toFixed(2) || '0.00'}
                      </Text>
                    </div>
                    <Link to="/user/checkout">
                      <Button 
                        type="primary" 
                        block 
                        size="large"
                        style={{
                          borderRadius: '10px',
                          height: '48px',
                          fontSize: '16px',
                          fontWeight: 500,
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                          marginTop: 8
                        }}
                      >
                        Proceed to Checkout
                      </Button>
                    </Link>
                    <Link to="/pharmacy/medicines">
                      <Button 
                        block
                        style={{
                          borderRadius: '10px',
                          height: '40px',
                          fontSize: '14px',
                          border: '2px solid #e8e8e8'
                        }}
                      >
                        Continue Shopping
                      </Button>
                    </Link>
                  </Space>
                </Card>
              </Col>
            </Row>
          )}
        </div>
      </AppLayout>
    </ConfigProvider>
  )
}

export default CartPage
