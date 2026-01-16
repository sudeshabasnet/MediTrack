import SupplierLayout from '../../components/layout/SupplierLayout'
import { Card, Typography, Space, Form, Input, Button, Switch } from 'antd'
import { SettingOutlined, SaveOutlined } from '@ant-design/icons'
import { ConfigProvider } from 'antd'
import toast from 'react-hot-toast'

const { Title, Text } = Typography

const SupplierSettings = () => {
  const [form] = Form.useForm()

  const handleSave = (values) => {
    console.log('Settings:', values)
    toast.success('Settings saved successfully!')
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
              <SettingOutlined style={{ fontSize: 40 }} />
              <div>
                <Title level={2} style={{ color: '#fff', margin: 0 }}>
                  Settings
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>
                  Manage your account preferences
                </Text>
              </div>
            </Space>
          </div>

          <Card style={{ borderRadius: '12px' }}>
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSave}
              size="large"
            >
              <Title level={4}>Notification Preferences</Title>
              <Form.Item
                name="emailNotifications"
                label="Email Notifications"
                valuePropName="checked"
              >
                <Switch defaultChecked />
              </Form.Item>

              <Form.Item
                name="orderNotifications"
                label="Order Notifications"
                valuePropName="checked"
              >
                <Switch defaultChecked />
              </Form.Item>

              <Form.Item
                name="stockAlerts"
                label="Low Stock Alerts"
                valuePropName="checked"
              >
                <Switch defaultChecked />
              </Form.Item>

              <div style={{ marginTop: 32 }}>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<SaveOutlined />}
                  size="large"
                >
                  Save Settings
                </Button>
              </div>
            </Form>
          </Card>
        </div>
      </SupplierLayout>
    </ConfigProvider>
  )
}

export default SupplierSettings










