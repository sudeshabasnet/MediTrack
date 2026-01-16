import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import PharmacyLayout from '../../components/layout/PharmacyLayout'
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
  Upload,
  Image,
  Descriptions
} from 'antd'
import {
  SearchOutlined,
  WarningOutlined,
  ExclamationCircleOutlined,
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
  MedicineBoxOutlined,
  ShoppingCartOutlined,
  InboxOutlined,
  FileTextOutlined,
  UploadOutlined,
  SyncOutlined,
  EyeOutlined,
  PictureOutlined,
  SaveOutlined
} from '@ant-design/icons'
import { Link } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { ConfigProvider } from 'antd'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { Option } = Select

const PharmacyInventoryManagement = ({ viewMode = 'dashboard' }) => {
  const navigate = useNavigate()
  const location = useLocation()
  const { user } = useAuth()
  const [medicines, setMedicines] = useState([])
  const [filteredMedicines, setFilteredMedicines] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [categoryFilter, setCategoryFilter] = useState(null)
  const [statusFilter, setStatusFilter] = useState(null)
  const [stats, setStats] = useState({
    totalMedicines: 0,
    lowStock: 0,
    nearExpiry: 0,
    expired: 0
  })
  const [dashboardStats, setDashboardStats] = useState({
    availableMedicines: 0,
    myOrders: 0,
    pendingOrders: 0
  })
  const [isModalVisible, setIsModalVisible] = useState(false)
  const [editingMedicine, setEditingMedicine] = useState(null)
  const [form] = Form.useForm()
  const [allMedicines, setAllMedicines] = useState([]) // All medicines (manual + purchased)
  const [purchasedStock, setPurchasedStock] = useState([]) // Only purchased from orders
  const [manualStock, setManualStock] = useState([]) // Manually added by pharmacy
  const [imageFileList, setImageFileList] = useState([]) // For image upload
  const [categories, setCategories] = useState([]) // Dynamic categories from backend

  useEffect(() => {
    fetchInventory()
    fetchDashboardStats()
    fetchCategories()

    // Check for filter parameter in URL
    const params = new URLSearchParams(location.search)
    const filterParam = params.get('filter')
    if (filterParam) {
      setStatusFilter(filterParam)
    }
  }, [location.search, viewMode])

  useEffect(() => {
    filterMedicines()
  }, [medicines, searchText, categoryFilter, statusFilter, viewMode])

  const fetchInventory = async () => {
    setLoading(true)
    try {
      // Determine source filter based on viewMode
      let params = {};
      if (viewMode === 'purchased') {
        params.source = 'PURCHASED';
      } else if (viewMode === 'all' || viewMode === 'dashboard') {
        // Fetch all inventory items
      }

      // Add status filter if exists
      if (statusFilter) {
        params.filter = statusFilter;
      }

      const response = await axios.get('/api/pharmacy/inventory', { params })
      const inventoryList = response.data || []

      // Separate by source
      const purchased = inventoryList.filter(m => m.source === 'PURCHASED')
      const manual = inventoryList.filter(m => m.source === 'MANUAL')

      setMedicines(inventoryList)
      setPurchasedStock(purchased)
      setManualStock(manual)
      setAllMedicines(inventoryList)
      calculateStats(inventoryList)
    } catch (error) {
      console.error('Failed to fetch inventory:', error)
      toast.error('Failed to load inventory')
    } finally {
      setLoading(false)
    }
  }

  const fetchDashboardStats = async () => {
    try {
      // Fetch available medicines count
      const medicinesResponse = await axios.get('/api/pharmacy/medicines')
      const availableMedicines = medicinesResponse.data?.length || 0

      // Fetch orders
      const ordersResponse = await axios.get('/api/orders')
      const orders = ordersResponse.data || []
      const myOrders = orders.length
      const pendingOrders = orders.filter(order => order.status === 'PENDING').length

      setDashboardStats({
        availableMedicines,
        myOrders,
        pendingOrders
      })
    } catch (error) {
      console.error('Failed to fetch dashboard stats:', error)
    }
  }

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories?activeOnly=true')
      setCategories(response.data || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      toast.error('Failed to load categories')
    }
  }

  const syncPurchasedOrders = async () => {
    try {
      setLoading(true);
      const response = await axios.post('/api/pharmacy/inventory/sync-orders');
      toast.success(response.data.message || 'Orders synced successfully!');
      fetchInventory(); // Refresh inventory
    } catch (error) {
      console.error('Failed to sync orders:', error);
      toast.error('Failed to sync orders. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  const calculateStats = (medList) => {
    const today = dayjs()
    const thirtyDaysFromNow = dayjs().add(30, 'days')

    const stats = {
      totalMedicines: medList.length,
      lowStock: medList.filter(m => (m.currentStock || m.quantity) <= (m.minStockLevel || 10)).length,
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
    // Start with different base data depending on viewMode
    let filtered = []
    if (viewMode === 'purchased') {
      filtered = [...purchasedStock]
    } else if (viewMode === 'all') {
      filtered = [...allMedicines]
    } else {
      // dashboard mode
      filtered = [...medicines]
    }

    if (searchText) {
      filtered = filtered.filter(m =>
        m.name?.toLowerCase().includes(searchText.toLowerCase()) ||
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
        if (statusFilter === 'low_stock') {
          const stock = m.currentStock !== undefined ? m.currentStock : (m.quantity || 0)
          const minStock = m.minStockLevel || 10
          return stock <= minStock
        }
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

  const getPageTitle = () => {
    switch (viewMode) {
      case 'all':
        return { title: 'All Medicines', desc: 'View and manage all medicines in your inventory - both purchased and manually added.' }
      case 'add':
        return { title: 'Add Medicine', desc: 'Add new medicines to your inventory manually.' }
      case 'purchased':
        return { title: 'Purchased Stock', desc: 'Track medicines purchased through orders from suppliers.' }
      default:
        return { title: 'Inventory Dashboard', desc: `Welcome back, ${user?.fullName || 'Pharmacy'}! Monitor your inventory and manage your pharmacy operations.` }
    }
  }

  // State for view details modal
  const [selectedMedicine, setSelectedMedicine] = useState(null);
  const [detailsModalVisible, setDetailsModalVisible] = useState(false);
  const [editingStock, setEditingStock] = useState(false);
  const [newStock, setNewStock] = useState(0);

  const handleViewDetails = (medicine) => {
    setSelectedMedicine(medicine);
    setNewStock(medicine.currentStock || medicine.quantity || 0);
    setDetailsModalVisible(true);
  };

  const handleStockUpdate = async () => {
    try {
      setLoading(true);
      await axios.put(`/api/pharmacy/inventory/${selectedMedicine.id}`, {
        currentStock: newStock
      });
      toast.success('Stock updated successfully!');
      setDetailsModalVisible(false);
      setEditingStock(false);
      fetchInventory();
    } catch (error) {
      console.error('Failed to update stock:', error);
      toast.error('Failed to update stock. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Image',
      dataIndex: 'imageUrl',
      key: 'imageUrl',
      width: 80,
      render: (imageUrl) => (
        <div style={{ width: 60, height: 60, display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', borderRadius: 8, overflow: 'hidden' }}>
          {imageUrl ? (
            <img
              src={imageUrl}
              alt="Medicine"
              style={{ width: '100%', height: '100%', objectFit: 'cover' }}
            />
          ) : (
            <PictureOutlined style={{ fontSize: 24, color: '#bfbfbf' }} />
          )}
        </div>
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
            Batch: {record.batchNumber || 'N/A'}
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
      title: 'Quantity',
      dataIndex: 'currentStock',
      key: 'currentStock',
      render: (currentStock, record) => {
        const stock = currentStock || record.quantity || 0;
        const minStock = record.minStockLevel || 10;
        return (
          <Tag color={stock <= minStock ? 'red' : 'green'}>
            {stock} units
          </Tag>
        );
      },
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
        const isLowStock = record.quantity <= 10

        if (expiryStatus.status === 'error') {
          return <Tag color="red" icon={<ExclamationCircleOutlined />}>Expired</Tag>
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
          size="small"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record)}
        >
          View Details
        </Button>
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
      <PharmacyLayout>
        <div style={{ padding: '32px 24px', background: '#f5f5f5', minHeight: '100vh' }}>
          {/* Title */}
          <div style={{ marginBottom: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <Title level={2} style={{ margin: 0, color: '#1a1a1a', fontWeight: 600 }}>{getPageTitle().title}</Title>
              <Text type="secondary" style={{ fontSize: '14px', marginTop: '8px', display: 'block' }}>
                {getPageTitle().desc}
              </Text>
            </div>
            {viewMode === 'purchased' && (
              <Button
                type="primary"
                icon={<SyncOutlined />}
                onClick={syncPurchasedOrders}
                loading={loading}
                style={{ marginLeft: 16 }}
              >
                Sync Orders
              </Button>
            )}
          </div>

          {/* Verification Status Alert */}
          {user?.verificationStatus === 'PENDING' && (
            <Alert
              message="Account Verification Pending"
              description="Your account is pending admin verification. Some features may be limited until your account is verified."
              type="warning"
              icon={<ExclamationCircleOutlined />}
              style={{
                marginBottom: 24,
                borderRadius: '12px',
                border: '1px solid #ffe58f',
                background: '#fffbe6'
              }}
              showIcon
            />
          )}
          {user?.verificationStatus === 'REJECTED' && (
            <Alert
              message="Account Verification Rejected"
              description="Your account verification was rejected. Please contact support for more information."
              type="error"
              icon={<ExclamationCircleOutlined />}
              style={{
                marginBottom: 24,
                borderRadius: '12px',
                border: '1px solid #ffccc7',
                background: '#fff1f0'
              }}
              showIcon
            />
          )}

          {/* Dashboard Overview Stats Cards - Only show in dashboard mode */}
          {viewMode === 'dashboard' && (
            <>
              <Row gutter={[20, 20]} style={{ marginBottom: 24 }}>
                <Col xs={24} sm={12} lg={8}>
                  <Card
                    hoverable
                    style={{
                      borderRadius: '16px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                      border: '1px solid #e8e8e8',
                      background: 'linear-gradient(135deg, #e3f2fd 0%, #ffffff 100%)',
                      transition: 'all 0.3s ease'
                    }}
                    bodyStyle={{ padding: '24px' }}
                  >
                    <Statistic
                      title={<span style={{ color: '#595959', fontSize: '14px' }}>Available Medicines</span>}
                      value={dashboardStats.availableMedicines}
                      prefix={<MedicineBoxOutlined style={{ color: '#1890ff', fontSize: '24px' }} />}
                      valueStyle={{ color: '#1890ff', fontSize: '32px', fontWeight: 700 }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Card
                    hoverable
                    style={{
                      borderRadius: '16px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                      border: '1px solid #e8e8e8',
                      background: 'linear-gradient(135deg, #e8f5e9 0%, #ffffff 100%)',
                      transition: 'all 0.3s ease'
                    }}
                    bodyStyle={{ padding: '24px' }}
                  >
                    <Statistic
                      title={<span style={{ color: '#595959', fontSize: '14px' }}>My Orders</span>}
                      value={dashboardStats.myOrders}
                      prefix={<ShoppingCartOutlined style={{ color: '#52c41a', fontSize: '24px' }} />}
                      valueStyle={{ color: '#52c41a', fontSize: '32px', fontWeight: 700 }}
                    />
                  </Card>
                </Col>
                <Col xs={24} sm={12} lg={8}>
                  <Card
                    hoverable
                    style={{
                      borderRadius: '16px',
                      boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                      border: '1px solid #e8e8e8',
                      background: 'linear-gradient(135deg, #fff3e0 0%, #ffffff 100%)',
                      transition: 'all 0.3s ease'
                    }}
                    bodyStyle={{ padding: '24px' }}
                  >
                    <Statistic
                      title={<span style={{ color: '#595959', fontSize: '14px' }}>Pending Orders</span>}
                      value={dashboardStats.pendingOrders}
                      prefix={<InboxOutlined style={{ color: '#faad14', fontSize: '24px' }} />}
                      valueStyle={{ color: '#faad14', fontSize: '32px', fontWeight: 700 }}
                    />
                  </Card>
                </Col>
              </Row>

              {/* Quick Actions */}
              <Card
                title={<span style={{ fontSize: '18px', fontWeight: 600, color: '#1a1a1a' }}>Quick Actions</span>}
                style={{
                  borderRadius: '16px',
                  boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
                  border: '1px solid #e8e8e8',
                  marginBottom: 24
                }}
                bodyStyle={{ padding: '24px' }}
              >
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} lg={8}>
                    <Link to="/pharmacy/medicines">
                      <Button
                        type="primary"
                        icon={<SearchOutlined />}
                        block
                        size="large"
                        style={{
                          height: 64,
                          borderRadius: '12px',
                          fontSize: '16px',
                          fontWeight: 500,
                          boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.transform = 'translateY(-2px)'
                          e.currentTarget.style.boxShadow = '0 6px 16px rgba(102, 126, 234, 0.4)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.transform = 'translateY(0)'
                          e.currentTarget.style.boxShadow = '0 4px 12px rgba(102, 126, 234, 0.3)'
                        }}
                      >
                        Browse Medicines
                      </Button>
                    </Link>
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <a href="#inventory-management">
                      <Button
                        type="default"
                        icon={<MedicineBoxOutlined />}
                        block
                        size="large"
                        style={{
                          height: 64,
                          borderRadius: '12px',
                          fontSize: '16px',
                          fontWeight: 500,
                          border: '2px solid #e8e8e8',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#667eea'
                          e.currentTarget.style.color = '#667eea'
                          e.currentTarget.style.transform = 'translateY(-2px)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e8e8e8'
                          e.currentTarget.style.color = 'inherit'
                          e.currentTarget.style.transform = 'translateY(0)'
                        }}
                      >
                        Manage Inventory
                      </Button>
                    </a>
                  </Col>
                  <Col xs={24} sm={12} lg={8}>
                    <Link to="/user/orders">
                      <Button
                        type="default"
                        icon={<FileTextOutlined />}
                        block
                        size="large"
                        style={{
                          height: 64,
                          borderRadius: '12px',
                          fontSize: '16px',
                          fontWeight: 500,
                          border: '2px solid #e8e8e8',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.borderColor = '#667eea'
                          e.currentTarget.style.color = '#667eea'
                          e.currentTarget.style.transform = 'translateY(-2px)'
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.borderColor = '#e8e8e8'
                          e.currentTarget.style.color = 'inherit'
                          e.currentTarget.style.transform = 'translateY(0)'
                        }}
                      >
                        View Orders
                      </Button>
                    </Link>
                  </Col>
                </Row>
              </Card>

              {/* Inventory Management Section */}
              <div id="inventory-management">
                <Title level={3} style={{ marginBottom: 16 }}>Inventory Management</Title>
              </div>
            </>
          )}

          {/* Add Medicine Form - Only show in add mode */}
          {viewMode === 'add' && (
            <Card style={{ borderRadius: 16, marginBottom: 24 }}>
              <Form
                form={form}
                layout="vertical"
                onFinish={async (values) => {
                  try {
                    setLoading(true);
                    const medicineData = {
                      name: values.name,
                      category: values.category,
                      genericName: values.genericName || null,
                      manufacturer: values.manufacturer || null,
                      description: values.description || null,
                      unitPrice: values.price,
                      currentStock: values.currentStock,
                      minStockLevel: 10,
                      expiryDate: values.expiryDate ? values.expiryDate.format('YYYY-MM-DD') : null,
                      batchNumber: values.batchNumber || null,
                      imageUrl: imageFileList.length > 0 ? imageFileList[0].thumbUrl || imageFileList[0].url : null
                    };

                    console.log('Sending medicine data:', medicineData);
                    const response = await axios.post('/api/pharmacy/inventory', medicineData);
                    console.log('Response:', response.data);
                    toast.success('Medicine added successfully!');
                    form.resetFields();
                    setImageFileList([]);
                    fetchInventory(); // Refresh inventory list
                  } catch (error) {
                    console.error('Failed to add medicine:', error);
                    console.error('Error response:', error.response);
                    const errorMessage = error.response?.data?.message || error.message || 'Failed to add medicine. Please try again.';
                    toast.error(errorMessage);
                  } finally {
                    setLoading(false);
                  }
                }}
              >
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Medicine Name"
                      name="name"
                      rules={[{ required: true, message: 'Please enter medicine name' }]}
                    >
                      <Input placeholder="Enter medicine name" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Category"
                      name="category"
                      rules={[{ required: true, message: 'Please select category' }]}
                    >
                      <Select placeholder="Select category">
                        {categories.map(category => (
                          <Option key={category.id} value={category.name}>
                            {category.icon && `${category.icon} `}{category.name}
                          </Option>
                        ))}
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Current Stock"
                      name="currentStock"
                      rules={[{ required: true, message: 'Please enter stock' }]}
                    >
                      <InputNumber min={0} style={{ width: '100%' }} placeholder="Stock quantity" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Unit Price"
                      name="price"
                      rules={[{ required: true, message: 'Please enter price' }]}
                    >
                      <InputNumber min={0} style={{ width: '100%' }} placeholder="Price" prefix="Rs" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={8}>
                    <Form.Item
                      label="Batch Number"
                      name="batchNumber"
                    >
                      <Input placeholder="Batch number" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Expiry Date"
                      name="expiryDate"
                      rules={[{ required: true, message: 'Please select expiry date' }]}
                    >
                      <DatePicker style={{ width: '100%' }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      label="Manufacturer"
                      name="manufacturer"
                    >
                      <Input placeholder="Manufacturer name" />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item
                      label="Description"
                      name="description"
                    >
                      <Input.TextArea rows={3} placeholder="Enter description" />
                    </Form.Item>
                  </Col>
                  <Col xs={24}>
                    <Form.Item
                      label="Product Image"
                      name="image"
                      valuePropName="fileList"
                      getValueFromEvent={(e) => {
                        if (Array.isArray(e)) {
                          return e;
                        }
                        return e?.fileList;
                      }}
                    >
                      <Upload
                        listType="picture-card"
                        fileList={imageFileList}
                        onChange={({ fileList }) => setImageFileList(fileList)}
                        beforeUpload={(file) => {
                          const isImage = file.type.startsWith('image/');
                          if (!isImage) {
                            toast.error('You can only upload image files!');
                            return Upload.LIST_IGNORE;
                          }
                          const isLt5M = file.size / 1024 / 1024 < 5;
                          if (!isLt5M) {
                            toast.error('Image must be smaller than 5MB!');
                            return Upload.LIST_IGNORE;
                          }
                          // Convert to base64 for preview
                          const reader = new FileReader();
                          reader.readAsDataURL(file);
                          reader.onload = () => {
                            const newFile = {
                              uid: file.uid,
                              name: file.name,
                              status: 'done',
                              url: reader.result,
                              thumbUrl: reader.result,
                            };
                            setImageFileList([newFile]);
                          };
                          return false; // Prevent auto upload
                        }}
                        onRemove={() => {
                          setImageFileList([]);
                        }}
                        maxCount={1}
                      >
                        {imageFileList.length === 0 && (
                          <div>
                            <PlusOutlined />
                            <div style={{ marginTop: 8 }}>Upload Image</div>
                          </div>
                        )}
                      </Upload>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        Upload product image (Max 5MB, JPG/PNG)
                      </Text>
                    </Form.Item>
                  </Col>
                </Row>
                <Form.Item>
                  <Space>
                    <Button type="primary" htmlType="submit" icon={<PlusOutlined />}>
                      Add Medicine
                    </Button>
                    <Button onClick={() => {
                      form.resetFields();
                      setImageFileList([]);
                    }}>
                      Reset
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            </Card>
          )}

          {/* Inventory Stats Cards - Show in dashboard and listing modes */}
          {(viewMode === 'dashboard' || viewMode === 'all' || viewMode === 'purchased') && (
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
                    title="Expired"
                    value={stats.expired}
                    styles={{ content: { color: '#cf1322' } }}
                    prefix={<ExclamationCircleOutlined />}
                  />
                </Card>
              </Col>
            </Row>
          )}

          {/* Alerts - Show in dashboard and listing modes */}
          {(viewMode === 'dashboard' || viewMode === 'all' || viewMode === 'purchased') && (
            <div>
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
              <Card style={{ marginBottom: 16, borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <Row gutter={[16, 16]}>
                  <Col xs={24} sm={12} md={8}>
                    <Input
                      placeholder="Search medicines..."
                      prefix={<SearchOutlined />}
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      allowClear
                    />
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Select
                      placeholder="Filter by Category"
                      style={{ width: '100%' }}
                      allowClear
                      value={categoryFilter}
                      onChange={setCategoryFilter}
                    >
                      {categories.map(category => (
                        <Option key={category.id} value={category.name}>
                          {category.icon && `${category.icon} `}{category.name}
                        </Option>
                      ))}
                    </Select>
                  </Col>
                  <Col xs={24} sm={12} md={8}>
                    <Select
                      placeholder="Filter by Status"
                      style={{ width: '100%' }}
                      allowClear
                      value={statusFilter}
                      onChange={setStatusFilter}
                    >
                      <Option value="low_stock">Low Stock</Option>
                      <Option value="near_expiry">Near Expiry</Option>
                      <Option value="expired">Expired</Option>
                    </Select>
                  </Col>
                </Row>
              </Card>

              {/* Inventory Table */}
              <Card style={{ borderRadius: 12, boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
                <Table
                  columns={columns}
                  dataSource={filteredMedicines}
                  loading={loading}
                  rowKey={(record) => `${record.id}-${record.batchNumber || 'default'}`}
                  pagination={{
                    pageSize: 10,
                    showSizeChanger: true,
                    showTotal: (total) => `Total ${total} medicines`,
                  }}
                />
              </Card>
            </div>
          )}

          {/* Medicine Details Modal */}
          <Modal
            title={<span><EyeOutlined style={{ marginRight: 8 }} />Medicine Details</span>}
            open={detailsModalVisible}
            onCancel={() => {
              setDetailsModalVisible(false);
              setEditingStock(false);
            }}
            footer={[
              <Button key="close" onClick={() => {
                setDetailsModalVisible(false);
                setEditingStock(false);
              }}>
                Close
              </Button>,
              !editingStock && (
                <Button
                  key="edit"
                  type="primary"
                  icon={<EditOutlined />}
                  onClick={() => setEditingStock(true)}
                >
                  Edit Stock
                </Button>
              ),
              editingStock && (
                <Button
                  key="save"
                  type="primary"
                  icon={<SaveOutlined />}
                  onClick={handleStockUpdate}
                  loading={loading}
                >
                  Save Changes
                </Button>
              ),
            ]}
            width={700}
          >
            {selectedMedicine && (
              <div>
                <Row gutter={[24, 24]}>
                  {/* Medicine Image */}
                  <Col span={24} style={{ textAlign: 'center' }}>
                    <div style={{
                      width: '200px',
                      height: '200px',
                      margin: '0 auto',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      background: '#f5f5f5',
                      borderRadius: 12,
                      overflow: 'hidden',
                      border: '1px solid #e8e8e8'
                    }}>
                      {selectedMedicine.imageUrl ? (
                        <img
                          src={selectedMedicine.imageUrl}
                          alt={selectedMedicine.name}
                          style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                        />
                      ) : (
                        <PictureOutlined style={{ fontSize: 64, color: '#bfbfbf' }} />
                      )}
                    </div>
                  </Col>

                  {/* Medicine Details */}
                  <Col span={24}>
                    <Card style={{ background: '#fafafa', border: 'none' }}>
                      <Descriptions column={2} bordered size="small">
                        <Descriptions.Item label="Medicine Name" span={2}>
                          <Text strong style={{ fontSize: 16 }}>{selectedMedicine.name}</Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Category">
                          <Tag color="blue">{selectedMedicine.category}</Tag>
                        </Descriptions.Item>
                        <Descriptions.Item label="Batch Number">
                          {selectedMedicine.batchNumber || 'N/A'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Generic Name" span={2}>
                          {selectedMedicine.genericName || 'N/A'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Manufacturer" span={2}>
                          {selectedMedicine.manufacturer || 'N/A'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Unit Price">
                          <Text strong style={{ color: '#1890ff', fontSize: 16 }}>
                            Rs {selectedMedicine.unitPrice || 0}
                          </Text>
                        </Descriptions.Item>
                        <Descriptions.Item label="Current Stock">
                          {editingStock ? (
                            <Space>
                              <InputNumber
                                min={0}
                                value={newStock}
                                onChange={setNewStock}
                                style={{ width: 120 }}
                              />
                              <Text type="secondary">units</Text>
                            </Space>
                          ) : (
                            <Tag color={selectedMedicine.currentStock <= 10 ? 'red' : 'green'} style={{ fontSize: 14 }}>
                              {selectedMedicine.currentStock || selectedMedicine.quantity || 0} units
                            </Tag>
                          )}
                        </Descriptions.Item>
                        <Descriptions.Item label="Min Stock Level">
                          {selectedMedicine.minStockLevel || 10} units
                        </Descriptions.Item>
                        <Descriptions.Item label="Expiry Date">
                          {selectedMedicine.expiryDate ? (
                            <>
                              {dayjs(selectedMedicine.expiryDate).format('YYYY-MM-DD')}
                              <br />
                              <Tag color={getExpiryStatus(selectedMedicine.expiryDate).status === 'error' ? 'red' :
                                getExpiryStatus(selectedMedicine.expiryDate).status === 'warning' ? 'orange' : 'green'}>
                                {getExpiryStatus(selectedMedicine.expiryDate).text}
                              </Tag>
                            </>
                          ) : 'N/A'}
                        </Descriptions.Item>
                        <Descriptions.Item label="Source">
                          <Tag color={selectedMedicine.source === 'PURCHASED' ? 'purple' : 'cyan'}>
                            {selectedMedicine.source === 'PURCHASED' ? '📦 Purchased from Order' : '✋ Manually Added'}
                          </Tag>
                        </Descriptions.Item>
                        {selectedMedicine.description && (
                          <Descriptions.Item label="Description" span={2}>
                            {selectedMedicine.description}
                          </Descriptions.Item>
                        )}
                      </Descriptions>
                    </Card>
                  </Col>
                </Row>
              </div>
            )}
          </Modal>
        </div>
      </PharmacyLayout>
    </ConfigProvider>
  )
}

export default PharmacyInventoryManagement

