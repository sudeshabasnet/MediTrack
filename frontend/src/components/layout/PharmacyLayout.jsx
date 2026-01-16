import { useState, useEffect, useRef } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { Layout, Menu, Avatar, Typography, Space, Badge, Button, Drawer } from 'antd'

const { ItemGroup } = Menu
import {
  HomeOutlined,
  MedicineBoxOutlined,
  ShoppingCartOutlined,
  InboxOutlined,
  UserOutlined,
  LogoutOutlined,
  MenuOutlined,
  SearchOutlined,
  FileTextOutlined,
  WarningOutlined,
  ClockCircleOutlined,
  BarChartOutlined,
  AppstoreOutlined,
  ArrowLeftOutlined
} from '@ant-design/icons'
import { ConfigProvider } from 'antd'

const { Header, Sider, Content } = Layout
const { Text } = Typography

const PharmacyLayout = ({ children }) => {
  const { user, logout } = useAuth()
  const location = useLocation()
  const navigate = useNavigate()
  const [collapsed, setCollapsed] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const menuContainerRef = useRef(null)

  useEffect(() => {
    // Restore scroll position
    const savedScroll = sessionStorage.getItem('pharmacyMenuScroll')
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
    sessionStorage.setItem('pharmacyMenuScroll', e.target.scrollTop)
  }

  const getSelectedKey = () => {
    return location.pathname
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
      <Menu.Item key="/pharmacy/dashboard" icon={<HomeOutlined />}>
        <Link to="/pharmacy/dashboard">Dashboard</Link>
      </Menu.Item>
      
      <Menu.Divider style={{ borderColor: '#e0e0e0', margin: '8px 0' }} />
      
      <ItemGroup title={<span style={{ color: '#888', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Inventory Management</span>}>
        <Menu.Item key="/pharmacy/inventory" icon={<HomeOutlined />}>
          <Link to="/pharmacy/inventory">Inventory Dashboard</Link>
        </Menu.Item>
        <Menu.Item key="/pharmacy/inventory/all" icon={<MedicineBoxOutlined />}>
          <Link to="/pharmacy/inventory/all">All Medicines</Link>
        </Menu.Item>
        <Menu.Item key="/pharmacy/inventory/add" icon={<AppstoreOutlined />}>
          <Link to="/pharmacy/inventory/add">Add Medicine</Link>
        </Menu.Item>
        <Menu.Item key="/pharmacy/inventory/purchased" icon={<ShoppingCartOutlined />}>
          <Link to="/pharmacy/inventory/purchased">Purchased Stock</Link>
        </Menu.Item>
        <Menu.Item key="/pharmacy/inventory?filter=low_stock" icon={<WarningOutlined />}>
          <Link to="/pharmacy/inventory?filter=low_stock">
            <Space>
              Low Stock Alert
              <Badge 
                count={0} 
                showZero={false} 
                style={{ backgroundColor: '#faad14' }}
                size="small"
              />
            </Space>
          </Link>
        </Menu.Item>
        <Menu.Item key="/pharmacy/inventory?filter=near_expiry" icon={<ClockCircleOutlined />}>
          <Link to="/pharmacy/inventory?filter=near_expiry">
            <Space>
              Expiring Soon
              <Badge 
                count={0} 
                showZero={false} 
                style={{ backgroundColor: '#ff4d4f' }}
                size="small"
              />
            </Space>
          </Link>
        </Menu.Item>
        <Menu.Item key="/pharmacy/inventory?filter=expired" icon={<ClockCircleOutlined />}>
          <Link to="/pharmacy/inventory?filter=expired">Expired Medicines</Link>
        </Menu.Item>
      </ItemGroup>

      <Menu.Divider style={{ borderColor: '#e0e0e0', margin: '8px 0' }} />

      <ItemGroup title={<span style={{ color: '#888', fontSize: '12px', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Account</span>}>
        <Menu.Item key="/user/profile" icon={<UserOutlined />}>
          <Link to="/user/profile">Profile</Link>
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
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: 8,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Text strong style={{ color: '#fff', fontSize: 16 }}>M</Text>
              </div>
              <Text strong>MediTrack Pharmacy</Text>
            </Space>
          }
          placement="left"
          onClose={() => setMobileMenuOpen(false)}
          open={mobileMenuOpen}
          styles={{ body: { padding: 0, background: '#f5f5f5' } }}
        >
          {menuItems}
          <div style={{ padding: '16px' }}>
            <Button
              danger
              icon={<LogoutOutlined />}
              onClick={handleLogout}
              block
              style={{ borderRadius: '8px' }}
            >
              Logout
            </Button>
          </div>
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
            boxShadow: '2px 0 8px rgba(0,0,0,0.1)',
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
              <Link to="/pharmacy/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 12, textDecoration: 'none' }}>
                <div style={{ 
                  width: collapsed ? 36 : 44, 
                  height: collapsed ? 36 : 44, 
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  borderRadius: 12,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  transition: 'all 0.2s',
                  boxShadow: '0 2px 8px rgba(99, 102, 241, 0.3)'
                }}>
                  <Text strong style={{ color: '#fff', fontSize: collapsed ? 16 : 20 }}>M</Text>
                </div>
                {!collapsed && <Text strong style={{ fontSize: 20, color: '#1a1a1a' }}>MediTrack</Text>}
              </Link>
            </div>

            {/* User Info */}
            {!collapsed && (
              <div style={{ 
                padding: '20px 16px', 
                borderBottom: '1px solid #e0e0e0',
                background: '#f8f9fa',
                margin: '8px',
                borderRadius: '12px',
                flexShrink: 0
              }}>
                <Space>
                  <Avatar 
                    style={{ 
                      backgroundColor: '#6366f1',
                      border: '2px solid #e6e8ff'
                    }}
                    icon={<UserOutlined style={{ color: '#fff' }} />}
                  >
                    {user?.fullName?.charAt(0)?.toUpperCase()}
                  </Avatar>
                  <div>
                    <div style={{ fontWeight: 600, color: '#1a1a1a', fontSize: 14 }}>{user?.fullName || 'Pharmacy'}</div>
                    <Text style={{ fontSize: 12, color: '#666' }}>{user?.email}</Text>
                  </div>
                </Space>
              </div>
            )}

            {/* Navigation Menu */}
            <div 
              ref={menuContainerRef}
              className="pharmacy-sidebar-menu-container"
              style={{ 
                flex: 1, 
                overflowY: 'auto', 
                overflowX: 'hidden',
                minHeight: 0,
                WebkitOverflowScrolling: 'touch',
                position: 'relative',
                paddingBottom: '8px'
              }}
              onScroll={handleScroll}
            >
              <style>{`
                .pharmacy-sidebar-menu-container {
                  overflow-y: auto !important;
                  overflow-x: hidden !important;
                }
                .pharmacy-sidebar-menu-container::-webkit-scrollbar {
                  width: 6px;
                }
                .pharmacy-sidebar-menu-container::-webkit-scrollbar-track {
                  background: #f0f0f0;
                  border-radius: 3px;
                }
                .pharmacy-sidebar-menu-container::-webkit-scrollbar-thumb {
                  background: #c0c0c0;
                  border-radius: 3px;
                }
                .pharmacy-sidebar-menu-container::-webkit-scrollbar-thumb:hover {
                  background: #a0a0a0;
                }
              `}</style>
              {menuItems}
            </div>

            {/* Logout Button */}
            <div style={{ 
              padding: '16px', 
              borderTop: '1px solid #e0e0e0',
              background: 'transparent',
              flexShrink: 0
            }}>
              <Button
                type="text"
                danger
                icon={<LogoutOutlined />}
                onClick={handleLogout}
                block
                style={{ 
                  textAlign: 'left', 
                  height: 44,
                  color: '#ff4d4f',
                  borderRadius: '8px',
                  background: '#fff1f0',
                  border: '1px solid #ffccc7'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = '#ffe4e6'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#fff1f0'
                }}
              >
                {!collapsed && <span style={{ color: '#ff4d4f' }}>Logout</span>}
              </Button>
            </div>
          </div>
        </Sider>

        {/* Main Content */}
        <Layout className="pharmacy-main-content">
          <style>{`
            .pharmacy-main-content {
              margin-left: 0;
              transition: all 0.2s;
            }
            @media (min-width: 768px) {
              .pharmacy-main-content {
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
            {/* Back to E-Commerce Button */}
            <div style={{ 
              padding: '16px 24px', 
              background: '#fff', 
              borderBottom: '1px solid #f0f0f0',
              position: 'sticky',
              top: 0,
              zIndex: 10
            }}>
              <Button 
                type="default" 
                icon={<ArrowLeftOutlined />}
                onClick={() => navigate('/pharmacy/medicines')}
                style={{ 
                  borderRadius: 8,
                  boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
                }}
              >
                Back to E-Commerce
              </Button>
            </div>
            {children}
          </Content>
        </Layout>
      </Layout>
    </ConfigProvider>
  )
}

export default PharmacyLayout


