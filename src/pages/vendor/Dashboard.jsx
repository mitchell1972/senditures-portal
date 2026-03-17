import { useApp } from '../../context/AppContext'
import { MetricCard, Card, Badge, fmt, fmtDate } from '../../components/ui'
import { PageHeader } from '../../components/ui'
import { Package, TrendingUp, DollarSign, AlertTriangle, Bell, FileText, BarChart2 } from 'lucide-react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts'
import { PRODUCT_STATUSES, PAYMENT_STATUSES } from '../../data/mockData'

const CHANNEL_COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#6366f1']

export default function Dashboard() {
  const { currentVendor, currentUser, getVendorMetrics, getNotificationsForVendor, getDocumentsByVendor, paymentRecords } = useApp()

  if (!currentVendor) return null

  const m = getVendorMetrics(currentVendor.id)
  const recentNotifs = getNotificationsForVendor(currentVendor.id).slice(0, 3)
  const recentDocs = getDocumentsByVendor(currentVendor.id).slice(0, 3)
  const latestPayment = paymentRecords.filter(p => p.vendorId === currentVendor.id && ['approved', 'pending'].includes(p.paymentStatus))[0]

  const isApproved = currentVendor.onboardingStatus === 'approved'

  if (!isApproved) {
    return (
      <div>
        <PageHeader title="Dashboard" subtitle={`Welcome, ${currentUser.name}`} />
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="w-14 h-14 rounded-full bg-amber-100 flex items-center justify-center mb-4">
            <AlertTriangle size={24} className="text-amber-500" />
          </div>
          <h2 className="text-lg font-semibold text-gray-900">Account Pending Approval</h2>
          <p className="mt-2 text-sm text-gray-500 max-w-sm">
            Your vendor account is currently <strong>{currentVendor.onboardingStatus.replace('_', ' ')}</strong>.
            Once approved by the Senditures team, your dashboard will be fully unlocked.
          </p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <PageHeader
        title={`Welcome back, ${currentUser.name.split(' ')[0]}`}
        subtitle={`${currentVendor.companyName} · ${currentVendor.brandName}`}
      />

      {/* KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Active Products" value={m.activeProducts} sub={`${m.totalProducts} total with Senditures`} icon={Package} color="brand" />
        <MetricCard label="Units Sold" value={m.unitsSold.toLocaleString()} sub="all-time" icon={TrendingUp} color="green" />
        <MetricCard label="Total Sales" value={fmt(m.totalSales)} sub="vendor cost basis" icon={BarChart2} color="blue" />
        <MetricCard label="Total Paid" value={fmt(m.totalPaid)} sub={m.pendingAmount > 0 ? `${fmt(m.pendingAmount)} pending` : 'all cleared'} icon={DollarSign} color="green" />
      </div>

      {/* Alert row */}
      {(m.outOfStock > 0 || latestPayment) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          {m.outOfStock > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-xl px-4 py-3 flex items-center gap-3">
              <AlertTriangle size={18} className="text-red-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-red-700">{m.outOfStock} Out-of-Stock Product{m.outOfStock !== 1 ? 's' : ''}</p>
                <p className="text-xs text-red-500">Update inventory to restore availability</p>
              </div>
            </div>
          )}
          {latestPayment && (
            <div className="bg-blue-50 border border-blue-100 rounded-xl px-4 py-3 flex items-center gap-3">
              <DollarSign size={18} className="text-blue-500 flex-shrink-0" />
              <div>
                <p className="text-sm font-semibold text-blue-700">{latestPayment.paymentPeriod} payment — {fmt(latestPayment.amountApproved || latestPayment.amountEarned)}</p>
                <p className="text-xs text-blue-500">Status: {PAYMENT_STATUSES[latestPayment.paymentStatus]?.label}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Monthly trend */}
        <Card className="lg:col-span-2" padding={false}>
          <div className="px-6 pt-5 pb-2">
            <h3 className="text-sm font-semibold text-gray-900">Sales Trend</h3>
            <p className="text-xs text-gray-400">Vendor cost basis by period</p>
          </div>
          <div className="px-4 pb-4">
            <ResponsiveContainer width="100%" height={180}>
              <BarChart data={m.monthlySales} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                <XAxis dataKey="period" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={v => `$${(v/1000).toFixed(0)}k`} />
                <Tooltip formatter={v => fmt(v)} labelFormatter={l => `Period: ${l}`} />
                <Bar dataKey="amount" fill="#4f46e5" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Sales by channel */}
        <Card padding={false}>
          <div className="px-6 pt-5 pb-2">
            <h3 className="text-sm font-semibold text-gray-900">Sales by Channel</h3>
            <p className="text-xs text-gray-400">All-time breakdown</p>
          </div>
          <div className="flex justify-center pb-2">
            <ResponsiveContainer width="100%" height={140}>
              <PieChart>
                <Pie data={m.salesByChannel} dataKey="amount" nameKey="channel" cx="50%" cy="50%" outerRadius={55} innerRadius={30}>
                  {m.salesByChannel.map((_, i) => (
                    <Cell key={i} fill={CHANNEL_COLORS[i % CHANNEL_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip formatter={v => fmt(v)} />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="px-5 pb-4 space-y-1.5">
            {m.salesByChannel.map((ch, i) => (
              <div key={ch.channel} className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-sm flex-shrink-0" style={{ backgroundColor: CHANNEL_COLORS[i % CHANNEL_COLORS.length] }} />
                  <span className="text-gray-600">{ch.channel}</span>
                </div>
                <span className="font-medium text-gray-800">{fmt(ch.amount)}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Top 5 products */}
        <Card className="lg:col-span-1">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Top Products</h3>
          <div className="space-y-3">
            {m.top5.map((t, i) => (
              <div key={t.product.id} className="flex items-center gap-3">
                <span className="w-5 h-5 rounded-full bg-gray-100 text-xs font-bold text-gray-500 flex items-center justify-center flex-shrink-0">{i + 1}</span>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{t.product.productName}</p>
                  <p className="text-xs text-gray-400">{t.product.vendorSKU}</p>
                </div>
                <span className="text-xs font-semibold text-gray-700">{fmt(t.amount)}</span>
              </div>
            ))}
            {m.top5.length === 0 && <p className="text-sm text-gray-400">No sales data yet.</p>}
          </div>
        </Card>

        {/* Recent notifications */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Recent Notifications</h3>
            <Bell size={15} className="text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentNotifs.map(n => (
              <div key={n.id} className={`text-xs rounded-lg p-2.5 ${n.read ? 'bg-gray-50' : 'bg-brand-50 border border-brand-100'}`}>
                <div className="flex items-start gap-1.5">
                  {!n.read && <span className="w-1.5 h-1.5 mt-0.5 rounded-full bg-brand-500 flex-shrink-0" />}
                  <div>
                    <p className="font-semibold text-gray-800">{n.title}</p>
                    <p className="text-gray-500 mt-0.5 line-clamp-2">{n.message}</p>
                    <p className="text-gray-400 mt-1">{fmtDate(n.createdDate)}</p>
                  </div>
                </div>
              </div>
            ))}
            {recentNotifs.length === 0 && <p className="text-sm text-gray-400">No notifications yet.</p>}
          </div>
        </Card>

        {/* Recent docs */}
        <Card>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-semibold text-gray-900">Recent Documents</h3>
            <FileText size={15} className="text-gray-400" />
          </div>
          <div className="space-y-3">
            {recentDocs.map(d => (
              <div key={d.id} className="flex items-start gap-2.5">
                <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
                  <FileText size={14} className="text-gray-500" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-medium text-gray-800 truncate">{d.fileName}</p>
                  <p className="text-xs text-gray-400">{d.documentType} · {fmtDate(d.uploadDate)}</p>
                </div>
              </div>
            ))}
            {recentDocs.length === 0 && <p className="text-sm text-gray-400">No documents yet.</p>}
          </div>
        </Card>
      </div>
    </div>
  )
}
