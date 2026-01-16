import { useEffect, useState, useCallback } from 'react'
import { useSearchParams, Link } from 'react-router-dom'
import { CheckCircleOutlined } from '@ant-design/icons'
import AppLayout from '../../components/layout/AppLayout'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Card, Result, Button, Space, Typography, Spin } from 'antd'
import { ConfigProvider } from 'antd'

const { Text } = Typography

const PaymentSuccessPage = () => {
  const [searchParams] = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [orderId, setOrderId] = useState(null)
  const [transactionId, setTransactionId] = useState(null)

  // Helper function to decode base64 data parameter
  const decodeDataParam = (dataParam) => {
    if (!dataParam) return null
    
    try {
      // Decode URI component and fix base64 padding
      const normalized = decodeURIComponent(dataParam).replace(/-/g, '+').replace(/_/g, '/')
      // Decode base64
      const decoded = atob(normalized)
      // Parse JSON
      return JSON.parse(decoded)
    } catch (error) {
      console.error('Error decoding data parameter:', error)
      return null
    }
  }

  useEffect(() => {
    // Check for data parameter (eSewa callback format)
    const dataParam = searchParams.get('data')
    let decodedData = null
    let txId = null
    
    if (dataParam) {
      decodedData = decodeDataParam(dataParam)
      if (decodedData) {
        // Extract transaction code from decoded data
        txId = decodedData.transaction_code || decodedData.transaction_uuid || decodedData.oid || decodedData.refId
        if (txId) {
          setTransactionId(txId)
        }
      }
    }

    // Check for direct query parameters
    const transactionUuid = searchParams.get('transaction_uuid') || searchParams.get('oid') || searchParams.get('refId')
    const status = searchParams.get('status') || (decodedData && decodedData.status)

    // Set transaction ID from direct params if not already set from data param
    if (!txId && transactionUuid) {
      setTransactionId(transactionUuid)
    }

    const pendingOrderId = sessionStorage.getItem('pendingOrderId')
    if (pendingOrderId) {
      setOrderId(pendingOrderId)
      sessionStorage.removeItem('pendingOrderId')
      sessionStorage.removeItem('pendingTransactionUuid')
    }

    if (status === 'COMPLETE' || status === 'success' || transactionUuid || decodedData) {
      setLoading(false)
      toast.success('Payment successful! Your order has been confirmed.')
      window.dispatchEvent(new CustomEvent('cartChanged'))
      
      if (!pendingOrderId) {
        fetchLatestOrder()
      }
    } else {
      setLoading(false)
    }
  }, [searchParams])

  const fetchLatestOrder = useCallback(async () => {
    try {
      const response = await axios.get('/api/orders')
      if (response.data && response.data.length > 0) {
        setOrderId(response.data[0].id)
      }
    } catch (error) {
      console.error('Error fetching order:', error)
    }
  }, [])

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
        <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card style={{ maxWidth: 600, width: '100%' }}>
            <Result
              status="success"
              icon={<CheckCircleOutlined style={{ color: '#52c41a' }} />}
              title="Payment Successful!"
              subTitle="Thank you for your purchase. Your order has been confirmed and will be processed shortly."
              extra={[
                <Space key="actions" direction="vertical" style={{ width: '100%' }} size="middle">
                  {orderId && (
                    <Card size="small" style={{ background: '#fafafa' }}>
                      <Text type="secondary" style={{ fontSize: 12 }}>Order ID</Text>
                      <div style={{ fontSize: 14, fontFamily: 'monospace', marginTop: 4 }}>
                        #{orderId}
                      </div>
                    </Card>
                  )}
                  <Card size="small" style={{ background: '#fafafa' }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>Transaction ID</Text>
                    <div style={{ fontSize: 14, fontFamily: 'monospace', marginTop: 4 }}>
                      {transactionId || searchParams.get('transaction_uuid') || searchParams.get('oid') || searchParams.get('refId') || 'N/A'}
                    </div>
                  </Card>
                  <Space>
                    <Link to="/user/orders">
                      <Button type="primary" size="large">
                        View My Orders
                      </Button>
                    </Link>
                    <Link to="/pharmacy/medicines">
                      <Button size="large">
                        Browse Medicines
                      </Button>
                    </Link>
                  </Space>
                </Space>
              ]}
            />
          </Card>
        </div>
      </AppLayout>
    </ConfigProvider>
  )
}

export default PaymentSuccessPage
