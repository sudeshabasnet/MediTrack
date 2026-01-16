import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import AdminLayout from '../../components/layout/AdminLayout'
import axios from 'axios'
import toast from 'react-hot-toast'
import {
  Table,
  Input,
  Select,
  Button,
  Space,
  Tag,
  Typography,
  Card,
  Dropdown
} from 'antd'
import { showDeleteConfirm } from '../../utils/modalConfig.jsx'
import {
  PlusOutlined,
  SearchOutlined,
  EditOutlined,
  DeleteOutlined,
  DownloadOutlined,
  MoreOutlined
} from '@ant-design/icons'
import { ConfigProvider } from 'antd'

const { Title, Text } = Typography

const MedicineManagement = () => {
  const navigate = useNavigate()
  const [medicines, setMedicines] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState({
    category: '',
    status: '',
    supplier: ''
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const itemsPerPage = 10

  useEffect(() => {
    fetchMedicines()
  }, [currentPage, searchTerm, filters])

  const fetchMedicines = async () => {
    try {
      setLoading(true)
      const params = {
        page: currentPage - 1,
        size: itemsPerPage,
        search: searchTerm,
        ...filters
      }
      const response = await axios.get('/api/admin/medicines', { params })
      setMedicines(response.data.content || response.data)
      if (response.data.totalPages) {
        setTotalPages(response.data.totalPages)
      }
    } catch (error) {
      console.error('Failed to fetch medicines:', error)
      toast.error('Failed to fetch medicines')
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/admin/medicines/${id}`)
      toast.success('Medicine deleted successfully')
      fetchMedicines()
    } catch (error) {
      toast.error('Failed to delete medicine')
    }
  }

  const handleExport = async (format) => {
    try {
      const response = await axios.get(`/api/admin/medicines/export?format=${format}`, {
        responseType: 'blob'
      })
      const url = window.URL.createObjectURL(new Blob([response.data]))
      const link = document.createElement('a')
      link.href = url
      link.setAttribute('download', `medicines.${format}`)
      document.body.appendChild(link)
      link.click()
      link.remove()
      toast.success(`Exported successfully as ${format.toUpperCase()}`)
    } catch (error) {
      toast.error('Failed to export medicines')
    }
  }

  const getStatusTag = (status) => {
    const statusColors = {
      AVAILABLE: 'success',
      LOW_STOCK: 'warning',
      OUT_OF_STOCK: 'error'
    }
    return <Tag color={statusColors[status]}>{status.replace('_', ' ')}</Tag>
  }

  const exportMenuItems = [
    {
      key: 'csv',
      label: 'Export CSV',
      icon: <DownloadOutlined />,
      onClick: () => handleExport('csv')
    },
    {
      key: 'pdf',
      label: 'Export PDF',
      icon: <DownloadOutlined />,
      onClick: () => handleExport('pdf')
    },
  ]

  const columns = [
    {
      title: 'Medicine Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Category',
      dataIndex: 'category',
      key: 'category',
    },
    {
      title: 'Generic Name',
      dataIndex: 'genericName',
      key: 'genericName',
    },
    {
      title: 'Manufacturer',
      dataIndex: 'manufacturer',
      key: 'manufacturer',
    },
    {
      title: 'Current Stock',
      dataIndex: 'currentStock',
      key: 'currentStock',
    },
    {
      title: 'Unit Price',
      dataIndex: 'unitPrice',
      key: 'unitPrice',
      render: (price) => `Rs. ${price}`,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => navigate(`/admin/medicines/edit/${record.id}`)}
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
      <AdminLayout>
        <div style={{ 
          background: '#f5f5f5', 
          padding: '24px', 
          borderRadius: '12px', 
          minHeight: 'calc(100vh - 112px)',
          maxWidth: '100%',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          <div style={{ marginBottom: 32 }}>
            <Space style={{ width: '100%', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <Title level={2} style={{ margin: 0, color: '#1a1a1a', fontWeight: 700, fontSize: '28px' }}>
                  Medicine Management
                </Title>
                  <Text type="secondary" style={{ fontSize: '15px', marginTop: '8px', display: 'block' }}>
                  View and manage all medicines in the system (Suppliers add medicines)
                </Text>
              </div>
              <Space>
                <Dropdown menu={{ items: exportMenuItems }} placement="bottomRight">
                  <Button 
                    icon={<DownloadOutlined />}
                    style={{ 
                      borderRadius: '10px',
                      height: '40px'
                    }}
                  >
                    Export <MoreOutlined />
                  </Button>
                </Dropdown>
              </Space>
            </Space>
          </div>

          {/* Filter Section */}
          <Card 
            style={{ 
              borderRadius: '16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              border: 'none',
              background: '#ffffff',
              marginBottom: 24
            }}
            bodyStyle={{ padding: '20px' }}
          >
            <Space wrap size="middle" style={{ width: '100%' }}>
              <Input
                placeholder="Search..."
                prefix={<SearchOutlined style={{ color: '#667eea' }} />}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ 
                  width: 300,
                  borderRadius: '10px',
                  border: '2px solid #e8e8e8'
                }}
                size="large"
                allowClear
              />
              <Select
                placeholder="Category"
                value={filters.category}
                onChange={(value) => setFilters({ ...filters, category: value })}
                style={{ 
                  width: 200,
                  borderRadius: '10px'
                }}
                size="large"
                allowClear
              >
                <Select.Option value="ANTIBIOTIC">Antibiotic</Select.Option>
                <Select.Option value="PAINKILLER">Painkiller</Select.Option>
                <Select.Option value="VITAMIN">Vitamin</Select.Option>
                <Select.Option value="HERBAL">Herbal</Select.Option>
                <Select.Option value="OTHER">Other</Select.Option>
              </Select>
              <Select
                placeholder="Status"
                value={filters.status}
                onChange={(value) => setFilters({ ...filters, status: value })}
                style={{ 
                  width: 200,
                  borderRadius: '10px'
                }}
                size="large"
                allowClear
              >
                <Select.Option value="AVAILABLE">Available</Select.Option>
                <Select.Option value="LOW_STOCK">Low Stock</Select.Option>
                <Select.Option value="OUT_OF_STOCK">Out of Stock</Select.Option>
              </Select>
              <Select
                placeholder="Supplier"
                value={filters.supplier}
                onChange={(value) => setFilters({ ...filters, supplier: value })}
                style={{ 
                  width: 200,
                  borderRadius: '10px'
                }}
                size="large"
                allowClear
              >
                {/* Populate from API */}
              </Select>
            </Space>
          </Card>

          {/* Main Content Card */}
          <Card 
            style={{ 
              borderRadius: '16px',
              boxShadow: '0 4px 16px rgba(0,0,0,0.08)',
              border: 'none',
              background: '#ffffff'
            }}
            bodyStyle={{ padding: '24px' }}
          >
            <Table
              columns={columns}
              dataSource={medicines}
              loading={loading}
              rowKey="id"
              scroll={{ x: 1200 }}
              pagination={{
                current: currentPage,
                total: totalPages * itemsPerPage,
                pageSize: itemsPerPage,
                onChange: (page) => setCurrentPage(page),
                showSizeChanger: false,
              }}
              locale={{
                emptyText: 'No medicines found'
              }}
            />
          </Card>
        </div>
      </AdminLayout>
    </ConfigProvider>
  )
}

export default MedicineManagement
