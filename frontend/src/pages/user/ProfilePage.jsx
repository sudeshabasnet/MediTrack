import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AppLayout from '../../components/layout/AppLayout'
import { Card, Row, Col, Space, Typography, Input, Avatar, Button, Descriptions, Tag } from 'antd'
import { UserOutlined, EditOutlined, ShoppingOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'
import { ConfigProvider } from 'antd'

const { Title, Text } = Typography

const AVATARS = [
  { id: 'avatar1', imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex&backgroundColor=b6e3f4' },
  { id: 'avatar2', imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah&backgroundColor=ffd5dc' },
  { id: 'avatar3', imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Michael&backgroundColor=c7d2fe' },
  { id: 'avatar4', imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma&backgroundColor=ffdfbf' },
  { id: 'avatar5', imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=James&backgroundColor=d1fae5' },
  { id: 'avatar6', imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Olivia&backgroundColor=fce7f3' },
  { id: 'avatar7', imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=David&backgroundColor=e0e7ff' },
  { id: 'avatar8', imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophia&backgroundColor=fef3c7' },
  { id: 'avatar9', imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Daniel&backgroundColor=fed7aa' },
  { id: 'avatar10', imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Isabella&backgroundColor=fce7f3' },
  { id: 'avatar11', imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Matthew&backgroundColor=dbeafe' },
  { id: 'avatar12', imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Ava&backgroundColor=ddd6fe' },
  { id: 'avatar13', imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=William&backgroundColor=bbf7d0' },
  { id: 'avatar14', imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Mia&backgroundColor=fecaca' },
  { id: 'avatar15', imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Benjamin&backgroundColor=bfdbfe' },
  { id: 'avatar16', imageUrl: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Charlotte&backgroundColor=fde68a' },
]

const ProfilePage = () => {
  const { user } = useAuth()
  
  const getStoredAvatar = () => {
    const stored = localStorage.getItem(`avatar_${user?.id || 'default'}`)
    if (stored) {
      const parsed = JSON.parse(stored)
      return AVATARS.find(a => a.id === parsed.id) || AVATARS[0]
    }
    return AVATARS[0]
  }
  
  const [selectedAvatar, setSelectedAvatar] = useState(getStoredAvatar)
  
  const handleAvatarChange = (avatar) => {
    setSelectedAvatar(avatar)
    localStorage.setItem(`avatar_${user?.id || 'default'}`, JSON.stringify({ id: avatar.id, imageUrl: avatar.imageUrl }))
    window.dispatchEvent(new CustomEvent('avatarChanged', { detail: avatar }))
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
          <Title level={2} style={{ marginBottom: 24, color: '#1a1a1a', fontWeight: 600 }}>My Profile</Title>

          <Card 
            style={{ 
              borderRadius: '16px', 
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              border: '1px solid #e8e8e8',
              background: '#ffffff'
            }}
            bodyStyle={{ padding: '32px' }}
          >
            <Row gutter={[32, 32]}>
              <Col xs={24} md={8}>
                <Space direction="vertical" style={{ width: '100%' }} align="center" size="large">
                  <div style={{ position: 'relative' }}>
                    <Avatar
                      size={120}
                      src={selectedAvatar.imageUrl}
                      icon={<UserOutlined />}
                      style={{ 
                        border: '5px solid #ffffff', 
                        boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
                        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      }}
                    />
                    <Button
                      type="primary"
                      shape="circle"
                      icon={<EditOutlined />}
                      size="small"
                      style={{ 
                        position: 'absolute', 
                        bottom: 0, 
                        right: 0,
                        boxShadow: '0 2px 8px rgba(102, 126, 234, 0.4)'
                      }}
                    />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Title level={4} style={{ margin: 0, color: '#1a1a1a', fontWeight: 600 }}>
                      {user?.fullName}
                    </Title>
                    <Text type="secondary" style={{ fontSize: '14px', marginTop: '4px', display: 'block' }}>
                      {user?.email}
                    </Text>
                  </div>

                  <div style={{ width: '100%' }}>
                    <Text strong style={{ marginBottom: 12, display: 'block', fontSize: '14px', color: '#595959' }}>
                      Profile Avatar
                    </Text>
                    <Row gutter={[8, 8]}>
                      {AVATARS.map((avatar) => (
                        <Col span={6} key={avatar.id}>
                          <Button
                            type={selectedAvatar.id === avatar.id ? 'primary' : 'default'}
                            style={{
                              padding: 0,
                              height: 64,
                              width: '100%',
                              borderRadius: '50%',
                              overflow: 'hidden',
                              border: selectedAvatar.id === avatar.id ? '3px solid #667eea' : '2px solid #d9d9d9',
                              transition: 'all 0.3s ease',
                              boxShadow: selectedAvatar.id === avatar.id ? '0 2px 8px rgba(102, 126, 234, 0.3)' : 'none'
                            }}
                            onClick={() => handleAvatarChange(avatar)}
                            onMouseEnter={(e) => {
                              if (selectedAvatar.id !== avatar.id) {
                                e.currentTarget.style.borderColor = '#667eea'
                                e.currentTarget.style.transform = 'scale(1.05)'
                              }
                            }}
                            onMouseLeave={(e) => {
                              if (selectedAvatar.id !== avatar.id) {
                                e.currentTarget.style.borderColor = '#d9d9d9'
                                e.currentTarget.style.transform = 'scale(1)'
                              }
                            }}
                          >
                            <Avatar
                              src={avatar.imageUrl}
                              size={64}
                              style={{ border: 'none' }}
                            />
                          </Button>
                        </Col>
                      ))}
                    </Row>
                    <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
                      Choose your profile avatar
                    </Text>
                  </div>
                </Space>
              </Col>

              <Col xs={24} md={16}>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  <Card 
                    title={<span style={{ fontSize: '16px', fontWeight: 600, color: '#1a1a1a' }}>Profile Summary</span>}
                    style={{ 
                      borderRadius: '12px', 
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      border: '1px solid #f0f0f0'
                    }}
                  >
                    <Descriptions column={{ xs: 1, sm: 2 }} size="middle">
                      <Descriptions.Item label={<span style={{ fontWeight: 500 }}>Role</span>}>
                        <Text strong style={{ color: '#667eea' }}>{user?.role || 'USER'}</Text>
                      </Descriptions.Item>
                      {(user?.role === 'SUPPLIER' || user?.role === 'PHARMACY') && (
                        <Descriptions.Item label={<span style={{ fontWeight: 500 }}>Verification Status</span>}>
                          {user?.verificationStatus === 'VERIFIED' && (
                            <Tag color="success" icon={<CheckCircleOutlined />}>Verified</Tag>
                          )}
                          {user?.verificationStatus === 'PENDING' && (
                            <Tag color="warning" icon={<ClockCircleOutlined />}>Pending</Tag>
                          )}
                          {user?.verificationStatus === 'REJECTED' && (
                            <Tag color="error" icon={<CloseCircleOutlined />}>Rejected</Tag>
                          )}
                        </Descriptions.Item>
                      )}
                      <Descriptions.Item label={<span style={{ fontWeight: 500 }}>Phone</span>}>
                        {user?.phoneNumber || '—'}
                      </Descriptions.Item>
                      <Descriptions.Item label={<span style={{ fontWeight: 500 }}>Address</span>}>
                        {user?.address || '—'}
                      </Descriptions.Item>
                    </Descriptions>
                  </Card>

                  <Card
                    style={{ 
                      borderRadius: '12px', 
                      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
                      border: '1px solid #f0f0f0',
                      background: 'linear-gradient(135deg, #f8f9ff 0%, #ffffff 100%)'
                    }}
                    bodyStyle={{ padding: '24px' }}
                  >
                    <Space style={{ width: '100%', justifyContent: 'space-between' }} align="start">
                      <div>
                        <Title level={4} style={{ margin: 0, color: '#1a1a1a', fontWeight: 600 }}>
                          Orders & Progress
                        </Title>
                        <Text type="secondary" style={{ marginTop: 8, display: 'block', fontSize: '14px' }}>
                          Quickly jump to your full order history and track delivery status.
                        </Text>
                      </div>
                      <Link to="/user/orders">
                        <Button 
                          type="primary" 
                          icon={<ShoppingOutlined />}
                          style={{
                            borderRadius: '8px',
                            boxShadow: '0 2px 8px rgba(102, 126, 234, 0.3)'
                          }}
                        >
                          View all orders
                        </Button>
                      </Link>
                    </Space>
                  </Card>
                </Space>
              </Col>
            </Row>
          </Card>
        </div>
      </AppLayout>
    </ConfigProvider>
  )
}

export default ProfilePage
