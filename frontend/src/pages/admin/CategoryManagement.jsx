import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import axios from 'axios'
import toast from 'react-hot-toast'
import { 
  Card, 
  Table, 
  Button, 
  Modal, 
  Form, 
  Input, 
  Space, 
  Typography, 
  Tag,
  Empty
} from 'antd'
import { showDeleteConfirm } from '../../utils/modalConfig.jsx'
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined 
} from '@ant-design/icons'
import { ConfigProvider } from 'antd'

const { Title, Text } = Typography

const CategoryManagement = () => {
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(false)
  const [modalVisible, setModalVisible] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)
  const [form] = Form.useForm()

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/categories', { params: { activeOnly: false } })
      setCategories(response.data)
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      toast.error('Failed to load categories')
    } finally {
      setLoading(false)
    }
  }

  const handleAdd = () => {
    setEditingCategory(null)
    form.resetFields()
    setModalVisible(true)
  }

  const handleEdit = (category) => {
    setEditingCategory(category)
    form.setFieldsValue({
      name: category.name,
      icon: category.icon || '',
      description: category.description || ''
    })
    setModalVisible(true)
  }

  const handleDelete = async (id) => {
    try {
      await axios.delete(`/api/categories/${id}`)
      toast.success('Category deleted successfully')
      fetchCategories()
    } catch (error) {
      console.error('Failed to delete category:', error)
      toast.error('Failed to delete category')
    }
  }

  const handleSubmit = async (values) => {
    try {
      if (editingCategory) {
        await axios.put(`/api/categories/${editingCategory.id}`, values)
        toast.success('Category updated successfully')
      } else {
        await axios.post('/api/categories', values)
        toast.success('Category created successfully')
      }
      setModalVisible(false)
      form.resetFields()
      fetchCategories()
    } catch (error) {
      console.error('Failed to save category:', error)
      const errorMessage = error.response?.data?.message || 'Failed to save category'
      toast.error(errorMessage)
    }
  }

  const columns = [
    {
      title: 'Icon',
      dataIndex: 'icon',
      key: 'icon',
      width: 80,
      render: (icon) => icon ? <span style={{ fontSize: '24px' }}>{icon}</span> : '-'
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      render: (text) => <Text strong>{text}</Text>
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      width: 100,
      render: (active) => (
        <Tag color={active ? 'success' : 'default'}>
          {active ? 'Active' : 'Inactive'}
        </Tag>
      )
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 150,
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
                title: 'Delete Category?',
                itemName: `category "${record.name}"`,
                additionalWarning: 'This will deactivate the category.',
                onConfirm: () => handleDelete(record.id)
              })
            }}
          >
            Delete
          </Button>
        </Space>
      )
    }
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
          width: '100%'
        }}>
          <div style={{ marginBottom: 32 }}>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center'
            }}>
              <div>
                <Title level={2} style={{ margin: 0, color: '#1a1a1a', fontWeight: 700, fontSize: '28px' }}>
                  Category Management
                </Title>
                <Text type="secondary" style={{ fontSize: '15px', marginTop: '8px', display: 'block' }}>
                  Manage medicine categories and their settings
                </Text>
              </div>
              <Button
                type="primary"
                icon={<PlusOutlined />}
                onClick={handleAdd}
                size="large"
                style={{ 
                  borderRadius: '12px',
                  height: '44px',
                  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)',
                  fontWeight: 500
                }}
              >
                Add Category
              </Button>
            </div>
          </div>

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
              dataSource={categories}
              rowKey="id"
              loading={loading}
              pagination={{ pageSize: 10 }}
              locale={{
                emptyText: (
                  <Empty
                    description="No categories found"
                    image={Empty.PRESENTED_IMAGE_SIMPLE}
                  />
                )
              }}
            />
          </Card>

          <Modal
            title={<span style={{ fontSize: '20px', fontWeight: 600 }}>{editingCategory ? 'Edit Category' : 'Add Category'}</span>}
            open={modalVisible}
            onCancel={() => {
              setModalVisible(false)
              form.resetFields()
            }}
            footer={null}
            width={600}
            style={{ borderRadius: '16px' }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              style={{ marginTop: '24px' }}
            >
              <Form.Item
                label="Category Name"
                name="name"
                rules={[
                  { required: true, message: 'Please enter category name' },
                  { min: 2, message: 'Name must be at least 2 characters' }
                ]}
              >
                <Input 
                  placeholder="e.g., Antibiotic, Painkiller" 
                  size="large"
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item
                label="Icon (Emoji)"
                name="icon"
                help="Enter an emoji or icon symbol (e.g., 🌿, 💊, 🔬)"
              >
                <Input 
                  placeholder="e.g., 🌿" 
                  size="large"
                  maxLength={2}
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item
                label="Description"
                name="description"
              >
                <Input.TextArea 
                  placeholder="Optional description for this category"
                  rows={3}
                  style={{ borderRadius: '8px' }}
                />
              </Form.Item>

              <Form.Item style={{ marginBottom: 0, marginTop: '24px' }}>
                <Space>
                  <Button
                    type="primary"
                    htmlType="submit"
                    size="large"
                    style={{ borderRadius: '8px' }}
                  >
                    {editingCategory ? 'Update' : 'Create'}
                  </Button>
                  <Button
                    onClick={() => {
                      setModalVisible(false)
                      form.resetFields()
                    }}
                    size="large"
                    style={{ borderRadius: '8px' }}
                  >
                    Cancel
                  </Button>
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </AdminLayout>
    </ConfigProvider>
  )
}

export default CategoryManagement

