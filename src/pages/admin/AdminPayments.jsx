import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Card, Badge, Button, Table, PageHeader, MetricCard, Modal, Input, Select, fmt, fmtDate } from '../../components/ui'
import { DollarSign, Clock, CheckCircle, Plus } from 'lucide-react'
import { PAYMENT_STATUSES } from '../../data/mockData'

export default function AdminPayments() {
  const { paymentRecords, vendors, addPaymentRecord } = useApp()
  const [vendorFilter, setVendorFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')
  const [addModal, setAddModal] = useState(false)
  const [form, setForm] = useState({ vendorId: '', paymentPeriod: '', amountEarned: '', adjustments: '', amountApproved: '', amountPaid: '', paymentDate: '', paymentStatus: 'pending', referenceNumber: '' })

  const getVendorName = id => vendors.find(v => v.id === id)?.companyName || id
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const filtered = paymentRecords.filter(p => {
    const matchVendor = vendorFilter === 'all' || p.vendorId === vendorFilter
    const matchStatus = statusFilter === 'all' || p.paymentStatus === statusFilter
    return matchVendor && matchStatus
  })

  const totalPaid = paymentRecords.filter(p => p.paymentStatus === 'paid').reduce((s, p) => s + (p.amountPaid || 0), 0)
  const totalPending = paymentRecords.filter(p => ['pending', 'approved'].includes(p.paymentStatus)).reduce((s, p) => s + (p.amountApproved || p.amountEarned || 0), 0)

  const handleAdd = () => {
    addPaymentRecord({
      id: `pay_${Date.now()}`,
      vendorId: form.vendorId,
      paymentPeriod: form.paymentPeriod,
      amountEarned: parseFloat(form.amountEarned) || 0,
      adjustments: parseFloat(form.adjustments) || 0,
      amountApproved: parseFloat(form.amountApproved) || null,
      amountPaid: parseFloat(form.amountPaid) || null,
      paymentDate: form.paymentDate || null,
      paymentStatus: form.paymentStatus,
      referenceNumber: form.referenceNumber || null,
      documentId: null,
    })
    setAddModal(false)
    setForm({ vendorId: '', paymentPeriod: '', amountEarned: '', adjustments: '', amountApproved: '', amountPaid: '', paymentDate: '', paymentStatus: 'pending', referenceNumber: '' })
  }

  const columns = [
    { key: 'vendorId', label: 'Vendor', render: v => <span className="text-sm font-medium text-gray-800">{getVendorName(v)}</span> },
    { key: 'paymentPeriod', label: 'Period' },
    { key: 'amountEarned', label: 'Earned', render: v => fmt(v) },
    { key: 'adjustments', label: 'Adj.', render: v => v ? <span className="text-red-600">{fmt(v)}</span> : '—' },
    { key: 'amountApproved', label: 'Approved', render: v => v ? fmt(v) : '—' },
    { key: 'amountPaid', label: 'Paid', render: v => v ? <span className="text-green-700 font-semibold">{fmt(v)}</span> : '—' },
    { key: 'paymentDate', label: 'Date', render: v => fmtDate(v) },
    {
      key: 'paymentStatus', label: 'Status', render: v => {
        const s = PAYMENT_STATUSES[v] || { label: v, color: 'gray' }
        return <Badge color={s.color} label={s.label} />
      }
    },
    { key: 'referenceNumber', label: 'Reference', render: v => v ? <span className="font-mono text-xs text-gray-500">{v}</span> : '—' },
  ]

  return (
    <div>
      <PageHeader
        title="Payments"
        subtitle="All vendor payment records"
        actions={
          <Button size="sm" onClick={() => setAddModal(true)}>
            <Plus size={14} /> Add Payment
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <MetricCard label="Total Paid (All Time)" value={fmt(totalPaid)} icon={DollarSign} color="green" />
        <MetricCard label="Pending / Approved" value={fmt(totalPending)} icon={Clock} color="amber" />
        <MetricCard label="Payment Records" value={paymentRecords.length} icon={CheckCircle} color="brand" />
      </div>

      <Card className="mb-4" padding={false}>
        <div className="px-4 py-3 flex gap-3">
          <select value={vendorFilter} onChange={e => setVendorFilter(e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="all">All Vendors</option>
            {vendors.map(v => <option key={v.id} value={v.id}>{v.companyName}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="all">All Statuses</option>
            {Object.entries(PAYMENT_STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </Card>

      <Card padding={false}>
        <Table columns={columns} rows={filtered} emptyMessage="No payment records." />
      </Card>

      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add Payment Record" maxWidth="max-w-lg">
        <div className="space-y-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vendor *</label>
            <select value={form.vendorId} onChange={e => set('vendorId', e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
              <option value="">Select vendor...</option>
              {vendors.map(v => <option key={v.id} value={v.id}>{v.companyName}</option>)}
            </select>
          </div>
          <Input label="Payment Period" value={form.paymentPeriod} onChange={e => set('paymentPeriod', e.target.value)} placeholder="e.g. April 2025" />
          <div className="grid grid-cols-2 gap-3">
            <Input label="Amount Earned" type="number" value={form.amountEarned} onChange={e => set('amountEarned', e.target.value)} placeholder="0.00" />
            <Input label="Adjustments" type="number" value={form.adjustments} onChange={e => set('adjustments', e.target.value)} placeholder="0.00" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Amount Approved" type="number" value={form.amountApproved} onChange={e => set('amountApproved', e.target.value)} placeholder="0.00" />
            <Input label="Amount Paid" type="number" value={form.amountPaid} onChange={e => set('amountPaid', e.target.value)} placeholder="0.00" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Payment Date" type="date" value={form.paymentDate} onChange={e => set('paymentDate', e.target.value)} />
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select value={form.paymentStatus} onChange={e => set('paymentStatus', e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                {Object.entries(PAYMENT_STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
              </select>
            </div>
          </div>
          <Input label="Reference Number" value={form.referenceNumber} onChange={e => set('referenceNumber', e.target.value)} placeholder="REF-YYYY-MMDD" />
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="secondary" onClick={() => setAddModal(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.vendorId || !form.paymentPeriod}>Add Record</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
