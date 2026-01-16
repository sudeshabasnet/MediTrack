import { useState, useEffect } from 'react'
import AdminLayout from '../../components/layout/AdminLayout'
import axios from 'axios'
import toast from 'react-hot-toast'
import { Table, Input, Select, Tag, Button, Space, Typography, Card, Modal, Descriptions, Divider, Image, Alert } from 'antd'
import { 
  SearchOutlined, 
  EyeOutlined, 
  EditOutlined, 
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CarOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  LockOutlined
} from '@ant-design/icons'
import { showStatusChangeConfirm } from '../../utils/modalConfig.jsx'
import { ConfigProvider } from 'antd'
import dayjs from 'dayjs'

const { Title, Text } = Typography

const OrdersManagement = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('PENDING')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [detailsVisible, setDetailsVisible] = useState(false)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [statusFilter])

  const fetchOrders = async () => {
    try {
      setLoading(true)
      const response = await axios.get('/api/admin/orders', {
        params: { status: statusFilter || undefined }
      })
      setOrders(response.data || [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      toast.error('Failed to fetch orders')
      setOrders([])
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = async (orderId) => {
    setDetailsVisible(true)
    setDetailsLoading(true)
    try {
      const response = await axios.get(`/api/admin/orders/${orderId}`)
      setSelectedOrder(response.data)
    } catch (error) {
      console.error('Failed to fetch order details:', error)
      toast.error('Failed to load order details')
      setDetailsVisible(false)
    } finally {
      setDetailsLoading(false)
    }
  }

  const handleUpdateStatus = async (newStatus) => {
    if (!selectedOrder) return
    
    // Check if order is in final state
    if (selectedOrder.status === 'CANCELLED' || selectedOrder.status === 'DELIVERED') {
      toast.error(`Cannot change status of a ${selectedOrder.status.toLowerCase()} order`)
      return
    }
    
    // Show beautiful confirmation dialog
    showStatusChangeConfirm({
      title: 'Confirm Order Status Change',
      newStatus: newStatus,
      additionalInfo: 'The customer will be notified via email about this change.',
      warningMessage: (newStatus === 'CANCELLED' || newStatus === 'DELIVERED') 
        ? `Once set to ${newStatus}, the status cannot be changed again!` 
        : null,
      onConfirm: async () => {
        setStatusUpdateLoading(true)
        try {
          const response = await axios.put(`/api/admin/orders/${selectedOrder.id}/status`, { status: newStatus })
          if (newStatus === 'CANCELLED') {
            toast.success('Order cancelled! Stock restored and customer notified via email.')
          } else {
            toast.success('Order status updated! Customer notified via email.')
          }
          setSelectedOrder({ ...selectedOrder, status: newStatus })
          fetchOrders() // Refresh the list
        } catch (error) {
          console.error('Failed to update order status:', error)
          const errorMessage = error.response?.data?.error || 'Failed to update order status'
          toast.error(errorMessage)
        } finally {
          setStatusUpdateLoading(false)
        }
      }
    })
  }

  const handleCloseDetails = () => {
    setDetailsVisible(false)
    setSelectedOrder(null)
  }

  const getStatusTag = (status) => {
    const statusColors = {
      PENDING: 'warning',
      CONFIRMED: 'blue',
      PROCESSING: 'processing',
      SHIPPED: 'default',
      DELIVERED: 'success',
      CANCELLED: 'error'
    }
    return <Tag color={statusColors[status]}>{status}</Tag>
  }

  const filteredOrders = orders.filter(order =>
    order.id.toString().includes(searchTerm) ||
    order.user?.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    order.user?.fullName?.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const columns = [
    {
      title: 'Order ID',
      dataIndex: 'id',
      key: 'id',
      width: 100,
      render: (id) => <Text strong>#{id}</Text>,
    },
    {
      title: 'Customer',
      key: 'customer',
      width: 180,
      render: (_, record) => (
        <div>
          <Text strong>{record.user?.fullName || record.fullName || 'Guest'}</Text>
          <br />
          <Text type="secondary" style={{ fontSize: '12px' }}>
            {record.user?.email || 'N/A'}
          </Text>
        </div>
      ),
    },
    {
      title: 'Medicines',
      key: 'medicines',
      width: 280,
      render: (_, record) => {
        const items = record.orderItems || []
        const firstItem = items[0]
        const remainingCount = items.length - 1
        
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {(firstItem?.medicineImage || firstItem?.medicine?.imageUrl) && (
              <Image
                width={50}
                height={50}
                src={firstItem?.medicineImage || firstItem?.medicine?.imageUrl}
                fallback="/placeholder-medicine.png"
                style={{ objectFit: 'cover', borderRadius: 4 }}
                preview={false}
              />
            )}
            <div style={{ flex: 1 }}>
              <Text strong>{firstItem?.medicineName || firstItem?.medicine?.name || 'N/A'}</Text>
              <br />
              <Text type="secondary" style={{ fontSize: '12px' }}>
                {firstItem?.genericName || firstItem?.medicine?.genericName || ''}
              </Text>
              {remainingCount > 0 && (
                <>
                  <br />
                  <Tag color="blue" style={{ fontSize: '11px', marginTop: '4px' }}>
                    +{remainingCount} more item{remainingCount > 1 ? 's' : ''}
                  </Tag>
                </>
              )}
            </div>
          </div>
        )
      },
    },
    {
      title: 'Items',
      dataIndex: 'orderItems',
      key: 'items',
      width: 80,
      render: (items) => <Tag color="purple">{items?.length || 0}</Tag>,
    },
    {
      title: 'Total',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount) => <Text strong>Rs. {amount?.toFixed(2) || '0.00'}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => getStatusTag(status),
    },
    {
      title: 'Date',
      dataIndex: 'createdAt',
      key: 'createdAt',
      width: 120,
      render: (date) => dayjs(date).format('MMM DD, YYYY'),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 100,
      fixed: 'right',
      render: (_, record) => (
        <Button 
          type="primary"
          icon={<EyeOutlined />}
          onClick={() => handleViewDetails(record.id)}
          size="small"
        >
          Details
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
            <Title level={2} style={{ margin: 0, color: '#1a1a1a', fontWeight: 700, fontSize: '28px' }}>
              Orders Management
            </Title>
            <Text type="secondary" style={{ fontSize: '15px', marginTop: '8px', display: 'block' }}>
              View and manage all customer orders
            </Text>
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
                placeholder="Filter by Status"
                defaultValue="PENDING"
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ 
                  width: 220,
                  borderRadius: '10px'
                }}
                size="large"
                allowClear
              >
                <Select.Option value="PENDING">
                  <ClockCircleOutlined /> Pending
                </Select.Option>
                <Select.Option value="CONFIRMED">
                  <CheckCircleOutlined /> Confirmed
                </Select.Option>
                <Select.Option value="PROCESSING">
                  <SyncOutlined /> Processing
                </Select.Option>
                <Select.Option value="SHIPPED">
                  <CarOutlined /> Shipped
                </Select.Option>
                <Select.Option value="DELIVERED">
                  <CheckOutlined /> Delivered
                </Select.Option>
                <Select.Option value="CANCELLED">
                  <CloseCircleOutlined /> Cancelled
                </Select.Option>
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
              dataSource={filteredOrders}
              loading={loading}
              rowKey="id"
              scroll={{ x: 1400 }}
              locale={{
                emptyText: 'No orders found'
              }}
              pagination={{
                pageSize: 10,
                showTotal: (total) => `Total ${total} orders`,
                showSizeChanger: true,
                pageSizeOptions: ['10', '20', '50']
              }}
            />
          </Card>

          {/* Order Details Modal */}
          <Modal
            title={<Title level={4}>Order Details #{selectedOrder?.id}</Title>}
            open={detailsVisible}
            onCancel={handleCloseDetails}
            footer={[
              <Button key="close" onClick={handleCloseDetails}>
                Close
              </Button>
            ]}
            width={900}
          >
            {detailsLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Text>Loading order details...</Text>
              </div>
            ) : selectedOrder ? (
              <div>
                {/* Order Management Section */}
                <Card 
                  style={{ 
                    marginBottom: '24px', 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    border: 'none'
                  }}
                >
                  <Space direction="vertical" style={{ width: '100%' }}>
                    <Text strong style={{ color: '#fff', fontSize: '16px' }}>
                      <EditOutlined /> Update Order Status
                    </Text>
                    <Space size="large" style={{ width: '100%', justifyContent: 'space-between' }}>
                      <div>
                        <Text style={{ color: 'rgba(255,255,255,0.9)', display: 'block', marginBottom: '8px' }}>
                          Current Status:
                        </Text>
                        {getStatusTag(selectedOrder.status)}
                      </div>
                      <div>
                        <Text style={{ color: 'rgba(255,255,255,0.9)', display: 'block', marginBottom: '8px' }}>
                          {(selectedOrder.status === 'CANCELLED' || selectedOrder.status === 'DELIVERED') 
                            ? <><LockOutlined /> Status Locked (Final State)</> 
                            : 'Change Status:'}
                        </Text>
                        <Select
                          value={selectedOrder.status}
                          onChange={handleUpdateStatus}
                          loading={statusUpdateLoading}
                          disabled={selectedOrder.status === 'CANCELLED' || selectedOrder.status === 'DELIVERED'}
                          style={{ width: 250 }}
                          size="large"
                        >
                          <Select.Option value="PENDING">
                            <ClockCircleOutlined /> Pending
                          </Select.Option>
                          <Select.Option value="CONFIRMED">
                            <CheckCircleOutlined /> Confirmed
                          </Select.Option>
                          <Select.Option value="PROCESSING">
                            <SyncOutlined spin /> Processing/Packaging
                          </Select.Option>
                          <Select.Option value="SHIPPED">
                            <CarOutlined /> Shipped/Delivering
                          </Select.Option>
                          <Select.Option value="DELIVERED">
                            <CheckOutlined /> Delivered (Final)
                          </Select.Option>
                          <Select.Option value="CANCELLED">
                            <CloseCircleOutlined /> Cancelled (Final)
                          </Select.Option>
                        </Select>
                      </div>
                    </Space>
                  </Space>
                </Card>

                {/* Order Items - MOST IMPORTANT - Show First */}
                <Divider orientation="left" style={{ fontSize: '16px', fontWeight: 600 }}>
                  📦 Ordered Products
                </Divider>
                
                <Table
                  dataSource={selectedOrder.orderItems || []}
                  pagination={false}
                  rowKey="id"
                  size="middle"
                  style={{ marginBottom: '16px' }}
                  columns={[
                    {
                      title: 'Product Image',
                      key: 'image',
                      width: 100,
                      render: (_, record) => (
                        <Image
                          width={80}
                          height={80}
                          src={record.medicineImage || record.medicine?.imageUrl || '/placeholder-medicine.png'}
                          fallback="/placeholder-medicine.png"
                          style={{ objectFit: 'cover', borderRadius: 8, border: '2px solid #f0f0f0' }}
                          preview={{
                            mask: <EyeOutlined />
                          }}
                        />
                      )
                    },
                    {
                      title: 'Product Details',
                      key: 'medicine',
                      render: (_, record) => (
                        <div>
                          <Text strong style={{ fontSize: '15px', color: '#1a1a1a' }}>
                            {record.medicineName || record.medicine?.name || 'N/A'}
                          </Text>
                          {(record.genericName || record.medicine?.genericName) && (
                            <>
                              <br />
                              <Text type="secondary" style={{ fontSize: '13px' }}>
                                Generic: {record.genericName || record.medicine?.genericName}
                              </Text>
                            </>
                          )}
                          {(record.manufacturer || record.medicine?.supplier?.organizationName) && (
                            <>
                              <br />
                              <Tag color="blue" style={{ fontSize: '11px', marginTop: '4px' }}>
                                {record.manufacturer ? `${record.manufacturer}` : `${record.medicine?.supplier?.organizationName}`}
                              </Tag>
                            </>
                          )}
                        </div>
                      )
                    },
                    {
                      title: 'Quantity',
                      dataIndex: 'quantity',
                      key: 'quantity',
                      width: 100,
                    },
                    {
                      title: 'Unit Price',
                      dataIndex: 'unitPrice',
                      key: 'unitPrice',
                      width: 120,
                      render: (price) => `Rs. ${price?.toFixed(2)}`
                    },
                    {
                      title: 'Subtotal',
                      dataIndex: 'subtotal',
                      key: 'subtotal',
                      width: 120,
                      render: (subtotal) => (
                        <Text strong>Rs. {subtotal?.toFixed(2)}</Text>
                      )
                    }
                  ]}
                  summary={() => (
                    <Table.Summary fixed>
                      <Table.Summary.Row>
                        <Table.Summary.Cell index={0} colSpan={4} align="right">
                          <Text strong>Total Amount:</Text>
                        </Table.Summary.Cell>
                        <Table.Summary.Cell index={1}>
                          <Text strong style={{ fontSize: '16px', color: '#4F46E5' }}>
                            Rs. {selectedOrder.totalAmount?.toFixed(2)}
                          </Text>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </Table.Summary>
                  )}
                />

                {/* Customer & Delivery Details - Show After Products */}
                <Divider orientation="left" style={{ fontSize: '16px', fontWeight: 600, marginTop: '32px' }}>
                  👤 Customer & Delivery Information
                </Divider>
                <Descriptions bordered column={2} size="small">
                  <Descriptions.Item label="Order ID">
                    <Text strong>#{selectedOrder.id}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Order Date">
                    {dayjs(selectedOrder.createdAt).format('MMM DD, YYYY HH:mm')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Customer Name">
                    <Text strong>{selectedOrder.user?.fullName || selectedOrder.fullName || 'Guest'}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Email">
                    <Text>{selectedOrder.email || selectedOrder.user?.email || 'N/A'}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone">
                    <Text strong>{selectedOrder.phoneNumber || 'N/A'}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Payment Method">
                    <Tag color="green">{selectedOrder.paymentMethod || 'N/A'}</Tag>
                  </Descriptions.Item>
                  <Descriptions.Item label="Transaction ID" span={2}>
                    {selectedOrder.transactionId || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Shipping Address" span={2}>
                    <Text strong>{selectedOrder.address || 'N/A'}</Text>
                  </Descriptions.Item>
                </Descriptions>

                {/* Cancellation Information */}
                {selectedOrder.status === 'CANCELLED' && selectedOrder.cancellationReason && (
                  <>
                    <Divider style={{ margin: '24px 0' }} />
                    <Alert
                      message="Order Cancellation Details"
                      description={
                        <div style={{ marginTop: '12px' }}>
                          <div style={{ marginBottom: '8px' }}>
                            <Text strong style={{ color: '#8c8c8c' }}>Cancelled At:</Text>
                            <br />
                            <Text style={{ fontSize: '14px' }}>
                              {selectedOrder.cancelledAt ? dayjs(selectedOrder.cancelledAt).format('MMM DD, YYYY HH:mm') : 'N/A'}
                            </Text>
                          </div>
                          <div>
                            <Text strong style={{ color: '#8c8c8c' }}>Cancellation Reason:</Text>
                            <br />
                            <Text style={{ fontSize: '14px', lineHeight: '1.6' }}>
                              {selectedOrder.cancellationReason}
                            </Text>
                          </div>
                        </div>
                      }
                      type="error"
                      showIcon
                      style={{
                        borderRadius: '12px',
                        border: '1px solid #ffccc7',
                        background: '#fff1f0'
                      }}
                    />
                  </>
                )}
              </div>
            ) : null}
          </Modal>
        </div>
      </AdminLayout>
    </ConfigProvider>
  )
}

export default OrdersManagement
