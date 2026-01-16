import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import SupplierLayout from '../../components/layout/SupplierLayout'
import {
  Card,
  Form,
  Input,
  InputNumber,
  Select,
  DatePicker,
  Button,
  Typography,
  Space,
  Alert,
  Row,
  Col,
  ConfigProvider,
  Upload,
  Image
} from 'antd'
import {
  MedicineBoxOutlined,
  SaveOutlined,
  CloseOutlined,
  UploadOutlined,
  PictureOutlined
} from '@ant-design/icons'
import axios from 'axios'
import toast from 'react-hot-toast'
import dayjs from 'dayjs'
import { useAuth } from '../../contexts/AuthContext'

const { Title, Text } = Typography
const { TextArea } = Input
const { Option } = Select

const AddMedicine = () => {
  const navigate = useNavigate()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  const [imageUrl, setImageUrl] = useState('')
  const [imageUploading, setImageUploading] = useState(false)
  const [imagePreview, setImagePreview] = useState(null)
  const [categories, setCategories] = useState([])

  useEffect(() => {
    fetchCategories()
  }, [])

  const fetchCategories = async () => {
    try {
      const response = await axios.get('/api/categories?activeOnly=true')
      setCategories(response.data || [])
    } catch (error) {
      console.error('Failed to fetch categories:', error)
      toast.error('Failed to load categories')
    }
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
      toast.success('Image uploaded successfully')
      return false // Prevent default upload behavior
    } catch (error) {
      toast.error(error.response?.data?.error || 'Failed to upload image')
      return false
    } finally {
      setImageUploading(false)
    }
  }

  const handleSubmit = async (values) => {
    setLoading(true)
    try {
      const medicineData = {
        ...values,
        expiryDate: values.expiryDate.format('YYYY-MM-DD'),
        manufacturingDate: values.manufacturingDate.format('YYYY-MM-DD'),
        imageUrl: imageUrl || '',
        status: 'AVAILABLE'
      }

      await axios.post('/api/supplier/medicines', medicineData)
      toast.success('Medicine added successfully!')
      navigate('/supplier/medicines')
    } catch (error) {
      console.error('Failed to add medicine:', error)
      toast.error(error.response?.data?.message || 'Failed to add medicine')
    } finally {
      setLoading(false)
    }
  }

  // Check if user is verified
  if (user?.verificationStatus !== 'VERIFIED') {
    return (
      <SupplierLayout>
        <ConfigProvider
          theme={{
            token: {
              colorPrimary: '#6366f1',
              borderRadius: 8,
            },
          }}
        >
          <div style={{ padding: '24px' }}>
            <Alert
              message="Account Not Verified"
              description="Your account must be verified by an administrator before you can add medicines. Please wait for admin approval."
              type="warning"
              showIcon
              style={{ marginBottom: 24 }}
            />
            <Button onClick={() => navigate('/supplier/medicines')}>
              Back to Medicines
            </Button>
          </div>
        </ConfigProvider>
      </SupplierLayout>
    )
  }

  return (
    <SupplierLayout>
      <ConfigProvider
        theme={{
          token: {
            colorPrimary: '#6366f1',
            borderRadius: 8,
          },
        }}
      >
        <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
          {/* Header */}
          <div
            style={{
              background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
              padding: '32px',
              borderRadius: '12px',
              marginBottom: '24px',
              boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
            }}
          >
            <Space direction="vertical" size={4}>
              <Space align="center">
                <MedicineBoxOutlined
                  style={{ fontSize: '32px', color: '#fff' }}
                />
                <Title level={2} style={{ margin: 0, color: '#fff' }}>
                  Add New Medicine
                </Title>
              </Space>
              <Text style={{ color: 'rgba(255, 255, 255, 0.9)', fontSize: '16px' }}>
                Fill in the details to add a new medicine to your inventory
              </Text>
            </Space>
          </div>

          {/* Form Card */}
          <Card
            style={{
              borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0, 0, 0, 0.08)',
            }}
          >
            <Form
              form={form}
              layout="vertical"
              onFinish={handleSubmit}
              initialValues={{
                currentStock: 0,
                minStockLevel: 10,
                status: 'AVAILABLE',
              }}
            >
              <Row gutter={24}>
                {/* Basic Information */}
                <Col span={24}>
                  <Title level={4} style={{ marginBottom: 16 }}>
                    Basic Information
                  </Title>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Medicine Name"
                    name="name"
                    rules={[
                      { required: true, message: 'Please enter medicine name' },
                    ]}
                  >
                    <Input
                      placeholder="Enter medicine name"
                      size="large"
                      prefix={<MedicineBoxOutlined />}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Generic Name"
                    name="genericName"
                    rules={[
                      { required: true, message: 'Please enter generic name' },
                    ]}
                  >
                    <Input placeholder="Enter generic name" size="large" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Category"
                    name="category"
                    rules={[{ required: true, message: 'Please select category' }]}
                  >
                    <Select placeholder="Select category" size="large">
                      {categories.map((category) => (
                        <Option key={category.id} value={category.name.toUpperCase()}>
                          {category.icon && `${category.icon} `}{category.name}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Manufacturer"
                    name="manufacturer"
                    rules={[
                      { required: true, message: 'Please enter manufacturer' },
                    ]}
                  >
                    <Input placeholder="Enter manufacturer name" size="large" />
                  </Form.Item>
                </Col>

                <Col xs={24}>
                  <Form.Item
                    label="Description"
                    name="description"
                    rules={[
                      { required: true, message: 'Please enter description' },
                    ]}
                  >
                    <TextArea
                      placeholder="Enter medicine description"
                      rows={4}
                      size="large"
                    />
                  </Form.Item>
                </Col>

                {/* Image Upload Section */}
                <Col span={24}>
                  <Title level={4} style={{ marginTop: 24, marginBottom: 16 }}>
                    Medicine Image
                  </Title>
                </Col>

                <Col xs={24}>
                  <Form.Item label="Upload Image" extra="Upload a clear image of the medicine. Max size: 10MB">
                    <Space direction="vertical" style={{ width: '100%' }} size="large">
                      <Upload
                        accept="image/*"
                        beforeUpload={handleImageUpload}
                        showUploadList={false}
                        disabled={imageUploading}
                      >
                        <Button
                          icon={<UploadOutlined />}
                          loading={imageUploading}
                          size="large"
                          style={{ width: '100%', maxWidth: '300px' }}
                        >
                          {imageUploading ? 'Uploading...' : 'Select Image'}
                        </Button>
                      </Upload>

                      {imagePreview && (
                        <Card
                          style={{
                            maxWidth: '400px',
                            borderRadius: '8px',
                            overflow: 'hidden'
                          }}
                          styles={{ body: { padding: '12px' } }}
                        >
                          <Space direction="vertical" size="small" style={{ width: '100%' }}>
                            <Text type="secondary">Image Preview:</Text>
                            <Image
                              src={imagePreview}
                              alt="Medicine preview"
                              style={{
                                width: '100%',
                                height: 'auto',
                                maxHeight: '300px',
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
                              }}
                            >
                              Remove Image
                            </Button>
                          </Space>
                        </Card>
                      )}

                      {!imagePreview && (
                        <Card
                          style={{
                            maxWidth: '400px',
                            borderRadius: '8px',
                            background: '#f5f5f5',
                            borderStyle: 'dashed'
                          }}
                          styles={{ body: { padding: '32px', textAlign: 'center' } }}
                        >
                          <Space direction="vertical" align="center">
                            <PictureOutlined style={{ fontSize: '48px', color: '#999' }} />
                            <Text type="secondary">No image uploaded yet</Text>
                          </Space>
                        </Card>
                      )}
                    </Space>
                  </Form.Item>
                </Col>

                {/* Inventory Details */}
                <Col span={24}>
                  <Title level={4} style={{ marginTop: 24, marginBottom: 16 }}>
                    Inventory Details
                  </Title>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    label="Batch Number"
                    name="batchNumber"
                    rules={[
                      { required: true, message: 'Please enter batch number' },
                    ]}
                  >
                    <Input placeholder="Enter batch number" size="large" />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    label="Current Stock"
                    name="currentStock"
                    rules={[
                      { required: true, message: 'Please enter current stock' },
                    ]}
                  >
                    <InputNumber
                      placeholder="Enter stock quantity"
                      size="large"
                      style={{ width: '100%' }}
                      min={0}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={8}>
                  <Form.Item
                    label="Min Stock Level"
                    name="minStockLevel"
                    rules={[
                      { required: true, message: 'Please enter min stock level' },
                    ]}
                  >
                    <InputNumber
                      placeholder="Enter min stock level"
                      size="large"
                      style={{ width: '100%' }}
                      min={0}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Unit Price (Rs.)"
                    name="unitPrice"
                    rules={[
                      { required: true, message: 'Please enter unit price' },
                    ]}
                  >
                    <InputNumber
                      placeholder="Enter unit price"
                      size="large"
                      style={{ width: '100%' }}
                      min={0}
                      precision={2}
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Dosage Form"
                    name="dosageForm"
                    rules={[
                      { required: true, message: 'Please enter dosage form' },
                    ]}
                  >
                    <Input placeholder="e.g., Tablet, Capsule, Syrup" size="large" />
                  </Form.Item>
                </Col>

                {/* Date Information */}
                <Col span={24}>
                  <Title level={4} style={{ marginTop: 24, marginBottom: 16 }}>
                    Date Information
                  </Title>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Manufacturing Date"
                    name="manufacturingDate"
                    rules={[
                      { required: true, message: 'Please select manufacturing date' },
                    ]}
                  >
                    <DatePicker
                      placeholder="Select manufacturing date"
                      size="large"
                      style={{ width: '100%' }}
                      disabledDate={(current) =>
                        current && current > dayjs().endOf('day')
                      }
                    />
                  </Form.Item>
                </Col>

                <Col xs={24} md={12}>
                  <Form.Item
                    label="Expiry Date"
                    name="expiryDate"
                    rules={[
                      { required: true, message: 'Please select expiry date' },
                    ]}
                  >
                    <DatePicker
                      placeholder="Select expiry date"
                      size="large"
                      style={{ width: '100%' }}
                      disabledDate={(current) =>
                        current && current < dayjs().endOf('day')
                      }
                    />
                  </Form.Item>
                </Col>

                {/* Action Buttons */}
                <Col span={24}>
                  <Form.Item style={{ marginTop: 32, marginBottom: 0 }}>
                    <Space size="middle">
                      <Button
                        type="primary"
                        htmlType="submit"
                        size="large"
                        icon={<SaveOutlined />}
                        loading={loading}
                        style={{
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          border: 'none',
                          minWidth: '150px',
                        }}
                      >
                        Add Medicine
                      </Button>
                      <Button
                        size="large"
                        icon={<CloseOutlined />}
                        onClick={() => navigate('/supplier/medicines')}
                        disabled={loading}
                      >
                        Cancel
                      </Button>
                    </Space>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Card>
        </div>
      </ConfigProvider>
    </SupplierLayout>
  )
}

export default AddMedicine

