import { useState, useEffect } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import axios from 'axios'
import toast from 'react-hot-toast'
import { useAuth } from '../../contexts/AuthContext'
import { Card, Row, Col, Form, Input, Radio, Button, Space, Typography, Spin } from 'antd'
import { ArrowLeftOutlined } from '@ant-design/icons'
import { ConfigProvider } from 'antd'

const { Title, Text } = Typography

const CheckoutPage = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [cartSummary, setCartSummary] = useState({ totalAmount: 0, subtotal: 0, deliveryCharge: 0 })
  const [paymentMethod, setPaymentMethod] = useState('esewa')
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    fetchCartSummary()
    
    if (user) {
      form.setFieldsValue({
        fullName: user.fullName || '',
        address: user.address || '',
        phoneNumber: user.phoneNumber || ''
      })
    }
  }, [user, form])

  const fetchCartSummary = async (address = null) => {
    try {
      const url = address ? `/api/cart/summary?address=${encodeURIComponent(address)}` : '/api/cart/summary'
      const response = await axios.get(url)
      const data = response.data
      setCartSummary(data)
      
      if (!data.totalAmount || data.totalAmount === 0) {
        toast.error('Your cart is empty')
        navigate('/user/cart')
      }
    } catch (error) {
      console.error('Error fetching cart summary:', error)
      toast.error('Failed to load cart')
      navigate('/user/cart')
    }
  }

  const handleAddressChange = (e) => {
    const address = e.target.value
    if (address && address.length > 3) {
      fetchCartSummary(address)
    }
  }

  const handleSubmit = async (values) => {
    if (cartSummary.totalAmount <= 0) {
      toast.error('Your cart is empty')
      navigate('/user/cart')
      return
    }

    setLoading(true)

    try {
      if (paymentMethod === 'esewa') {
        let orderId = null
        try {
          const orderResponse = await axios.post('/api/orders', {
            fullName: values.fullName.trim(),
            address: values.address.trim(),
            phoneNumber: values.phoneNumber.trim(),
            paymentMethod: 'esewa'
          })
          orderId = orderResponse.data.id
          console.log('Order created:', orderId)
        } catch (orderError) {
          console.error('Order creation error:', orderError)
          toast.error('Failed to create order. Please try again.')
          setLoading(false)
          return
        }

        try {
          const paymentResponse = await axios.post('/api/payment/esewa', {
            total_amount: cartSummary.totalAmount
          })

          const form = document.createElement('form')
          form.method = 'POST'
          form.action = paymentResponse.data.action
          form.id = 'esewa-payment-form'

          Object.keys(paymentResponse.data).forEach((key) => {
            if (key !== 'action') {
              const input = document.createElement('input')
              input.type = 'hidden'
              input.name = key
              input.value = paymentResponse.data[key]
              form.appendChild(input)
            }
          })

          if (orderId) {
            sessionStorage.setItem('pendingOrderId', orderId)
            sessionStorage.setItem('pendingTransactionUuid', paymentResponse.data.transaction_uuid)
          }

          document.body.appendChild(form)
          toast.loading('Redirecting to eSewa payment gateway...', { id: 'payment-redirect' })
          form.submit()
        } catch (paymentError) {
          console.error('Payment initiation error:', paymentError)
          toast.error('Failed to initiate payment. Please try again.')
          setLoading(false)
        }
      } else {
        const orderResponse = await axios.post('/api/orders', {
          fullName: values.fullName.trim(),
          address: values.address.trim(),
          phoneNumber: values.phoneNumber.trim(),
          paymentMethod: paymentMethod
        })

        window.dispatchEvent(new CustomEvent('cartChanged'))
        toast.success('Order placed successfully!')
        navigate('/user/orders')
        setLoading(false)
      }
    } catch (error) {
      console.error('Checkout error:', error)
      const errorMessage = error.response?.data?.message || error.message || 'Failed to place order'
      toast.error(errorMessage)
      setLoading(false)
    }
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
          <Link to="/user/cart" style={{ marginBottom: 16, display: 'inline-block' }}>
            <Button 
              icon={<ArrowLeftOutlined />}
              style={{
                borderRadius: '8px',
                border: '2px solid #e8e8e8'
              }}
            >
              Back to Cart
            </Button>
          </Link>

          <Title level={2} style={{ marginBottom: 24, color: '#1a1a1a', fontWeight: 600 }}>Checkout</Title>

          <Form
            form={form}
            onFinish={handleSubmit}
            layout="vertical"
          >
            <Row gutter={[24, 24]}>
              <Col xs={24} lg={16}>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  <Card 
                    title={<span style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a' }}>Shipping Information</span>}
                    style={{
                      borderRadius: '16px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                      border: '1px solid #e8e8e8'
                    }}
                    bodyStyle={{ padding: '24px' }}
                  >
                    <Form.Item
                      name="fullName"
                      label={<span style={{ fontWeight: 500 }}>Full Name</span>}
                      rules={[{ required: true, message: 'Please enter your full name' }]}
                    >
                      <Input 
                        size="large"
                        style={{
                          borderRadius: '10px',
                          border: '2px solid #e8e8e8'
                        }}
                      />
                    </Form.Item>

                    <Form.Item
                      name="address"
                      label={<span style={{ fontWeight: 500 }}>Delivery Address</span>}
                      rules={[{ required: true, message: 'Please enter your address' }]}
                    >
                      <Input.TextArea 
                        size="large"
                        rows={2}
                        placeholder="Enter your full delivery address (city, area, street)"
                        onChange={handleAddressChange}
                        style={{
                          borderRadius: '10px',
                          border: '2px solid #e8e8e8'
                        }}
                      />
                    </Form.Item>
                    <Text type="secondary" style={{ fontSize: 12, marginTop: -16, display: 'block', marginBottom: 16 }}>
                      💡 Delivery charges: Kathmandu Valley (Rs. 100), Nearby cities (Rs. 200), Mid-range (Rs. 300), Far regions (Rs. 500)
                    </Text>

                    <Form.Item
                      name="phoneNumber"
                      label={<span style={{ fontWeight: 500 }}>Phone Number</span>}
                      rules={[{ required: true, message: 'Please enter your phone number' }]}
                    >
                      <Input 
                        size="large"
                        style={{
                          borderRadius: '10px',
                          border: '2px solid #e8e8e8'
                        }}
                      />
                    </Form.Item>
                  </Card>

                  <Card 
                    title={<span style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a' }}>Payment Method</span>}
                    style={{
                      borderRadius: '16px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                      border: '1px solid #e8e8e8'
                    }}
                    bodyStyle={{ padding: '24px' }}
                  >
                    <Form.Item name="paymentMethod" initialValue="esewa">
                      <Radio.Group value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                        <Space direction="vertical" style={{ width: '100%' }} size="middle">
                          <Radio value="esewa" style={{ padding: '12px', borderRadius: '8px', border: '2px solid #e8e8e8', width: '100%' }}>
                            <Space>
                              <div style={{ 
                                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                                color: '#fff', 
                                padding: '6px 16px', 
                                borderRadius: '8px', 
                                fontSize: 14, 
                                fontWeight: 'bold' 
                              }}>
                                eSewa
                              </div>
                              <Text style={{ fontSize: '15px' }}>Pay securely with eSewa</Text>
                            </Space>
                          </Radio>
                          <Radio value="cash" style={{ padding: '12px', borderRadius: '8px', border: '2px solid #e8e8e8', width: '100%' }}>
                            <Space>
                              <Text style={{ fontSize: '15px', fontWeight: 500 }}>Cash on Delivery</Text>
                              <Text type="secondary" style={{ fontSize: 13 }}>Pay when you receive</Text>
                            </Space>
                          </Radio>
                        </Space>
                      </Radio.Group>
                    </Form.Item>
                  </Card>
                </Space>
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
                      <Text type="secondary" style={{ fontSize: '14px' }}>Subtotal</Text>
                      <Text style={{ fontSize: '14px', fontWeight: 500 }}>Rs. {cartSummary.subtotal?.toFixed(2) || '0.00'}</Text>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: 12 }}>
                      <Text type="secondary" style={{ fontSize: '14px' }}>Delivery Charge</Text>
                      <Text style={{ fontSize: '14px', fontWeight: 500, color: '#f59e0b' }}>Rs. {cartSummary.deliveryCharge?.toFixed(2) || '100.00'}</Text>
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
                        Rs. {cartSummary.totalAmount?.toFixed(2) || '0.00'}
                      </Text>
                    </div>
                    <Form.Item style={{ marginBottom: 0, marginTop: 16 }}>
                      <Button
                        type="primary"
                        htmlType="submit"
                        block
                        size="large"
                        loading={loading}
                        disabled={cartSummary.totalAmount <= 0}
                        style={{
                          borderRadius: '10px',
                          height: '48px',
                          fontSize: '16px',
                          fontWeight: 500,
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
                        }}
                      >
                        {loading ? (
                          paymentMethod === 'esewa' ? 'Redirecting to eSewa...' : 'Processing...'
                        ) : (
                          paymentMethod === 'esewa' ? 'Pay with eSewa' : 'Place Order'
                        )}
                      </Button>
                    </Form.Item>
                    {paymentMethod === 'esewa' && (
                      <Text type="secondary" style={{ fontSize: 12, textAlign: 'center', display: 'block', marginTop: 8 }}>
                        You will be redirected to eSewa to complete your payment
                      </Text>
                    )}
                  </Space>
                </Card>
              </Col>
            </Row>
          </Form>
        </div>
      </AppLayout>
    </ConfigProvider>
  )
}

export default CheckoutPage
