import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { Card, Button, Tag, Space, Image, Typography, Row, Col, Descriptions, Form, Input, Spin, Alert } from 'antd'
import { CheckCircleOutlined, CloseCircleOutlined, ArrowLeftOutlined, FileImageOutlined } from '@ant-design/icons'
import axios from 'axios'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import AdminLayout from '../../components/layout/AdminLayout'

const { Title, Text } = Typography
const { TextArea } = Input

const UserVerificationDetail = () => {
  const { userId } = useParams()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const [actionLoading, setActionLoading] = useState(false)
  const [user, setUser] = useState(null)
  const [rejectionReason, setRejectionReason] = useState('')
  const [form] = Form.useForm()

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

  const handleApprove = async () => {
    setActionLoading(true)
    try {
      await axios.post(`/api/admin/users/${userId}/verify`, {
        action: 'APPROVE'
      })
      toast.success('User verified successfully!')
      navigate('/admin/verification')
    } catch (error) {
      console.error('Error approving user:', error)
      toast.error('Failed to approve user')
    } finally {
      setActionLoading(false)
    }
  }

  const handleReject = async (values) => {
    setActionLoading(true)
    try {
      await axios.post(`/api/admin/users/${userId}/verify`, {
        action: 'REJECT',
        rejectionReason: values.rejectionReason
      })
      toast.success('User verification rejected')
      navigate('/admin/verification')
    } catch (error) {
      console.error('Error rejecting user:', error)
      toast.error('Failed to reject user')
    } finally {
      setActionLoading(false)
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
              onClick={() => navigate('/admin/verification')}
              style={{ marginBottom: 16, background: 'rgba(255,255,255,0.2)', border: 'none', color: '#fff' }}
            >
              Back to Verifications
            </Button>
            <Title level={2} style={{ color: '#fff', margin: 0 }}>
              User Verification Details
            </Title>
            <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>
              Review user information and documents
            </Text>
          </Space>
        </div>

        <Row gutter={[24, 24]}>
          {/* User Information */}
          <Col xs={24} lg={12}>
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
                  <Tag color="blue">{user.role}</Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Organization">
                  {user.organizationName || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="License Number">
                  {user.licenseNumber || 'N/A'}
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={getStatusColor(user.verificationStatus)}>
                    {user.verificationStatus}
                  </Tag>
                </Descriptions.Item>
                <Descriptions.Item label="Registered">
                  {dayjs(user.createdAt).format('MMM DD, YYYY')}
                </Descriptions.Item>
              </Descriptions>
            </Card>
          </Col>

          {/* Legal Document */}
          <Col xs={24} lg={12}>
            <Card
              title={<Space><FileImageOutlined /> Legal Document</Space>}
              style={{ borderRadius: '12px', height: '100%' }}
              headStyle={{ background: '#f9fafb', fontWeight: 600 }}
            >
              {user.legalDocumentUrl ? (
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
              ) : (
                <Alert
                  message="No document uploaded"
                  type="warning"
                  showIcon
                />
              )}
            </Card>
          </Col>

          {/* Actions - Only show if status is PENDING */}
          {user.verificationStatus === 'PENDING' && (
            <Col xs={24}>
              <Card
                title="Verification Actions"
                style={{ borderRadius: '12px' }}
                headStyle={{ background: '#f9fafb', fontWeight: 600 }}
              >
                <Row gutter={[24, 24]}>
                  {/* Approve Section */}
                  <Col xs={24} md={12}>
                    <Card
                      type="inner"
                      style={{
                        borderRadius: '8px',
                        border: '2px solid #52c41a',
                        background: '#f6ffed'
                      }}
                    >
                      <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <div>
                          <CheckCircleOutlined style={{ fontSize: 32, color: '#52c41a' }} />
                          <Title level={4} style={{ marginTop: 12, marginBottom: 8 }}>
                            Approve Verification
                          </Title>
                          <Text type="secondary">
                            Verify this user's account and allow them to access the platform
                          </Text>
                        </div>
                        <Button
                          type="primary"
                          icon={<CheckCircleOutlined />}
                          size="large"
                          block
                          loading={actionLoading}
                          onClick={handleApprove}
                          style={{ background: '#52c41a', border: 'none' }}
                        >
                          Approve User
                        </Button>
                      </Space>
                    </Card>
                  </Col>

                  {/* Reject Section */}
                  <Col xs={24} md={12}>
                    <Card
                      type="inner"
                      style={{
                        borderRadius: '8px',
                        border: '2px solid #ff4d4f',
                        background: '#fff1f0'
                      }}
                    >
                      <Space direction="vertical" style={{ width: '100%' }} size="middle">
                        <div>
                          <CloseCircleOutlined style={{ fontSize: 32, color: '#ff4d4f' }} />
                          <Title level={4} style={{ marginTop: 12, marginBottom: 8 }}>
                            Reject Verification
                          </Title>
                          <Text type="secondary">
                            Reject this user's verification request with a reason
                          </Text>
                        </div>
                        <Form form={form} onFinish={handleReject}>
                          <Form.Item
                            name="rejectionReason"
                            rules={[
                              { required: true, message: 'Please provide a rejection reason' }
                            ]}
                          >
                            <TextArea
                              rows={4}
                              placeholder="Enter rejection reason..."
                              value={rejectionReason}
                              onChange={(e) => setRejectionReason(e.target.value)}
                            />
                          </Form.Item>
                          <Button
                            danger
                            type="primary"
                            icon={<CloseCircleOutlined />}
                            size="large"
                            block
                            htmlType="submit"
                            loading={actionLoading}
                          >
                            Reject User
                          </Button>
                        </Form>
                      </Space>
                    </Card>
                  </Col>
                </Row>
              </Card>
            </Col>
          )}

          {/* Status Message for already processed users */}
          {user.verificationStatus !== 'PENDING' && (
            <Col xs={24}>
              <Alert
                message={`This user has already been ${user.verificationStatus.toLowerCase()}`}
                type={user.verificationStatus === 'VERIFIED' ? 'success' : 'error'}
                showIcon
                style={{ borderRadius: '8px' }}
              />
            </Col>
          )}
        </Row>
      </div>
    </AdminLayout>
  )
}

export default UserVerificationDetail










