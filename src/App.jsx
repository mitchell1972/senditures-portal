import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AppProvider, useApp } from './context/AppContext'
import Layout from './components/Layout'

// Pages
import Login from './pages/Login'
import Dashboard from './pages/vendor/Dashboard'
import Catalog from './pages/vendor/Catalog'
import Documents from './pages/vendor/Documents'
import Payments from './pages/vendor/Payments'
import Notifications from './pages/vendor/Notifications'
import Onboarding from './pages/vendor/Onboarding'

import Vendors from './pages/admin/Vendors'
import VendorDetail from './pages/admin/VendorDetail'
import Products from './pages/admin/Products'
import AdminDocuments from './pages/admin/AdminDocuments'
import AdminPayments from './pages/admin/AdminPayments'
import AdminNotifications from './pages/admin/AdminNotifications'
import ImportLog from './pages/admin/ImportLog'

function RequireAuth({ children, allowedRoles }) {
  const { currentUser } = useApp()
  const location = useLocation()

  if (!currentUser) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  if (allowedRoles && !allowedRoles.includes(currentUser.role)) {
    // Redirect to appropriate home
    if (currentUser.role === 'internal_admin') return <Navigate to="/admin/vendors" replace />
    return <Navigate to="/dashboard" replace />
  }

  return children
}

function VendorRoute({ children }) {
  return (
    <RequireAuth allowedRoles={['vendor_user', 'vendor_admin']}>
      <Layout>{children}</Layout>
    </RequireAuth>
  )
}

function AdminRoute({ children }) {
  return (
    <RequireAuth allowedRoles={['internal_admin']}>
      <Layout>{children}</Layout>
    </RequireAuth>
  )
}

function AppRoutes() {
  const { currentUser } = useApp()

  return (
    <Routes>
      <Route path="/login" element={currentUser ? <Navigate to={currentUser.role === 'internal_admin' ? '/admin/vendors' : '/dashboard'} replace /> : <Login />} />

      {/* Vendor routes */}
      <Route path="/dashboard"     element={<VendorRoute><Dashboard /></VendorRoute>} />
      <Route path="/catalog"       element={<VendorRoute><Catalog /></VendorRoute>} />
      <Route path="/documents"     element={<VendorRoute><Documents /></VendorRoute>} />
      <Route path="/payments"      element={<VendorRoute><Payments /></VendorRoute>} />
      <Route path="/notifications" element={<VendorRoute><Notifications /></VendorRoute>} />
      <Route path="/onboarding"    element={<VendorRoute><Onboarding /></VendorRoute>} />

      {/* Admin routes */}
      <Route path="/admin/vendors"       element={<AdminRoute><Vendors /></AdminRoute>} />
      <Route path="/admin/vendors/:id"   element={<AdminRoute><VendorDetail /></AdminRoute>} />
      <Route path="/admin/products"      element={<AdminRoute><Products /></AdminRoute>} />
      <Route path="/admin/documents"     element={<AdminRoute><AdminDocuments /></AdminRoute>} />
      <Route path="/admin/payments"      element={<AdminRoute><AdminPayments /></AdminRoute>} />
      <Route path="/admin/notifications" element={<AdminRoute><AdminNotifications /></AdminRoute>} />
      <Route path="/admin/imports"       element={<AdminRoute><ImportLog /></AdminRoute>} />

      {/* Root redirect */}
      <Route path="/" element={
        currentUser
          ? <Navigate to={currentUser.role === 'internal_admin' ? '/admin/vendors' : '/dashboard'} replace />
          : <Navigate to="/login" replace />
      } />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AppProvider>
  )
}
