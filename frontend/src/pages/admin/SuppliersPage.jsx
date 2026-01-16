import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import axios from 'axios'
import { Card, Input, Row, Col, Typography, Spin, Empty, Avatar, Tag, Button } from 'antd'
import { SearchOutlined, ShopOutlined, EyeOutlined } from '@ant-design/icons'
import { ConfigProvider } from 'antd'

const { Title, Text } = Typography

const SuppliersPage = () => {
  const navigate = useNavigate()
  const [suppliers, setSuppliers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchSuppliers()
  }, [])

  const fetchSuppliers = async () => {
    try {
      const response = await axios.get('/api/admin/users', {
        params: { role: 'SUPPLIER' }
      })
      setSuppliers(response.data.content || response.data || [])
    } catch (error) {
      console.error('Failed to fetch suppliers:', error)
    } finally {
      setLoading(false)
    }
  }

  const filteredSuppliers = suppliers.filter(supplier =>
    supplier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    supplier.organizationName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

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
              Suppliers
            </Title>
            <Text type="secondary" style={{ fontSize: '15px', marginTop: '8px', display: 'block' }}>
              Manage all suppliers in the system
            </Text>
          </div>

          <Card 
            style={{ 
              borderRadius: '16px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              border: 'none',
              background: '#ffffff',
              marginBottom: 24
            }}
            bodyStyle={{ padding: '16px' }}
          >
            <Input
              placeholder="Search suppliers..."
              prefix={<SearchOutlined style={{ color: '#667eea' }} />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ 
                borderRadius: '10px',
                border: '2px solid #e8e8e8'
              }}
              size="large"
              allowClear
            />
          </Card>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '64px 0' }}>
              <Spin size="large" />
            </div>
          ) : filteredSuppliers.length > 0 ? (
            <Row gutter={[20, 20]}>
              {filteredSuppliers.map((supplier) => (
                <Col xs={24} sm={12} lg={8} key={supplier.id}>
                  <Card
                    hoverable
                    style={{
                      borderRadius: '16px',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.08)',
                      border: '1px solid #e8e8e8',
                      transition: 'all 0.3s ease'
                    }}
                    bodyStyle={{ padding: '24px' }}
                  >
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                        <Avatar
                          size={56}
                          icon={<ShopOutlined />}
                          style={{
                            background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                            flexShrink: 0
                          }}
                        />
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <Title level={5} style={{ margin: 0, marginBottom: 4, fontSize: '16px', fontWeight: 600 }}>
                            {supplier.organizationName || supplier.fullName}
                          </Title>
                          <Text type="secondary" style={{ fontSize: '13px', display: 'block' }}>
                            {supplier.fullName}
                          </Text>
                          <Text type="secondary" style={{ fontSize: '12px', display: 'block', marginTop: 4 }}>
                            {supplier.email}
                          </Text>
                          {supplier.verificationStatus && (
                            <Tag 
                              color={supplier.verificationStatus === 'VERIFIED' ? 'success' : 'warning'}
                              style={{ marginTop: 8 }}
                            >
                              {supplier.verificationStatus}
                            </Tag>
                          )}
                        </div>
                      </div>
                      <Button
                        type="primary"
                        icon={<EyeOutlined />}
                        onClick={() => navigate(`/admin/users/${supplier.id}`)}
                        block
                        style={{
                          borderRadius: '8px',
                          height: '36px',
                          fontWeight: 500
                        }}
                      >
                        View Details
                      </Button>
                    </div>
                  </Card>
                </Col>
              ))}
            </Row>
          ) : (
            <Card
              style={{
                borderRadius: '16px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                border: 'none',
                background: '#ffffff'
              }}
              bodyStyle={{ padding: '64px 24px' }}
            >
              <Empty description="No suppliers found" />
            </Card>
          )}
        </div>
      </AdminLayout>
    </ConfigProvider>
  )
}

export default SuppliersPage
