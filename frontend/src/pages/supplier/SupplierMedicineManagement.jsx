import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SupplierLayout from '../../components/layout/SupplierLayout'
import { useAuth } from '../../contexts/AuthContext'
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
  Image,
  Upload
} from 'antd'
import { showDeleteConfirm } from '../../utils/modalConfig.jsx'
import { 
  SearchOutlined, 
  WarningOutlined, 
  ExclamationCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  EyeOutlined,
  UploadOutlined,
  PictureOutlined
} from '@ant-design/icons'
import { ConfigProvider } from 'antd'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { Option } = Select
const { TextArea } = Input

const SupplierMedicineManagement = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [medicines, setMedicines] = useState([])
  const [filteredMedicines, setFilteredMedicines] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState(null)
  const [categories, setCategories] = useState([])
  const [stats, setStats] = useState({
    totalMedicines: 0,
    lowStock: 0,
    nearExpiry: 0,
    expired: 0,
    totalStockValue: 0
  })
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingMedicine, setEditingMedicine] = useState(null)
  const [form] = Form.useForm()
  const [imageUrl, setImageUrl] = useState('')
  const [imageUploading, setImageUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)

  useEffect(() => {
    fetchMedicines()
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories', { params: { activeOnly: true } })
      setCategories(response.data || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
    }
  }

  useEffect(() => {
    filterMedicines()
  }, [medicines, searchText, categoryFilter, statusFilter])

  const fetchMedicines = async () => {
    setLoading(true)
    try {
      const params = {
        search: searchText || undefined,
        category: (categoryFilter && categoryFilter !== 'ALL') ? categoryFilter : undefined,
        status: statusFilter || undefined
      }
      const response = await axios.get('/api/supplier/medicines', { params })
      setMedicines(response.data || [])
      calculateStats(response.data || [])
    } catch (error) {
      console.error('Failed to fetch medicines:', error)
      toast.error('Failed to fetch medicines')
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (medList) => {
    const today = dayjs()
    const thirtyDaysFromNow = dayjs().add(30, 'days')
    
    const stats = {
      totalMedicines: medList.length,
      lowStock: medList.filter(m => m.currentStock <= m.minStockLevel).length,
      nearExpiry: medList.filter(m => {
        if (!m.expiryDate) return false
        const expiry = dayjs(m.expiryDate)
        return expiry.isBefore(thirtyDaysFromNow) && expiry.isAfter(today)
      }).length,
      expired: medList.filter(m => {
        if (!m.expiryDate) return false
        return dayjs(m.expiryDate).isBefore(today)
      }).length,
      totalStockValue: medList.reduce((sum, m) => 
        sum + (m.currentStock * parseFloat(m.unitPrice || 0)), 0
      )
    }
    setStats(stats)
  }

  const filterMedicines = () => {
    let filtered = [...medicines]

    if (searchText) {
      filtered = filtered.filter(m => 
        m.name?.toLowerCase().includes(searchText.toLowerCase()) ||
        m.batchNumber?.toLowerCase().includes(searchText.toLowerCase()) ||
        m.genericName?.toLowerCase().includes(searchText.toLowerCase())
      )
    }

    if (categoryFilter && categoryFilter !== 'ALL') {
      filtered = filtered.filter(m => m.category === categoryFilter)
    }

    if (statusFilter) {
      filtered = filtered.filter(m => m.status === statusFilter)
    }

    setFilteredMedicines(filtered)
  }

  const getExpiryStatus = (expiryDate) => {
    if (!expiryDate) return { status: 'default', text: 'N/A' }
    
    const today = dayjs()
    const expiry = dayjs(expiryDate)
    const daysUntilExpiry = expiry.diff(today, 'days')

    if (daysUntilExpiry < 0) {
      return { status: 'error', text: 'Expired', days: Math.abs(daysUntilExpiry) }
    } else if (daysUntilExpiry <= 7) {
      return { status: 'error', text: `Expires in ${daysUntilExpiry} days`, days: daysUntilExpiry }
    } else if (daysUntilExpiry <= 30) {
      return { status: 'warning', text: `Expires in ${daysUntilExpiry} days`, days: daysUntilExpiry }
    } else {
      return { status: 'success', text: `Expires in ${daysUntilExpiry} days`, days: daysUntilExpiry }
    }
  }

  const handleAdd = () => {
    navigate('/supplier/medicines/add')
  }

  const handleImageUpload = async (file) => {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file')
      return false
    }

    // Validate file size (10MB)
    if (file.size > 10 * 1024 * 1024) {
      toast.error('Image size must be less than 10MB')
      return false
    }

    setImageUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await axios.post('/api/images/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })

      setImageUrl(response.data.imageUrl)
      setImagePreview(response.data.imageUrl)
      form.setFieldsValue({ imageUrl: response.data.imageUrl })
      toast.success('Image uploaded successfully')
      return false // Prevent default upload behavior
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to upload image')
      return false
    } finally {
      setImageUploading(false)
    }
  }

  const handleEdit = (medicine) => {
    setEditingMedicine(medicine)
    setImageUrl(medicine.imageUrl || '')
    setImagePreview(medicine.imageUrl || null)
    form.setFieldsValue({
      ...medicine,
      expiryDate: medicine.expiryDate ? dayjs(medicine.expiryDate) : null
    })
    setIsModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/supplier/medicines/${id}`)
      toast.success('Medicine deleted successfully')
      fetchMedicines()
    } catch (error) {
      toast.error('Failed to delete medicine')
    }
  }

  const handleSubmit = async (values) => {
    try {
      const data = {
        ...values,
        imageUrl: imageUrl || values.imageUrl || '',
        expiryDate: values.expiryDate ? values.expiryDate.format('YYYY-MM-DD') : null
      }

      if (editingMedicine) {
        await axios.put(`/api/supplier/medicines/${editingMedicine.id}`, data)
        toast.success('Medicine updated successfully')
      } else {
        await axios.post('/api/supplier/medicines', data)
        toast.success('Medicine added successfully')
      }
      
      setIsModalVisible(false)
      form.resetFields()
      setImageUrl('')
      setImagePreview(null)
      fetchMedicines()
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to save medicine')
    }
  }

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 80,
      render: (url) => (
        <Image
          width={60}
          height={60}
          src={url || '/placeholder-medicine.png'}
          fallback="/placeholder-medicine.png"
          style={{ objectFit: 'cover', borderRadius: 4 }}
        />
      ),
    },
    {
      title: 'Medicine Name',
      dataIndex: 'name',
      key: 'name',
      render: (text, record) => (
        <div>
          <Text strong>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            {record.genericName}
          </Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>
            Batch: {record.batchNumber}
          </Text>
        </div>
      ),
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
      render: (category) => <Tag color="blue">{category}</Tag>,
    },
    {
      title: 'Stock',
      key: 'stock',
      render: (_, record) => (
        <div>
          <Text strong>{record.currentStock}</Text> / {record.minStockLevel}
          <br />
          <Tag color={record.currentStock <= record.minStockLevel ? 'red' : 'green'}>
            {record.status}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (price) => `Rs. ${parseFloat(price || 0).toFixed(2)}`,
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
            <Tag color={expiryStatus.status === 'error' ? 'red' : expiryStatus.status === 'warning' ? 'orange' : 'green'}>
              {expiryStatus.text}
            </Tag>
          </div>
        )
      },
    },
    {
      title: 'Status',
      key: 'status',
      render: (_, record) => {
        const expiryStatus = getExpiryStatus(record.expiryDate)
        const isLowStock = record.currentStock <= record.minStockLevel
        
        if (expiryStatus.status === 'error') {
          return <Tag color="red" icon={<ExclamationCircleOutlined />}>Expired</Tag>
        } else if (expiryStatus.status === 'warning' || isLowStock) {
          return <Tag color="orange" icon={<WarningOutlined />}>Warning</Tag>
        } else {
          return <Tag color="green">{record.status}</Tag>
        }
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Edit
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => {
              showDeleteConfirm({
                title: 'Delete Medicine?',
                itemName: `medicine "${record.name}"`,
                onConfirm: () => handleDelete(record.id)
              })
            }}
          >
            Delete
          </Button>
        </Space>
      ),
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
      <SupplierLayout>
        <div style={{ padding: '32px 24px', background: '#f5f5f5', minHeight: '100vh' }}>
          {/* Verification Status Alert */}
          {user?.verificationStatus !== 'VERIFIED' && (
            <Alert
              message={user?.verificationStatus === 'PENDING' ? 'Account Verification Pending' : 'Account Verification Rejected'}
              description={
                user?.verificationStatus === 'PENDING' 
                  ? 'Your account is pending admin verification. You will be able to add and manage medicines once your account is verified.'
                  : 'Your account verification was rejected. Please contact support for more information. You cannot add new medicines until verification is approved.'
              }
              type={user?.verificationStatus === 'PENDING' ? 'warning' : 'error'}
              icon={<ExclamationCircleOutlined />}
              style={{ 
                marginBottom: 24,
                borderRadius: '12px',
                border: `1px solid ${user?.verificationStatus === 'PENDING' ? '#ffe58f' : '#ffccc7'}`,
                background: user?.verificationStatus === 'PENDING' ? '#fffbe6' : '#fff1f0'
              }}
              showIcon
            />
          )}

          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <Title level={2} style={{ margin: 0 }}>My Medicines</Title>
            <Button
              type="primary"
              disabled={user?.verificationStatus !== 'VERIFIED'}
              icon={<PlusOutlined />}
              size="large"
              onClick={handleAdd}
            >
              Add Medicine
            </Button>
          </div>

          {/* Stats Cards */}
          <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
            <Col xs={24} sm={12} lg={6}>
              <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <Statistic
                  title="Total Medicines"
                  value={stats.totalMedicines}
                  styles={{ content: { color: '#1890ff' } }}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <Statistic
                  title="Low Stock"
                  value={stats.lowStock}
                  styles={{ content: { color: '#faad14' } }}
                  prefix={<WarningOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <Statistic
                  title="Near Expiry"
                  value={stats.nearExpiry}
                  styles={{ content: { color: '#ff4d4f' } }}
                  prefix={<ExclamationCircleOutlined />}
                />
              </Card>
            </Col>
            <Col xs={24} sm={12} lg={6}>
              <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <Statistic
                  title="Total Stock Value"
                  value={stats.totalStockValue}
                  prefix="Rs."
                  precision={2}
                  styles={{ content: { color: '#52c41a' } }}
                />
              </Card>
            </Col>
          </Row>

          {/* Alerts */}
          {stats.expired > 0 && (
            <Alert
              message={`You have ${stats.expired} expired medicine(s) in your inventory`}
              type="error"
              icon={<ExclamationCircleOutlined />}
              style={{ marginBottom: 16 }}
              showIcon
            />
          )}
          {stats.nearExpiry > 0 && (
            <Alert
              message={`You have ${stats.nearExpiry} medicine(s) expiring within 30 days`}
              type="warning"
              icon={<WarningOutlined />}
              style={{ marginBottom: 16 }}
              showIcon
            />
          )}
          {stats.lowStock > 0 && (
            <Alert
              message={`You have ${stats.lowStock} medicine(s) with low stock`}
              type="warning"
              icon={<WarningOutlined />}
              style={{ marginBottom: 16 }}
              showIcon
            />
          )}

          {/* Filters */}
          <Card 
            style={{ 
              marginBottom: 16, 
              borderRadius: '16px', 
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              border: '1px solid #e8e8e8'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={10}>
                <Input
                  placeholder="Search..."
                  prefix={<SearchOutlined style={{ color: '#667eea' }} />}
                  value={searchText}
                  onChange={(e) => setSearchText(e.target.value)}
                  allowClear
                  size="large"
                  style={{
                    borderRadius: '12px',
                    border: '2px solid #e8e8e8',
                    transition: 'all 0.3s ease'
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#667eea'
                    e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)'
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#e8e8e8'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </Col>
              <Col xs={24} sm={12} md={7}>
                <Select
                  placeholder="Category"
                  style={{ 
                    width: '100%',
                    borderRadius: '12px'
                  }}
                  value={categoryFilter}
                  onChange={(value) => setCategoryFilter(value)}
                  size="large"
                >
                  <Option value="ALL">
                    <span style={{ fontWeight: 500, color: '#667eea' }}>All Medicines</span>
                  </Option>
                  {categories
                    .sort((a, b) => {
                      if (a.name.toUpperCase() === 'OTHER') return 1
                      if (b.name.toUpperCase() === 'OTHER') return -1
                      return a.name.localeCompare(b.name)
                    })
                    .map((cat) => (
                      <Option key={cat.id} value={cat.name.toUpperCase()}>
                        {cat.icon && <span style={{ marginRight: '8px' }}>{cat.icon}</span>}
                        {cat.name}
                      </Option>
                    ))}
                </Select>
              </Col>
              <Col xs={24} sm={12} md={7}>
                <Select
                  placeholder="Status"
                  style={{ 
                    width: '100%',
                    borderRadius: '12px'
                  }}
                  allowClear
                  value={statusFilter}
                  onChange={setStatusFilter}
                  size="large"
                >
                  <Option value="AVAILABLE">Available</Option>
                  <Option value="LOW_STOCK">Low Stock</Option>
                  <Option value="OUT_OF_STOCK">Out of Stock</Option>
                </Select>
              </Col>
            </Row>
          </Card>

          {/* Medicines Table */}
          <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
            <Table
              columns={columns}
              dataSource={filteredMedicines}
              loading={loading}
              rowKey="id"
              pagination={{
                pageSize: 10,
                showSizeChanger: true,
                showTotal: (total) => `Total ${total} medicines`,
              }}
            />
          </Card>

          {/* Add/Edit Modal */}
          <Modal
            title={editingMedicine ? 'Edit Medicine' : 'Add Medicine'}
            open={isModalVisible}
            onCancel={() => {
              setIsModalVisible(false)
              form.resetFields()
            }}
            footer={null}
            width={800}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
            >
              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="name"
                    label="Medicine Name"
                    rules={[{ required: true, message: 'Please enter medicine name' }]}
                  >
                    <Input placeholder="Enter medicine name" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="genericName"
                    label="Generic Name"
                    rules={[{ required: true, message: 'Please enter generic name' }]}
                  >
                    <Input placeholder="Enter generic name" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="category"
                    label="Category"
                    rules={[{ required: true, message: 'Please select category' }]}
                  >
                    <Select placeholder="Select category">
                      <Option value="ANTIBIOTIC">Antibiotic</Option>
                      <Option value="PAINKILLER">Painkiller</Option>
                      <Option value="VITAMIN">Vitamin</Option>
                      <Option value="ANTISEPTIC">Antiseptic</Option>
                      <Option value="HERBAL">Herbal</Option>
                      <Option value="OTHER">Other</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="manufacturer"
                    label="Manufacturer"
                    rules={[{ required: true, message: 'Please enter manufacturer' }]}
                  >
                    <Input placeholder="Enter manufacturer" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={12}>
                  <Form.Item
                    name="batchNumber"
                    label="Batch Number"
                    rules={[{ required: true, message: 'Please enter batch number' }]}
                  >
                    <Input placeholder="Enter batch number" />
                  </Form.Item>
                </Col>
                <Col span={12}>
                  <Form.Item
                    name="expiryDate"
                    label="Expiry Date"
                    rules={[{ required: true, message: 'Please select expiry date' }]}
                  >
                    <DatePicker style={{ width: '100%' }} format="YYYY-MM-DD" />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col span={8}>
                  <Form.Item
                    name="unitPrice"
                    label="Unit Price (Rs.)"
                    rules={[{ required: true, message: 'Please enter unit price' }]}
                  >
                    <InputNumber style={{ width: '100%' }} min={0} step={0.01} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="currentStock"
                    label="Current Stock"
                    rules={[{ required: true, message: 'Please enter current stock' }]}
                  >
                    <InputNumber style={{ width: '100%' }} min={0} />
                  </Form.Item>
                </Col>
                <Col span={8}>
                  <Form.Item
                    name="minStockLevel"
                    label="Min Stock Level"
                    rules={[{ required: true, message: 'Please enter min stock level' }]}
                  >
                    <InputNumber style={{ width: '100%' }} min={0} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item
                name="description"
                label="Description"
              >
                <TextArea rows={4} placeholder="Enter description" />
              </Form.Item>

              <Form.Item
                name="imageUrl"
                label="Medicine Image"
                extra="Upload a clear image of the medicine. Max size: 10MB"
              >
                <Space direction="vertical" style={{ width: '100%' }} size="middle">
                  <Upload
                    accept="image/*"
                    beforeUpload={handleImageUpload}
                    showUploadList={false}
                    disabled={imageUploading}
                  >
                    <Button
                      icon={<UploadOutlined />}
                      loading={imageUploading}
                    >
                      {imageUploading ? 'Uploading...' : 'Select Image'}
                    </Button>
                  </Upload>

                  {imagePreview ? (
                    <Card
                      size="small"
                      style={{
                        maxWidth: '300px',
                        borderRadius: '8px',
                        overflow: 'hidden'
                      }}
                    >
                      <Space direction="vertical" size="small" style={{ width: '100%' }}>
                        <Text type="secondary" style={{ fontSize: '12px' }}>Image Preview:</Text>
                        <Image
                          src={imagePreview}
                          alt="Medicine preview"
                          style={{
                            width: '100%',
                            height: 'auto',
                            maxHeight: '200px',
                            objectFit: 'contain',
                            borderRadius: '4px'
                          }}
                        />
                        <Button
                          danger
                          size="small"
                          onClick={() => {
                            setImagePreview(null)
                            setImageUrl('')
                            form.setFieldsValue({ imageUrl: '' })
                          }}
                        >
                          Remove Image
                        </Button>
                      </Space>
                    </Card>
                  ) : (
                    <Card
                      size="small"
                      style={{
                        maxWidth: '300px',
                        borderRadius: '8px',
                        background: '#f5f5f5',
                        borderStyle: 'dashed'
                      }}
                    >
                      <Space direction="vertical" align="center" style={{ width: '100%', padding: '16px' }}>
                        <PictureOutlined style={{ fontSize: '32px', color: '#999' }} />
                        <Text type="secondary" style={{ fontSize: '12px' }}>No image uploaded yet</Text>
                      </Space>
                    </Card>
                  )}
                </Space>
              </Form.Item>

              <Form.Item>
                <Space>
                  <Button type="primary" htmlType="submit">
                    {editingMedicine ? 'Update' : 'Add'} Medicine
                  </Button>
                  <Button onClick={() => {
                    setIsModalVisible(false)
                    form.resetFields()
                    setImageUrl('')
                    setImagePreview(null)
                  }}>
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </SupplierLayout>
    </ConfigProvider>
  )
}

export default SupplierMedicineManagement
