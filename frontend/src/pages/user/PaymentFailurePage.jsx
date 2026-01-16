import { useEffect } from 'react'
import { useNavigate, useSearchParams, Link } from 'react-router-dom'
import { CloseCircleOutlined } from '@ant-design/icons'
import AppLayout from '../../components/layout/AppLayout'
import toast from 'react-hot-toast'
import { Card, Result, Button, Space, Typography, List } from 'antd'
import { ConfigProvider } from 'antd'

const { Text } = Typography

const PaymentFailurePage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()

  useEffect(() => {
    const status = searchParams.get('status')
    
    if (status === 'failure' || status === 'FAILED') {
      toast.error('Payment failed. Please try again.')
    } else {
      toast.error('Payment was not completed. Please try again.')
    }
  }, [searchParams])

  const failureReasons = [
    'Insufficient balance in your eSewa account',
    'Network connectivity issues',
    'Payment gateway timeout',
    'Invalid payment credentials'
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
      <AppLayout>
        <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card style={{ maxWidth: 600, width: '100%' }}>
            <Result
              status="error"
              icon={<CloseCircleOutlined style={{ color: '#ff4d4f' }} />}
              title="Payment Failed"
              subTitle="We're sorry, but your payment could not be processed. Please check your payment details and try again."
              extra={[
                <Space key="content" direction="vertical" style={{ width: '100%' }} size="large">
                  <Card size="small" style={{ background: '#fafafa' }}>
                    <Text type="secondary" style={{ fontSize: 12 }}>Transaction ID</Text>
                    <div style={{ fontSize: 14, fontFamily: 'monospace', marginTop: 4 }}>
                      {searchParams.get('transaction_uuid') || 'N/A'}
                    </div>
                  </Card>
                  
                  <div>
                    <Text strong style={{ fontSize: 14, marginBottom: 8, display: 'block' }}>
                      Possible reasons for payment failure:
                    </Text>
                    <List
                      size="small"
                      dataSource={failureReasons}
                      renderItem={(item) => (
                        <List.Item style={{ padding: '4px 0' }}>
                          <Text type="secondary" style={{ fontSize: 13 }}>• {item}</Text>
                        </List.Item>
                      )}
                    />
                  </div>

                  <Space>
                    <Link to="/user/checkout">
                      <Button type="primary" size="large">
                        Try Again
                      </Button>
                    </Link>
                    <Link to="/user/cart">
                      <Button size="large">
                        Back to Cart
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

export default PaymentFailurePage
