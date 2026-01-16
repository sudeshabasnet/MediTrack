import { useState, useEffect } from 'react'
import { Link, useNavigate, useSearchParams } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Layout, Form, Input, Button, Card, Typography, Space, Result, Spin } from 'antd'
import { LockOutlined, CheckCircleOutlined, LoginOutlined, HomeOutlined, CloseCircleOutlined } from '@ant-design/icons'
import { ConfigProvider } from 'antd'

const { Header, Content, Footer } = Layout
const { Title, Paragraph, Text } = Typography

const ResetPasswordPage = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [validatingToken, setValidatingToken] = useState(true)
  const [tokenValid, setTokenValid] = useState(false)
  const [success, setSuccess] = useState(false)
  const [searchParams] = useSearchParams()
  const [userEmail, setUserEmail] = useState('')
  const navigate = useNavigate()
  const token = searchParams.get('token')

  useEffect(() => {
    validateToken()
  }, [token])

  const validateToken = async () => {
    if (!token) {
      setValidatingToken(false)
      setTokenValid(false)
      return
    }

    try {
      const response = await axios.get('/api/auth/validate-reset-token', {
        params: { token }
      })
      if (response.data.valid) {
        setTokenValid(true)
        setUserEmail(response.data.email || '')
      } else {
        setTokenValid(false)
        toast.error(response.data.message || 'Invalid reset link')
      }
    } catch (error) {
      setTokenValid(false)
      toast.error('Invalid or expired reset link')
    } finally {
      setValidatingToken(false)
    }
  }

  const handleSubmit = async (values) => {
    if (values.password !== values.confirmPassword) {
      toast.error('Passwords do not match')
      return
    }

    setLoading(true)
    try {
      const response = await axios.post('/api/auth/reset-password', {
        token: token,
        password: values.password
      })
      toast.success(response.data.message || 'Password reset successfully!')
      setSuccess(true)
      setTimeout(() => {
        navigate('/login')
      }, 3000)
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to reset password')
    } finally {
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
      <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <Header 
          style={{ 
            background: '#fff', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            padding: '0 50px',
            height: '80px',
            lineHeight: '80px'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <Link to="/">
              <Space>
                <div style={{ 
                  width: 40, 
                  height: 40, 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Text strong style={{ color: '#fff', fontSize: 20 }}>M</Text>
                </div>
                <Title level={3} style={{ margin: 0, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                  MediTrack
                </Title>
              </Space>
            </Link>
            <Space>
              <Link to="/">
                <Button type="text" icon={<HomeOutlined />}>Home</Button>
              </Link>
              <Link to="/login">
                <Button type="primary" icon={<LoginOutlined />}>Login</Button>
              </Link>
            </Space>
          </div>
        </Header>

        <Content style={{ padding: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card
            style={{
              width: '100%',
              maxWidth: 500,
              borderRadius: 16,
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}
          >
            {validatingToken ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <Spin size="large" />
                <Paragraph style={{ marginTop: 16, color: '#666' }}>
                  Validating reset link...
                </Paragraph>
              </div>
            ) : !tokenValid ? (
              <Result
                status="error"
                icon={<CloseCircleOutlined style={{ fontSize: 72, color: '#ff4d4f' }} />}
                title="Invalid Reset Link"
                subTitle="This password reset link is invalid or has expired. Please request a new one."
                extra={[
                  <Link key="forgot" to="/forgot-password">
                    <Button type="primary">
                      Request New Link
                    </Button>
                  </Link>,
                  <Link key="login" to="/login">
                    <Button>Back to Login</Button>
                  </Link>
                ]}
              />
            ) : success ? (
              <Result
                status="success"
                icon={<CheckCircleOutlined style={{ fontSize: 72, color: '#52c41a' }} />}
                title="Password Reset Successful"
                subTitle="Your password has been changed successfully. You can now login with your new password."
                extra={[
                  <Link key="login" to="/login">
                    <Button type="primary" icon={<LoginOutlined />}>
                      Login Now
                    </Button>
                  </Link>
                ]}
              />
            ) : (
              <>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                  <Title level={2} style={{ marginBottom: 8, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Reset Password
                  </Title>
                  <Paragraph style={{ color: '#666', fontSize: 16 }}>
                    Enter your new password below
                  </Paragraph>
                  {userEmail && (
                    <Text type="secondary" style={{ fontSize: 14 }}>
                      Resetting password for: <Text strong>{userEmail}</Text>
                    </Text>
                  )}
                </div>

                <Form
                  form={form}
                  name="resetPassword"
                  onFinish={handleSubmit}
                  layout="vertical"
                  size="large"
                >
                  <Form.Item
                    name="password"
                    label="New Password"
                    rules={[
                      { required: true, message: 'Please enter your new password' },
                      { min: 6, message: 'Password must be at least 6 characters long' }
                    ]}
                    hasFeedback
                  >
                    <Input.Password 
                      prefix={<LockOutlined />}
                      placeholder="Enter new password"
                    />
                  </Form.Item>

                  <Form.Item
                    name="confirmPassword"
                    label="Confirm Password"
                    dependencies={['password']}
                    hasFeedback
                    rules={[
                      { required: true, message: 'Please confirm your password' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve()
                          }
                          return Promise.reject(new Error('Passwords do not match'))
                        },
                      }),
                    ]}
                  >
                    <Input.Password 
                      prefix={<LockOutlined />}
                      placeholder="Confirm new password"
                    />
                  </Form.Item>

                  <Form.Item>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading}
                      block
                      icon={<CheckCircleOutlined />}
                      style={{ height: 45 }}
                    >
                      Reset Password
                    </Button>
                  </Form.Item>
                </Form>

                <div style={{ textAlign: 'center', marginTop: 24 }}>
                  <Link to="/login">
                    <Text type="secondary">
                      ← Back to Login
                    </Text>
                  </Link>
                </div>
              </>
            )}
          </Card>
        </Content>

        <Footer style={{ textAlign: 'center', background: '#001529', color: '#fff', padding: '40px 50px' }}>
          <Text style={{ color: 'rgba(255,255,255,0.65)' }}>
            &copy; 2024 MediTrack. All rights reserved.
          </Text>
        </Footer>
      </Layout>
    </ConfigProvider>
  )
}

export default ResetPasswordPage






