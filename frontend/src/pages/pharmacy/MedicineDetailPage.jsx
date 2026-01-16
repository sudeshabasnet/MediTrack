import { useState, useEffect } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AppLayout from '../../components/layout/AppLayout'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Card, Row, Col, Button, Space, Typography, Spin, Tag, Descriptions, InputNumber, Empty } from 'antd'
import {
  ArrowLeftOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled,
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  CalendarOutlined,
  BankOutlined,
  TagOutlined
} from '@ant-design/icons'
import { ConfigProvider } from 'antd'

const { Title, Text } = Typography

const MedicineDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [medicine, setMedicine] = useState(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [wishlist, setWishlist] = useState(new Set())

  useEffect(() => {
    fetchMedicine()
    const stored = localStorage.getItem('wishlist')
    if (stored) {
      setWishlist(new Set(JSON.parse(stored)))
    }
  }, [id])

  const fetchMedicine = async () => {
    try {
      setLoading(true)
      const response = await axios.get(`/api/pharmacy/medicines/${id}`)
      setMedicine(response.data)
    } catch (error) {
      console.error('Failed to fetch medicine:', error)
      toast.error('Failed to load medicine details')
      navigate('/pharmacy/medicines')
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async () => {
    try {
      await axios.post('/api/cart', {
        medicineId: medicine.id,
        quantity: quantity
      })
      toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart!`)
      window.dispatchEvent(new CustomEvent('cartChanged'))
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  const toggleWishlist = () => {
    const newWishlist = new Set(wishlist)
    if (newWishlist.has(medicine.id)) {
      newWishlist.delete(medicine.id)
      toast.success('Removed from wishlist')
    } else {
      newWishlist.add(medicine.id)
      toast.success('Added to wishlist')
    }
    setWishlist(newWishlist)
    localStorage.setItem('wishlist', JSON.stringify([...newWishlist]))
  }

  const getStatusTag = (status) => {
    const statusConfig = {
      AVAILABLE: { color: 'success', icon: <CheckCircleOutlined />, text: 'In Stock' },
      LOW_STOCK: { color: 'warning', icon: <ExclamationCircleOutlined />, text: 'Low Stock' },
      OUT_OF_STOCK: { color: 'error', icon: <CloseCircleOutlined />, text: 'Out of Stock' }
    }
    const config = statusConfig[status] || { color: 'default', icon: null, text: status }
    return <Tag color={config.color} icon={config.icon}>{config.text}</Tag>
  }

  const getCategoryTag = (category) => {
    const categoryColors = {
      ANTIBIOTIC: 'blue',
      PAINKILLER: 'purple',
      VITAMIN: 'gold',
      HERBAL: 'green',
      OTHER: 'default'
    }
    return <Tag color={categoryColors[category]} icon={<TagOutlined />}>{category}</Tag>
  }

  if (loading) {
    return (
      <AppLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '50vh' }}>
          <Spin size="large" />
        </div>
      </AppLayout>
    )
  }

  if (!medicine) {
    return (
      <AppLayout>
        <Card>
          <Empty description="Medicine not found" />
        </Card>
      </AppLayout>
    )
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
          <Link to="/pharmacy/medicines" style={{ marginBottom: 16, display: 'inline-block' }}>
            <Button icon={<ArrowLeftOutlined />}>Back to Medicines</Button>
          </Link>

          <Row gutter={[24, 24]}>
            <Col xs={24} lg={12}>
              <Card>
                <div style={{ position: 'relative', paddingTop: '100%', background: '#f5f5f5', borderRadius: 8 }}>
                  <img
                    alt={medicine.name}
                    src={medicine.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop'}
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                      borderRadius: 8
                    }}
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=800&h=800&fit=crop'
                    }}
                  />
                </div>
              </Card>
            </Col>

            <Col xs={24} lg={12}>
              <Card>
                <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 16 }}>
                  <div style={{ flex: 1 }}>
                    <Title level={2} style={{ margin: 0 }}>{medicine.name}</Title>
                    <Text type="secondary" style={{ fontSize: 16 }}>{medicine.genericName}</Text>
                  </div>
                  <Button
                    type="text"
                    icon={wishlist.has(medicine.id) ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                    onClick={toggleWishlist}
                    size="large"
                  />
                </Space>

                <Space style={{ marginBottom: 24 }} wrap>
                  {getStatusTag(medicine.status)}
                  {getCategoryTag(medicine.category)}
                </Space>

                <div style={{ borderTop: '1px solid #f0f0f0', borderBottom: '1px solid #f0f0f0', padding: '24px 0', marginBottom: 24 }}>
                  <Space align="baseline">
                    <Title level={2} style={{ margin: 0, color: '#1890ff' }}>
                      Rs. {medicine.unitPrice}
                    </Title>
                    <Text type="secondary">per unit</Text>
                  </Space>
                  {medicine.currentStock > 0 && (
                    <div style={{ marginTop: 8 }}>
                      <Text type="secondary">{medicine.currentStock} units available</Text>
                    </div>
                  )}
                </div>

                {medicine.description && (
                  <div style={{ marginBottom: 24 }}>
                    <Title level={4}>Description</Title>
                    <Text>{medicine.description}</Text>
                  </div>
                )}

                <Descriptions column={2} style={{ marginBottom: 24 }}>
                  <Descriptions.Item label={<><BankOutlined /> Manufacturer</>}>
                    {medicine.manufacturer}
                  </Descriptions.Item>
                  <Descriptions.Item label={<><TagOutlined /> Batch Number</>}>
                    {medicine.batchNumber}
                  </Descriptions.Item>
                  <Descriptions.Item label={<><CalendarOutlined /> Expiry Date</>}>
                    {new Date(medicine.expiryDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </Descriptions.Item>
                  {medicine.supplierName && (
                    <Descriptions.Item label={<><BankOutlined /> Supplier</>}>
                      {medicine.supplierName}
                    </Descriptions.Item>
                  )}
                </Descriptions>

                {medicine.currentStock > 0 && (
                  <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 24 }}>
                    <Space style={{ marginBottom: 16 }}>
                      <Text strong>Quantity:</Text>
                      <InputNumber
                        min={1}
                        max={medicine.currentStock}
                        value={quantity}
                        onChange={setQuantity}
                        style={{ width: 120 }}
                      />
                      <Text type="secondary">Max: {medicine.currentStock}</Text>
                    </Space>
                    <Button
                      type="primary"
                      icon={<ShoppingCartOutlined />}
                      block
                      size="large"
                      onClick={addToCart}
                    >
                      Add to Cart
                    </Button>
                  </div>
                )}

                {medicine.currentStock === 0 && (
                  <div style={{ borderTop: '1px solid #f0f0f0', paddingTop: 24 }}>
                    <Button disabled block size="large">
                      Out of Stock
                    </Button>
                  </div>
                )}
              </Card>
            </Col>
          </Row>
        </div>
      </AppLayout>
    </ConfigProvider>
  )
}

export default MedicineDetailPage
