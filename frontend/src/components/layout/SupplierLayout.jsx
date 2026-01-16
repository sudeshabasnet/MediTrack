import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Layout, Menu, Avatar, Typography, Space, Badge, Button, Drawer } from 'antd'

const { ItemGroup } = Menu
import {
  HomeOutlined,
  MedicineBoxOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
  AppstoreOutlined,
  DollarOutlined,
  FileTextOutlined,
  SettingOutlined,
  BellOutlined
} from '@ant-design/icons'
import { ConfigProvider } from 'antd'

const { Header, Sider, Content } = Layout
const { Text } = Typography

const SupplierLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuContainerRef = useRef(null)

  useEffect(() => {
    // Restore scroll position
    const savedScroll = sessionStorage.getItem('supplierMenuScroll')
    if (savedScroll && menuContainerRef.current) {
      setTimeout(() => {
        if (menuContainerRef.current) {
          menuContainerRef.current.scrollTop = Number(savedScroll)
        }
      }, 100)
    }
  }, [location.pathname])

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const handleScroll = (e) => {
    sessionStorage.setItem('supplierMenuScroll', e.target.scrollTop)
  }

  const getSelectedKey = () => {
    return location.pathname
  }

  const getStoredAvatar = () => {
    const stored = localStorage.getItem(`avatar_${user?.id || 'default'}`)
    if (stored) {
      const parsed = JSON.parse(stored)
      return parsed.imageUrl
    }
    return 'https://api.dicebear.com/7.x/avataaars/svg?seed=Supplier&backgroundColor=b6e3f4'
  }

  const menuItems = (
    <Menu
      mode="inline"
      selectedKeys={[getSelectedKey()]}
      style={{
        border: 'none',
        background: 'transparent',
        color: '#000'
      }}
    >
      <Menu.Item key="/supplier/dashboard" icon={<HomeOutlined />}>
        <Link to="/supplier/dashboard">Dashboard</Link>
      </Menu.Item>

      <Menu.Divider style={{ borderColor: '#e0e0e0', margin: '8px 0' }} />

      <ItemGroup title={<span style={{ color: '#888', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Inventory Management</span>}>
        <Menu.Item key="/supplier/medicines" icon={<MedicineBoxOutlined />}>
          <Link to="/supplier/medicines">My Medicines</Link>
        </Menu.Item>
        <Menu.Item key="/supplier/medicines/add" icon={<AppstoreOutlined />}>
          <Link to="/supplier/medicines/add">Add Medicine</Link>
        </Menu.Item>
        <Menu.Item key="/supplier/inventory" icon={<FileTextOutlined />}>
          <Link to="/supplier/inventory">Inventory Tracking</Link>
        </Menu.Item>
      </ItemGroup>

      <Menu.Divider style={{ borderColor: '#e0e0e0', margin: '8px 0' }} />

      <ItemGroup title={<span style={{ color: '#888', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Sales & Analytics</span>}>
        <Menu.Item key="/supplier/orders" icon={<ShoppingCartOutlined />}>
          <Link to="/supplier/orders">Orders</Link>
        </Menu.Item>

      </ItemGroup>

      <Menu.Divider style={{ borderColor: '#e0e0e0', margin: '8px 0' }} />

      <ItemGroup title={<span style={{ color: '#888', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Account</span>}>
        <Menu.Item key="/supplier/profile" icon={<UserOutlined />}>
          <Link to="/supplier/profile">My Profile</Link>
        </Menu.Item>
        <Menu.Item key="/supplier/notifications" icon={<BellOutlined />}>
          <Link to="/supplier/notifications">
            <Space>
              <span>Notifications</span>
              <Badge count={0} size="small" />
            </Space>
          </Link>
        </Menu.Item>
        <Menu.Item key="/supplier/settings" icon={<SettingOutlined />}>
          <Link to="/supplier/settings">Settings</Link>
        </Menu.Item>
      </ItemGroup>
    </Menu>
  )

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: '#6366f1',
          borderRadius: 8,
        },
        components: {
          Menu: {
            itemBg: 'transparent',
            itemHoverBg: '#f0f0f0',
            itemSelectedBg: '#e6e8ff',
            itemActiveBg: '#f0f0f0',
            itemHoverColor: '#000',
            itemSelectedColor: '#6366f1',
            subMenuItemBg: 'transparent',
            colorText: '#000',
            colorTextSecondary: '#666',
          },
        },
      }}
    >
      <Layout style={{ minHeight: '100vh' }}>
        {/* Mobile Drawer */}
        <Drawer
          title={
            <Space>
              <div style={{
                width: 32,
                height: 32,
                background: '#6366f1',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text strong style={{ color: '#fff', fontSize: 16 }}>M</Text>
              </div>
              <Text strong>MediTrack</Text>
            </Space>
          }
          placement="left"
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
          styles={{ body: { padding: 0 } }}
          size="default"
        >
          {menuItems}
          <div style={{ padding: '16px', borderTop: '1px solid #f0f0f0' }}>
            <Button
              danger
              block
              icon={<LogoutOutlined />}
              onClick={handleLogout}
            >
              Logout
            </Button>
          </div>
        </Drawer>

        {/* Desktop Sidebar */}
        <Sider
          breakpoint="lg"
          collapsedWidth="0"
          onCollapse={(collapsed) => setCollapsed(collapsed)}
          width={280}
          style={{
            background: '#ffffff',
            boxShadow: '2px 0 8px rgba(0,0,0,0.08)',
            display: 'flex',
            flexDirection: 'column',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            zIndex: 100
          }}
          className="supplier-sidebar"
        >
          {/* Logo */}
          <div style={{
            padding: '24px 16px',
            borderBottom: '1px solid #e0e0e0',
            flexShrink: 0
          }}>
            <Space>
              <div style={{
                width: 40,
                height: 40,
                background: '#6366f1',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text strong style={{ color: '#fff', fontSize: 20 }}>M</Text>
              </div>
              <div>
                <Text strong style={{ color: '#000', fontSize: 18, display: 'block' }}>
                  MediTrack
                </Text>
                <Text style={{ color: '#666', fontSize: 12 }}>
                  Supplier Portal
                </Text>
              </div>
            </Space>
          </div>

          {/* User Info */}
          <div style={{
            padding: '16px',
            borderBottom: '1px solid #e0e0e0',
            background: '#f5f5f5',
            flexShrink: 0
          }}>
            <Space>
              <Avatar
                size={48}
                src={getStoredAvatar()}
                icon={<UserOutlined />}
                style={{ border: '2px solid #6366f1' }}
              />
              <div style={{ flex: 1 }}>
                <Text strong style={{ color: '#000', display: 'block', fontSize: 14 }}>
                  {user?.fullName || 'Supplier'}
                </Text>
                <Text style={{ color: '#666', fontSize: 12 }}>
                  {user?.organizationName || 'Organization'}
                </Text>
                {user?.verificationStatus && (
                  <div style={{ marginTop: 4 }}>
                    <Badge
                      status={user.verificationStatus === 'VERIFIED' ? 'success' : user.verificationStatus === 'PENDING' ? 'warning' : 'error'}
                      text={
                        <Text style={{ color: '#666', fontSize: 11 }}>
                          {user.verificationStatus}
                        </Text>
                      }
                    />
                  </div>
                )}
              </div>
            </Space>
          </div>

          {/* Scrollable Menu */}
          <div
            ref={menuContainerRef}
            onScroll={handleScroll}
            className="supplier-sidebar-menu-container"
            style={{
              flex: 1,
              overflowY: 'auto',
              overflowX: 'hidden',
              minHeight: 0,
              maxHeight: 'calc(100vh - 250px)'
            }}
          >
            {menuItems}
          </div>

          {/* Logout Button */}
          <div style={{
            padding: '16px',
            borderTop: '1px solid #e0e0e0',
            background: '#f9f9f9',
            flexShrink: 0
          }}>
            <Button
              danger
              block
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              style={{
                height: 40,
                fontWeight: 500
              }}
            >
              Logout
            </Button>
          </div>
        </Sider>

        <Layout style={{ marginLeft: window.innerWidth >= 992 ? 280 : 0 }}>
          {/* Mobile Header */}
          <Header
            style={{
              background: '#fff',
              padding: '0 16px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
              display: window.innerWidth < 992 ? 'flex' : 'none',
              alignItems: 'center',
              justifyContent: 'space-between',
              position: 'sticky',
              top: 0,
              zIndex: 99
            }}
          >
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuOpen(true)}
              style={{ fontSize: 18 }}
            />
            <Space>
              <Text strong>MediTrack</Text>
            </Space>
            <Avatar
              size={32}
              src={getStoredAvatar()}
              icon={<UserOutlined />}
            />
          </Header>

          <Content style={{
            minHeight: '100vh',
            background: '#f5f5f5'
          }}>
            {children}
          </Content>
        </Layout>

        {/* Custom Scrollbar Styles */}
        <style>{`
          .supplier-sidebar-menu-container::-webkit-scrollbar {
            width: 6px;
          }
          .supplier-sidebar-menu-container::-webkit-scrollbar-track {
            background: #f0f0f0;
            border-radius: 3px;
          }
          .supplier-sidebar-menu-container::-webkit-scrollbar-thumb {
            background: #d0d0d0;
            border-radius: 3px;
          }
          .supplier-sidebar-menu-container::-webkit-scrollbar-thumb:hover {
            background: #b0b0b0;
          }
          .supplier-sidebar .ant-menu-item:hover,
          .supplier-sidebar .ant-menu-submenu-title:hover {
            background: #f0f0f0 !important;
            color: #000 !important;
            transition: all 0.3s ease;
          }
          .supplier-sidebar .ant-menu-item-selected {
            background: #e6e8ff !important;
            color: #6366f1 !important;
            font-weight: 500;
          }
          .supplier-sidebar .ant-menu-item-selected::after {
            border-right: 3px solid #6366f1;
          }
        `}</style>
      </Layout>
    </ConfigProvider>
  )
}

export default SupplierLayout

