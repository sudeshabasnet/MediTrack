import { useState } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import { Card, Form, Switch, InputNumber, Button, Space, Typography, Divider } from 'antd'
import { SaveOutlined } from '@ant-design/icons'
import toast from 'react-hot-toast'
import { ConfigProvider } from 'antd'

const { Title, Text } = Typography

const SettingsPage = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)

  const handleSave = async (values) => {
    setLoading(true)
    try {
      // Save settings logic here
      await new Promise(resolve => setTimeout(resolve, 500)) // Simulate API call
      toast.success('Settings saved successfully')
    } catch (error) {
      toast.error('Failed to save settings')
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
              Settings
            </Title>
            <Text type="secondary" style={{ fontSize: '15px', marginTop: '8px', display: 'block' }}>
              Configure system settings and preferences
            </Text>
          </div>

          <Form
            form={form}
            layout="vertical"
            onFinish={handleSave}
            initialValues={{
              emailNotifications: true,
              lowStockThreshold: 10,
              expiryWarningDays: 30,
              systemMaintenance: false
            }}
          >
            <Card 
              title={<span style={{ fontSize: '18px', fontWeight: 600 }}>Email Notifications</span>}
              style={{ 
                borderRadius: '16px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                border: 'none',
                background: '#ffffff',
                marginBottom: 20
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <Form.Item
                name="emailNotifications"
                valuePropName="checked"
                style={{ marginBottom: 0 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Text strong style={{ display: 'block', marginBottom: 4 }}>Enable email notifications</Text>
                    <Text type="secondary" style={{ fontSize: '13px' }}>Receive email alerts for important events</Text>
                  </div>
                  <Switch />
                </div>
              </Form.Item>
            </Card>

            <Card 
              title={<span style={{ fontSize: '18px', fontWeight: 600 }}>Stock Management</span>}
              style={{ 
                borderRadius: '16px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                border: 'none',
                background: '#ffffff',
                marginBottom: 20
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <Form.Item
                label={<span style={{ fontWeight: 500 }}>Low Stock Threshold</span>}
                name="lowStockThreshold"
                help="Alert when stock falls below this number"
              >
                <InputNumber 
                  min={1} 
                  style={{ width: '100%' }}
                  size="large"
                />
              </Form.Item>
              <Form.Item
                label={<span style={{ fontWeight: 500 }}>Expiry Warning Days</span>}
                name="expiryWarningDays"
                help="Days before expiry to send warning"
              >
                <InputNumber 
                  min={1} 
                  style={{ width: '100%' }}
                  size="large"
                />
              </Form.Item>
            </Card>

            <Card 
              title={<span style={{ fontSize: '18px', fontWeight: 600 }}>System Maintenance</span>}
              style={{ 
                borderRadius: '16px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                border: 'none',
                background: '#ffffff',
                marginBottom: 24
              }}
              bodyStyle={{ padding: '24px' }}
            >
              <Form.Item
                name="systemMaintenance"
                valuePropName="checked"
                style={{ marginBottom: 0 }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Text strong style={{ display: 'block', marginBottom: 4 }}>Maintenance Mode</Text>
                    <Text type="secondary" style={{ fontSize: '13px' }}>Put the system in maintenance mode</Text>
                  </div>
                  <Switch />
                </div>
              </Form.Item>
            </Card>

            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <Button
                type="primary"
                icon={<SaveOutlined />}
                htmlType="submit"
                loading={loading}
                size="large"
                style={{
                  borderRadius: '10px',
                  height: '44px',
                  padding: '0 32px',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  fontWeight: 500
                }}
              >
                Save Settings
              </Button>
            </div>
          </Form>
        </div>
      </AdminLayout>
    </ConfigProvider>
  )
}

export default SettingsPage
