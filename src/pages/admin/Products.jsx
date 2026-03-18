import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Card, Badge, Button, Table, PageHeader, MetricCard, fmt } from '../../components/ui'
import { Package, ShoppingBag, AlertTriangle, Download } from 'lucide-react'
import { PRODUCT_STATUSES } from '../../data/mockData'

export default function Products() {
  const { products, vendors } = useApp()
  const [vendorFilter, setVendorFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [channelFilter, setChannelFilter] = useState('all')
  const [search, setSearch] = useState('')

  const getVendorName = (id) => vendors.find(v => v.id === id)?.companyName || id

  const allChannels = [...new Set(products.flatMap(p => p.channelAvailability || []))].sort()

  const filtered = products.filter(p => {
    const matchVendor = vendorFilter === 'all' || p.vendorId === vendorFilter
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    const matchChannel = channelFilter === 'all' || (p.channelAvailability || []).includes(channelFilter)
    const matchSearch = !search || p.productName.toLowerCase().includes(search.toLowerCase()) || p.vendorSKU.toLowerCase().includes(search.toLowerCase()) || (p.internalSKU || '').toLowerCase().includes(search.toLowerCase())
    return matchVendor && matchStatus && matchSearch && matchChannel
  })

  const exportAll = () => {
    const headers = ['vendor', 'vendor_sku', 'internal_sku', 'product_name', 'category', 'cost', 'msrp', 'quantity_on_hand', 'status']
    const rows = products.map(p => [getVendorName(p.vendorId), p.vendorSKU, p.internalSKU, p.productName, p.category, p.cost, p.msrp, p.quantityOnHand, p.status])
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'all_products_export.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const columns = [
    {
      key: 'vendorId', label: 'Vendor', render: v => (
        <span className="text-xs text-gray-500 font-medium">{getVendorName(v)}</span>
      )
    },
    { key: 'vendorSKU', label: 'Vendor SKU', render: v => <span className="font-mono text-xs">{v}</span> },
    { key: 'internalSKU', label: 'Internal SKU', render: v => <span className={`font-mono text-xs ${v ? 'text-gray-700' : 'text-gray-300'}`}>{v || '—'}</span> },
    {
      key: 'productName', label: 'Product Name', render: (v, row) => (
        <div>
          <p className="font-medium text-gray-900 max-w-xs truncate">{v}</p>
          <p className="text-xs text-gray-400">{row.category}</p>
        </div>
      )
    },
    { key: 'cost', label: 'Cost', render: v => fmt(v) },
    { key: 'msrp', label: 'MSRP', render: v => fmt(v) },
    {
      key: 'quantityOnHand', label: 'QOH', render: v => (
        <span className={v === 0 ? 'text-red-600 font-semibold' : 'text-gray-700'}>{v}</span>
      )
    },
    {
      key: 'channelAvailability', label: 'Channels', render: v => (
        v && v.length > 0
          ? <div className="flex flex-wrap gap-1">{v.map(ch => <span key={ch} className="inline-flex px-1.5 py-0.5 rounded text-[10px] font-medium bg-blue-50 text-blue-700">{ch}</span>)}</div>
          : <span className="text-gray-300 text-xs">—</span>
      )
    },
    {
      key: 'status', label: 'Status', render: v => {
        const s = PRODUCT_STATUSES[v] || { label: v, color: 'gray' }
        return <Badge color={s.color} label={s.label} />
      }
    },
  ]

  return (
    <div>
      <PageHeader
        title="All Products"
        subtitle={`${products.length} products across ${vendors.length} vendors`}
        actions={
          <Button variant="secondary" size="sm" onClick={exportAll}>
            <Download size={14} /> Export All
          </Button>
        }
      />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Total Products" value={products.length} icon={Package} color="brand" />
        <MetricCard label="Active" value={products.filter(p => p.status === 'active').length} icon={ShoppingBag} color="green" />
        <MetricCard label="Out of Stock" value={products.filter(p => p.status === 'out_of_stock').length} icon={AlertTriangle} color="red" />
        <MetricCard label="Pending Review" value={products.filter(p => p.status === 'pending_review').length} icon={Package} color="amber" />
      </div>

      {/* Filters */}
      <Card className="mb-4" padding={false}>
        <div className="px-4 py-3 flex flex-col sm:flex-row gap-3">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search SKU, internal SKU, or product name..."
            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
          <select
            value={vendorFilter}
            onChange={e => setVendorFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="all">All Vendors</option>
            {vendors.map(v => <option key={v.id} value={v.id}>{v.companyName}</option>)}
          </select>
          <select
            value={statusFilter}
            onChange={e => setStatusFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="all">All Statuses</option>
            {Object.entries(PRODUCT_STATUSES).map(([k, v]) => (
              <option key={k} value={k}>{v.label}</option>
            ))}
          </select>
          <select
            value={channelFilter}
            onChange={e => setChannelFilter(e.target.value)}
            className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
          >
            <option value="all">All Channels</option>
            {allChannels.map(ch => <option key={ch} value={ch}>{ch}</option>)}
          </select>
        </div>
      </Card>

      <Card padding={false}>
        <Table columns={columns} rows={filtered} emptyMessage="No products match your filters." />
      </Card>
    </div>
  )
}
