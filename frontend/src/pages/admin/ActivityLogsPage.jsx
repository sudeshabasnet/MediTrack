import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import axios from 'axios'
import { Card, Table, Typography, Spin, Empty, Tag } from 'antd'
import { ClockCircleOutlined } from '@ant-design/icons'
import { ConfigProvider } from 'antd'

const { Title, Text } = Typography

const ActivityLogsPage = () => {
  const [activities, setActivities] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchActivities()
  }, [])

  const fetchActivities = async () => {
    try {
      const response = await axios.get('/api/admin/activities')
      const data = response.data.content || response.data || []
      setActivities(data.map(activity => ({
        key: activity.id || Math.random(),
        action: activity.action || 'Unknown Action',
        description: activity.description || '',
        user: activity.user?.fullName || 'System',
        timestamp: activity.createdAt || activity.timestamp
      })))
    } catch (error) {
      console.error('Failed to fetch activities:', error)
    } finally {
      setLoading(false)
    }
  }

  const columns = [
    {
      title: 'Action',
      dataIndex: 'action',
      key: 'action',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: 'User',
      dataIndex: 'user',
      key: 'user',
      render: (user) => <Tag color="blue">{user}</Tag>
    },
    {
      title: 'Timestamp',
      dataIndex: 'timestamp',
      key: 'timestamp',
      render: (timestamp) => timestamp ? new Date(timestamp).toLocaleString() : 'N/A'
    },
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
      <AdminLayout>
        <div style={{ 
          background: '#f5f5f5', 
          padding: '24px', 
          borderRadius: '12px', 
          minHeight: 'calc(100vh - 112px)',
          maxWidth: '100%',
          width: '100%'
        }}>
          <div style={{ marginBottom: 32 }}>
            <Title level={2} style={{ margin: 0, color: '#1a1a1a', fontWeight: 700, fontSize: '28px' }}>
              Activity Logs
            </Title>
            <Text type="secondary" style={{ fontSize: '15px', marginTop: '8px', display: 'block' }}>
              View system activity and user actions
            </Text>
          </div>

          <Card 
            style={{ 
              borderRadius: '16px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              border: 'none',
              background: '#ffffff'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            {loading ? (
              <div style={{ textAlign: 'center', padding: '64px 0' }}>
                <Spin size="large" />
              </div>
            ) : (
              <Table
                columns={columns}
                dataSource={activities}
                loading={loading}
                pagination={{ pageSize: 10 }}
                locale={{
                  emptyText: <Empty description="No activity logs found" />
                }}
              />
            )}
          </Card>
        </div>
      </AdminLayout>
    </ConfigProvider>
  )
}

export default ActivityLogsPage
