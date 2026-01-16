import { Link } from 'react-router-dom'
import { Layout, Button, Row, Col, Card, Typography, Space, Tag, Statistic, Avatar, Divider } from 'antd'
import {
  HomeOutlined,
  LoginOutlined,
  UserAddOutlined,
  BarChartOutlined,
  BellOutlined,
  ThunderboltOutlined,
  SafetyOutlined,
  ClockCircleOutlined,
  TeamOutlined,
  CheckCircleOutlined,
  StarFilled,
  RightOutlined,
  ShoppingCartOutlined,
  InfoCircleOutlined
} from '@ant-design/icons'
import { ConfigProvider } from 'antd'

const { Header, Content, Footer } = Layout
const { Title, Paragraph, Text } = Typography

const LandingPage = () => {
  const scrollToSection = (id) => {
    const element = document.getElementById(id)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' })
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
      <Layout style={{ minHeight: '100vh', background: '#fff' }}>
        {/* Navigation Header */}
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
                <Button
                  type="text"
                  icon={<HomeOutlined />}
                  onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                  style={{ fontWeight: 500 }}
                >
                  Home
                </Button>
                <Button
                  type="text"
                  onClick={() => scrollToSection('features')}
                  style={{ fontWeight: 500 }}
                >
                  Features
                </Button>
                <Button
                  type="text"
                  onClick={() => scrollToSection('how-it-works')}
                  style={{ fontWeight: 500 }}
                >
                  How It Works
                </Button>
                <Button
                  type="text"
                  onClick={() => scrollToSection('about')}
                  style={{ fontWeight: 500 }}
                >
                  About Us
                </Button>
                <Button
                  type="text"
                  onClick={() => scrollToSection('contact')}
                  style={{ fontWeight: 500 }}
                >
                  Contact
                </Button>
              </Space>
            </Col>
            <Col>
              <Space size="middle">
                <Link to="/login">
                  <Button icon={<LoginOutlined />} style={{ fontWeight: 500 }}>
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button type="primary" icon={<UserAddOutlined />} style={{ fontWeight: 500 }}>
                    Register
                  </Button>
                </Link>
              </Space>
            </Col>
          </Row>
        </Header>

        <Content>
          {/* Hero Section */}
          <section style={{
            padding: '100px 50px',
            background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundImage: 'url(https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80)',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              opacity: 0.1,
              zIndex: 0
            }} />
            <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
              <Row gutter={[24, 24]} align="middle">
                <Col xs={24} lg={12}>
                  <Space orientation="vertical" size="large" style={{ width: '100%' }}>
                    <Tag color="blue" style={{ fontSize: 14, padding: '4px 16px' }}>
                      Trusted by 500+ Healthcare Facilities
                    </Tag>
                    <Title level={1} style={{ fontSize: '3.5rem', margin: 0, fontWeight: 800 }}>
                      Smart Medicine
                      <br />
                      <span style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Management System
                      </span>
                    </Title>
                    <Paragraph style={{ fontSize: 20, color: '#666' }}>
                      Streamline your healthcare supply chain with real-time tracking,
                      intelligent alerts, and AI-powered forecasting for optimal medicine management.
                    </Paragraph>
                    <Space size="middle">
                      <Link to="/register">
                        <Button
                          type="primary"
                          size="large"
                          icon={<UserAddOutlined />}
                          style={{ height: 50, fontSize: 16, paddingLeft: 30, paddingRight: 30 }}
                        >
                          Get Started Free
                        </Button>
                      </Link>
                      <Link to="/login">
                        <Button
                          size="large"
                          style={{ height: 50, fontSize: 16, paddingLeft: 30, paddingRight: 30 }}
                        >
                          Learn More
                        </Button>
                      </Link>
                    </Space>
                    <Space size="large">
                      <Space>
                        <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
                        <Text>No Credit Card</Text>
                      </Space>
                      <Space>
                        <CheckCircleOutlined style={{ color: '#52c41a', fontSize: 20 }} />
                        <Text>14-Day Free Trial</Text>
                      </Space>
                    </Space>
                  </Space>
                </Col>
                <Col xs={24} lg={12}>
                  <div style={{ borderRadius: 16, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.3)' }}>
                    <img
                      src="/assets/pharmacy_shelves.png"
                      alt="Modern pharmacy with medicine shelves"
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                    />
                  </div>
                </Col>
              </Row>
            </div>
          </section>

          {/* Features Section */}
          <section id="features" style={{ padding: '100px 50px', background: '#fff', scrollMarginTop: '80px' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 60 }}>
                <Tag color="blue" style={{ fontSize: 14, padding: '4px 16px', marginBottom: 20 }}>
                  Features
                </Tag>
                <Title level={2} style={{ fontSize: '2.5rem', marginBottom: 16 }}>
                  Powerful Features for
                  <br />
                  <span style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    Healthcare Management
                  </span>
                </Title>
                <Paragraph style={{ fontSize: 18, color: '#666' }}>
                  Everything you need to manage your medicine inventory efficiently
                </Paragraph>
              </div>
              <Row gutter={[24, 24]}>
                {[
                  { icon: <BarChartOutlined />, title: 'Real-time Tracking', desc: 'Monitor medicine stock levels in real-time across all locations with instant updates', color: '#667eea' },
                  { icon: <BellOutlined />, title: 'Expiry Alerts', desc: 'Get notified before medicines expire to reduce waste and ensure patient safety', color: '#f59e0b' },
                  { icon: <ThunderboltOutlined />, title: 'AI Forecasting', desc: 'Predict demand and optimize inventory with AI-powered analytics', color: '#8b5cf6' },
                  { icon: <SafetyOutlined />, title: 'Secure & Compliant', desc: 'Enterprise-grade security with compliance to healthcare regulations', color: '#10b981' },
                  { icon: <ClockCircleOutlined />, title: '24/7 Availability', desc: 'Access your inventory anytime, anywhere with cloud-based platform', color: '#3b82f6' },
                  { icon: <TeamOutlined />, title: 'Multi-User Support', desc: 'Role-based access for suppliers, pharmacies, and administrators', color: '#6366f1' },
                ].map((feature, index) => (
                  <Col xs={24} sm={12} lg={8} key={index}>
                    <Card
                      hoverable
                      style={{
                        height: '100%',
                        borderRadius: 16,
                        border: '2px solid #f0f0f0',
                        transition: 'all 0.3s'
                      }}
                      styles={{ body: { padding: 32 } }}
                    >
                      <div style={{
                        width: 64,
                        height: 64,
                        borderRadius: 16,
                        background: `linear-gradient(135deg, ${feature.color} 0%, ${feature.color}dd 100%)`,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginBottom: 24,
                        fontSize: 32,
                        color: '#fff'
                      }}>
                        {feature.icon}
                      </div>
                      <Title level={4} style={{ marginBottom: 12 }}>{feature.title}</Title>
                      <Paragraph style={{ color: '#666', margin: 0 }}>{feature.desc}</Paragraph>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </section>

          {/* How It Works Section */}
          <section id="how-it-works" style={{ padding: '100px 50px', background: '#f5f7fa', scrollMarginTop: '80px' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <div style={{ textAlign: 'center', marginBottom: 60 }}>
                <Tag color="blue" style={{ fontSize: 14, padding: '4px 16px', marginBottom: 20 }}>
                  Process
                </Tag>
                <Title level={2} style={{ fontSize: '2.5rem', marginBottom: 16 }}>
                  How It Works
                </Title>
                <Paragraph style={{ fontSize: 18, color: '#666' }}>
                  Simple steps to transform your medicine management
                </Paragraph>
              </div>
              <Row gutter={[32, 32]}>
                {[
                  { num: '01', title: 'Register & Setup', desc: 'Create your account and set up your organization profile in minutes', img: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
                  { num: '02', title: 'Add Your Medicines', desc: 'Upload your medicine inventory with details, images, and batch numbers', img: 'https://images.unsplash.com/photo-1587854692152-cbe660dbde88?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
                  { num: '03', title: 'Manage & Track', desc: 'Monitor stock levels, receive alerts, and manage orders seamlessly', img: 'https://images.unsplash.com/photo-1551601651-2a8555f1a136?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&q=80' },
                ].map((step, index) => (
                  <Col xs={24} lg={8} key={index}>
                    <Card
                      hoverable
                      style={{
                        borderRadius: 24,
                        border: '2px solid #f0f0f0',
                        overflow: 'hidden'
                      }}
                      styles={{ body: { padding: 0 } }}
                    >
                      <div style={{ padding: 32 }}>
                        <Space style={{ marginBottom: 24 }}>
                          <div style={{
                            width: 64,
                            height: 64,
                            borderRadius: 16,
                            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: '#fff',
                            fontSize: 24,
                            fontWeight: 'bold'
                          }}>
                            {step.num}
                          </div>
                        </Space>
                        <div style={{ borderRadius: 16, overflow: 'hidden', marginBottom: 24 }}>
                          <img
                            src={step.img}
                            alt={step.title}
                            style={{ width: '100%', height: 200, objectFit: 'cover' }}
                            onError={(e) => {
                              e.target.src = `https://via.placeholder.com/400x300/667eea/FFFFFF?text=${step.title}`
                            }}
                          />
                        </div>
                        <Title level={3} style={{ marginBottom: 12 }}>{step.title}</Title>
                        <Paragraph style={{ color: '#666', margin: 0 }}>{step.desc}</Paragraph>
                      </div>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </section>

          {/* About Section */}
          <section id="about" style={{ padding: '100px 50px', background: '#fff', scrollMarginTop: '80px' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
              <Row gutter={[48, 48]} align="middle">
                <Col xs={24} lg={12}>
                  <div style={{ borderRadius: 24, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,0.1)' }}>
                    <img
                      src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80"
                      alt="Healthcare professionals"
                      style={{ width: '100%', height: 'auto', display: 'block' }}
                      onError={(e) => {
                        e.target.src = 'https://via.placeholder.com/800x600/667eea/FFFFFF?text=Healthcare+Professionals'
                      }}
                    />
                  </div>
                </Col>
                <Col xs={24} lg={12}>
                  <Space orientation="vertical" size="large" style={{ width: '100%' }}>
                    <Tag color="blue" style={{ fontSize: 14, padding: '4px 16px' }}>
                      About Us
                    </Tag>
                    <Title level={2} style={{ fontSize: '2.5rem' }}>
                      Trusted by Healthcare
                      <br />
                      <span style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                        Professionals
                      </span>
                    </Title>
                    <Paragraph style={{ fontSize: 18, color: '#666' }}>
                      MediTrack is designed to help healthcare facilities, pharmacies, and suppliers
                      manage their medicine inventory more efficiently. Our platform ensures that
                      critical medicines are always available when needed.
                    </Paragraph>
                    <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
                      {[
                        { icon: <CheckCircleOutlined />, title: 'Reduce Waste', desc: 'Minimize expired medicine waste with proactive alerts', color: '#52c41a' },
                        { icon: <CheckCircleOutlined />, title: 'Save Time', desc: 'Automate inventory management and reduce manual work', color: '#1890ff' },
                        { icon: <CheckCircleOutlined />, title: 'Improve Patient Care', desc: 'Ensure medicines are always available for patients', color: '#722ed1' },
                      ].map((item, index) => (
                        <Card key={index} style={{ borderRadius: 12, border: `2px solid ${item.color}20`, background: `${item.color}08` }}>
                          <Space>
                            <div style={{ color: item.color, fontSize: 24 }}>{item.icon}</div>
                            <div>
                              <Text strong style={{ fontSize: 16 }}>{item.title}</Text>
                              <br />
                              <Text type="secondary">{item.desc}</Text>
                            </div>
                          </Space>
                        </Card>
                      ))}
                    </Space>
                  </Space>
                </Col>
              </Row>
            </div>
          </section>

          {/* Statistics Section */}
          <section style={{
            padding: '100px 50px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            color: '#fff'
          }}>
            <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
              <Title level={2} style={{ color: '#fff', marginBottom: 16, fontSize: '2.5rem' }}>
                Trusted by Healthcare Industry
              </Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 18, marginBottom: 60 }}>
                Join thousands of healthcare professionals using MediTrack
              </Paragraph>
              <Row gutter={[32, 32]}>
                {[
                  { value: '10,000+', label: 'Medicines Tracked' },
                  { value: '500+', label: 'Active Suppliers' },
                  { value: '200+', label: 'Hospitals Served' },
                ].map((stat, index) => (
                  <Col xs={24} sm={8} key={index}>
                    <Card
                      style={{
                        background: 'rgba(255,255,255,0.1)',
                        backdropFilter: 'blur(10px)',
                        borderRadius: 16,
                        border: '2px solid rgba(255,255,255,0.2)'
                      }}
                    >
                      <Statistic
                        value={stat.value}
                        styles={{ content: { color: '#fff', fontSize: 48, fontWeight: 'bold' } }}
                        suffix={null}
                      />
                      <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>{stat.label}</Text>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          </section>

          {/* CTA Section */}
          <section style={{
            padding: '100px 50px',
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            textAlign: 'center'
          }}>
            <div style={{ maxWidth: 800, margin: '0 auto' }}>
              <Title level={2} style={{ color: '#fff', fontSize: '3rem', marginBottom: 24 }}>
                Ready to Transform Your
                <br />
                Medicine Management?
              </Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.9)', fontSize: 20, marginBottom: 40 }}>
                Join thousands of healthcare professionals who trust MediTrack for their inventory management
              </Paragraph>
              <Space size="middle">
                <Link to="/register">
                  <Button
                    type="primary"
                    size="large"
                    icon={<UserAddOutlined />}
                    style={{
                      height: 50,
                      fontSize: 16,
                      paddingLeft: 30,
                      paddingRight: 30,
                      background: '#fff',
                      color: '#667eea',
                      border: 'none'
                    }}
                  >
                    Get Started Free
                  </Button>
                </Link>
                <Link to="/login">
                  <Button
                    size="large"
                    style={{
                      height: 50,
                      fontSize: 16,
                      paddingLeft: 30,
                      paddingRight: 30,
                      background: 'transparent',
                      color: '#fff',
                      border: '2px solid rgba(255,255,255,0.8)'
                    }}
                  >
                    Sign In
                  </Button>
                </Link>
              </Space>
            </div>
          </section>
        </Content>

        {/* Footer */}
        <Footer style={{ background: '#001529', color: '#fff', padding: '60px 50px' }}>
          <div style={{ maxWidth: 1200, margin: '0 auto' }}>
            <Row gutter={[48, 48]}>
              <Col xs={24} sm={12} lg={10}>
                <Title level={4} style={{ color: '#fff', marginBottom: 16 }}>
                  <span style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    MediTrack
                  </span>
                </Title>
                <Paragraph style={{ color: 'rgba(255,255,255,0.65)', marginBottom: 24 }}>
                  Empowering healthcare with smart medicine management. Streamline your inventory, reduce waste, and improve patient care.
                </Paragraph>
                <Space>
                  <Button shape="circle" icon={<ShoppingCartOutlined />} style={{ background: '#1f2937', border: 'none', color: '#fff' }} />
                  <Button shape="circle" icon={<TeamOutlined />} style={{ background: '#1f2937', border: 'none', color: '#fff' }} />
                </Space>
              </Col>
              <Col xs={24} sm={6} lg={4}>
                <Title level={5} style={{ color: '#fff', marginBottom: 16 }}>Quick Links</Title>
                <Space orientation="vertical" style={{ width: '100%' }}>
                  <Link to="/" style={{ color: 'rgba(255,255,255,0.65)' }}>Home</Link>
                  <Link to="/login" style={{ color: 'rgba(255,255,255,0.65)' }}>Login</Link>
                  <Link to="/register" style={{ color: 'rgba(255,255,255,0.65)' }}>Register</Link>
                </Space>
              </Col>
              <Col xs={24} sm={6} lg={4} id="contact" style={{ scrollMarginTop: '80px' }}>
                <Title level={5} style={{ color: '#fff', marginBottom: 16 }}>Contact</Title>
                <Space orientation="vertical" style={{ width: '100%' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.65)' }}>📧 info@meditrack.com</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.65)' }}>📱 +977-1-1234567</Text>
                  <Text style={{ color: 'rgba(255,255,255,0.65)' }}>📍 Kathmandu, Nepal</Text>
                </Space>
              </Col>
            </Row>
            <Divider style={{ borderColor: 'rgba(255,255,255,0.1)', margin: '40px 0 20px' }} />
            <Row justify="space-between" align="middle">
              <Col>
                <Text style={{ color: 'rgba(255,255,255,0.65)' }}>
                  &copy; 2024 MediTrack. All rights reserved.
                </Text>
              </Col>
              <Col>
                <Space>
                  <a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>Privacy Policy</a>
                  <a href="#" style={{ color: 'rgba(255,255,255,0.65)' }}>Terms of Service</a>
                </Space>
              </Col>
            </Row>
          </div>
        </Footer>
      </Layout>
    </ConfigProvider>
  )
}

export default LandingPage
