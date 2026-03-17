import { NavLink, useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import {
  LayoutDashboard, Package, FileText, CreditCard, Bell,
  Users, ShoppingBag, Upload, LogOut, Building2,
  ChevronDown, AlertCircle,
} from 'lucide-react'
import { useState } from 'react'

const vendorNav = [
  { to: '/dashboard',     icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/catalog',       icon: Package,          label: 'Catalog & Inventory' },
  { to: '/documents',     icon: FileText,         label: 'Documents' },
  { to: '/payments',      icon: CreditCard,       label: 'Payments' },
  { to: '/notifications', icon: Bell,             label: 'Notifications' },
]

const vendorAdminExtra = [
  { to: '/team', icon: Users, label: 'Team Management' },
]

const adminNav = [
  { to: '/admin/vendors',       icon: Building2,   label: 'Vendors' },
  { to: '/admin/products',      icon: ShoppingBag, label: 'All Products' },
  { to: '/admin/documents',     icon: FileText,    label: 'Documents' },
  { to: '/admin/payments',      icon: CreditCard,  label: 'Payments' },
  { to: '/admin/notifications', icon: Bell,        label: 'Notifications' },
  { to: '/admin/imports',       icon: Upload,      label: 'Import Log' },
]

export default function Layout({ children }) {
  const { currentUser, currentVendor, logout, getNotificationsForVendor, notifications } = useApp()
  const navigate = useNavigate()
  const [mobileOpen, setMobileOpen] = useState(false)

  const isVendor = currentUser?.role === 'vendor_user' || currentUser?.role === 'vendor_admin'
  const isAdmin = currentUser?.role === 'internal_admin'

  const navItems = isAdmin
    ? adminNav
    : currentUser?.role === 'vendor_admin'
      ? [...vendorNav, ...vendorAdminExtra]
      : vendorNav

  const unreadCount = isVendor && currentUser?.vendorId
    ? notifications.filter(n => !n.read && (n.allVendors || n.vendorId === currentUser.vendorId)).length
    : 0

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  const Sidebar = () => (
    <div className="flex flex-col h-full bg-slate-900 text-white">
      {/* Logo */}
      <div className="px-5 py-5 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand-600 flex items-center justify-center text-white font-bold text-sm">S</div>
          <div>
            <p className="text-sm font-bold leading-none">Senditures</p>
            <p className="text-[10px] text-slate-400 mt-0.5 leading-none">Vendor Portal</p>
          </div>
        </div>
      </div>

      {/* User info */}
      <div className="px-4 py-3 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-brand-600/80 flex items-center justify-center text-white text-xs font-semibold">
            {currentUser?.name?.split(' ').map(n => n[0]).join('').slice(0, 2)}
          </div>
          <div className="min-w-0">
            <p className="text-xs font-semibold text-white truncate">{currentUser?.name}</p>
            <p className="text-[10px] text-slate-400 truncate">
              {isAdmin ? 'Senditures Admin' : currentVendor?.brandName || 'Vendor'}
            </p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-3 space-y-0.5 overflow-y-auto">
        {isAdmin && (
          <p className="px-3 pt-1 pb-2 text-[10px] font-semibold uppercase tracking-widest text-slate-500">Admin</p>
        )}
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `sidebar-link ${isActive ? 'sidebar-link-active' : 'sidebar-link-inactive'}`
            }
            onClick={() => setMobileOpen(false)}
          >
            <Icon size={17} className="flex-shrink-0" />
            <span className="flex-1">{label}</span>
            {label === 'Notifications' && unreadCount > 0 && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{unreadCount}</span>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-3 py-3 border-t border-white/10">
        <button
          onClick={handleLogout}
          className="sidebar-link sidebar-link-inactive w-full"
        >
          <LogOut size={17} />
          Sign Out
        </button>
      </div>
    </div>
  )

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Desktop sidebar */}
      <div className="hidden lg:flex w-56 flex-shrink-0">
        <Sidebar />
      </div>

      {/* Mobile sidebar overlay */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40 flex lg:hidden">
          <div className="fixed inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
          <div className="relative w-56 flex-shrink-0">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top bar */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-6 h-14 flex items-center justify-between flex-shrink-0">
          <button
            className="lg:hidden p-1.5 rounded-md text-gray-500 hover:bg-gray-100"
            onClick={() => setMobileOpen(true)}
          >
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>

          <div className="hidden lg:block" />

          <div className="flex items-center gap-3">
            {isVendor && currentVendor && (
              <span className={`hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium ${
                currentVendor.onboardingStatus === 'approved'
                  ? 'bg-green-50 text-green-700'
                  : currentVendor.onboardingStatus === 'pending_review'
                    ? 'bg-amber-50 text-amber-700'
                    : 'bg-gray-100 text-gray-600'
              }`}>
                <span className={`w-1.5 h-1.5 rounded-full ${
                  currentVendor.onboardingStatus === 'approved' ? 'bg-green-500' : 'bg-amber-400'
                }`} />
                {currentVendor.companyName}
              </span>
            )}
            {isAdmin && (
              <span className="hidden sm:flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full font-medium bg-brand-50 text-brand-700">
                <span className="w-1.5 h-1.5 rounded-full bg-brand-500" />
                Senditures Internal
              </span>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  )
}
