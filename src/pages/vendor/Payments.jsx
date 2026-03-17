import { useApp } from '../../context/AppContext'
import { Card, Badge, MetricCard, Table, PageHeader, fmt, fmtDate } from '../../components/ui'
import { DollarSign, TrendingUp, Clock, Download, FileText } from 'lucide-react'
import { PAYMENT_STATUSES } from '../../data/mockData'

export default function Payments() {
  const { currentVendor, getPaymentsByVendor, getDocumentsByVendor } = useApp()

  const payments = getPaymentsByVendor(currentVendor.id)
  const docs = getDocumentsByVendor(currentVendor.id)

  const totalPaid = payments.filter(p => p.paymentStatus === 'paid').reduce((s, p) => s + (p.amountPaid || 0), 0)
  const pendingAmount = payments.filter(p => ['pending', 'approved'].includes(p.paymentStatus)).reduce((s, p) => s + (p.amountApproved || p.amountEarned || 0), 0)
  const lastPayment = payments.find(p => p.paymentStatus === 'paid')

  const getDoc = (docId) => docs.find(d => d.id === docId)

  const columns = [
    { key: 'paymentPeriod', label: 'Period', render: v => <span className="font-medium text-gray-900">{v}</span> },
    { key: 'amountEarned', label: 'Amount Earned', render: v => fmt(v) },
    { key: 'adjustments', label: 'Adjustments', render: v => (
      <span className={v && v !== 0 ? 'text-red-600' : 'text-gray-400'}>{v ? fmt(v) : '—'}</span>
    )},
    { key: 'amountApproved', label: 'Approved', render: v => v ? fmt(v) : '—' },
    { key: 'amountPaid', label: 'Paid', render: v => v ? <span className="font-semibold text-green-700">{fmt(v)}</span> : '—' },
    { key: 'paymentDate', label: 'Payment Date', render: v => fmtDate(v) },
    {
      key: 'paymentStatus', label: 'Status', render: v => {
        const s = PAYMENT_STATUSES[v] || { label: v, color: 'gray' }
        return <Badge color={s.color} label={s.label} />
      }
    },
    { key: 'referenceNumber', label: 'Reference', render: v => v ? <span className="font-mono text-xs text-gray-500">{v}</span> : '—' },
    {
      key: 'documentId', label: 'Document', render: (v) => {
        if (!v) return <span className="text-gray-400 text-xs">—</span>
        const doc = getDoc(v)
        return doc ? (
          <button className="text-xs text-brand-600 hover:text-brand-800 flex items-center gap-1">
            <Download size={12} /> {doc.fileName.length > 20 ? doc.fileName.slice(0, 20) + '…' : doc.fileName}
          </button>
        ) : '—'
      }
    },
  ]

  return (
    <div>
      <PageHeader
        title="Payments & Statements"
        subtitle="Your payment history and remittance documents"
      />

      {/* Summary cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <MetricCard label="Total Paid" value={fmt(totalPaid)} sub="all-time" icon={DollarSign} color="green" />
        <MetricCard label="Pending / Approved" value={fmt(pendingAmount)} sub="upcoming payment" icon={Clock} color="amber" />
        <MetricCard label="Last Payment" value={lastPayment ? fmt(lastPayment.amountPaid) : '—'} sub={lastPayment ? fmtDate(lastPayment.paymentDate) : 'No payments yet'} icon={TrendingUp} color="brand" />
      </div>

      {/* Payment history */}
      <Card padding={false}>
        <div className="px-5 py-4 border-b border-gray-100">
          <h2 className="text-sm font-semibold text-gray-900">Payment History</h2>
        </div>
        <Table columns={columns} rows={payments} emptyMessage="No payment records yet." />
      </Card>

      {/* Remittance docs */}
      <div className="mt-6">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Remittance Documents</h2>
        <Card padding={false}>
          {docs.filter(d => ['Remittance Statement', 'Payment Document', 'Sales Statement'].includes(d.documentType)).length === 0 ? (
            <div className="px-5 py-8 text-center text-sm text-gray-400">
              Remittance documents will appear here when Senditures posts your payments.
            </div>
          ) : (
            <div className="divide-y divide-gray-100">
              {docs
                .filter(d => ['Remittance Statement', 'Payment Document', 'Sales Statement'].includes(d.documentType))
                .map(doc => (
                  <div key={doc.id} className="flex items-center justify-between px-5 py-3">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-green-50 rounded flex items-center justify-center">
                        <FileText size={14} className="text-green-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">{doc.fileName}</p>
                        <p className="text-xs text-gray-400">{doc.documentType} · {fmtDate(doc.uploadDate)}</p>
                      </div>
                    </div>
                    <button className="text-xs text-brand-600 hover:text-brand-800 flex items-center gap-1 font-medium">
                      <Download size={13} /> Download
                    </button>
                  </div>
                ))}
            </div>
          )}
        </Card>
      </div>
    </div>
  )
}
