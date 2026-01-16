import { useState, useEffect } from 'react'
import SupplierLayout from '../../components/layout/SupplierLayout'
import { Card, Table, Tag, Typography, Space, Button, Input, Select, Modal, Descriptions, Divider, Image } from 'antd'
import { 
  ShoppingCartOutlined, 
  SearchOutlined, 
  EyeOutlined, 
  ExclamationCircleOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  SyncOutlined,
  CarOutlined,
  CheckOutlined,
  CloseCircleOutlined,
  AppstoreOutlined,
  LockOutlined
} from '@ant-design/icons'
import { showStatusChangeConfirm } from '../../utils/modalConfig.jsx'
import { ConfigProvider } from 'antd'
import axios from 'axios'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'

const { Title, Text } = Typography
const { Option } = Select

const SupplierOrders = () => {
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(false)
  const [searchText, setSearchText] = useState('')
  const [statusFilter, setStatusFilter] = useState('PENDING')
  const [selectedOrder, setSelectedOrder] = useState(null)
  const [detailsVisible, setDetailsVisible] = useState(false)
  const [detailsLoading, setDetailsLoading] = useState(false)
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false)

  useEffect(() => {
    fetchOrders()
  }, [])

  const fetchOrders = async () => {
    setLoading(true)
    try {
      // This endpoint needs to be created in backend
      const response = await axios.get('/api/supplier/orders')
      setOrders(response.data || [])
    } catch (error) {
      console.error('Failed to fetch orders:', error)
      toast.error('Failed to load orders')
    } finally {
      setLoading(false)
    }
  }

  const handleViewDetails = async (orderId) => {
    setDetailsVisible(true)
    setDetailsLoading(true)
    try {
      const response = await axios.get(`/api/supplier/orders/${orderId}`)
      setSelectedOrder(response.data)
    } catch (error) {
      console.error('Failed to fetch order details:', error)
      toast.error('Failed to load order details')
      setDetailsVisible(false)
    } finally {
      setDetailsLoading(false)
    }
  }

  const handleCloseDetails = () => {
    setDetailsVisible(false)
    setSelectedOrder(null)
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
          const response = await axios.put(`/api/supplier/orders/${selectedOrder.id}/status`, { status: newStatus })
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

  // Filter orders based on search text and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toString().includes(searchText) ||
      order.customerName?.toLowerCase().includes(searchText.toLowerCase()) ||
      order.email?.toLowerCase().includes(searchText.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

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
      dataIndex: 'customerName',
      key: 'customerName',
      width: 150,
      render: (name) => (
        <div>
          <Text strong>{name || 'Guest'}</Text>
        </div>
      ),
    },
    {
      title: 'Medicines',
      key: 'medicines',
      width: 280,
      render: (_, record) => {
        const firstMedicine = record.firstMedicine
        const remainingCount = (record.itemCount || 0) - 1
        
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {firstMedicine?.imageUrl && (
              <Image
                width={50}
                height={50}
                src={firstMedicine.imageUrl}
                fallback="/placeholder-medicine.png"
                style={{ objectFit: 'cover', borderRadius: 4 }}
                preview={false}
              />
            )}
            <div style={{ flex: 1 }}>
              <Text strong>{firstMedicine?.name || 'Medicine Items'}</Text>
              {firstMedicine?.genericName && (
                <>
                  <br />
                  <Text type="secondary" style={{ fontSize: '12px' }}>
                    {firstMedicine.genericName}
                  </Text>
                </>
              )}
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
      title: 'Total',
      dataIndex: 'totalAmount',
      key: 'totalAmount',
      width: 120,
      render: (amount) => <Text strong>Rs. {amount?.toFixed(2)}</Text>,
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      width: 120,
      render: (status) => {
        const colors = {
          PENDING: 'gold',
          CONFIRMED: 'blue',
          PROCESSING: 'cyan',
          SHIPPED: 'purple',
          DELIVERED: 'green',
          CANCELLED: 'red',
        }
        return <Tag color={colors[status] || 'default'}>{status}</Tag>
      },
    },
    {
      title: 'Order Date',
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
          colorPrimary: '#6366f1',
          borderRadius: 8,
        },
      }}
    >
      <SupplierLayout>
        <div style={{ padding: '24px', background: '#f5f5f5', minHeight: 'calc(100vh - 64px)' }}>
          {/* Header */}
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            padding: '32px',
            borderRadius: '12px',
            marginBottom: '24px',
            color: '#fff'
          }}>
            <Space align="center">
              <ShoppingCartOutlined style={{ fontSize: 40 }} />
              <div>
                <Title level={2} style={{ color: '#fff', margin: 0 }}>
                  Orders
                </Title>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: 16 }}>
                  Manage customer orders for your medicines
                </Text>
              </div>
            </Space>
          </div>

          {/* Filters */}
          <Card style={{ marginBottom: '24px', borderRadius: '12px' }}>
            <Space size="large" style={{ width: '100%' }} wrap>
              <Input
                placeholder="Search orders..."
                prefix={<SearchOutlined />}
                value={searchText}
                onChange={(e) => setSearchText(e.target.value)}
                style={{ width: 300 }}
                size="large"
                allowClear
              />
              <Select
                placeholder="Filter by Status"
                defaultValue="PENDING"
                value={statusFilter}
                onChange={setStatusFilter}
                style={{ width: 220 }}
                size="large"
                allowClear
              >
                <Option value="all">
                  <AppstoreOutlined /> All Status
                </Option>
                <Option value="PENDING">
                  <ClockCircleOutlined /> Pending
                </Option>
                <Option value="CONFIRMED">
                  <CheckCircleOutlined /> Confirmed
                </Option>
                <Option value="PROCESSING">
                  <SyncOutlined /> Processing
                </Option>
                <Option value="SHIPPED">
                  <CarOutlined /> Shipped
                </Option>
                <Option value="DELIVERED">
                  <CheckOutlined /> Delivered
                </Option>
                <Option value="CANCELLED">
                  <CloseCircleOutlined /> Cancelled
                </Option>
              </Select>
            </Space>
          </Card>

          {/* Orders Table */}
          <Card style={{ borderRadius: '12px' }}>
            <Table
              columns={columns}
              dataSource={filteredOrders}
              loading={loading}
              rowKey="id"
              scroll={{ x: 1300 }}
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
            width={800}
          >
            {detailsLoading ? (
              <div style={{ textAlign: 'center', padding: '40px' }}>
                <Text>Loading order details...</Text>
              </div>
            ) : selectedOrder ? (
              <div>
                <Descriptions bordered column={2}>
                  <Descriptions.Item label="Order ID" span={2}>
                    <Text strong>#{selectedOrder.id}</Text>
                  </Descriptions.Item>
                  <Descriptions.Item label="Customer">
                    {selectedOrder.customerName || selectedOrder.user?.fullName || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Order Date">
                    {dayjs(selectedOrder.createdAt).format('MMM DD, YYYY HH:mm')}
                  </Descriptions.Item>
                  <Descriptions.Item label="Status" span={2}>
                    <Space direction="vertical" size="small">
                      <Space>
                        <Tag color={
                          selectedOrder.status === 'PENDING' ? 'gold' :
                          selectedOrder.status === 'CONFIRMED' ? 'blue' :
                          selectedOrder.status === 'PROCESSING' ? 'cyan' :
                          selectedOrder.status === 'SHIPPED' ? 'purple' :
                          selectedOrder.status === 'DELIVERED' ? 'green' :
                          selectedOrder.status === 'CANCELLED' ? 'red' : 'default'
                        }>
                          {selectedOrder.status}
                        </Tag>
                        {(selectedOrder.status === 'CANCELLED' || selectedOrder.status === 'DELIVERED') && (
                          <Tag color="orange" icon={<LockOutlined />}>Locked</Tag>
                        )}
                      </Space>
                      <Select
                        value={selectedOrder.status}
                        onChange={handleUpdateStatus}
                        loading={statusUpdateLoading}
                        disabled={selectedOrder.status === 'CANCELLED' || selectedOrder.status === 'DELIVERED'}
                        style={{ width: 240 }}
                        size="small"
                        placeholder={
                          (selectedOrder.status === 'CANCELLED' || selectedOrder.status === 'DELIVERED') 
                            ? 'Status locked (Final)' 
                            : 'Change status'
                        }
                      >
                        <Option value="PENDING">
                          <ClockCircleOutlined /> Pending
                        </Option>
                        <Option value="CONFIRMED">
                          <CheckCircleOutlined /> Confirmed
                        </Option>
                        <Option value="PROCESSING">
                          <SyncOutlined spin /> Processing
                        </Option>
                        <Option value="SHIPPED">
                          <CarOutlined /> Shipped
                        </Option>
                        <Option value="DELIVERED">
                          <CheckOutlined /> Delivered (Final)
                        </Option>
                        <Option value="CANCELLED">
                          <CloseCircleOutlined /> Cancelled (Final)
                        </Option>
                      </Select>
                    </Space>
                  </Descriptions.Item>
                  <Descriptions.Item label="Payment Method">
                    {selectedOrder.paymentMethod || 'N/A'}
                  </Descriptions.Item>
                  <Descriptions.Item label="Phone Number">
                    {selectedOrder.phoneNumber || 'N/A'}
                  </Descriptions.Item>
                  {selectedOrder.shippingAddress && (
                    <Descriptions.Item label="Shipping Address" span={2}>
                      {selectedOrder.shippingAddress}
                    </Descriptions.Item>
                  )}
                  {selectedOrder.notes && (
                    <Descriptions.Item label="Notes" span={2}>
                      {selectedOrder.notes}
                    </Descriptions.Item>
                  )}
                </Descriptions>

                <Divider orientation="left">Order Items</Divider>
                
                <Table
                  dataSource={selectedOrder.items || []}
                  pagination={false}
                  rowKey="id"
                  size="small"
                  columns={[
                    {
                      title: 'Image',
                      dataIndex: ['medicine', 'imageUrl'],
                      key: 'image',
                      width: 80,
                      render: (imageUrl) => (
                        <Image
                          width={60}
                          height={60}
                          src={imageUrl || '/placeholder-medicine.png'}
                          fallback="/placeholder-medicine.png"
                          style={{ objectFit: 'cover', borderRadius: 4 }}
                          preview={{
                            mask: <EyeOutlined />
                          }}
                        />
                      )
                    },
                    {
                      title: 'Medicine',
                      dataIndex: ['medicine', 'name'],
                      key: 'medicine',
                      render: (name, record) => (
                        <div>
                          <Text strong>{name || 'N/A'}</Text>
                          {record.medicine?.genericName && (
                            <>
                              <br />
                              <Text type="secondary" style={{ fontSize: '12px' }}>
                                {record.medicine.genericName}
                              </Text>
                            </>
                          )}
                          {record.medicine?.manufacturer && (
                            <>
                              <br />
                              <Text type="secondary" style={{ fontSize: '11px' }}>
                                By: {record.medicine.manufacturer}
                              </Text>
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
                      dataIndex: 'price',
                      key: 'price',
                      width: 120,
                      render: (price) => `Rs. ${price?.toFixed(2)}`
                    },
                    {
                      title: 'Subtotal',
                      key: 'subtotal',
                      width: 120,
                      render: (_, record) => (
                        <Text strong>Rs. {(record.quantity * record.price)?.toFixed(2)}</Text>
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
                          <Text strong style={{ fontSize: '16px', color: '#6366f1' }}>
                            Rs. {selectedOrder.totalAmount?.toFixed(2)}
                          </Text>
                        </Table.Summary.Cell>
                      </Table.Summary.Row>
                    </Table.Summary>
                  )}
                />
              </div>
            ) : null}
          </Modal>
        </div>
      </SupplierLayout>
    </ConfigProvider>
  )
}

export default SupplierOrders


