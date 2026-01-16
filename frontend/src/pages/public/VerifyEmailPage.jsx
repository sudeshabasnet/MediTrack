import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Layout, Card, Typography, Button, Space, Spin, Result } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, MailOutlined, LoginOutlined } from '@ant-design/icons'
import { ConfigProvider } from 'antd'

const { Content } = Layout
const { Title, Paragraph } = Typography

const VerifyEmailPage = () => {
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const [status, setStatus] = useState('verifying') // 'verifying', 'success', 'error'
  const [message, setMessage] = useState('')
  const [resending, setResending] = useState(false)
  const token = searchParams.get('token')

  useEffect(() => {
    if (token) {
      verifyEmail(token)
    } else {
      setStatus('error')
      setMessage('No verification token provided')
    }
  }, [token])

  const verifyEmail = async (verificationToken) => {
    try {
      const response = await axios.get(`/api/auth/verify-email?token=${verificationToken}`)
      setStatus('success')
      setMessage(response.data.message || 'Email verified successfully!')
      toast.success('Email verified successfully!')
      
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (error) {
      setStatus('error')
      setMessage(error.response?.data?.message || 'Verification failed. The link may have expired.')
      toast.error(error.response?.data?.message || 'Verification failed')
    }
  }

  const handleResendVerification = async () => {
    const email = searchParams.get('email')
    if (!email) {
      toast.error('Email address is required to resend verification')
      return
    }

    setResending(true)
    try {
      await axios.post('/api/auth/resend-verification', { email })
      toast.success('Verification email sent! Please check your inbox.')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to resend verification email')
    } finally {
      setResending(false)
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
      <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <Content style={{ padding: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card
            style={{
              width: '100%',
              maxWidth: 500,
              borderRadius: 16,
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}
          >
            {status === 'verifying' && (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin size="large" style={{ marginBottom: 24 }} />
                <Title level={3}>Verifying Email</Title>
                <Paragraph type="secondary">
                  Please wait while we verify your email address...
                </Paragraph>
              </div>
            )}

            {status === 'success' && (
              <Result
                status="success"
                icon={<CheckCircleOutlined style={{ fontSize: 72, color: '#52c41a' }} />}
                title="Email Verified!"
                subTitle={message}
                extra={[
                  <Paragraph key="redirect" type="secondary" style={{ marginBottom: 16 }}>
                    Redirecting to login page in 3 seconds...
                  </Paragraph>,
                  <Button 
                    key="login" 
                    type="primary" 
                    icon={<LoginOutlined />}
                    onClick={() => navigate('/login')}
                  >
                    Go to Login
                  </Button>
                ]}
              />
            )}

            {status === 'error' && (
              <Result
                status="error"
                icon={<CloseCircleOutlined style={{ fontSize: 72, color: '#ff4d4f' }} />}
                title="Verification Failed"
                subTitle={message}
                extra={[
                  <Button
                    key="resend"
                    type="primary"
                    icon={<MailOutlined />}
                    loading={resending}
                    onClick={handleResendVerification}
                    style={{ marginBottom: 8 }}
                  >
                    Resend Verification Email
                  </Button>,
                  <Link key="login" to="/login">
                    <Button type="default">Back to Login</Button>
                  </Link>
                ]}
              />
            )}
          </Card>
        </Content>
      </Layout>
    </ConfigProvider>
  )
}

export default VerifyEmailPage
