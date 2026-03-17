import { createContext, useContext, useState, useCallback } from 'react'
import {
  users as initialUsers,
  vendors as initialVendors,
  products as initialProducts,
  salesRecords as initialSales,
  paymentRecords as initialPayments,
  documents as initialDocuments,
  notifications as initialNotifications,
  importLogs as initialImportLogs,
} from '../data/mockData'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null)
  const [vendors, setVendors] = useState(initialVendors)
  const [products, setProducts] = useState(initialProducts)
  const [salesRecords] = useState(initialSales)
  const [paymentRecords, setPaymentRecords] = useState(initialPayments)
  const [documents, setDocuments] = useState(initialDocuments)
  const [notifications, setNotifications] = useState(initialNotifications)
  const [importLogs, setImportLogs] = useState(initialImportLogs)

  // ── Auth ────────────────────────────────────────────────────────────────────
  const login = useCallback((userId) => {
    const user = initialUsers.find(u => u.id === userId)
    if (user) setCurrentUser(user)
  }, [])

  const logout = useCallback(() => setCurrentUser(null), [])

  // ── Vendor helpers ──────────────────────────────────────────────────────────
  const currentVendor = currentUser?.vendorId
    ? vendors.find(v => v.id === currentUser.vendorId)
    : null

  const getVendorById = useCallback((id) => vendors.find(v => v.id === id), [vendors])

  const updateVendorStatus = useCallback((vendorId, status) => {
    setVendors(prev => prev.map(v =>
      v.id === vendorId
        ? { ...v, onboardingStatus: status, approvedDate: status === 'approved' ? new Date().toISOString().split('T')[0] : v.approvedDate }
        : v
    ))
  }, [])

  // ── Product helpers ─────────────────────────────────────────────────────────
  const getProductsByVendor = useCallback((vendorId) =>
    products.filter(p => p.vendorId === vendorId), [products])

  const addProducts = useCallback((newProducts) => {
    setProducts(prev => [...prev, ...newProducts])
  }, [])

  const updateProducts = useCallback((updatedProducts) => {
    setProducts(prev => {
      const updated = [...prev]
      updatedProducts.forEach(up => {
        const idx = updated.findIndex(p => p.id === up.id)
        if (idx !== -1) updated[idx] = { ...updated[idx], ...up }
      })
      return updated
    })
  }, [])

  // ── Sales helpers ───────────────────────────────────────────────────────────
  const getSalesByVendor = useCallback((vendorId) =>
    salesRecords.filter(s => s.vendorId === vendorId), [salesRecords])

  // ── Payment helpers ─────────────────────────────────────────────────────────
  const getPaymentsByVendor = useCallback((vendorId) =>
    paymentRecords.filter(p => p.vendorId === vendorId), [paymentRecords])

  const addPaymentRecord = useCallback((record) => {
    setPaymentRecords(prev => [record, ...prev])
  }, [])

  // ── Document helpers ────────────────────────────────────────────────────────
  const getDocumentsByVendor = useCallback((vendorId) =>
    documents.filter(d => d.vendorId === vendorId), [documents])

  const addDocument = useCallback((doc) => {
    setDocuments(prev => [doc, ...prev])
  }, [])

  // ── Notification helpers ────────────────────────────────────────────────────
  const getNotificationsForVendor = useCallback((vendorId) =>
    notifications.filter(n => n.allVendors || n.vendorId === vendorId)
      .sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate)),
    [notifications])

  const markNotificationRead = useCallback((notifId) => {
    setNotifications(prev => prev.map(n => n.id === notifId ? { ...n, read: true } : n))
  }, [])

  const sendNotification = useCallback((notif) => {
    const newNotif = {
      id: `n${Date.now()}`,
      ...notif,
      createdBy: currentUser?.name || 'Admin',
      createdDate: new Date().toISOString().split('T')[0],
      read: false,
    }
    setNotifications(prev => [newNotif, ...prev])
  }, [currentUser])

  // ── Import log helpers ──────────────────────────────────────────────────────
  const addImportLog = useCallback((log) => {
    setImportLogs(prev => [log, ...prev])
  }, [])

  // ── Computed dashboard metrics for a vendor ─────────────────────────────────
  const getVendorMetrics = useCallback((vendorId) => {
    const vProducts = products.filter(p => p.vendorId === vendorId)
    const vSales = salesRecords.filter(s => s.vendorId === vendorId)
    const vPayments = paymentRecords.filter(p => p.vendorId === vendorId)

    const totalProducts = vProducts.length
    const activeProducts = vProducts.filter(p => p.status === 'active').length
    const outOfStock = vProducts.filter(p => p.status === 'out_of_stock').length
    const unitsSold = vSales.reduce((sum, s) => sum + s.unitsSold, 0)
    const totalSales = vSales.reduce((sum, s) => sum + s.vendorCostAmount, 0)
    const totalPaid = vPayments.filter(p => p.paymentStatus === 'paid').reduce((sum, p) => sum + (p.amountPaid || 0), 0)
    const pendingAmount = vPayments.filter(p => ['pending', 'approved'].includes(p.paymentStatus)).reduce((sum, p) => sum + (p.amountApproved || p.amountEarned || 0), 0)

    // Sales by channel
    const channelMap = {}
    vSales.forEach(s => {
      channelMap[s.channel] = (channelMap[s.channel] || 0) + s.vendorCostAmount
    })
    const salesByChannel = Object.entries(channelMap).map(([channel, amount]) => ({ channel, amount }))

    // Top 5 products
    const productSales = {}
    vSales.forEach(s => {
      productSales[s.productId] = (productSales[s.productId] || 0) + s.vendorCostAmount
    })
    const top5 = Object.entries(productSales)
      .sort(([, a], [, b]) => b - a)
      .slice(0, 5)
      .map(([productId, amount]) => ({
        product: products.find(p => p.id === productId),
        amount,
      }))
      .filter(t => t.product)

    // Monthly sales trend
    const monthlyMap = {}
    vSales.forEach(s => {
      monthlyMap[s.salePeriod] = (monthlyMap[s.salePeriod] || 0) + s.vendorCostAmount
    })
    const monthlySales = Object.entries(monthlyMap)
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([period, amount]) => ({ period, amount }))

    return { totalProducts, activeProducts, outOfStock, unitsSold, totalSales, totalPaid, pendingAmount, salesByChannel, top5, monthlySales }
  }, [products, salesRecords, paymentRecords])

  const value = {
    // Auth
    currentUser, login, logout,
    // Vendors
    vendors, currentVendor, getVendorById, updateVendorStatus,
    // Products
    products, getProductsByVendor, addProducts, updateProducts,
    // Sales
    salesRecords, getSalesByVendor,
    // Payments
    paymentRecords, getPaymentsByVendor, addPaymentRecord,
    // Documents
    documents, getDocumentsByVendor, addDocument,
    // Notifications
    notifications, getNotificationsForVendor, markNotificationRead, sendNotification,
    // Import logs
    importLogs, addImportLog,
    // Metrics
    getVendorMetrics,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export const useApp = () => {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
