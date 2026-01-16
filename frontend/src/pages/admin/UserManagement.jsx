import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast from 'react-hot-toast'
import AdminLayout from '../../components/layout/AdminLayout'
import {
  Table,
  Input,
  Select,
  Button,
  Space,
  Tag,
  Typography,
  Card
} from 'antd'
import {
  SearchOutlined,
  DeleteOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  EyeOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import { ConfigProvider } from 'antd'
import { showDeleteConfirm, showConfirmModal } from '../../utils/modalConfig.jsx'

const { Title } = Typography

const UserManagement = () => {
  const navigate = useNavigate()
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [roleFilter, setRoleFilter] = useState('')
  const [currentPage, setCurrentPage] = useState(0)
  const [totalPages, setTotalPages] = useState(0)

  useEffect(() => {
    fetchUsers()
  }, [currentPage, searchTerm, roleFilter])

  const fetchUsers = async () => {
    try {
      setLoading(true)
      const params = {
        page: currentPage,
        size: 10,
        role: roleFilter || undefined,
        search: searchTerm || undefined
      }
      const response = await axios.get('/api/admin/users', { params })
      setUsers(response.data.content || response.data)
      if (response.data.totalPages !== undefined) {
        setTotalPages(response.data.totalPages)
      }
    } catch (error) {
      console.error('Failed to fetch users:', error)
      toast.error('Failed to fetch users')
    } finally {
      setLoading(false)
    }
  }


  const handleActivate = async (id) => {
    try {
      await axios.put(`/api/admin/users/${id}/activate`)
      toast.success('User activated successfully')
      fetchUsers()
    } catch (error) {
      toast.error('Failed to activate user')
    }
  }

  const handleDeactivate = async (id) => {
    try {
      await axios.put(`/api/admin/users/${id}/deactivate`)
      toast.success('User deactivated successfully')
      fetchUsers()
    } catch (error) {
      toast.error('Failed to deactivate user')
    }
  }

  const handleDelete = async (id) => {
    if (!id) {
      toast.error('Invalid user ID')
      return
    }
    
    try {
      const response = await axios.delete(`/api/admin/users/${id}`)
      if (response.status === 200 || response.status === 204) {
        const message = response.data?.message || 'User and all associated records deleted successfully'
        toast.success(message, { duration: 3000 })
        // Refresh the data
        await fetchUsers()
      }
    } catch (error) {
      console.error('Delete error:', error)
      console.error('Error response:', error.response)
      
      let errorMessage = 'Failed to delete user'
      
      if (error.response?.data) {
        if (typeof error.response.data === 'string') {
          errorMessage = error.response.data
        } else if (error.response.data.message) {
          errorMessage = error.response.data.message
        } else if (error.response.data.error) {
          errorMessage = error.response.data.error
        }
      } else if (error.message) {
        errorMessage = error.message
      }
      
      toast.error(errorMessage, { duration: 4000 })
    }
  }

  const getRoleTag = (role) => {
    const roleColors = {
      ADMIN: 'purple',
      SUPPLIER: 'blue',
      PHARMACY: 'green',
      USER: 'default'
    }
    return <Tag color={roleColors[role]}>{role}</Tag>
  }

  const getVerificationStatusTag = (status) => {
    const statusConfig = {
      VERIFIED: { color: 'success', icon: <CheckCircleOutlined />, label: 'Verified' },
      PENDING: { color: 'warning', icon: <ClockCircleOutlined />, label: 'Pending' },
      REJECTED: { color: 'error', icon: <CloseCircleOutlined />, label: 'Rejected' }
    }
    const config = statusConfig[status] || statusConfig.PENDING
    return <Tag color={config.color} icon={config.icon}>{config.label}</Tag>
  }

  const getEmailVerificationTag = (verified) => {
    return verified ? (
      <Tag color="success" icon={<CheckCircleOutlined />}>Verified</Tag>
    ) : (
      <Tag color="error" icon={<CloseCircleOutlined />}>Not Verified</Tag>
    )
  }

  const columns = [
    {
      title: 'Name',
      dataIndex: 'fullName',
      key: 'fullName',
      width: 180,
      fixed: 'left',
      render: (text) => <span style={{ fontWeight: 500, color: '#1a1a1a' }}>{text}</span>
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
      width: 220,
      render: (text) => <span style={{ color: '#595959' }}>{text}</span>
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      width: 120,
      render: (role) => getRoleTag(role),
    },
    {
      title: 'Organization',
      dataIndex: 'organizationName',
      key: 'organizationName',
      width: 200,
      render: (text) => <span style={{ color: '#8c8c8c' }}>{text || 'N/A'}</span>
    },
    {
      title: 'Email Status',
      dataIndex: 'emailVerified',
      key: 'emailVerified',
      width: 140,
      align: 'center',
      render: (verified) => getEmailVerificationTag(verified),
    },
    {
      title: 'Verification',
      dataIndex: 'verificationStatus',
      key: 'verificationStatus',
      width: 150,
      align: 'center',
      render: (status) => getVerificationStatusTag(status),
    },
    {
      title: 'Status',
      dataIndex: 'active',
      key: 'active',
      width: 100,
      align: 'center',
      render: (active) => active ? (
        <Tag color="success" style={{ margin: 0 }}>Active</Tag>
      ) : (
        <Tag color="default" style={{ margin: 0 }}>Inactive</Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 180,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            size="small"
            icon={<EyeOutlined />}
            onClick={() => navigate(`/admin/users/${record.id}`)}
          >
            View Details
          </Button>
          
          {record.active && record.role !== 'ADMIN' ? (
                <Button
                  type="text"
                  icon={<CloseCircleOutlined />}
                  style={{ color: '#faad14' }}
                  title="Deactivate"
                  onClick={() => {
                    showConfirmModal({
                      title: 'Deactivate User?',
                      content: 'The user will not be able to access the system. This action can be reversed later.',
                      okText: 'Yes, Deactivate',
                      cancelText: 'No, Cancel',
                      type: 'warning',
                      onOk: () => handleDeactivate(record.id)
                    })
                  }}
                />
              ) : (
                <Button
                  type="text"
                  icon={<CheckCircleOutlined />}
                  style={{ color: '#52c41a' }}
                  title="Activate"
                  onClick={() => {
                    showConfirmModal({
                      title: 'Activate User?',
                      content: 'The user will regain access to the system and can log in again.',
                      okText: 'Yes, Activate',
                      cancelText: 'No, Cancel',
                      type: 'success',
                      onOk: () => handleActivate(record.id)
                    })
                  }}
                />
              )}
              <Button
                type="text"
                icon={<DeleteOutlined />}
                danger
                title="Delete"
                onClick={() => {
                  showDeleteConfirm({
                    title: 'Delete User?',
                    itemName: `user "${record.fullName}"`,
                    additionalWarning: record.role === 'SUPPLIER' 
                      ? 'All medicines added by this supplier will also be deleted.' 
                      : 'All associated records (orders, reviews, cart items, activity logs) will be permanently removed.',
                    onConfirm: () => handleDelete(record.id)
                  })
                }}
              />
          ) : null}
        </Space>
      ),
    },
  ]

  const dataSource = users

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
          background: '#ffffff', 
          padding: 0, 
          minHeight: 'calc(100vh - 112px)',
          maxWidth: '100%',
          width: '100%',
          boxSizing: 'border-box'
        }}>
          {/* Header with Gradient */}
          <div style={{ 
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '40px 32px 32px',
            marginBottom: 0
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
              <div>
                <Title level={2} style={{ margin: 0, color: '#ffffff', fontWeight: 700, fontSize: '32px', marginBottom: 8 }}>
                  User Management
                </Title>
                <Typography.Text style={{ fontSize: '16px', color: 'rgba(255,255,255,0.9)' }}>
                  Manage users, roles, and verifications
                </Typography.Text>
              </div>
            </div>

            {/* Filter Section in White Card */}
            <div style={{ background: '#ffffff', borderRadius: '12px', padding: '20px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)' }}>
              <Space wrap size="middle" style={{ width: '100%' }}>
                <Input
                  placeholder="Search by name or email..."
                  prefix={<SearchOutlined style={{ color: '#667eea' }} />}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  style={{ 
                    width: 320,
                    borderRadius: '8px',
                    border: '1px solid #e0e0e0'
                  }}
                  size="large"
                  allowClear
                />
                <Select
                  placeholder="Filter by role"
                  value={roleFilter}
                  onChange={setRoleFilter}
                  style={{ 
                    width: 180,
                    borderRadius: '8px'
                  }}
                  size="large"
                  allowClear
                >
                  <Select.Option value="ADMIN">Admin</Select.Option>
                  <Select.Option value="SUPPLIER">Supplier</Select.Option>
                  <Select.Option value="PHARMACY">Pharmacy</Select.Option>
                  <Select.Option value="USER">General User</Select.Option>
                </Select>
              </Space>
            </div>
          </div>

          {/* Main Content */}
          <div style={{ padding: '32px', background: '#f8f9fa' }}>
            <Card 
              style={{ 
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                border: 'none',
                background: '#ffffff'
              }}
              bodyStyle={{ padding: 0 }}
            >
              <div style={{ padding: '24px' }}>
                <style>{`
                  .ant-table {
                    font-size: 14px;
                  }
                  .ant-table-thead > tr > th {
                    background: #fafafa !important;
                    font-weight: 600 !important;
                    color: #1a1a1a !important;
                    border-bottom: 2px solid #e8e8e8 !important;
                    padding: 14px 16px !important;
                    font-size: 12px !important;
                    text-transform: uppercase !important;
                    letter-spacing: 0.5px !important;
                  }
                  .ant-table-tbody > tr {
                    transition: all 0.2s ease !important;
                  }
                  .ant-table-tbody > tr:hover > td {
                    background: #f5f7fa !important;
                  }
                  .ant-table-tbody > tr > td {
                    border-bottom: 1px solid #f0f0f0 !important;
                    padding: 16px !important;
                    vertical-align: middle !important;
                  }
                  .ant-table-tbody > tr:last-child > td {
                    border-bottom: none !important;
                  }
                  .ant-table-pagination {
                    margin-top: 24px !important;
                  }
                  .ant-btn-text {
                    padding: 4px 8px !important;
                    height: auto !important;
                    border-radius: 4px !important;
                  }
                  .ant-btn-text:hover {
                    background: rgba(0,0,0,0.04) !important;
                  }
                  .ant-popover-inner {
                    border-radius: 12px !important;
                    box-shadow: 0 4px 16px rgba(0,0,0,0.15) !important;
                  }
                  .ant-popover-inner-content {
                    padding: 20px !important;
                  }
                  .ant-popconfirm-message {
                    margin-bottom: 16px !important;
                  }
                  .ant-popconfirm-buttons {
                    margin-top: 16px !important;
                  }
                `}</style>
                <Table
                  columns={columns}
                  dataSource={dataSource}
                  loading={loading}
                  rowKey="id"
                  scroll={{ x: 1200 }}
                  size="middle"
                  pagination={{
                    current: currentPage + 1,
                    total: totalPages * 10,
                    pageSize: 10,
                    onChange: (page) => setCurrentPage(page - 1),
                    showSizeChanger: false,
                    style: { marginTop: 24, marginBottom: 0 }
                  }}
                  locale={{
                    emptyText: 'No users found'
                  }}
                />
              </div>
            </Card>
          </div>
        </div>
      </AdminLayout>
    </ConfigProvider>
  )
}

export default UserManagement
