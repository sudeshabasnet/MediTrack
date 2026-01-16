import SupplierLayout from '../../components/layout/SupplierLayout'
import { Card, Typography, Space, List, Badge, Empty } from 'antd'
import { BellOutlined, CheckCircleOutlined, InfoCircleOutlined } from '@ant-design/icons'
import { ConfigProvider } from 'antd'

const { Title, Text } = Typography

const SupplierNotifications = () => {
  const notifications = []

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
        <div style={{ padding: '24px', background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '32px',
            borderRadius: '12px',
            marginBottom: '24px',
            color: '#fff'
          }}>
            <Space align="center">
              <Badge count={0}>
                <BellOutlined style={{ fontSize: 40, color: '#fff' }} />
              </Badge>
              <div>
                <Title level={2} style={{ color: '#fff', margin: 0 }}>
                  Notifications
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>
                  Stay updated with important alerts
                </Text>
              </div>
            </Space>
          </div>

          <Card style={{ borderRadius: '12px' }}>
            {notifications.length === 0 ? (
              <Empty
                image={<BellOutlined style={{ fontSize: 80, color: '#d9d9d9' }} />}
                description={
                  <div>
                    <Title level={4}>No Notifications</Title>
                    <Text type="secondary">
                      You're all caught up! New notifications will appear here.
                    </Text>
                  </div>
                }
              />
            ) : (
              <List
                dataSource={notifications}
                renderItem={(item) => (
                  <List.Item>
                    <List.Item.Meta
                      avatar={<CheckCircleOutlined style={{ fontSize: 24, color: '#52c41a' }} />}
                      title={item.title}
                      description={item.description}
                    />
                  </List.Item>
                )}
              />
            )}
          </Card>
        </div>
      </SupplierLayout>
    </ConfigProvider>
  )
}

export default SupplierNotifications










