import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import axios from 'axios'
import { Layout, Menu, Avatar, Typography, Space, Badge, Button, Drawer } from 'antd'

const { ItemGroup } = Menu
import {
  HomeOutlined,
  UserOutlined,
  MedicineBoxOutlined,
  PlusOutlined,
  ShoppingCartOutlined,
  BarChartOutlined,
  ClockCircleOutlined,
  ShopOutlined,
  BellOutlined,
  SettingOutlined,
  LogoutOutlined,
  MenuOutlined,
  SafetyOutlined,
  AppstoreOutlined
} from '@ant-design/icons'
import { ConfigProvider } from 'antd'

const { Header, Sider, Content } = Layout
const { Text } = Typography

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [pendingVerificationsCount, setPendingVerificationsCount] = useState(0)
  const menuContainerRef = useRef(null)

  useEffect(() => {
    fetchPendingVerifications()
    // Restore scroll position
    const savedScroll = sessionStorage.getItem('adminMenuScroll')
    if (savedScroll && menuContainerRef.current) {
      setTimeout(() => {
        if (menuContainerRef.current) {
          menuContainerRef.current.scrollTop = Number(savedScroll)
        }
      }, 100)
    }
  }, [location.pathname])

  const fetchPendingVerifications = async () => {
    try {
      const response = await axios.get('/api/admin/users/pending-verification')
      setPendingVerificationsCount(response.data?.length || 0)
    } catch (error) {
      console.error('Failed to fetch pending verifications:', error)
    }
  }

  const handleLogout = () => {
    logout()
    navigate('/login')
  }


  const getSelectedKey = () => {
    const path = location.pathname
    const search = location.search
    
    if (path === '/admin/users' && search.includes('tab=pending')) {
      return '/admin/users?tab=pending'
    }
    return path
  }

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
          <Menu
            mode="inline"
            selectedKeys={[getSelectedKey()]}
            style={{ border: 'none' }}
          >
            <Menu.Item key="/admin/dashboard" icon={<HomeOutlined />}>
              <Link to="/admin/dashboard">Dashboard</Link>
            </Menu.Item>
            
            <Menu.Divider style={{ borderColor: '#e0e0e0', margin: '8px 0' }} />
            
            <ItemGroup title={<span style={{ color: '#888', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>User Management</span>}>
              <Menu.Item key="/admin/users" icon={<UserOutlined />}>
                <Link to="/admin/users">All Users</Link>
              </Menu.Item>
              <Menu.Item key="/admin/verification" icon={<SafetyOutlined />}>
                <Link to="/admin/verification">
                  <Space>
                    <span>User Verification</span>
                    {pendingVerificationsCount > 0 && (
                      <Badge count={pendingVerificationsCount} size="small" />
                    )}
                  </Space>
                </Link>
              </Menu.Item>
              <Menu.Item key="/admin/suppliers" icon={<ShopOutlined />}>
                <Link to="/admin/suppliers">Suppliers</Link>
              </Menu.Item>
              <Menu.Item key="/admin/pharmacies" icon={<ShopOutlined />}>
                <Link to="/admin/pharmacies">Pharmacies</Link>
              </Menu.Item>
            </ItemGroup>
            
            <Menu.Divider style={{ borderColor: '#e0e0e0', margin: '8px 0' }} />
            
            <ItemGroup title={<span style={{ color: '#888', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Medicine Management</span>}>
              <Menu.Item key="/admin/medicines" icon={<MedicineBoxOutlined />}>
                <Link to="/admin/medicines">All Medicines</Link>
              </Menu.Item>
              <Menu.Item key="/admin/categories" icon={<AppstoreOutlined />}>
                <Link to="/admin/categories">Categories</Link>
              </Menu.Item>
            </ItemGroup>
            
            <Menu.Divider style={{ borderColor: '#e0e0e0', margin: '8px 0' }} />
            
            <ItemGroup title={<span style={{ color: '#888', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Orders & Reports</span>}>
              <Menu.Item key="/admin/orders" icon={<ShoppingCartOutlined />}>
                <Link to="/admin/orders">Orders</Link>
              </Menu.Item>
              <Menu.Item key="/admin/reports" icon={<BarChartOutlined />}>
                <Link to="/admin/reports">Reports & Analytics</Link>
              </Menu.Item>
            </ItemGroup>
            
            <Menu.Divider style={{ borderColor: '#e0e0e0', margin: '8px 0' }} />
            
            <ItemGroup title={<span style={{ color: '#888', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>System</span>}>
              <Menu.Item key="/admin/activity-logs" icon={<ClockCircleOutlined />}>
                <Link to="/admin/activity-logs">Activity Logs</Link>
              </Menu.Item>
              <Menu.Item key="/admin/alerts" icon={<BellOutlined />}>
                <Link to="/admin/alerts">Alerts & Notifications</Link>
              </Menu.Item>
              <Menu.Item key="/admin/settings" icon={<SettingOutlined />}>
                <Link to="/admin/settings">Settings</Link>
              </Menu.Item>
            </ItemGroup>
            
            <Menu.Divider style={{ borderColor: 'rgba(0,0,0,0.1)', margin: '16px 0' }} />
            
            <Menu.Item 
              key="logout" 
              icon={<LogoutOutlined />} 
              danger
              onClick={handleLogout}
              style={{ 
                background: 'rgba(255,77,79,0.1)',
                color: '#ff4d4f',
                margin: '8px',
                borderRadius: '8px'
              }}
            >
              Logout
            </Menu.Item>
          </Menu>
        </Drawer>

        {/* Desktop Sidebar */}
        <Sider
          collapsible
          collapsed={collapsed}
          onCollapse={setCollapsed}
          width={280}
          style={{
            overflow: 'hidden',
            height: '100vh',
            position: 'fixed',
            left: 0,
            top: 0,
            bottom: 0,
            background: '#ffffff',
            boxShadow: '2px 0 8px rgba(0,0,0,0.08)',
            zIndex: 100
          }}
          theme="light"
          className="hidden md:block"
        >
          <div style={{
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden'
          }}>
          <div style={{ 
            padding: '20px 16px', 
            borderBottom: '1px solid #e0e0e0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            flexShrink: 0
          }}>
            <Link to="/admin/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
              <div style={{ 
                width: collapsed ? 36 : 44, 
                height: collapsed ? 36 : 44, 
                background: '#6366f1',
                borderRadius: 12,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                transition: 'all 0.2s'
              }}>
                <Text strong style={{ color: '#fff', fontSize: collapsed ? 16 : 20 }}>M</Text>
              </div>
              {!collapsed && <Text strong style={{ fontSize: 20, color: '#000' }}>MediTrack</Text>}
            </Link>
          </div>

          {/* User Info */}
          {!collapsed && (
            <div style={{ 
              padding: '20px 16px', 
              borderBottom: '1px solid #e0e0e0',
              background: '#f5f5f5',
              margin: '8px',
              borderRadius: '12px',
              flexShrink: 0
            }}>
              <Space>
                <Avatar 
                  style={{ 
                    backgroundColor: '#6366f1',
                    border: '2px solid #6366f1'
                  }}
                  icon={<UserOutlined style={{ color: '#fff' }} />}
                >
                  {user?.fullName?.charAt(0)?.toUpperCase()}
                </Avatar>
                <div>
                  <div style={{ fontWeight: 600, color: '#000', fontSize: 14 }}>{user?.fullName || 'Admin'}</div>
                  <Text style={{ fontSize: 12, color: '#666' }}>{user?.email}</Text>
                </div>
              </Space>
            </div>
          )}

          {/* Navigation Menu */}
          <div 
            ref={menuContainerRef}
            className="admin-sidebar-menu-container"
            style={{ 
              flex: 1, 
              overflowY: 'auto', 
              overflowX: 'hidden',
              minHeight: 0,
              WebkitOverflowScrolling: 'touch',
              position: 'relative',
              paddingBottom: '8px'
            }}
            onScroll={(e) => {
              // Save scroll position
              if (menuContainerRef.current) {
                sessionStorage.setItem('adminMenuScroll', String(menuContainerRef.current.scrollTop))
              }
            }}
          >
            <Menu
              mode="inline"
              selectedKeys={[getSelectedKey()]}
              style={{ 
                border: 'none', 
                marginTop: 8,
                marginBottom: 8,
                background: 'transparent',
                color: '#000',
                height: 'auto',
                overflow: 'visible'
              }}
              theme="light"
              inlineIndent={16}
            >
            <style>{`
              .admin-sidebar-menu-container {
                overflow-y: auto !important;
                overflow-x: hidden !important;
              }
              .admin-sidebar-menu-container::-webkit-scrollbar {
                width: 6px;
              }
              .admin-sidebar-menu-container::-webkit-scrollbar-track {
                background: #f0f0f0;
                border-radius: 3px;
              }
              .admin-sidebar-menu-container::-webkit-scrollbar-thumb {
                background: #d0d0d0;
                border-radius: 3px;
              }
              .admin-sidebar-menu-container::-webkit-scrollbar-thumb:hover {
                background: #b0b0b0;
              }
              .ant-menu-light .ant-menu-item:hover,
              .ant-menu-light .ant-menu-item-active,
              .ant-menu-light .ant-menu-submenu:hover > .ant-menu-submenu-title {
                background: #f0f0f0 !important;
                border-radius: 8px;
                transition: all 0.3s ease;
              }
              .ant-menu-light .ant-menu-item-selected {
                background: #e6e8ff !important;
                color: #6366f1 !important;
                border-radius: 8px;
                box-shadow: 0 2px 8px rgba(99, 102, 241, 0.15);
              }
              .ant-menu-light .ant-menu-item-selected::after {
                border-right: 3px solid #6366f1;
              }
              .ant-menu-light .ant-menu-item-group-title {
                color: #888 !important;
                font-weight: 600;
                letter-spacing: 0.5px;
              }
              .ant-menu.ant-menu-inline {
                overflow: visible !important;
                height: auto !important;
              }
            `}</style>
            <Menu.Item key="/admin/dashboard" icon={<HomeOutlined />}>
              <Link to="/admin/dashboard">Dashboard</Link>
            </Menu.Item>
            
            <Menu.Divider style={{ borderColor: '#e0e0e0', margin: '8px 0' }} />
            
            <ItemGroup title={<span style={{ color: '#888', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>User Management</span>}>
              <Menu.Item key="/admin/users" icon={<UserOutlined />}>
                <Link to="/admin/users">All Users</Link>
              </Menu.Item>
              <Menu.Item key="/admin/verification" icon={<SafetyOutlined />}>
                <Link to="/admin/verification">
                  <Space>
                    <span>User Verification</span>
                    {pendingVerificationsCount > 0 && (
                      <Badge count={pendingVerificationsCount} size="small" />
                    )}
                  </Space>
                </Link>
              </Menu.Item>
              <Menu.Item key="/admin/suppliers" icon={<ShopOutlined />}>
                <Link to="/admin/suppliers">Suppliers</Link>
              </Menu.Item>
              <Menu.Item key="/admin/pharmacies" icon={<ShopOutlined />}>
                <Link to="/admin/pharmacies">Pharmacies</Link>
              </Menu.Item>
            </ItemGroup>
            
            <Menu.Divider style={{ borderColor: '#e0e0e0', margin: '8px 0' }} />
            
            <ItemGroup title={<span style={{ color: '#888', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Medicine Management</span>}>
              <Menu.Item key="/admin/medicines" icon={<MedicineBoxOutlined />}>
                <Link to="/admin/medicines">All Medicines</Link>
              </Menu.Item>
              <Menu.Item key="/admin/categories" icon={<AppstoreOutlined />}>
                <Link to="/admin/categories">Categories</Link>
              </Menu.Item>
            </ItemGroup>
            
            <Menu.Divider style={{ borderColor: '#e0e0e0', margin: '8px 0' }} />
            
            <ItemGroup title={<span style={{ color: '#888', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Orders & Reports</span>}>
              <Menu.Item key="/admin/orders" icon={<ShoppingCartOutlined />}>
                <Link to="/admin/orders">Orders</Link>
              </Menu.Item>
              <Menu.Item key="/admin/reports" icon={<BarChartOutlined />}>
                <Link to="/admin/reports">Reports & Analytics</Link>
              </Menu.Item>
            </ItemGroup>
            
            <Menu.Divider style={{ borderColor: '#e0e0e0', margin: '8px 0' }} />
            
            <ItemGroup title={<span style={{ color: '#888', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>System</span>}>
              <Menu.Item key="/admin/activity-logs" icon={<ClockCircleOutlined />}>
                <Link to="/admin/activity-logs">Activity Logs</Link>
              </Menu.Item>
              <Menu.Item key="/admin/alerts" icon={<BellOutlined />}>
                <Link to="/admin/alerts">Alerts & Notifications</Link>
              </Menu.Item>
              <Menu.Item key="/admin/settings" icon={<SettingOutlined />}>
                <Link to="/admin/settings">Settings</Link>
              </Menu.Item>
            </ItemGroup>
            </Menu>
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
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              block
              style={{ 
                textAlign: 'left', 
                height: 44,
                borderRadius: '8px',
                fontWeight: 500
              }}
            >
              {!collapsed && <span>Logout</span>}
            </Button>
          </div>
          </div>
        </Sider>

        {/* Main Content */}
        <Layout className="admin-main-content">
          <style>{`
            .admin-main-content {
              margin-left: 0;
              transition: all 0.2s;
            }
            @media (min-width: 768px) {
              .admin-main-content {
                margin-left: ${collapsed ? '80px' : '280px'};
              }
            }
          `}</style>
          <Header style={{ 
            background: '#fff', 
            padding: '0 24px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between'
          }}>
            <Button
              type="text"
              icon={<MenuOutlined />}
              onClick={() => setMobileMenuOpen(true)}
              style={{ display: 'block' }}
              className="md:hidden"
            />
            <div style={{ flex: 1 }} />
            <Space>
              <Text type="secondary">
                Welcome back, <Text strong>{user?.fullName}</Text>
              </Text>
            </Space>
          </Header>
          <Content style={{ 
            margin: 0,
            padding: 0,
            background: 'transparent',
            minHeight: 'calc(100vh - 112px)',
            overflow: 'auto'
          }}>
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}

export default AdminLayout
