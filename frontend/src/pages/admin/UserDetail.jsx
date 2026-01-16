import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import {
  Card,
  Button,
  Tag,
  Space,
  Typography,
  Row,
  Col,
  Descriptions,
  Spin,
  Alert,
  Image
} from 'antd'
import {
  ArrowLeftOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  DeleteOutlined,
  FileImageOutlined,
  ClockCircleOutlined
} from '@ant-design/icons'
import axios from 'axios'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import AdminLayout from '../../components/layout/AdminLayout'
import { showDeleteConfirm, showConfirmModal } from '../../utils/modalConfig.jsx'

const { Title, Text } = Typography

const UserDetail = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [user, setUser] = useState(null)

  useEffect(() => {
    fetchUserDetails()
  }, [userId])

  const fetchUserDetails = async () => {
    setLoading(true)
    try {
      const response = await axios.get(`/api/admin/users/${userId}`)
      setUser(response.data)
    } catch (error) {
      console.error('Error fetching user details:', error)
      toast.error('Failed to load user details')
    } finally {
      setLoading(false)
    }
  }

  const handleDeactivate = async () => {
    setActionLoading(true)
    try {
      await axios.put(`/api/admin/users/${userId}/deactivate`)
      toast.success('User deactivated successfully')
      fetchUserDetails()
    } catch (error) {
      console.error('Error deactivating user:', error)
      toast.error('Failed to deactivate user')
    } finally {
      setActionLoading(false)
    }
  }

  const handleActivate = async () => {
    setActionLoading(true)
    try {
      await axios.put(`/api/admin/users/${userId}/activate`)
      toast.success('User activated successfully')
      fetchUserDetails()
    } catch (error) {
      console.error('Error activating user:', error)
      toast.error('Failed to activate user')
    } finally {
      setActionLoading(false)
    }
  }

  const handleDelete = async () => {
    setActionLoading(true)
    try {
      await axios.delete(`/api/admin/users/${userId}`)
      toast.success('User deleted successfully')
      navigate('/admin/users')
    } catch (error) {
      console.error('Error deleting user:', error)
      const errorMessage = error.response?.data?.message || error.response?.data || 'Failed to delete user'
      toast.error(errorMessage)
    } finally {
      setActionLoading(false)
    }
  }

  const handleVerifyEmail = async () => {
    setActionLoading(true)
    try {
      await axios.put(`/api/admin/users/${userId}/verify-email`)
      toast.success('Email verified successfully')
      fetchUserDetails()
    } catch (error) {
      console.error('Error verifying email:', error)
      toast.error('Failed to verify email')
    } finally {
      setActionLoading(false)
    }
  }

  const getRoleColor = (role) => {
    switch (role) {
      case 'ADMIN':
        return 'red'
      case 'SUPPLIER':
        return 'blue'
      case 'PHARMACY':
        return 'green'
      case 'USER':
        return 'default'
      default:
        return 'default'
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'VERIFIED':
        return 'green'
      case 'PENDING':
        return 'orange'
      case 'REJECTED':
        return 'red'
      default:
        return 'default'
    }
  }

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ padding: '24px', display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
          <Spin size="large" tip="Loading user details..." />
        </div>
      </AdminLayout>
    )
  }

  if (!user) {
    return (
      <AdminLayout>
        <div style={{ padding: '24px' }}>
          <Alert message="User not found" type="error" />
        </div>
      </AdminLayout>
    )
  }

  return (
    <AdminLayout>
      <div style={{ padding: '24px' }}>
        {/* Header */}
        <div
          style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '32px',
            borderRadius: '12px',
            marginBottom: '24px',
            color: '#fff'
          }}
        >
          <Space direction="vertical" size={4}>
            <Button
              icon={<ArrowLeftOutlined />}
              onClick={() => navigate('/admin/users')}
              style={{ marginBottom: 16, background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff' }}
            >
              Back to Users
            </Button>
            <Title level={2} style={{ color: '#fff', margin: 0 }}>
              User Details
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>
              View and manage user information
            </Text>
          </Space>
        </div>

        <Row gutter={[24, 24]}>
          {/* User Information */}
          <Col xs={24} lg={user.legalDocumentUrl ? 12 : 24}>
            <Card
              title="User Information"
              style={{ borderRadius: '12px', height: '100%' }}
              headStyle={{ background: '#f9fafb', fontWeight: 600 }}
            >
              <Descriptions column={1} bordered>
                <Descriptions.Item label="Full Name">
                  <Text strong>{user.fullName}</Text>
                </Descriptions.Item>
                <Descriptions.Item label="Email">{user.email}</Descriptions.Item>
                <Descriptions.Item label="Role">
                  <Tag color={getRoleColor(user.role)}>{user.role}</Tag>
                </Descriptions.Item>
                {user.organizationName && (
                  <Descriptions.Item label="Organization">
                    {user.organizationName}
                  </Descriptions.Item>
                )}
                {user.licenseNumber && (
                  <Descriptions.Item label="License Number">
                    {user.licenseNumber}
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Email Verified">
                  {user.emailVerified ? (
                    <Tag icon={<CheckCircleOutlined />} color="success">
                      Verified
                    </Tag>
                  ) : (
                    <Tag icon={<CloseCircleOutlined />} color="error">
                      Not Verified
                    </Tag>
                  )}
                </Descriptions.Item>
                {user.verificationStatus && (
                  <Descriptions.Item label="Account Status">
                    <Tag color={getStatusColor(user.verificationStatus)}>
                      {user.verificationStatus}
                    </Tag>
                  </Descriptions.Item>
                )}
                <Descriptions.Item label="Active Status">
                  {user.active ? (
                    <Tag icon={<CheckCircleOutlined />} color="success">
                      Active
                    </Tag>
                  ) : (
                    <Tag icon={<ClockCircleOutlined />} color="warning">
                      Inactive
                    </Tag>
                  )}
                </Descriptions.Item>
                <Descriptions.Item label="Registered">
                  {dayjs(user.createdAt).format('MMM DD, YYYY')}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {/* Legal Document */}
          {user.legalDocumentUrl && (
            <Col xs={24} lg={12}>
              <Card
                title={<Space><FileImageOutlined /> Legal Document</Space>}
                style={{ borderRadius: '12px', height: '100%' }}
                headStyle={{ background: '#f9fafb', fontWeight: 600 }}
              >
                <div style={{ textAlign: 'center' }}>
                  <Image
                    src={user.legalDocumentUrl}
                    alt="Legal Document"
                    style={{
                      maxWidth: '100%',
                      borderRadius: '8px',
                      border: '2px solid #e8e8e8'
                    }}
                    preview={{
                      mask: 'Click to view full size'
                    }}
                  />
                  <Text type="secondary" style={{ display: 'block', marginTop: 12 }}>
                    Click image to view full size
                  </Text>
                </div>
              </Card>
            </Col>
          )}

          {/* Actions */}
          {user.role !== 'ADMIN' && (
            <Col xs={24}>
              <Card
                title="User Actions"
                style={{ borderRadius: '12px' }}
                headStyle={{ background: '#f9fafb', fontWeight: 600 }}
              >
                <Space size="middle" wrap>
                  {user.active ? (
                    <Button
                      icon={<CloseCircleOutlined />}
                      size="large"
                      loading={actionLoading}
                      onClick={() => {
                        showConfirmModal({
                          title: 'Deactivate User?',
                          content: 'The user will not be able to access the system. This action can be reversed later.',
                          okText: 'Yes, Deactivate',
                          cancelText: 'No, Cancel',
                          type: 'warning',
                          onOk: handleDeactivate
                        })
                      }}
                    >
                      Deactivate User
                    </Button>
                  ) : (
                    <Button
                      type="primary"
                      icon={<CheckCircleOutlined />}
                      size="large"
                      loading={actionLoading}
                      onClick={() => {
                        showConfirmModal({
                          title: 'Activate User?',
                          content: 'The user will regain access to the system and can log in again.',
                          okText: 'Yes, Activate',
                          cancelText: 'No, Cancel',
                          type: 'success',
                          onOk: handleActivate
                        })
                      }}
                    >
                      Activate User
                    </Button>
                  )}

                  {!user.emailVerified && (
                    <Button
                      type="default"
                      icon={<CheckCircleOutlined />}
                      size="large"
                      loading={actionLoading}
                      style={{ 
                        borderColor: '#52c41a',
                        color: '#52c41a'
                      }}
                      onClick={() => {
                        showConfirmModal({
                          title: 'Verify User\'s Email?',
                          content: 'This will manually mark the user\'s email as verified, allowing them full access to the system.',
                          okText: 'Yes, Verify Email',
                          cancelText: 'No, Cancel',
                          type: 'success',
                          onOk: handleVerifyEmail
                        })
                      }}
                    >
                      Verify Email
                    </Button>
                  )}

                  <Button
                    danger
                    icon={<DeleteOutlined />}
                    size="large"
                    loading={actionLoading}
                    onClick={() => {
                      showDeleteConfirm({
                        title: 'Delete User?',
                        itemName: `user "${user.fullName}"`,
                        additionalWarning: user.role === 'SUPPLIER' 
                          ? 'All medicines added by this supplier will also be deleted.' 
                          : null,
                        onConfirm: handleDelete
                      })
                    }}
                  >
                    Delete User
                  </Button>
                </Space>
              </Card>
            </Col>
          )}
        </Row>
      </div>
    </AdminLayout>
  )
}

export default UserDetail

