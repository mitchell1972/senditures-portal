import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Card, Badge, Button, Table, PageHeader, MetricCard, Modal, fmtDate } from '../../components/ui'
import { Building2, CheckCircle, XCircle, AlertCircle, Eye, Users, Clock } from 'lucide-react'
import { ONBOARDING_STATUSES } from '../../data/mockData'

export default function Vendors() {
  const { vendors, updateVendorStatus, getProductsByVendor } = useApp()
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState('all')
  const [confirmModal, setConfirmModal] = useState(null) // { vendorId, action, vendorName }

  const filtered = statusFilter === 'all' ? vendors : vendors.filter(v => v.onboardingStatus === statusFilter)

  const counts = {
    all: vendors.length,
    approved: vendors.filter(v => v.onboardingStatus === 'approved').length,
    pending_review: vendors.filter(v => v.onboardingStatus === 'pending_review').length,
    submitted: vendors.filter(v => v.onboardingStatus === 'submitted').length,
    incomplete: vendors.filter(v => ['incomplete', 'draft', 'rejected'].includes(v.onboardingStatus)).length,
  }

  const handleAction = (action, vendorId, vendorName) => {
    setConfirmModal({ vendorId, action, vendorName })
  }

  const confirmAction = () => {
    if (!confirmModal) return
    const { action, vendorId } = confirmModal
    const statusMap = {
      approve: 'approved',
      reject: 'rejected',
      incomplete: 'incomplete',
      request_info: 'pending_review',
    }
    updateVendorStatus(vendorId, statusMap[action])
    setConfirmModal(null)
  }

  const columns = [
    {
      key: 'companyName', label: 'Company / Brand', render: (v, row) => (
        <div>
          <p className="font-medium text-gray-900">{v}</p>
          <p className="text-xs text-gray-400">{row.brandName}</p>
        </div>
      )
    },
    { key: 'contactName', label: 'Contact', render: (v, row) => (
      <div>
        <p className="text-sm text-gray-700">{v}</p>
        <p className="text-xs text-gray-400">{row.contactEmail}</p>
      </div>
    )},
    {
      key: 'onboardingStatus', label: 'Status', render: v => {
        const s = ONBOARDING_STATUSES[v] || { label: v, color: 'gray' }
        return <Badge color={s.color} label={s.label} />
      }
    },
    { key: 'createdDate', label: 'Applied', render: v => fmtDate(v) },
    { key: 'approvedDate', label: 'Approved', render: v => fmtDate(v) },
    {
      key: 'id', label: 'Products', render: (v) => {
        const count = getProductsByVendor(v).length
        return <span className="text-sm text-gray-600">{count}</span>
      }
    },
    {
      key: 'id', label: 'Actions', render: (v, row) => (
        <div className="flex items-center gap-1.5">
          <Button size="sm" variant="ghost" onClick={() => navigate(`/admin/vendors/${v}`)}>
            <Eye size={13} />
          </Button>
          {['submitted', 'pending_review'].includes(row.onboardingStatus) && (
            <>
              <Button size="sm" variant="success" onClick={() => handleAction('approve', v, row.companyName)}>
                <CheckCircle size={13} /> Approve
              </Button>
              <Button size="sm" variant="danger" onClick={() => handleAction('reject', v, row.companyName)}>
                <XCircle size={13} />
              </Button>
              <Button size="sm" variant="secondary" onClick={() => handleAction('incomplete', v, row.companyName)}>
                <AlertCircle size={13} />
              </Button>
            </>
          )}
          {row.onboardingStatus === 'incomplete' && (
            <Button size="sm" variant="secondary" onClick={() => handleAction('request_info', v, row.companyName)}>
              <Clock size={13} /> Request Info
            </Button>
          )}
        </div>
      )
    },
  ]

  return (
    <div>
      <PageHeader title="Vendors" subtitle="Manage all vendor accounts and onboarding" />

      {/* Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <MetricCard label="Total Vendors" value={counts.all} icon={Building2} color="brand" />
        <MetricCard label="Approved" value={counts.approved} icon={CheckCircle} color="green" />
        <MetricCard label="Pending Review" value={counts.pending_review + counts.submitted} icon={Clock} color="amber" />
        <MetricCard label="Incomplete / Rejected" value={counts.incomplete} icon={AlertCircle} color="red" />
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { key: 'all', label: `All (${counts.all})` },
          { key: 'approved', label: `Approved (${counts.approved})` },
          { key: 'pending_review', label: `Pending Review (${counts.pending_review})` },
          { key: 'submitted', label: `Submitted (${counts.submitted})` },
          { key: 'incomplete', label: 'Other' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setStatusFilter(tab.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${statusFilter === tab.key ? 'bg-brand-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card padding={false}>
        <Table columns={columns} rows={filtered} emptyMessage="No vendors match this filter." />
      </Card>

      {/* Confirm modal */}
      <Modal open={!!confirmModal} onClose={() => setConfirmModal(null)} title="Confirm Action" maxWidth="max-w-sm">
        {confirmModal && (
          <div>
            <p className="text-sm text-gray-700 mb-4">
              Are you sure you want to <strong>{confirmModal.action}</strong> vendor <strong>{confirmModal.vendorName}</strong>?
            </p>
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" onClick={() => setConfirmModal(null)}>Cancel</Button>
              <Button
                variant={confirmModal.action === 'approve' ? 'success' : confirmModal.action === 'reject' ? 'danger' : 'primary'}
                onClick={confirmAction}
              >
                Confirm
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
