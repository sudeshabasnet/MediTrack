import { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Layout, Form, Input, Button, Card, Typography, Space, Result, Row, Col } from 'antd'
import { MailOutlined, CheckCircleOutlined, LoginOutlined, HomeOutlined } from '@ant-design/icons'
import { ConfigProvider } from 'antd'

const { Header, Content, Footer } = Layout
const { Title, Paragraph, Text } = Typography

const ForgotPasswordPage = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [email, setEmail] = useState('')

  const handleSubmit = async (values) => {
    setLoading(true)
    setEmail(values.email)

    try {
      await axios.post('/api/auth/forgot-password', { email: values.email })
      setSuccess(true)
      toast.success('Password reset link sent to your email!')
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send reset link')
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
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            padding: '0 50px',
            height: '80px',
            lineHeight: '80px'
          }}
        >
          <Row justify="space-between" align="middle" style={{ maxWidth: 1400, margin: '0 auto' }}>
            <Col>
              <Link to="/">
                <Space style={{ cursor: 'pointer' }}>
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
            </Col>
            <Col flex="auto" style={{ display: 'flex', justifyContent: 'center' }}>
              <Space size="large">
                <Link to="/">
                  <Button 
                    type="text" 
                    icon={<HomeOutlined />}
                    style={{ fontWeight: 500 }}
                  >
                    Home
                  </Button>
                </Link>
                <Button 
                  type="text"
                  onClick={() => {
                    window.location.href = '/#features'
                  }}
                  style={{ fontWeight: 500 }}
                >
                  Features
                </Button>
                <Button 
                  type="text"
                  onClick={() => {
                    window.location.href = '/#how-it-works'
                  }}
                  style={{ fontWeight: 500 }}
                >
                  How It Works
                </Button>
                <Button 
                  type="text"
                  onClick={() => {
                    window.location.href = '/#about'
                  }}
                  style={{ fontWeight: 500 }}
                >
                  About Us
                </Button>
                <Button 
                  type="text"
                  onClick={() => {
                    window.location.href = '/#contact'
                  }}
                  style={{ fontWeight: 500 }}
                >
                  Contact
                </Button>
              </Space>
            </Col>
            <Col>
              <Space size="middle">
                <Link to="/login">
                  <Button type="primary" icon={<LoginOutlined />} style={{ fontWeight: 500 }}>
                    Login
                  </Button>
                </Link>
              </Space>
            </Col>
          </Row>
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
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <Title level={2} style={{ marginBottom: 8, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Forgot Password
              </Title>
              <Paragraph style={{ color: '#666', fontSize: 16 }}>
                Enter your email address and we'll send you a link to reset your password
              </Paragraph>
            </div>

            {success ? (
              <Result
                status="success"
                icon={<CheckCircleOutlined style={{ fontSize: 72, color: '#52c41a' }} />}
                title="Check your email"
                subTitle={`We've sent a password reset link to ${email}`}
                extra={[
                  <Link key="login" to="/login">
                    <Button type="primary" icon={<LoginOutlined />}>
                      Back to Login
                    </Button>
                  </Link>
                ]}
              />
            ) : (
              <Form
                form={form}
                name="forgotPassword"
                onFinish={handleSubmit}
                layout="vertical"
                size="large"
              >
                <Form.Item
                  name="email"
                  label="Email Address"
                  rules={[
                    { required: true, message: 'Please enter your email' },
                    { type: 'email', message: 'Please enter a valid email address' }
                  ]}
                >
                  <Input 
                    prefix={<MailOutlined />}
                    placeholder="Enter your email"
                  />
                </Form.Item>

                <Form.Item>
                  <Button
                    type="primary"
                    htmlType="submit"
                    loading={loading}
                    block
                    icon={<MailOutlined />}
                    style={{ height: 45 }}
                  >
                    Send Reset Link
                  </Button>
                </Form.Item>
              </Form>
            )}

            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Link to="/login">
                <Text type="secondary">
                  ← Back to Login
                </Text>
              </Link>
            </div>
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

export default ForgotPasswordPage
