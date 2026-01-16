import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/auth/ProtectedRoute'

// Public Pages
import LandingPage from './pages/public/LandingPage'
import LoginPage from './pages/public/LoginPage'
import RegisterPage from './pages/public/RegisterPage'
import ForgotPasswordPage from './pages/public/ForgotPasswordPage'
import ResetPasswordPage from './pages/public/ResetPasswordPage'
import VerifyEmailPage from './pages/public/VerifyEmailPage'
import AboutUsPage from './pages/public/AboutUsPage'

// Admin Pages
import AdminDashboard from './pages/admin/AdminDashboard'
import MedicineManagement from './pages/admin/MedicineManagement'
import AddEditMedicine from './pages/admin/AddEditMedicine'
import CategoryManagement from './pages/admin/CategoryManagement'

// User Pages
import CartPage from './pages/user/CartPage'
import CheckoutPage from './pages/user/CheckoutPage'
import OrdersPage from './pages/user/OrdersPage'
import OrderDetailsPage from './pages/user/OrderDetailsPage'
import PaymentSuccessPage from './pages/user/PaymentSuccessPage'
import PaymentFailurePage from './pages/user/PaymentFailurePage'
import ProfilePage from './pages/user/ProfilePage'

// Pharmacy Pages
import PharmacyMedicineBrowser from './pages/pharmacy/PharmacyMedicineBrowser'
import PharmacyInventoryManagement from './pages/pharmacy/PharmacyInventoryManagement'
import MedicineDetailPage from './pages/pharmacy/MedicineDetailPage'

// Supplier Pages
import SupplierDashboard from './pages/supplier/SupplierDashboard'
import SupplierMedicineManagement from './pages/supplier/SupplierMedicineManagement'
import AddMedicine from './pages/supplier/AddMedicine'
import SupplierOrders from './pages/supplier/SupplierOrders'
import SupplierReports from './pages/supplier/SupplierReports'
import SupplierRevenue from './pages/supplier/SupplierRevenue'
import SupplierInventory from './pages/supplier/SupplierInventory'
import SupplierNotifications from './pages/supplier/SupplierNotifications'
import SupplierSettings from './pages/supplier/SupplierSettings'
import SupplierProfile from './pages/supplier/SupplierProfile'

// Admin Additional Pages
import ReportsPage from './pages/admin/ReportsPage'
import UserManagement from './pages/admin/UserManagement'
import UserDetail from './pages/admin/UserDetail'
import OrdersManagement from './pages/admin/OrdersManagement'
import ActivityLogsPage from './pages/admin/ActivityLogsPage'
import SuppliersPage from './pages/admin/SuppliersPage'
import PharmaciesPage from './pages/admin/PharmaciesPage'
import AlertsPage from './pages/admin/AlertsPage'
import SettingsPage from './pages/admin/SettingsPage'
import VerificationPage from './pages/admin/VerificationPage'
import UserVerificationDetail from './pages/admin/UserVerificationDetail'

function App() {
  return (
    <AuthProvider>
      <Router>
        <Toaster position="top-right" />
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path="/reset-password" element={<ResetPasswordPage />} />
          <Route path="/verify-email" element={<VerifyEmailPage />} />
          <Route path="/about" element={<AboutUsPage />} />

          {/* Admin Protected Routes */}
          <Route
            path="/admin/dashboard"
            element={
              <ProtectedRoute role="ADMIN">
                <AdminDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/medicines"
            element={
              <ProtectedRoute role="ADMIN">
                <MedicineManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/medicines/add"
            element={
              <ProtectedRoute role="ADMIN">
                <AddEditMedicine />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/medicines/edit/:id"
            element={
              <ProtectedRoute role="ADMIN">
                <AddEditMedicine />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/categories"
            element={
              <ProtectedRoute role="ADMIN">
                <CategoryManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/reports"
            element={
              <ProtectedRoute role="ADMIN">
                <ReportsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users"
            element={
              <ProtectedRoute role="ADMIN">
                <UserManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/users/:userId"
            element={
              <ProtectedRoute role="ADMIN">
                <UserDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/verification"
            element={
              <ProtectedRoute role="ADMIN">
                <VerificationPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/verification/:userId"
            element={
              <ProtectedRoute role="ADMIN">
                <UserVerificationDetail />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/orders"
            element={
              <ProtectedRoute role="ADMIN">
                <OrdersManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/activity-logs"
            element={
              <ProtectedRoute role="ADMIN">
                <ActivityLogsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/suppliers"
            element={
              <ProtectedRoute role="ADMIN">
                <SuppliersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/pharmacies"
            element={
              <ProtectedRoute role="ADMIN">
                <PharmaciesPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/alerts"
            element={
              <ProtectedRoute role="ADMIN">
                <AlertsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/admin/settings"
            element={
              <ProtectedRoute role="ADMIN">
                <SettingsPage />
              </ProtectedRoute>
            }
          />

          {/* Pharmacy Protected Routes */}
          <Route
            path="/pharmacy/dashboard"
            element={
              <ProtectedRoute role="PHARMACY">
                <PharmacyInventoryManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharmacy/medicines"
            element={
              <ProtectedRoute role={["PHARMACY", "USER"]}>
                <PharmacyMedicineBrowser />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharmacy/medicines/:id"
            element={
              <ProtectedRoute role={["PHARMACY", "USER"]}>
                <MedicineDetailPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharmacy/inventory"
            element={
              <ProtectedRoute role="PHARMACY">
                <PharmacyInventoryManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharmacy/inventory/all"
            element={
              <ProtectedRoute role="PHARMACY">
                <PharmacyInventoryManagement viewMode="all" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharmacy/inventory/add"
            element={
              <ProtectedRoute role="PHARMACY">
                <PharmacyInventoryManagement viewMode="add" />
              </ProtectedRoute>
            }
          />
          <Route
            path="/pharmacy/inventory/purchased"
            element={
              <ProtectedRoute role="PHARMACY">
                <PharmacyInventoryManagement viewMode="purchased" />
              </ProtectedRoute>
            }
          />

          {/* Supplier Protected Routes */}
          <Route
            path="/supplier/dashboard"
            element={
              <ProtectedRoute role="SUPPLIER">
                <SupplierDashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supplier/medicines"
            element={
              <ProtectedRoute role="SUPPLIER">
                <SupplierMedicineManagement />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supplier/medicines/add"
            element={
              <ProtectedRoute role="SUPPLIER">
                <AddMedicine />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supplier/orders"
            element={
              <ProtectedRoute role="SUPPLIER">
                <SupplierOrders />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supplier/reports"
            element={
              <ProtectedRoute role="SUPPLIER">
                <SupplierReports />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supplier/revenue"
            element={
              <ProtectedRoute role="SUPPLIER">
                <SupplierRevenue />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supplier/inventory"
            element={
              <ProtectedRoute role="SUPPLIER">
                <SupplierInventory />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supplier/notifications"
            element={
              <ProtectedRoute role="SUPPLIER">
                <SupplierNotifications />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supplier/settings"
            element={
              <ProtectedRoute role="SUPPLIER">
                <SupplierSettings />
              </ProtectedRoute>
            }
          />
          <Route
            path="/supplier/profile"
            element={
              <ProtectedRoute role="SUPPLIER">
                <SupplierProfile />
              </ProtectedRoute>
            }
          />

          {/* User Protected Routes */}
          <Route
            path="/user/profile"
            element={
              <ProtectedRoute role={["USER", "SUPPLIER", "PHARMACY"]}>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/cart"
            element={
              <ProtectedRoute role={["USER", "PHARMACY"]}>
                <CartPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/checkout"
            element={
              <ProtectedRoute role={["USER", "PHARMACY"]}>
                <CheckoutPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/orders"
            element={
              <ProtectedRoute role={["USER", "PHARMACY"]}>
                <OrdersPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/user/orders/:id"
            element={
              <ProtectedRoute role={["USER", "PHARMACY"]}>
                <OrderDetailsPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/payment/success"
            element={<PaymentSuccessPage />}
          />
          <Route
            path="/payment/failure"
            element={<PaymentFailurePage />}
          />

          {/* Default redirect */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  )
}

export default App

