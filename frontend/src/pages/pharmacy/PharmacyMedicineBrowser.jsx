import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import AppLayout from '../../components/layout/AppLayout'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Card, Row, Col, Input, Select, Button, Space, Typography, Tag, Empty, Pagination, Spin } from 'antd'
import { SearchOutlined, HeartOutlined, HeartFilled, ShoppingCartOutlined } from '@ant-design/icons'
import { ConfigProvider } from 'antd'

const { Title, Text } = Typography

const PharmacyMedicineBrowser = () => {
  const { user } = useAuth()
  const [medicines, setMedicines] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [sortBy, setSortBy] = useState('popularity')
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [filters, setFilters] = useState({ category: '' })
  const [wishlist, setWishlist] = useState(new Set())
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchCategories()
  }, [])

  useEffect(() => {
    if (selectedCategory) {
      // Map category name to enum value (uppercase)
      const categoryEnum = selectedCategory.toUpperCase()
      setFilters(prev => ({ ...prev, category: categoryEnum }))
    } else {
      setFilters(prev => ({ ...prev, category: '' }))
    }
    setCurrentPage(1)
  }, [selectedCategory])

  useEffect(() => {
    fetchMedicines()
    setCurrentPage(1)
  }, [searchTerm, filters, sortBy])

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories')
      // Sort categories: "Other" should be last
      const sorted = [...response.data].sort((a, b) => {
        if (a.name.toLowerCase() === 'other') return 1
        if (b.name.toLowerCase() === 'other') return -1
        return a.name.localeCompare(b.name)
      })
      setCategories(sorted)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  const fetchMedicines = async () => {
    try {
      setLoading(true)
      const params = { search: searchTerm, ...filters }
      const response = await axios.get('/api/pharmacy/medicines', { params })
      let sorted = [...response.data]
      
      if (sortBy === 'price-low') {
        sorted.sort((a, b) => a.unitPrice - b.unitPrice)
      } else if (sortBy === 'price-high') {
        sorted.sort((a, b) => b.unitPrice - a.unitPrice)
      } else if (sortBy === 'name') {
        sorted.sort((a, b) => a.name.localeCompare(b.name))
      }
      
      setMedicines(sorted)
    } catch (error) {
      console.error('Failed to fetch medicines:', error)
      toast.error('Failed to fetch medicines')
    } finally {
      setLoading(false)
    }
  }

  const addToCart = async (medicine) => {
    try {
      await axios.post('/api/cart', { medicineId: medicine.id, quantity: 1 })
      toast.success('Added to cart!')
      window.dispatchEvent(new CustomEvent('cartChanged'))
    } catch (error) {
      toast.error('Failed to add to cart')
    }
  }

  const toggleWishlist = (medicineId) => {
    const newWishlist = new Set(wishlist)
    if (newWishlist.has(medicineId)) {
      newWishlist.delete(medicineId)
      toast.success('Removed from wishlist')
    } else {
      newWishlist.add(medicineId)
      toast.success('Added to wishlist')
    }
    setWishlist(newWishlist)
  }

  const totalPages = Math.ceil(medicines.length / itemsPerPage)
  const startIndex = (currentPage - 1) * itemsPerPage
  const endIndex = startIndex + itemsPerPage
  const currentMedicines = medicines.slice(startIndex, endIndex)

  const getStatusTag = (status) => {
    const statusConfig = {
      AVAILABLE: { color: 'success', text: 'In Stock' },
      LOW_STOCK: { color: 'warning', text: 'Low Stock' },
      OUT_OF_STOCK: { color: 'error', text: 'Out of Stock' }
    }
    const config = statusConfig[status] || { color: 'default', text: status }
    return <Tag color={config.color} style={{ borderRadius: 4 }}>{config.text}</Tag>
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
          <Card 
            style={{ 
              marginBottom: 20, 
              borderRadius: '16px', 
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              border: '1px solid #e8e8e8',
              background: '#ffffff',
              overflow: 'hidden'
            }}
            bodyStyle={{ padding: '24px 28px' }}
          >
            <div style={{
              display: 'flex',
              gap: '16px',
              flexWrap: 'wrap',
              alignItems: 'center'
            }}>
              <div style={{
                flex: 1,
                minWidth: '280px',
                position: 'relative'
              }}>
                <Input
                  placeholder="Search..."
                  prefix={<SearchOutlined style={{ color: '#667eea', fontSize: '18px' }} />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ 
                    width: '100%',
                    height: '48px',
                    borderRadius: '12px',
                    border: '2px solid #e8e8e8',
                    fontSize: '15px',
                    transition: 'all 0.3s ease',
                    background: '#ffffff',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                  }}
                  size="large"
                  allowClear
                  onFocus={(e) => {
                    e.currentTarget.style.borderColor = '#667eea'
                    e.currentTarget.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1), 0 2px 8px rgba(102, 126, 234, 0.15)'
                  }}
                  onBlur={(e) => {
                    e.currentTarget.style.borderColor = '#e8e8e8'
                    e.currentTarget.style.boxShadow = '0 2px 4px rgba(0,0,0,0.04)'
                  }}
                />
              </div>
              <div style={{
                minWidth: '220px'
              }}>
                <Select
                  placeholder="Category"
                  value={filters.category || 'ALL'}
                  onChange={(value) => {
                    if (value === 'ALL') {
                      setFilters({ ...filters, category: '' })
                      setSelectedCategory(null)
                    } else {
                      setFilters({ ...filters, category: value })
                      setSelectedCategory(categories.find(c => c.name.toUpperCase() === value)?.name || null)
                    }
                  }}
                  style={{ 
                    width: '100%',
                    height: '48px',
                    borderRadius: '12px',
                    border: '2px solid #e8e8e8',
                    fontSize: '15px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.04)'
                  }}
                  size="large"
                >
                  <Select.Option value="ALL">
                    <span style={{ fontWeight: 500, color: '#667eea' }}>All Medicines</span>
                  </Select.Option>
                  {categories
                    .sort((a, b) => {
                      if (a.name.toLowerCase() === 'other') return 1
                      if (b.name.toLowerCase() === 'other') return -1
                      return a.name.localeCompare(b.name)
                    })
                    .map(cat => (
                      <Select.Option key={cat.id} value={cat.name.toUpperCase()}>
                        {cat.icon && <span style={{ marginRight: '8px', fontSize: '16px' }}>{cat.icon}</span>}
                        {cat.name}
                      </Select.Option>
                    ))}
                </Select>
              </div>
            </div>
          </Card>

          {/* Category Row */}
          <Card 
            style={{ 
              marginBottom: 24, 
              borderRadius: '16px', 
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              border: '1px solid #f0f0f0',
              background: '#ffffff'
            }}
            bodyStyle={{ padding: '20px 24px' }}
          >
            <div style={{ 
              display: 'flex', 
              gap: '10px', 
              flexWrap: 'wrap',
              alignItems: 'center',
              overflowX: 'auto',
              paddingBottom: '4px'
            }}>
              <Button
                type={selectedCategory === null ? 'primary' : 'default'}
                onClick={() => setSelectedCategory(null)}
                style={{
                  borderRadius: '10px',
                  height: '44px',
                  fontWeight: selectedCategory === null ? 600 : 500,
                  fontSize: '14px',
                  border: selectedCategory === null ? 'none' : '1px solid #e8e8e8',
                  background: selectedCategory === null 
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                    : '#ffffff',
                  color: selectedCategory === null ? '#ffffff' : '#595959',
                  padding: '0 20px',
                  boxShadow: selectedCategory === null 
                    ? '0 2px 8px rgba(102, 126, 234, 0.3)' 
                    : '0 1px 2px rgba(0,0,0,0.05)',
                  transition: 'all 0.3s ease',
                  whiteSpace: 'nowrap'
                }}
                onMouseEnter={(e) => {
                  if (selectedCategory !== null) {
                    e.currentTarget.style.borderColor = '#667eea'
                    e.currentTarget.style.color = '#667eea'
                    e.currentTarget.style.transform = 'translateY(-1px)'
                    e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedCategory !== null) {
                    e.currentTarget.style.borderColor = '#e8e8e8'
                    e.currentTarget.style.color = '#595959'
                    e.currentTarget.style.transform = 'translateY(0)'
                    e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'
                  }
                }}
              >
                All Medicines
              </Button>
              {categories.map(category => {
                const isSelected = selectedCategory === category.name
                return (
                  <Button
                    key={category.id}
                    type={isSelected ? 'primary' : 'default'}
                    onClick={() => setSelectedCategory(category.name)}
                    style={{
                      borderRadius: '10px',
                      height: '44px',
                      fontWeight: isSelected ? 600 : 500,
                      fontSize: '14px',
                      border: isSelected ? 'none' : '1px solid #e8e8e8',
                      background: isSelected 
                        ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' 
                        : '#ffffff',
                      color: isSelected ? '#ffffff' : '#595959',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      padding: '0 20px',
                      boxShadow: isSelected 
                        ? '0 2px 8px rgba(102, 126, 234, 0.3)' 
                        : '0 1px 2px rgba(0,0,0,0.05)',
                      transition: 'all 0.3s ease',
                      whiteSpace: 'nowrap'
                    }}
                    onMouseEnter={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#667eea'
                        e.currentTarget.style.color = '#667eea'
                        e.currentTarget.style.transform = 'translateY(-1px)'
                        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.1)'
                      }
                    }}
                    onMouseLeave={(e) => {
                      if (!isSelected) {
                        e.currentTarget.style.borderColor = '#e8e8e8'
                        e.currentTarget.style.color = '#595959'
                        e.currentTarget.style.transform = 'translateY(0)'
                        e.currentTarget.style.boxShadow = '0 1px 2px rgba(0,0,0,0.05)'
                      }
                    }}
                  >
                    {category.icon && (
                      <span style={{ 
                        fontSize: '18px',
                        display: 'inline-flex',
                        alignItems: 'center'
                      }}>
                        {category.icon}
                      </span>
                    )}
                    <span>{category.name}</span>
                  </Button>
                )
              })}
            </div>
          </Card>

          <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>

            <Space style={{ width: '100%', justifyContent: 'space-between', marginBottom: 24 }} wrap>
              <Title level={4} style={{ margin: 0 }}>
                {medicines.length} {medicines.length === 1 ? 'medicine' : 'medicines'} available
                {medicines.length > itemsPerPage && (
                  <Text type="secondary" style={{ fontSize: 14, marginLeft: 8 }}>
                    (Showing {startIndex + 1}-{Math.min(endIndex, medicines.length)} of {medicines.length})
                  </Text>
                )}
              </Title>
              <Select
                value={sortBy}
                onChange={setSortBy}
                style={{ width: 200 }}
                size="large"
              >
                <Select.Option value="popularity">Sort: Popularity</Select.Option>
                <Select.Option value="price-low">Price: Low to High</Select.Option>
                <Select.Option value="price-high">Price: High to Low</Select.Option>
                <Select.Option value="name">Name: A-Z</Select.Option>
              </Select>
            </Space>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '64px 0' }}>
                <Spin size="large" />
              </div>
            ) : medicines.length === 0 ? (
              <Empty
                description={
                  <div>
                    <div style={{ fontSize: 48, marginBottom: 16 }}>🔍</div>
                    <Title level={4}>No medicines found</Title>
                    <Text type="secondary">Try adjusting your search terms or select a different category</Text>
                  </div>
                }
                style={{ padding: '64px 0' }}
              />
            ) : (
              <>
                <Row gutter={[20, 24]} className="product-grid-row">
                  {currentMedicines.map((medicine) => (
                    <Col 
                      xs={12} 
                      sm={8} 
                      md={6} 
                      lg={4} 
                      xl={4}
                      key={medicine.id}
                      className="product-col"
                    >
                      <Card
                        hoverable
                        style={{
                          transition: 'all 0.3s ease',
                          borderRadius: 12,
                          overflow: 'hidden',
                          height: '100%',
                          display: 'flex',
                          flexDirection: 'column',
                          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                        }}
                        styles={{ body: { padding: 16, flex: 1, display: 'flex', flexDirection: 'column' } }}
                        cover={
                          <div style={{ position: 'relative', paddingTop: '100%', background: '#f5f5f5', overflow: 'hidden' }}>
                            <img
                              alt={medicine.name}
                              src={medicine.imageUrl || 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop'}
                              style={{
                                position: 'absolute',
                                top: 0,
                                left: 0,
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                transition: 'transform 0.3s ease'
                              }}
                              onError={(e) => {
                                e.target.src = 'https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?w=400&h=400&fit=crop'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.05)'
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)'
                              }}
                            />
                            <Button
                              type="text"
                              icon={wishlist.has(medicine.id) ? <HeartFilled style={{ color: '#ff4d4f' }} /> : <HeartOutlined />}
                              onClick={(e) => {
                                e.stopPropagation()
                                toggleWishlist(medicine.id)
                              }}
                              style={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                background: 'rgba(255,255,255,0.95)',
                                borderRadius: '50%',
                                width: 36,
                                height: 36,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                                zIndex: 2
                              }}
                            />
                            <div style={{ position: 'absolute', top: 8, left: 8, zIndex: 2 }}>
                              {categories.find(cat => cat.name.toUpperCase() === medicine.category) && (
                                <Tag color="success" style={{ marginBottom: 4, borderRadius: 4 }}>
                                  {categories.find(cat => cat.name.toUpperCase() === medicine.category)?.icon} {medicine.category}
                                </Tag>
                              )}
                              {getStatusTag(medicine.status)}
                            </div>
                          </div>
                        }
                        actions={[
                          medicine.currentStock > 0 ? (
                            <Button
                              type="primary"
                              icon={<ShoppingCartOutlined />}
                              block
                              size="large"
                              onClick={(e) => {
                                e.stopPropagation()
                                addToCart(medicine)
                              }}
                              style={{
                                borderRadius: 8,
                                height: 40,
                                fontWeight: 500
                              }}
                            >
                              Add to cart
                            </Button>
                          ) : (
                            <Button disabled block size="large" style={{ borderRadius: 8, height: 40 }}>Out of Stock</Button>
                          )
                        ]}
                      >
                        <Link to={`/pharmacy/medicines/${medicine.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <Card.Meta
                            title={<div style={{ fontSize: 15, fontWeight: 600, marginBottom: 8, lineHeight: 1.4, color: '#262626' }}>{medicine.name}</div>}
                            description={
                              <div style={{ flex: 1 }}>
                                <Text type="secondary" style={{ fontSize: 13, display: 'block', marginBottom: 8 }}>{medicine.genericName}</Text>
                                <div style={{ marginTop: 'auto' }}>
                                  <Text strong style={{ fontSize: 18, color: '#1890ff' }}>Rs. {medicine.unitPrice?.toFixed(2)}</Text>
                                </div>
                              </div>
                            }
                          />
                        </Link>
                      </Card>
                    </Col>
                  ))}
                </Row>

                {/* Pagination */}
                {medicines.length > 0 && (
                  <div style={{ 
                    textAlign: 'center', 
                    marginTop: '40px',
                    padding: '24px 20px',
                    background: '#ffffff',
                    borderRadius: '12px',
                    border: '1px solid #e8e8e8',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
                  }}>
                    <Pagination
                      current={currentPage}
                      total={medicines.length}
                      pageSize={itemsPerPage}
                      onChange={(page) => {
                        setCurrentPage(page)
                        window.scrollTo({ top: 0, behavior: 'smooth' })
                      }}
                      showSizeChanger={false}
                      showQuickJumper={{
                        goButton: <Button style={{ borderRadius: '8px', marginLeft: '8px' }}>Go</Button>
                      }}
                      showTotal={(total, range) => (
                        <div style={{ 
                          marginBottom: '16px',
                          fontSize: '14px', 
                          color: '#595959',
                          fontWeight: 500
                        }}>
                          Showing <strong style={{ color: '#1890ff' }}>{range[0]}</strong> to <strong style={{ color: '#1890ff' }}>{range[1]}</strong> of <strong style={{ color: '#1890ff' }}>{total}</strong> medicines
                        </div>
                      )}
                      style={{ 
                        fontSize: 14,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexWrap: 'wrap',
                        gap: '8px'
                      }}
                      itemRender={(page, type, originalElement) => {
                        if (type === 'prev') {
                          return (
                            <Button 
                              style={{ 
                                borderRadius: '8px',
                                height: '32px',
                                padding: '0 16px',
                                fontWeight: 500
                              }}
                              disabled={currentPage === 1}
                            >
                              ← Previous
                            </Button>
                          )
                        }
                        if (type === 'next') {
                          return (
                            <Button 
                              style={{ 
                                borderRadius: '8px',
                                height: '32px',
                                padding: '0 16px',
                                fontWeight: 500
                              }}
                              disabled={currentPage === totalPages}
                            >
                              Next →
                            </Button>
                          )
                        }
                        if (type === 'page') {
                          return (
                            <Button
                              type={page === currentPage ? 'primary' : 'default'}
                              style={{
                                borderRadius: '8px',
                                minWidth: '32px',
                                height: '32px',
                                fontWeight: page === currentPage ? 600 : 400,
                                border: page === currentPage ? 'none' : '1px solid #d9d9d9'
                              }}
                            >
                              {page}
                            </Button>
                          )
                        }
                        return originalElement
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </Card>
        </div>
      </AppLayout>
    </ConfigProvider>
  )
}

export default PharmacyMedicineBrowser
