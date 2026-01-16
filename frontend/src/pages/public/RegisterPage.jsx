import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import toast from 'react-hot-toast'
import { Layout, Form, Input, Button, Select, Upload, Card, Typography, Space, Row, Col, Checkbox, Progress, Alert, Steps, Image } from 'antd'
import { UserAddOutlined, UploadOutlined, DeleteOutlined, HomeOutlined, LoginOutlined, MailOutlined, CheckCircleOutlined, EyeOutlined } from '@ant-design/icons'
import { ConfigProvider } from 'antd'
import axios from 'axios'

const { Header, Content, Footer } = Layout
const { Title, Text, Paragraph } = Typography
const { Option } = Select
const { Step } = Steps

const RegisterPage = () => {
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [documentUploading, setDocumentUploading] = useState(false)
  const [fileList, setFileList] = useState([])
  const { register } = useAuth()
  const navigate = useNavigate()
  const role = Form.useWatch('role', form)
  
  // Step management
  const [currentStep, setCurrentStep] = useState(0) // 0: Email verification, 1: Registration form
  const [emailVerified, setEmailVerified] = useState(false)
  const [verificationCode, setVerificationCode] = useState('')
  const [sentCode, setSentCode] = useState('')
  const [emailToVerify, setEmailToVerify] = useState('')
  const [sendingCode, setSendingCode] = useState(false)
  const [verifyingCode, setVerifyingCode] = useState(false)
  const [previewVisible, setPreviewVisible] = useState(false)
  const [previewImage, setPreviewImage] = useState('')

  const getPasswordStrength = (password) => {
    if (!password) return { strength: 0, label: '', color: '' }
    if (password.length < 6) return { strength: 25, label: 'Weak', color: '#ff4d4f' }
    if (password.length < 8) return { strength: 50, label: 'Fair', color: '#faad14' }
    if (password.length < 12) return { strength: 75, label: 'Good', color: '#1890ff' }
    return { strength: 100, label: 'Strong', color: '#52c41a' }
  }

  const password = Form.useWatch('password', form)
  const passwordStrength = getPasswordStrength(password)

  const handleSendVerificationCode = async () => {
    if (!emailToVerify || !emailToVerify.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) {
      toast.error('Please enter a valid email address')
      return
    }
    
    setSendingCode(true)
    try {
      // Backend will generate and send the code
      const response = await axios.post('/api/auth/send-verification-code', {
        email: emailToVerify
      })
      
      toast.success('Verification code sent to your email! Please check your inbox.')
      setSentCode('sent') // Just mark that code was sent
    } catch (error) {
      console.error('Error sending verification code:', error)
      toast.error(error.response?.data?.message || 'Failed to send verification code')
    } finally {
      setSendingCode(false)
    }
  }

  const handleVerifyCode = async () => {
    if (!verificationCode) {
      toast.error('Please enter the verification code')
      return
    }
    
    setVerifyingCode(true)
    try {
      const response = await axios.post('/api/auth/verify-code', {
        email: emailToVerify,
        code: verificationCode
      })
      
      if (response.data.verified) {
        setEmailVerified(true)
        setCurrentStep(1)
        form.setFieldsValue({ email: emailToVerify })
        toast.success('Email verified successfully! Please complete your registration.')
      } else {
        toast.error('Invalid verification code. Please try again.')
      }
    } catch (error) {
      console.error('Error verifying code:', error)
      toast.error(error.response?.data?.message || 'Invalid verification code')
    } finally {
      setVerifyingCode(false)
    }
  }

  const handleFileChange = ({ fileList: newFileList }) => {
    setFileList(newFileList)
  }

  const handlePreview = async (file) => {
    if (!file.url && !file.preview) {
      file.preview = await getBase64(file.originFileObj)
    }
    setPreviewImage(file.url || file.preview)
    setPreviewVisible(true)
  }

  const getBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader()
      reader.readAsDataURL(file)
      reader.onload = () => resolve(reader.result)
      reader.onerror = (error) => reject(error)
    })
  }

  const beforeUpload = (file) => {
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'application/pdf']
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a PDF or image file (JPG, PNG, GIF)')
      return Upload.LIST_IGNORE
    }
    if (file.size > 10 * 1024 * 1024) {
      toast.error('File size must be less than 10MB')
      return Upload.LIST_IGNORE
    }
    return false // Prevent auto upload
  }

  const handleSubmit = async (values) => {
    if (!emailVerified) {
      toast.error('Please verify your email first')
      return
    }

    if (!values.termsAccepted) {
      toast.error('Please accept the terms and conditions')
      return
    }

    // Validate legal document for pharmacy and supplier
    if ((values.role === 'PHARMACY' || values.role === 'SUPPLIER') && fileList.length === 0) {
      toast.error('Please upload your legal document (license certificate, registration document, etc.)')
      return
    }

    setLoading(true)
    
    try {
      let legalDocumentUrl = null
      
      // Upload legal document if provided
      if (fileList.length > 0 && (values.role === 'PHARMACY' || values.role === 'SUPPLIER')) {
        setDocumentUploading(true)
        try {
          const formDataUpload = new FormData()
          formDataUpload.append('file', fileList[0].originFileObj)
          
          const uploadResponse = await fetch('/api/images/upload-document', {
            method: 'POST',
            body: formDataUpload
          })
          
          if (!uploadResponse.ok) {
            const errorData = await uploadResponse.json()
            throw new Error(errorData.error || 'Failed to upload document')
          }
          
          const uploadData = await uploadResponse.json()
          legalDocumentUrl = uploadData.documentUrl || uploadData.imageUrl
        } catch (error) {
          console.error('Document upload error:', error)
          toast.error(error.message || 'Failed to upload document. Please try again.')
          setLoading(false)
          setDocumentUploading(false)
          return
        }
        setDocumentUploading(false)
      }

      // For USER role, backend will auto-generate organizationName and licenseNumber
      const submitData = { ...values }
      if (submitData.role === 'USER') {
        submitData.organizationName = ''
        submitData.licenseNumber = ''
      }
      
      // Add legal document URL if uploaded
      if (legalDocumentUrl) {
        submitData.legalDocumentUrl = legalDocumentUrl
      }

      const result = await register(submitData)
      setLoading(false)

      if (result.success) {
        toast.success('Registration successful! Your account has been created. Please wait for admin verification.')
        navigate('/login')
      } else {
        toast.error(result.error || 'Registration failed')
      }
    } catch (error) {
      setLoading(false)
      setDocumentUploading(false)
      toast.error('Registration failed. Please try again.')
    }
  }

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#4F46E5',
          borderRadius: 8,
        },
      }}
    >
      <Layout style={{ minHeight: '100vh', background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
        <Header 
          style={{ 
            background: '#fff', 
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            position: 'sticky',
            top: 0,
            zIndex: 1000,
            padding: '0 50px',
            height: '80px',
            lineHeight: '80px'
          }}
        >
          <Row justify="space-between" align="middle" style={{ maxWidth: 1400, margin: '0 auto' }}>
            <Col>
              <Link to="/">
                <Space style={{ cursor: 'pointer' }}>
                  <div style={{ 
                    width: 40, 
                    height: 40, 
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 8,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                  }}>
                    <Text strong style={{ color: '#fff', fontSize: 20 }}>M</Text>
                  </div>
                  <Title level={3} style={{ margin: 0, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                    MediTrack
                  </Title>
                </Space>
              </Link>
            </Col>
            <Col flex="auto" style={{ display: 'flex', justifyContent: 'center' }}>
              <Space size="large">
                <Link to="/">
                  <Button 
                    type="text" 
                    icon={<HomeOutlined />}
                    style={{ fontWeight: 500 }}
                  >
                    Home
                  </Button>
                </Link>
                <Button 
                  type="text"
                  onClick={() => {
                    window.location.href = '/#features'
                  }}
                  style={{ fontWeight: 500 }}
                >
                  Features
                </Button>
                <Button 
                  type="text"
                  onClick={() => {
                    window.location.href = '/#how-it-works'
                  }}
                  style={{ fontWeight: 500 }}
                >
                  How It Works
                </Button>
                <Button 
                  type="text"
                  onClick={() => {
                    window.location.href = '/#about'
                  }}
                  style={{ fontWeight: 500 }}
                >
                  About Us
                </Button>
                <Button 
                  type="text"
                  onClick={() => {
                    window.location.href = '/#contact'
                  }}
                  style={{ fontWeight: 500 }}
                >
                  Contact
                </Button>
              </Space>
            </Col>
            <Col>
              <Space size="middle">
                <Link to="/login">
                  <Button icon={<LoginOutlined />} style={{ fontWeight: 500 }}>
                    Login
                  </Button>
                </Link>
                <Link to="/register">
                  <Button type="primary" icon={<UserAddOutlined />} style={{ fontWeight: 500 }}>
                    Register
                  </Button>
                </Link>
              </Space>
            </Col>
          </Row>
        </Header>

        <Content style={{ padding: '50px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <Card
            style={{
              width: '100%',
              maxWidth: currentStep === 0 ? 600 : 900,
              borderRadius: 16,
              boxShadow: '0 10px 40px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <Title level={2} style={{ marginBottom: 8, background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
                Create Account
              </Title>
              <Paragraph style={{ color: '#666', fontSize: 16 }}>
                Register to start managing your medicine inventory
              </Paragraph>
            </div>

            <Steps current={currentStep} style={{ marginBottom: 32 }}>
              <Step title="Verify Email" icon={<MailOutlined />} />
              <Step title="Complete Registration" icon={<UserAddOutlined />} />
            </Steps>

            {currentStep === 0 && (
              <div style={{ maxWidth: 500, margin: '0 auto' }}>
                <Alert
                  message="Email Verification Required"
                  description="Please verify your email address before registering. We'll send you a verification code."
                  type="info"
                  showIcon
                  style={{ marginBottom: 24 }}
                />
                
                <Space direction="vertical" style={{ width: '100%' }} size="large">
                  <div>
                    <Text strong style={{ marginBottom: 8, display: 'block' }}>Email Address</Text>
                    <Space.Compact style={{ width: '100%' }}>
                      <Input
                        size="large"
                        placeholder="Enter your email address"
                        value={emailToVerify}
                        onChange={(e) => setEmailToVerify(e.target.value)}
                        onPressEnter={handleSendVerificationCode}
                        prefix={<MailOutlined />}
                      />
                      <Button
                        type="primary"
                        size="large"
                        onClick={handleSendVerificationCode}
                        loading={sendingCode}
                        disabled={!emailToVerify}
                      >
                        Send Code
                      </Button>
                    </Space.Compact>
                  </div>

                  {sentCode && (
                    <div>
                      <Text strong style={{ marginBottom: 8, display: 'block' }}>Verification Code</Text>
                      <Space.Compact style={{ width: '100%' }}>
                        <Input
                          size="large"
                          placeholder="Enter 6-digit code"
                          value={verificationCode}
                          onChange={(e) => setVerificationCode(e.target.value)}
                          onPressEnter={handleVerifyCode}
                          maxLength={6}
                          prefix={<CheckCircleOutlined />}
                        />
                        <Button
                          type="primary"
                          size="large"
                          onClick={handleVerifyCode}
                          loading={verifyingCode}
                          disabled={!verificationCode || verificationCode.length !== 6}
                        >
                          Verify
                        </Button>
                      </Space.Compact>
                      <Text type="secondary" style={{ fontSize: 12, marginTop: 8, display: 'block' }}>
                        Didn't receive the code? <Button type="link" size="small" onClick={handleSendVerificationCode}>Resend</Button>
                      </Text>
                    </div>
                  )}
                </Space>
              </div>
            )}

            {currentStep === 1 && (
              <Form
                form={form}
                name="register"
                onFinish={handleSubmit}
                layout="vertical"
                size="large"
                scrollToFirstError
              >
                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="fullName"
                      label="Full Name"
                      rules={[{ required: true, message: 'Please enter your full name' }]}
                    >
                      <Input placeholder="Enter your full name" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="email"
                      label="Email"
                      rules={[
                        { required: true, message: 'Please enter your email' },
                        { type: 'email', message: 'Please enter a valid email address' }
                      ]}
                    >
                      <Input placeholder="Enter your email" disabled suffix={<CheckCircleOutlined style={{ color: '#52c41a' }} />} />
                    </Form.Item>
                  </Col>
                </Row>

                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="phoneNumber"
                      label="Phone Number"
                      rules={[{ required: true, message: 'Please enter your phone number' }]}
                    >
                      <Input placeholder="Enter your phone number" />
                    </Form.Item>
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="role"
                      label="Role"
                      rules={[{ required: true, message: 'Please select your role' }]}
                      initialValue="USER"
                    >
                      <Select placeholder="Select your role">
                        <Option value="USER">General User</Option>
                        <Option value="SUPPLIER">Supplier</Option>
                        <Option value="PHARMACY">Pharmacy</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                {role && role !== 'USER' && (
                  <>
                    <Alert
                      message="Business Account Verification"
                      description="As a Supplier/Pharmacy, your account will require admin verification before you can list medicines. Please upload your legal documents."
                      type="warning"
                      showIcon
                      style={{ marginBottom: 24 }}
                    />

                    <Form.Item
                      name="organizationName"
                      label="Organization Name"
                      rules={[{ required: true, message: 'Please enter organization name' }]}
                    >
                      <Input placeholder="Enter your organization name" />
                    </Form.Item>

                    <Form.Item
                      name="licenseNumber"
                      label="License Number"
                      rules={[{ required: true, message: 'Please enter license number' }]}
                    >
                      <Input placeholder="Enter your license number" />
                    </Form.Item>

                    <Form.Item
                      label="Legal Document (License/Registration Certificate)"
                      required
                      tooltip="Upload your business license or registration certificate (PDF, JPG, PNG or GIF - Max 10MB)"
                    >
                      <Upload
                        fileList={fileList}
                        onChange={handleFileChange}
                        beforeUpload={beforeUpload}
                        onPreview={handlePreview}
                        maxCount={1}
                        listType="picture-card"
                      >
                        {fileList.length < 1 && (
                          <div>
                            <UploadOutlined style={{ fontSize: 32, color: '#4F46E5' }} />
                            <div style={{ marginTop: 8, fontSize: 14 }}>Upload Document</div>
                            <div style={{ fontSize: 12, color: '#999', marginTop: 4 }}>PDF or Image</div>
                          </div>
                        )}
                      </Upload>
                      {fileList.length > 0 && (
                        <div style={{ marginTop: 12 }}>
                          <Alert
                            message="Document uploaded successfully"
                            description={`File: ${fileList[0].name}`}
                            type="success"
                            showIcon
                            closable
                            onClose={() => setFileList([])}
                          />
                        </div>
                      )}
                    </Form.Item>
                  </>
                )}

                <Form.Item
                  name="address"
                  label="Address"
                  rules={[{ required: true, message: 'Please enter your address' }]}
                >
                  <Input.TextArea rows={3} placeholder="Enter your complete address" />
                </Form.Item>

                <Row gutter={16}>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="password"
                      label="Password"
                      rules={[
                        { required: true, message: 'Please enter your password' },
                        { min: 6, message: 'Password must be at least 6 characters' }
                      ]}
                    >
                      <Input.Password placeholder="Enter your password" />
                    </Form.Item>
                    {password && (
                      <div style={{ marginTop: -16, marginBottom: 16 }}>
                        <Progress 
                          percent={passwordStrength.strength} 
                          strokeColor={passwordStrength.color}
                          showInfo={false}
                          size="small"
                        />
                        <Text style={{ fontSize: 12, color: passwordStrength.color }}>
                          {passwordStrength.label}
                        </Text>
                      </div>
                    )}
                  </Col>
                  <Col xs={24} md={12}>
                    <Form.Item
                      name="confirmPassword"
                      label="Confirm Password"
                      dependencies={['password']}
                      rules={[
                        { required: true, message: 'Please confirm your password' },
                        ({ getFieldValue }) => ({
                          validator(_, value) {
                            if (!value || getFieldValue('password') === value) {
                              return Promise.resolve()
                            }
                            return Promise.reject(new Error('Passwords do not match'))
                          },
                        }),
                      ]}
                    >
                      <Input.Password placeholder="Confirm your password" />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item
                  name="termsAccepted"
                  valuePropName="checked"
                  rules={[
                    {
                      validator: (_, value) =>
                        value ? Promise.resolve() : Promise.reject(new Error('Please accept the terms and conditions')),
                    },
                  ]}
                >
                  <Checkbox>
                    I agree to the Terms & Conditions and Privacy Policy
                  </Checkbox>
                </Form.Item>

                <Form.Item>
                  <Space style={{ width: '100%' }} direction="vertical">
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={loading || documentUploading}
                      block
                      icon={<UserAddOutlined />}
                      style={{ height: 48 }}
                    >
                      {documentUploading ? 'Uploading document...' : loading ? 'Creating account...' : 'Create Account'}
                    </Button>
                    <Button
                      type="default"
                      block
                      onClick={() => {
                        setCurrentStep(0)
                        setEmailVerified(false)
                        setVerificationCode('')
                        setSentCode('')
                      }}
                    >
                      Back to Email Verification
                    </Button>
                  </Space>
                </Form.Item>
              </Form>
            )}

            <div style={{ textAlign: 'center', marginTop: 24 }}>
              <Text type="secondary">
                Already have an account?{' '}
                <Link to="/login">
                  <Text strong style={{ color: '#4F46E5' }}>Login Now</Text>
                </Link>
              </Text>
            </div>

            <div style={{ textAlign: 'center', marginTop: 16 }}>
              <Link to="/">
                <Text type="secondary">
                  ← Back to Home
                </Text>
              </Link>
            </div>
          </Card>
        </Content>

        {/* Image Preview Modal */}
        <Image
          preview={{
            visible: previewVisible,
            onVisibleChange: (visible) => setPreviewVisible(visible),
          }}
          src={previewImage}
          style={{ display: 'none' }}
        />

        <Footer style={{ textAlign: 'center', background: '#001529', color: '#fff', padding: '40px 50px' }}>
          <Row gutter={[48, 24]} justify="center">
            <Col xs={24} sm={8}>
              <Title level={5} style={{ color: '#fff', marginBottom: 12 }}>MediTrack</Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                Empowering healthcare with smart medicine management
              </Paragraph>
            </Col>
            <Col xs={24} sm={8}>
              <Title level={5} style={{ color: '#fff', marginBottom: 12 }}>Contact</Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                Email: info@meditrack.com
                <br />
                Phone: +977-1-1234567
              </Paragraph>
            </Col>
            <Col xs={24} sm={8}>
              <Title level={5} style={{ color: '#fff', marginBottom: 12 }}>Location</Title>
              <Paragraph style={{ color: 'rgba(255,255,255,0.65)', margin: 0 }}>
                Kathmandu, Nepal
              </Paragraph>
            </Col>
          </Row>
          <div style={{ marginTop: 32, paddingTop: 24, borderTop: '1px solid rgba(255,255,255,0.1)' }}>
            <Text style={{ color: 'rgba(255,255,255,0.65)' }}>
              &copy; 2024 MediTrack. All rights reserved.
            </Text>
          </div>
        </Footer>
      </Layout>
    </ConfigProvider>
  )
}

export default RegisterPage
