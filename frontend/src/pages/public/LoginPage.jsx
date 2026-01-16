import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import { Layout, Form, Input, Button, Checkbox, Card, Typography, Space, Row, Col } from 'antd'
import { LoginOutlined, LockOutlined, MailOutlined, HomeOutlined, UserAddOutlined } from '@ant-design/icons'
import { ConfigProvider } from 'antd'

const { Header, Content, Footer } = Layout
const { Title, Text, Paragraph } = Typography

const LoginPage = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (values) => {
    const { email, password } = values
    
    setLoading(true)

    try {
      const result = await login(email.trim(), password.trim())
      setLoading(false)

      if (result.success) {
        toast.success('Login successful!')
        const userRole = result.user?.role
        if (userRole === 'ADMIN') {
          navigate('/admin/dashboard')
        } else if (userRole === 'SUPPLIER') {
          navigate('/supplier/dashboard')
        } else if (userRole === 'PHARMACY') {
          navigate('/pharmacy/dashboard')
        } else if (userRole === 'USER') {
          navigate('/pharmacy/medicines')
        } else {
          navigate('/')
        }
      } else {
        const errorMessage = result.error || 'Login failed. Please check your credentials.'
        toast.error(errorMessage)
      }
    } catch (error) {
      setLoading(false)
      const errorMessage = error.response?.data?.message || 'An unexpected error occurred. Please try again.'
      toast.error(errorMessage)
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
                <Link to="/register">
                  <Button icon={<UserAddOutlined />} style={{ fontWeight: 500 }}>
                    Register
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
              maxWidth: 450,
              borderRadius: 16,
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <Title level={2} style={{ marginBottom: 8, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Welcome Back
              </Title>
              <Paragraph style={{ color: '#666', fontSize: 16 }}>
                Login to your MediTrack account
              </Paragraph>
            </div>

            <Form
              form={form}
              name="login"
              onFinish={handleSubmit}
              layout="vertical"
              size="large"
            >
              <Form.Item
                name="email"
                label="Email / Username"
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

              <Form.Item
                name="password"
                label="Password"
                rules={[{ required: true, message: 'Please enter your password' }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Enter your password"
                />
              </Form.Item>

              <Form.Item>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox>Remember Me</Checkbox>
                  </Form.Item>
                  <Link to="/forgot-password">
                    <Text type="secondary">Forgot Password?</Text>
                  </Link>
                </div>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  loading={loading}
                  block
                  icon={<LoginOutlined />}
                  style={{ height: 45 }}
                >
                  Login
                </Button>
              </Form.Item>
            </Form>

            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Text type="secondary">
                Don't have an account?{' '}
                <Link to="/register">
                  <Text strong style={{ color: '#4F46E5' }}>Register Now</Text>
                </Link>
              </Text>
            </div>

            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Link to="/">
                <Text type="secondary">
                  ← Back to Home
                </Text>
              </Link>
            </div>
          </Card>
        </Content>

        <Footer style={{ textAlign: 'center', background: '#001529', color: '#fff', padding: '40px 50px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Row gutter={[48, 24]} justify="center">
              <Col xs={24} sm={8}>
                <Title level={5} style={{ color: '#fff', marginBottom: 12 }}>MediTrack</Title>
                <Paragraph style={{ color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                  Empowering healthcare with smart medicine management
                </Paragraph>
              </Col>
              <Col xs={24} sm={8}>
                <Title level={5} style={{ color: '#fff', marginBottom: 12 }}>Contact</Title>
                <Paragraph style={{ color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                  Email: info@meditrack.com
                  <br />
                  Phone: +977-1-1234567
                </Paragraph>
              </Col>
              <Col xs={24} sm={8}>
                <Title level={5} style={{ color: '#fff', marginBottom: 12 }}>Location</Title>
                <Paragraph style={{ color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                  Kathmandu, Nepal
                </Paragraph>
              </Col>
            </Row>
            <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              <Text style={{ color: 'rgba(255,255,255,0.65)' }}>
                &copy; 2024 MediTrack. All rights reserved.
              </Text>
            </div>
          </div>
        </Footer>
      </Layout>
    </ConfigProvider>
  )
}

export default LoginPage
