import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, Table, Button, Tag, Input, Select, Typography } from 'antd'
import { EyeOutlined, SearchOutlined } from '@ant-design/icons'
import axios from 'axios'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import AdminLayout from '../../components/layout/AdminLayout'

const { Title, Text, Paragraph } = Typography
const { Option } = Select

const VerificationPage = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [users, setUsers] = useState([])
  const [filteredUsers, setFilteredUsers] = useState([])
  const [searchText, setSearchText] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('PENDING')

  useEffect(() => {
    fetchUsers()
  }, [])

  useEffect(() => {
    filterUsers()
  }, [users, searchText, roleFilter, statusFilter])

  const fetchUsers = async () => {
    setLoading(true)
    try {
      const response = await axios.get('/api/admin/users?size=1000')
      const allUsers = response.data.content || []
      // Filter to show ONLY PHARMACY and SUPPLIER roles (business users requiring verification)
      const businessUsers = allUsers.filter(user => 
        user.role === 'PHARMACY' || user.role === 'SUPPLIER'
      )
      setUsers(businessUsers)
    } catch (error) {
      console.error('Error fetching users:', error)
      toast.error('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const filterUsers = () => {
    let filtered = users

    // Search filter
    if (searchText) {
      filtered = filtered.filter(user =>
        user.fullName?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchText.toLowerCase()) ||
        user.organizationName?.toLowerCase().includes(searchText.toLowerCase())
      )
    }

    // Role filter
    if (roleFilter !== 'all') {
      filtered = filtered.filter(user => user.role === roleFilter)
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(user => user.verificationStatus === statusFilter)
    }

    setFilteredUsers(filtered)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'PENDING': return 'gold'
      case 'VERIFIED': return 'green'
      case 'REJECTED': return 'red'
      default: return 'default'
    }
  }

  const getStatusCounts = () => {
    return {
      pending: users.filter(u => u.verificationStatus === 'PENDING').length,
      verified: users.filter(u => u.verificationStatus === 'VERIFIED').length,
      rejected: users.filter(u => u.verificationStatus === 'REJECTED').length,
    }
  }

  const statusCounts = getStatusCounts()

  const columns = [
    {
      title: 'Organization',
      dataIndex: 'organizationName',
      key: 'organizationName',
      render: (text, record) => (
        <div>
          <Text strong>{text || 'N/A'}</Text>
          <br />
          <Tag color={record.role === 'SUPPLIER' ? 'blue' : 'green'} style={{ marginTop: 4 }}>
            {record.role}
          </Tag>
        </div>
      ),
    },
    {
      title: 'Contact Person',
      dataIndex: 'fullName',
      key: 'fullName',
      render: (text, record) => (
        <div>
          <Text>{text}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: 12 }}>{record.email}</Text>
        </div>
      ),
    },
    {
      title: 'License Number',
      dataIndex: 'licenseNumber',
      key: 'licenseNumber',
      render: (text) => <Text code>{text || 'N/A'}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'verificationStatus',
      key: 'verificationStatus',
      render: (status) => (
        <Tag color={getStatusColor(status)}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Registered',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Button
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => navigate(`/admin/verification/${record.id}`)}
        >
          View Details
        </Button>
      ),
    },
  ]

  return (
    <AdminLayout>
      <div style={{ padding: '24px' }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          padding: '32px',
          borderRadius: '12px',
          marginBottom: '24px',
          color: '#fff'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
              <Title level={2} style={{ color: '#fff', margin: 0, marginBottom: 8 }}>
                Business Account Verification
              </Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.9)', margin: 0, fontSize: 16 }}>
                Review and verify supplier and pharmacy accounts only
              </Paragraph>
            </div>
            <div style={{ display: 'flex', gap: '16px' }}>
              <Card size="small" style={{ textAlign: 'center', minWidth: 100 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>Pending</Text>
                <Title level={3} style={{ margin: '4px 0', color: '#faad14' }}>{statusCounts.pending}</Title>
              </Card>
              <Card size="small" style={{ textAlign: 'center', minWidth: 100 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>Verified</Text>
                <Title level={3} style={{ margin: '4px 0', color: '#52c41a' }}>{statusCounts.verified}</Title>
              </Card>
              <Card size="small" style={{ textAlign: 'center', minWidth: 100 }}>
                <Text type="secondary" style={{ fontSize: 12 }}>Rejected</Text>
                <Title level={3} style={{ margin: '4px 0', color: '#ff4d4f' }}>{statusCounts.rejected}</Title>
              </Card>
            </div>
          </div>
        </div>

        {/* Filters */}
        <Card style={{ marginBottom: 24, borderRadius: '12px' }}>
          <div style={{ display: 'flex', gap: '16px', flexWrap: 'wrap' }}>
            <Input
              placeholder="Search by name, email, organization..."
              prefix={<SearchOutlined />}
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              style={{ flex: 1, minWidth: '250px' }}
              size="large"
              allowClear
            />
            <Select
              placeholder="All Roles"
              value={roleFilter}
              onChange={setRoleFilter}
              style={{ width: 200 }}
              size="large"
            >
              <Option value="all">All Roles</Option>
              <Option value="SUPPLIER">Supplier</Option>
              <Option value="PHARMACY">Pharmacy</Option>
            </Select>
            <Select
              placeholder="Status"
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: 200 }}
              size="large"
            >
              <Option value="all">All Status</Option>
              <Option value="PENDING">● Pending</Option>
              <Option value="VERIFIED">● Verified</Option>
              <Option value="REJECTED">● Rejected</Option>
            </Select>
          </div>
        </Card>

        {/* Table */}
        <Card style={{ borderRadius: '12px' }}>
          <Table
            columns={columns}
            dataSource={filteredUsers}
            rowKey="id"
            loading={loading}
            pagination={{
              pageSize: 10,
              showSizeChanger: true,
              showTotal: (total) => `Total ${total} users`,
            }}
            scroll={{ x: 1000 }}
          />
        </Card>
      </div>
    </AdminLayout>
  )
}

export default VerificationPage
