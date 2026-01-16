import { useState, useEffect } from 'react'
import SupplierLayout from '../../components/layout/SupplierLayout'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  Card,
  Table,
  Tag,
  Input,
  Select,
  Space,
  Typography,
  Row,
  Col,
  Statistic,
  Alert,
  Button,
  Modal,
  Form,
  DatePicker,
  InputNumber,
  Image
} from 'antd'
import {
  SearchOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  EditOutlined,
  MedicineBoxOutlined,
  ShoppingOutlined,
  StarOutlined,
  PictureOutlined,
  DollarOutlined,
  SyncOutlined,
  SortAscendingOutlined
} from '@ant-design/icons'
import { ConfigProvider } from 'antd'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { Option } = Select

const SupplierInventory = () => {
  const [medicines, setMedicines] = useState([])
  const [filteredMedicines, setFilteredMedicines] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [categoryFilter, setCategoryFilter] = useState(null)
  const [statusFilter, setStatusFilter] = useState(null)
  const [stats, setStats] = useState({
    totalMedicines: 0,
    totalValue: 0,
    lowStock: 0,
    outOfStock: 0,
    nearExpiry: 0,
    expired: 0
  })
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingMedicine, setEditingMedicine] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchInventory()
  }, [])

  useEffect(() => {
    filterMedicines()
  }, [medicines, searchText, categoryFilter, statusFilter])

  const fetchInventory = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/supplier/medicines')
      const medList = response.data || []
      setMedicines(medList)
      calculateStats(medList)
    } catch (error) {
      console.error('Failed to fetch inventory:', error)
      toast.error('Failed to load inventory')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (medList) => {
    const today = dayjs()
    const thirtyDaysFromNow = dayjs().add(30, 'days')

    const stats = {
      totalMedicines: medList.length,
      totalValue: medList.reduce((sum, m) => sum + (m.currentStock * m.unitPrice), 0),
      lowStock: medList.filter(m => m.status === 'LOW_STOCK').length,
      outOfStock: medList.filter(m => m.status === 'OUT_OF_STOCK').length,
      nearExpiry: medList.filter(m => {
        if (!m.expiryDate) return false
        const expiry = dayjs(m.expiryDate)
        return expiry.isBefore(thirtyDaysFromNow) && expiry.isAfter(today)
      }).length,
      expired: medList.filter(m => {
        if (!m.expiryDate) return false
        return dayjs(m.expiryDate).isBefore(today)
      }).length
    }
    setStats(stats)
  }

  const filterMedicines = () => {
    let filtered = [...medicines]

    if (searchText) {
      filtered = filtered.filter(m =>
        m.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        m.genericName?.toLowerCase().includes(searchText.toLowerCase()) ||
        m.manufacturer?.toLowerCase().includes(searchText.toLowerCase()) ||
        m.batchNumber?.toLowerCase().includes(searchText.toLowerCase())
      )
    }

    if (categoryFilter) {
      filtered = filtered.filter(m => m.category === categoryFilter)
    }

    if (statusFilter) {
      const today = dayjs()
      const thirtyDaysFromNow = dayjs().add(30, 'days')

      filtered = filtered.filter(m => {
        if (statusFilter === 'LOW_STOCK') return m.status === 'LOW_STOCK'
        if (statusFilter === 'OUT_OF_STOCK') return m.status === 'OUT_OF_STOCK'
        if (statusFilter === 'AVAILABLE') return m.status === 'AVAILABLE'
        if (statusFilter === 'near_expiry') {
          if (!m.expiryDate) return false
          const expiry = dayjs(m.expiryDate)
          return expiry.isBefore(thirtyDaysFromNow) && expiry.isAfter(today)
        }
        if (statusFilter === 'expired') {
          if (!m.expiryDate) return false
          return dayjs(m.expiryDate).isBefore(today)
        }
        return true
      })
    }

    setFilteredMedicines(filtered)
  }

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return { status: 'default', text: 'N/A', color: 'default' }

    const today = dayjs()
    const expiry = dayjs(expiryDate)
    const daysUntilExpiry = expiry.diff(today, 'days')

    if (daysUntilExpiry < 0) {
      return { status: 'error', text: `Expired ${Math.abs(daysUntilExpiry)} days ago`, color: 'red', days: Math.abs(daysUntilExpiry) }
    } else if (daysUntilExpiry === 0) {
      return { status: 'error', text: 'Expires today', color: 'red', days: 0 }
    } else if (daysUntilExpiry <= 7) {
      return { status: 'error', text: `Expires in ${daysUntilExpiry} days`, color: 'red', days: daysUntilExpiry }
    } else if (daysUntilExpiry <= 30) {
      return { status: 'warning', text: `Expires in ${daysUntilExpiry} days`, color: 'orange', days: daysUntilExpiry }
    } else if (daysUntilExpiry <= 90) {
      return { status: 'info', text: `Expires in ${daysUntilExpiry} days`, color: 'blue', days: daysUntilExpiry }
    } else {
      return { status: 'success', text: `Expires in ${daysUntilExpiry} days`, color: 'green', days: daysUntilExpiry }
    }
  }

  const getStockStatus = (medicine) => {
    if (medicine.status === 'OUT_OF_STOCK') {
      return { color: 'red', text: 'Out of Stock' }
    } else if (medicine.status === 'LOW_STOCK') {
      return { color: 'orange', text: 'Low Stock' }
    } else {
      return { color: 'green', text: 'Available' }
    }
  }

  const handleUpdateStock = (record) => {
    setEditingMedicine(record)
    form.setFieldsValue({
      currentStock: record.currentStock,
      batchNumber: record.batchNumber,
      expiryDate: record.expiryDate ? dayjs(record.expiryDate) : null
    })
    setIsModalVisible(true)
  }

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields()

      const updateData = {
        ...editingMedicine,
        currentStock: values.currentStock,
        batchNumber: values.batchNumber,
        expiryDate: values.expiryDate ? values.expiryDate.format('YYYY-MM-DD') : null
      }

      await axios.put(`/api/supplier/medicines/${editingMedicine.id}`, updateData)
      toast.success('Inventory updated successfully')
      setIsModalVisible(false)
      form.resetFields()
      setEditingMedicine(null)
      fetchInventory()
    } catch (error) {
      console.error('Failed to update inventory:', error)
      toast.error('Failed to update inventory')
    }
  }

  const handleModalCancel = () => {
    setIsModalVisible(false)
    form.resetFields()
    setEditingMedicine(null)
  }

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 80,
      render: (imageUrl, record) => (
        <Image
          src={imageUrl || '/placeholder-medicine.png'}
          alt={record.name}
          width={60}
          height={60}
          style={{ objectFit: 'cover', borderRadius: '8px' }}
          fallback="/placeholder-medicine.png"
        />
      ),
    },
    {
      title: 'Medicine Details',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <Text strong style={{ fontSize: 15 }}>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Generic: {record.genericName || 'N/A'}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Batch: {record.batchNumber || 'N/A'}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Manufacturer: {record.manufacturer || 'N/A'}
          </Text>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="blue">{category || 'N/A'}</Tag>,
    },
    {
      title: 'Stock',
      dataIndex: 'currentStock',
      key: 'currentStock',
      render: (stock, record) => {
        const stockStatus = getStockStatus(record)
        return (
          <div>
            <Text strong style={{ fontSize: 16, color: stockStatus.color === 'red' ? '#ff4d4f' : stockStatus.color === 'orange' ? '#faad14' : '#52c41a' }}>
              {stock} units
            </Text>
            <br />
            <Tag color={stockStatus.color} style={{ marginTop: 4 }}>
              {stockStatus.text}
            </Tag>
          </div>
        )
      },
      sorter: (a, b) => a.currentStock - b.currentStock,
    },
    {
      title: 'Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (price) => (
        <Text strong style={{ color: '#1890ff' }}>
          Rs. {price?.toFixed(2)}
        </Text>
      ),
    },
    {
      title: 'Total Value',
      key: 'totalValue',
      render: (_, record) => (
        <Text strong style={{ color: '#52c41a' }}>
          Rs. {(record.currentStock * record.unitPrice).toFixed(2)}
        </Text>
      ),
      sorter: (a, b) => (a.currentStock * a.unitPrice) - (b.currentStock * b.unitPrice),
    },
    {
      title: 'Expiry Date',
      dataIndex: 'expiryDate',
      key: 'expiryDate',
      render: (date) => {
        const expiryStatus = getExpiryStatus(date)
        return (
          <div>
            <Text>{date ? dayjs(date).format('YYYY-MM-DD') : 'N/A'}</Text>
            <br />
            <Tag color={expiryStatus.color} style={{ marginTop: 4 }}>
              {expiryStatus.text}
            </Tag>
          </div>
        )
      },
      sorter: (a, b) => {
        if (!a.expiryDate) return 1
        if (!b.expiryDate) return -1
        return dayjs(a.expiryDate).unix() - dayjs(b.expiryDate).unix()
      },
    },
    {
      title: 'Overall Status',
      key: 'overallStatus',
      render: (_, record) => {
        const expiryStatus = getExpiryStatus(record.expiryDate)
        const isOutOfStock = record.status === 'OUT_OF_STOCK'
        const isLowStock = record.status === 'LOW_STOCK'

        if (expiryStatus.status === 'error') {
          return <Tag color="red" icon={<ExclamationCircleOutlined />}>Critical</Tag>
        } else if (isOutOfStock) {
          return <Tag color="red" icon={<ExclamationCircleOutlined />}>Out of Stock</Tag>
        } else if (expiryStatus.status === 'warning' || isLowStock) {
          return <Tag color="orange" icon={<WarningOutlined />}>Warning</Tag>
        } else {
          return <Tag color="green">Good</Tag>
        }
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EditOutlined />}
          onClick={() => handleUpdateStock(record)}
          size="small"
        >
          Update
        </Button>
      ),
    },
  ]

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
        <div style={{ padding: '24px', background: '#f5f5f5', minHeight: '100vh' }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '32px',
            borderRadius: '12px',
            marginBottom: '24px',
            color: '#fff'
          }}>
            <Space align="center">
              <MedicineBoxOutlined style={{ fontSize: 40 }} />
              <div>
                <Title level={2} style={{ color: '#fff', margin: 0 }}>
                  Inventory Management
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>
                  Track and manage your medicine stock, expiry dates, and batch numbers
                </Text>
              </div>
            </Space>
          </div>

          {/* Advanced Features Banner */}
          <Card
            style={{
              marginBottom: 24,
              borderRadius: 12,
              background: 'linear-gradient(135deg, #f6f8fb 0%, #e9ecef 100%)',
              border: '1px solid #d3d9e3'
            }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24}>
                <Text strong style={{ fontSize: 15, color: '#6366f1' }}>
                  <StarOutlined style={{ marginRight: 8 }} />
                  Advanced Inventory Features
                </Text>
              </Col>
              <Col xs={12} sm={6}>
                <Space direction="vertical" size={4}>
                  <Text strong style={{ fontSize: 13 }}>
                    <PictureOutlined style={{ marginRight: 6, color: '#1890ff' }} />
                    Image Display
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>Visual medicine preview</Text>
                </Space>
              </Col>
              <Col xs={12} sm={6}>
                <Space direction="vertical" size={4}>
                  <Text strong style={{ fontSize: 13 }}>
                    <DollarOutlined style={{ marginRight: 6, color: '#52c41a' }} />
                    Value Calculation
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>Real-time stock value</Text>
                </Space>
              </Col>
              <Col xs={12} sm={6}>
                <Space direction="vertical" size={4}>
                  <Text strong style={{ fontSize: 13 }}>
                    <SyncOutlined style={{ marginRight: 6, color: '#faad14' }} />
                    Stock Update
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>Quick edit modal</Text>
                </Space>
              </Col>
              <Col xs={12} sm={6}>
                <Space direction="vertical" size={4}>
                  <Text strong style={{ fontSize: 13 }}>
                    <SortAscendingOutlined style={{ marginRight: 6, color: '#722ed1' }} />
                    Advanced Sorting
                  </Text>
                  <Text type="secondary" style={{ fontSize: 12 }}>Sort by any column</Text>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Stats Cards */}
          <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={8}>
              <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <Statistic
                  title="Total Medicines"
                  value={stats.totalMedicines}
                  prefix={<MedicineBoxOutlined />}
                  valueStyle={{ color: '#1890ff', fontWeight: 700 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <Statistic
                  title="Total Inventory Value"
                  value={stats.totalValue}
                  prefix="Rs. "
                  precision={2}
                  valueStyle={{ color: '#52c41a', fontWeight: 700 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <Statistic
                  title="Low Stock Items"
                  value={stats.lowStock}
                  prefix={<WarningOutlined />}
                  valueStyle={{ color: '#faad14', fontWeight: 700 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <Statistic
                  title="Out of Stock"
                  value={stats.outOfStock}
                  prefix={<ExclamationCircleOutlined />}
                  valueStyle={{ color: '#ff4d4f', fontWeight: 700 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <Statistic
                  title="Near Expiry (30 days)"
                  value={stats.nearExpiry}
                  prefix={<WarningOutlined />}
                  valueStyle={{ color: '#ff7a45', fontWeight: 700 }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={8}>
              <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <Statistic
                  title="Expired"
                  value={stats.expired}
                  prefix={<ExclamationCircleOutlined />}
                  valueStyle={{ color: '#cf1322', fontWeight: 700 }}
                />
              </Card>
            </Col>
          </Row>

          {/* Alerts */}
          {stats.expired > 0 && (
            <Alert
              message="Expired Medicines Alert"
              description={`You have ${stats.expired} expired medicine(s) in your inventory. Please remove them from sale immediately.`}
              type="error"
              icon={<ExclamationCircleOutlined />}
              style={{ marginBottom: 16, borderRadius: 8 }}
              showIcon
              closable
            />
          )}
          {stats.nearExpiry > 0 && (
            <Alert
              message="Expiry Warning"
              description={`You have ${stats.nearExpiry} medicine(s) expiring within 30 days. Plan promotions or restock accordingly.`}
              type="warning"
              icon={<WarningOutlined />}
              style={{ marginBottom: 16, borderRadius: 8 }}
              showIcon
              closable
            />
          )}
          {stats.outOfStock > 0 && (
            <Alert
              message="Out of Stock Alert"
              description={`You have ${stats.outOfStock} medicine(s) that are out of stock. Restock to avoid losing sales.`}
              type="error"
              icon={<ExclamationCircleOutlined />}
              style={{ marginBottom: 16, borderRadius: 8 }}
              showIcon
              closable
            />
          )}
          {stats.lowStock > 0 && (
            <Alert
              message="Low Stock Warning"
              description={`You have ${stats.lowStock} medicine(s) with low stock levels. Consider restocking soon.`}
              type="warning"
              icon={<WarningOutlined />}
              style={{ marginBottom: 16, borderRadius: 8 }}
              showIcon
              closable
            />
          )}

          {/* Filters and Quick Actions */}
          <Card
            title={<span style={{ fontSize: 16, fontWeight: 600 }}>🔍 Search & Filter</span>}
            style={{ marginBottom: 20, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={8}>
                <Input
                  placeholder="Search by name, generic name, batch..."
                  prefix={<SearchOutlined />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                  size="large"
                />
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Select
                  placeholder="Filter by Stock Status"
                  style={{ width: '100%' }}
                  allowClear
                  value={statusFilter}
                  onChange={setStatusFilter}
                  size="large"
                >
                  <Option value="AVAILABLE">✅ Available</Option>
                  <Option value="LOW_STOCK">⚠️ Low Stock</Option>
                  <Option value="OUT_OF_STOCK">🚫 Out of Stock</Option>
                  <Option value="near_expiry">📅 Near Expiry (30 days)</Option>
                  <Option value="expired">❌ Expired</Option>
                </Select>
              </Col>
              <Col xs={24} sm={12} md={8}>
                <Button
                  type="default"
                  icon={<SearchOutlined />}
                  size="large"
                  block
                  onClick={() => {
                    setSearchText('')
                    setCategoryFilter(null)
                    setStatusFilter(null)
                  }}
                >
                  Clear All Filters
                </Button>
              </Col>
            </Row>

            {/* Feature Indicators */}
            <Row gutter={[12, 12]} style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid #f0f0f0' }}>
              <Col xs={12} sm={6}>
                <Space>
                  <Tag color="blue" style={{ margin: 0 }}>📸 Image Display</Tag>
                </Space>
              </Col>
              <Col xs={12} sm={6}>
                <Space>
                  <Tag color="green" style={{ margin: 0 }}>💰 Value Calculation</Tag>
                </Space>
              </Col>
              <Col xs={12} sm={6}>
                <Space>
                  <Tag color="purple" style={{ margin: 0 }}>🔄 Stock Update</Tag>
                </Space>
              </Col>
              <Col xs={12} sm={6}>
                <Space>
                  <Tag color="orange" style={{ margin: 0 }}>⬆️⬇️ Advanced Sorting</Tag>
                </Space>
              </Col>
            </Row>
          </Card>

          {/* Inventory Table */}
          <Card
            title={
              <Space>
                <MedicineBoxOutlined style={{ fontSize: 18, color: '#6366f1' }} />
                <Text strong style={{ fontSize: 16 }}>Inventory Details</Text>
                <Tag color="blue">📸 Images</Tag>
                <Tag color="green">💰 Values</Tag>
                <Tag color="purple">🔄 Editable</Tag>
                <Tag color="orange">⬆️⬇️ Sortable</Tag>
              </Space>
            }
            style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}
          >
            <Alert
              message="Advanced Features Active"
              description={
                <Space direction="vertical" size={4}>
                  <Text>✅ Click column headers to sort data</Text>
                  <Text>✅ View medicine images in first column</Text>
                  <Text>✅ See calculated total values for each item</Text>
                  <Text>✅ Click 'Update' button to modify stock, batch, or expiry</Text>
                </Space>
              }
              type="info"
              showIcon
              closable
              style={{ marginBottom: 16 }}
            />
            <Table
              columns={columns}
              dataSource={filteredMedicines}
              loading={loading}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} medicines | Total Value: Rs. ${stats.totalValue.toFixed(2)}`,
                pageSizeOptions: ['10', '20', '50', '100'],
              }}
              scroll={{ x: 1400 }}
            />
          </Card>

          {/* Update Stock Modal */}
          <Modal
            title={
              <Space>
                <EditOutlined style={{ color: '#6366f1' }} />
                <span style={{ fontSize: 18, fontWeight: 600 }}>Update Inventory Details</span>
                <Tag color="purple">🔄 Stock Update Feature</Tag>
              </Space>
            }
            open={isModalVisible}
            onOk={handleModalOk}
            onCancel={handleModalCancel}
            okText="💾 Save Changes"
            cancelText="Cancel"
            width={650}
            style={{ borderRadius: 12 }}
          >
            <Form
              form={form}
              layout="vertical"
              style={{ marginTop: 20 }}
              onValuesChange={(changedValues, allValues) => {
                // Real-time value calculation
                if (editingMedicine && allValues.currentStock !== undefined) {
                  const newValue = allValues.currentStock * editingMedicine.unitPrice
                  // Update is handled by React re-render
                }
              }}
            >
              <Alert
                message="💡 Quick Update Feature"
                description="Modify stock levels, batch numbers, and expiry dates. The total value is calculated automatically."
                type="success"
                showIcon
                style={{ marginBottom: 16 }}
              />

              <Form.Item
                label={<Text strong>Current Stock Quantity</Text>}
                name="currentStock"
                rules={[
                  { required: true, message: 'Please enter current stock' },
                  { type: 'number', min: 0, message: 'Stock cannot be negative' }
                ]}
              >
                <InputNumber
                  min={0}
                  style={{ width: '100%' }}
                  placeholder="Enter stock quantity"
                  size="large"
                  prefix="📦"
                />
              </Form.Item>

              {editingMedicine && form.getFieldValue('currentStock') !== undefined && (
                <Card
                  size="small"
                  style={{
                    marginBottom: 16,
                    background: '#f0f5ff',
                    border: '1px solid #adc6ff'
                  }}
                >
                  <Space direction="vertical" size={4}>
                    <Text strong style={{ color: '#1890ff' }}>💰 Value Calculation:</Text>
                    <Text>
                      {form.getFieldValue('currentStock') || 0} units × Rs. {editingMedicine.unitPrice?.toFixed(2)} =
                      <Text strong style={{ color: '#52c41a', fontSize: 16, marginLeft: 8 }}>
                        Rs. {((form.getFieldValue('currentStock') || 0) * editingMedicine.unitPrice).toFixed(2)}
                      </Text>
                    </Text>
                  </Space>
                </Card>
              )}

              <Form.Item
                label={<Text strong>Batch Number</Text>}
                name="batchNumber"
              >
                <Input
                  placeholder="Enter batch number (optional)"
                  size="large"
                  prefix="🏷️"
                />
              </Form.Item>

              <Form.Item
                label={<Text strong>Expiry Date</Text>}
                name="expiryDate"
              >
                <DatePicker
                  style={{ width: '100%' }}
                  format="YYYY-MM-DD"
                  placeholder="Select expiry date"
                  size="large"
                  disabledDate={(current) => current && current < dayjs().startOf('day')}
                  suffixIcon="📅"
                />
              </Form.Item>

              {editingMedicine && (
                <Alert
                  message="📋 Current Medicine Information"
                  description={
                    <div>
                      <Row gutter={[8, 8]}>
                        <Col span={24}>
                          <Text strong style={{ fontSize: 15 }}>{editingMedicine.name}</Text>
                        </Col>
                        <Col span={12}>
                          <Text type="secondary">Unit Price: Rs. {editingMedicine.unitPrice?.toFixed(2)}</Text>
                        </Col>
                        <Col span={12}>
                          <Text type="secondary">Category: {editingMedicine.category || 'N/A'}</Text>
                        </Col>
                        <Col span={12}>
                          <Text type="secondary">Current Stock: {editingMedicine.currentStock} units</Text>
                        </Col>
                        <Col span={12}>
                          <Text type="secondary" strong style={{ color: '#52c41a' }}>
                            Current Value: Rs. {(editingMedicine.currentStock * editingMedicine.unitPrice).toFixed(2)}
                          </Text>
                        </Col>
                      </Row>
                    </div>
                  }
                  type="info"
                  showIcon
                  style={{ marginTop: 10 }}
                />
              )}
            </Form>
          </Modal>
        </div>
      </SupplierLayout>
    </ConfigProvider>
  )
}

export default SupplierInventory

