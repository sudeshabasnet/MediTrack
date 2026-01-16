import { useState } from 'react'
import { useAuth } from '../../contexts/AuthContext'
import SupplierLayout from '../../components/layout/SupplierLayout'
import { Card, Row, Col, Space, Typography, Input, Avatar, Button, Descriptions, Tag } from 'antd'
import { UserOutlined, EditOutlined, CheckCircleOutlined, CloseCircleOutlined, ClockCircleOutlined } from '@ant-design/icons'
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

const SupplierProfile = () => {
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

  const getVerificationStatusColor = (status) => {
    switch (status) {
      case 'VERIFIED':
        return 'green'
      case 'PENDING':
        return 'orange'
      case 'REJECTED':
        return 'red'
      default:
        return 'default'
    }
  }

  const getVerificationIcon = (status) => {
    switch (status) {
      case 'VERIFIED':
        return <CheckCircleOutlined />
      case 'PENDING':
        return <ClockCircleOutlined />
      case 'REJECTED':
        return <CloseCircleOutlined />
      default:
        return null
    }
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#6366f1',
          borderRadius: 8,
        },
      }}
    >
      <SupplierLayout>
        <div style={{ padding: '24px' }}>
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              padding: '32px',
              borderRadius: '12px',
              marginBottom: '24px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Space direction="vertical" size={4}>
              <Space align="center">
                <UserOutlined style={{ fontSize: '32px', color: '#fff' }} />
                <Title level={2} style={{ margin: 0, color: '#fff' }}>
                  My Profile
                </Title>
              </Space>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px' }}>
                Manage your account information and settings
              </Text>
            </Space>
          </div>

          <Card 
            style={{ 
              borderRadius: '12px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
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
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
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
                        boxShadow: '0 2px 8px rgba(99, 102, 241, 0.4)',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        border: 'none'
                      }}
                    />
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <Title level={4} style={{ margin: 0, color: '#1a1a1a' }}>
                      {user?.fullName}
                    </Title>
                    <Text type="secondary" style={{ fontSize: '14px' }}>Supplier</Text>
                  </div>
                  
                  {/* Verification Status */}
                  <Tag 
                    icon={getVerificationIcon(user?.verificationStatus)}
                    color={getVerificationStatusColor(user?.verificationStatus)}
                    style={{ 
                      fontSize: '13px', 
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontWeight: 500
                    }}
                  >
                    {user?.verificationStatus || 'PENDING'}
                  </Tag>
                </Space>
              </Col>

              <Col xs={24} md={16}>
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  <div>
                    <Title level={5} style={{ marginBottom: 16, color: '#6366f1' }}>Account Information</Title>
                    <Descriptions 
                      bordered 
                      column={1}
                      labelStyle={{ 
                        fontWeight: 600, 
                        background: '#f9fafb',
                        color: '#374151',
                        width: '180px'
                      }}
                      contentStyle={{ 
                        background: '#ffffff',
                        color: '#1f2937'
                      }}
                    >
                      <Descriptions.Item label="Full Name">{user?.fullName}</Descriptions.Item>
                      <Descriptions.Item label="Email">{user?.email}</Descriptions.Item>
                      <Descriptions.Item label="Organization">{user?.organizationName || 'N/A'}</Descriptions.Item>
                      <Descriptions.Item label="Role">
                        <Tag color="blue" style={{ fontSize: '13px' }}>SUPPLIER</Tag>
                      </Descriptions.Item>
                      <Descriptions.Item label="Verification Status">
                        <Tag 
                          icon={getVerificationIcon(user?.verificationStatus)}
                          color={getVerificationStatusColor(user?.verificationStatus)}
                        >
                          {user?.verificationStatus || 'PENDING'}
                        </Tag>
                      </Descriptions.Item>
                      {user?.verificationStatus !== 'VERIFIED' && (
                        <Descriptions.Item label="Note">
                          <Text type="warning" style={{ fontSize: '13px' }}>
                            {user?.verificationStatus === 'PENDING' 
                              ? 'Your account is pending admin verification. You will be able to add medicines once verified.'
                              : 'Your account verification was rejected. Please contact admin for more information.'
                            }
                          </Text>
                        </Descriptions.Item>
                      )}
                    </Descriptions>
                  </div>
                </Space>
              </Col>
            </Row>

            {/* Avatar Selection */}
            <div style={{ marginTop: 40 }}>
              <Title level={5} style={{ marginBottom: 20, color: '#6366f1' }}>Choose Your Avatar</Title>
              <div style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fill, minmax(80px, 1fr))', 
                gap: '16px',
                maxWidth: '100%'
              }}>
                {AVATARS.map((avatar) => (
                  <div
                    key={avatar.id}
                    onClick={() => handleAvatarChange(avatar)}
                    style={{
                      cursor: 'pointer',
                      padding: '8px',
                      borderRadius: '12px',
                      border: selectedAvatar.id === avatar.id 
                        ? '3px solid #6366f1' 
                        : '3px solid transparent',
                      background: selectedAvatar.id === avatar.id 
                        ? 'linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)' 
                        : '#f9fafb',
                      transition: 'all 0.3s ease',
                      transform: selectedAvatar.id === avatar.id ? 'scale(1.05)' : 'scale(1)',
                      boxShadow: selectedAvatar.id === avatar.id 
                        ? '0 4px 12px rgba(99, 102, 241, 0.3)' 
                        : '0 2px 4px rgba(0,0,0,0.05)',
                    }}
                    onMouseEnter={(e) => {
                      if (selectedAvatar.id !== avatar.id) {
                        e.currentTarget.style.transform = 'scale(1.05)'
                        e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (selectedAvatar.id !== avatar.id) {
                        e.currentTarget.style.transform = 'scale(1)'
                        e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.05)'
                      }
                    }}
                  >
                    <Avatar 
                      size={64} 
                      src={avatar.imageUrl} 
                      style={{ display: 'block', margin: '0 auto' }}
                    />
                  </div>
                ))}
              </div>
            </div>
          </Card>
        </div>
      </SupplierLayout>
    </ConfigProvider>
  )
}

export default SupplierProfile

