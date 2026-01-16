import { Link } from 'react-router-dom'
import AppLayout from '../../components/layout/AppLayout'
import { useAuth } from '../../contexts/AuthContext'
import { Layout, Typography, Row, Col, Card, Space, Button, Divider } from 'antd'
import { 
  HeartOutlined, 
  SafetyOutlined, 
  TruckOutlined, 
  TeamOutlined, 
  BankOutlined,
  CheckCircleOutlined
} from '@ant-design/icons'
import { ConfigProvider } from 'antd'

const { Content, Header } = Layout
const { Title, Paragraph, Text } = Typography

const AboutUsPage = () => {
  const { isAuthenticated } = useAuth()

  const content = (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4F46E5',
          borderRadius: 8,
        },
      }}
    >
      <Content style={{ padding: '50px', background: '#fff' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto' }}>
          {/* Hero Section */}
          <div style={{ textAlign: 'center', marginBottom: 64 }}>
            <Title level={1} style={{ fontSize: '3rem', marginBottom: 16 }}>
              About MediTrack
            </Title>
            <Paragraph style={{ fontSize: 20, color: '#666', maxWidth: 800, margin: '0 auto' }}>
              Empowering healthcare with smart medicine management and distribution solutions
            </Paragraph>
          </div>

          {/* Mission Section */}
          <Card
            style={{
              marginBottom: 64,
              borderRadius: 16,
              background: 'linear-gradient(135deg, #e6f7ff 0%, #f0f5ff 100%)',
              border: 'none'
            }}
            styles={{ body: { padding: 48 } }}
          >
            <div style={{ textAlign: 'center', maxWidth: 800, margin: '0 auto' }}>
              <HeartOutlined style={{ fontSize: 64, color: '#1890ff', marginBottom: 24 }} />
              <Title level={2} style={{ marginBottom: 16 }}>Our Mission</Title>
              <Paragraph style={{ fontSize: 18, color: '#666', lineHeight: 1.8 }}>
                To revolutionize healthcare management in Nepal by providing a comprehensive, 
                user-friendly platform that connects pharmacies, suppliers, and patients. 
                We aim to ensure timely access to medicines, reduce stockouts, and improve 
                healthcare outcomes through innovative technology.
              </Paragraph>
            </div>
          </Card>

          {/* Features Grid */}
          <Row gutter={[24, 24]} style={{ marginBottom: 64 }}>
            <Col xs={24} md={8}>
              <Card
                hoverable
                style={{ borderRadius: 16, height: '100%' }}
                styles={{ body: { padding: 32 } }}
              >
                <SafetyOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 16 }} />
                <Title level={4} style={{ marginBottom: 12 }}>Secure & Reliable</Title>
                <Paragraph style={{ color: '#666', margin: 0 }}>
                  Your data and transactions are protected with industry-standard security measures.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card
                hoverable
                style={{ borderRadius: 16, height: '100%' }}
                styles={{ body: { padding: 32 } }}
              >
                <TruckOutlined style={{ fontSize: 48, color: '#52c41a', marginBottom: 16 }} />
                <Title level={4} style={{ marginBottom: 12 }}>Fast Delivery</Title>
                <Paragraph style={{ color: '#666', margin: 0 }}>
                  Efficient distribution network ensuring medicines reach patients quickly and safely.
                </Paragraph>
              </Card>
            </Col>
            <Col xs={24} md={8}>
              <Card
                hoverable
                style={{ borderRadius: 16, height: '100%' }}
                styles={{ body: { padding: 32 } }}
              >
                <TeamOutlined style={{ fontSize: 48, color: '#722ed1', marginBottom: 16 }} />
                <Title level={4} style={{ marginBottom: 12 }}>Trusted Network</Title>
                <Paragraph style={{ color: '#666', margin: 0 }}>
                  Verified pharmacies and suppliers working together to serve communities across Nepal.
                </Paragraph>
              </Card>
            </Col>
          </Row>

          {/* What We Do */}
          <div style={{ marginBottom: 64 }}>
            <Title level={2} style={{ textAlign: 'center', marginBottom: 48 }}>
              What We Do
            </Title>
            <Row gutter={[32, 32]}>
              <Col xs={24} md={12}>
                <Card style={{ borderRadius: 16, height: '100%' }} bodyStyle={{ padding: 32 }}>
                  <Title level={3} style={{ marginBottom: 24 }}>For Patients</Title>
                  <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
                    {[
                      'Easy access to medicines from verified pharmacies',
                      'Transparent pricing and availability',
                      'Order tracking and delivery updates',
                      'Secure payment options',
                    ].map((item, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <CheckCircleOutlined style={{ color: '#1890ff', marginRight: 12, marginTop: 4 }} />
                        <Text style={{ color: '#666' }}>{item}</Text>
                      </div>
                    ))}
                  </Space>
                </Card>
              </Col>
              <Col xs={24} md={12}>
                <Card style={{ borderRadius: 16, height: '100%' }} bodyStyle={{ padding: 32 }}>
                  <Title level={3} style={{ marginBottom: 24 }}>For Pharmacies</Title>
                  <Space orientation="vertical" size="middle" style={{ width: '100%' }}>
                    {[
                      'Inventory management system',
                      'Connect with verified suppliers',
                      'Stock alerts and expiry tracking',
                      'Order management and analytics',
                    ].map((item, index) => (
                      <div key={index} style={{ display: 'flex', alignItems: 'flex-start' }}>
                        <CheckCircleOutlined style={{ color: '#52c41a', marginRight: 12, marginTop: 4 }} />
                        <Text style={{ color: '#666' }}>{item}</Text>
                      </div>
                    ))}
                  </Space>
                </Card>
              </Col>
            </Row>
          </div>

          {/* Company Info */}
          <Card
            style={{
              borderRadius: 16,
              background: '#f5f5f5',
              marginBottom: 64
            }}
            styles={{ body: { padding: 48 } }}
          >
            <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
              <BankOutlined style={{ fontSize: 48, color: '#1890ff', marginBottom: 24 }} />
              <Title level={2} style={{ marginBottom: 32 }}>MediTrack Nepal</Title>
              <Row gutter={[32, 32]}>
                <Col xs={24} md={12}>
                  <Title level={5} style={{ marginBottom: 8 }}>Location</Title>
                  <Text style={{ color: '#666' }}>Kathmandu, Nepal</Text>
                </Col>
                <Col xs={24} md={12}>
                  <Title level={5} style={{ marginBottom: 8 }}>Contact</Title>
                  <div>
                    <Text style={{ color: '#666', display: 'block' }}>Email: info@meditrack.com</Text>
                    <Text style={{ color: '#666' }}>Phone: +977-1-1234567</Text>
                  </div>
                </Col>
              </Row>
            </div>
          </Card>

          {/* CTA Section */}
          <div style={{ textAlign: 'center', marginTop: 64 }}>
            <Title level={2} style={{ marginBottom: 16 }}>Join Us Today</Title>
            <Paragraph style={{ fontSize: 16, color: '#666', marginBottom: 32 }}>
              Start managing your medicine inventory efficiently
            </Paragraph>
            {!isAuthenticated && (
              <Space size="large">
                <Link to="/register">
                  <Button type="primary" size="large">
                    Get Started
                  </Button>
                </Link>
                <Link to="/pharmacy/medicines">
                  <Button size="large">
                    Browse Medicines
                  </Button>
                </Link>
              </Space>
            )}
          </div>
        </div>
      </Content>
    </ConfigProvider>
  )

  if (isAuthenticated) {
    return <AppLayout>{content}</AppLayout>
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
                  width: 32, 
                  height: 32, 
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  borderRadius: 8,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Text strong style={{ color: '#fff', fontSize: 18 }}>M</Text>
                </div>
                <Text strong style={{ fontSize: 20 }}>MediTrack</Text>
              </Space>
            </Link>
            <Space>
              <Link to="/pharmacy/medicines">
                <Button type="text">Browse Medicines</Button>
              </Link>
              <Link to="/login">
                <Button type="text">Login</Button>
              </Link>
              <Link to="/register">
                <Button type="primary">Register</Button>
              </Link>
            </Space>
          </div>
        </Header>
        {content}
      </Layout>
    </ConfigProvider>
  )
}

export default AboutUsPage
