import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import axios from 'axios'
import { Card, Typography, Spin, Empty, Tag, Alert } from 'antd'
import { ExclamationCircleOutlined, WarningOutlined, CheckCircleOutlined } from '@ant-design/icons'
import { ConfigProvider } from 'antd'

const { Title, Text } = Typography

const AlertsPage = () => {
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchAlerts()
  }, [])

  const fetchAlerts = async () => {
    try {
      const [lowStockRes, expiryRes] = await Promise.all([
        axios.get('/api/admin/reports/low-stock-report'),
        axios.get('/api/admin/reports/expiry-prediction')
      ])
      
      const alertsList = []
      
      if (lowStockRes.data?.medicines) {
        lowStockRes.data.medicines.forEach(med => {
          alertsList.push({
            key: `low-stock-${med.id}`,
            type: 'warning',
            title: 'Low Stock Alert',
            message: `${med.name} is running low (${med.currentStock} units remaining)`,
            timestamp: new Date()
          })
        })
      }
      
      if (expiryRes.data?.expiryAlerts) {
        expiryRes.data.expiryAlerts.forEach(alert => {
          alertsList.push({
            key: `expiry-${alert.id}`,
            type: 'error',
            title: 'Expiry Alert',
            message: `${alert.name} will expire soon`,
            timestamp: new Date(alert.expiryDate)
          })
        })
      }
      
      setAlerts(alertsList)
    } catch (error) {
      console.error('Failed to fetch alerts:', error)
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
              Alerts & Notifications
            </Title>
            <Text type="secondary" style={{ fontSize: '15px', marginTop: '8px', display: 'block' }}>
              System alerts and important notifications
            </Text>
          </div>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '64px 0' }}>
              <Spin size="large" />
            </div>
          ) : alerts.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {alerts.map((alert) => (
                <Alert
                  key={alert.key}
                  message={alert.title}
                  description={
                    <div>
                      <Text>{alert.message}</Text>
                      <br />
                      <Text type="secondary" style={{ fontSize: '12px', marginTop: 4, display: 'block' }}>
                        {alert.timestamp.toLocaleString()}
                      </Text>
                    </div>
                  }
                  type={alert.type}
                  icon={alert.type === 'error' ? <ExclamationCircleOutlined /> : <WarningOutlined />}
                  style={{
                    borderRadius: '12px',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.06)'
                  }}
                  showIcon
                />
              ))}
            </div>
          ) : (
            <Card
              style={{
                borderRadius: '16px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                border: 'none',
                background: '#ffffff'
              }}
              bodyStyle={{ padding: '64px 24px', textAlign: 'center' }}
            >
              <CheckCircleOutlined style={{ fontSize: '48px', color: '#52c41a', marginBottom: 16 }} />
              <Text type="secondary" style={{ fontSize: '16px' }}>No alerts at this time</Text>
            </Card>
          )}
        </div>
      </AdminLayout>
    </ConfigProvider>
  )
}

export default AlertsPage
