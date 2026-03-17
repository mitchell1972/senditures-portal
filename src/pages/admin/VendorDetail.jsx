import { useParams, useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Card, Badge, Button, Table, PageHeader, fmt, fmtDate } from '../../components/ui'
import { ArrowLeft, Building2, User, CreditCard, Package, FileText, DollarSign } from 'lucide-react'
import { ONBOARDING_STATUSES, PRODUCT_STATUSES } from '../../data/mockData'

export default function VendorDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { getVendorById, getProductsByVendor, getDocumentsByVendor, getPaymentsByVendor } = useApp()

  const vendor = getVendorById(id)
  if (!vendor) return <div className="p-8 text-gray-500">Vendor not found.</div>

  const products = getProductsByVendor(id)
  const documents = getDocumentsByVendor(id)
  const payments = getPaymentsByVendor(id)
  const status = ONBOARDING_STATUSES[vendor.onboardingStatus] || { label: vendor.onboardingStatus, color: 'gray' }

  return (
    <div>
      <div className="mb-6">
        <button onClick={() => navigate('/admin/vendors')} className="flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 mb-3">
          <ArrowLeft size={15} /> Back to Vendors
        </button>
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-xl font-bold text-gray-900">{vendor.companyName}</h1>
            <p className="text-sm text-gray-500 mt-0.5">{vendor.brandName} · Vendor ID: {vendor.id}</p>
          </div>
          <Badge color={status.color} label={status.label} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Company info */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <Building2 size={16} className="text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900">Company</h3>
          </div>
          <div className="space-y-2 text-sm">
            {[
              ['Company', vendor.companyName],
              ['Brand', vendor.brandName],
              ['Website', vendor.website],
              ['Address', vendor.address],
              ['Tax ID', vendor.taxId || '—'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2">
                <span className="text-gray-400 flex-shrink-0">{k}</span>
                <span className="text-gray-700 text-right">{v}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Contact */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <User size={16} className="text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900">Contact</h3>
          </div>
          <div className="space-y-2 text-sm">
            {[
              ['Name', vendor.contactName],
              ['Email', vendor.contactEmail],
              ['Phone', vendor.phone || '—'],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2">
                <span className="text-gray-400">{k}</span>
                <span className="text-gray-700">{v}</span>
              </div>
            ))}
          </div>
        </Card>

        {/* Payment & dates */}
        <Card>
          <div className="flex items-center gap-2 mb-4">
            <CreditCard size={16} className="text-gray-400" />
            <h3 className="text-sm font-semibold text-gray-900">Payment & Dates</h3>
          </div>
          <div className="space-y-2 text-sm">
            {[
              ['Payment', vendor.paymentDetails || '—'],
              ['Applied', fmtDate(vendor.createdDate)],
              ['Approved', fmtDate(vendor.approvedDate)],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between gap-2">
                <span className="text-gray-400">{k}</span>
                <span className="text-gray-700">{v}</span>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Products summary */}
      <Card padding={false} className="mb-6">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <Package size={16} className="text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900">Products ({products.length})</h3>
        </div>
        <Table
          columns={[
            { key: 'vendorSKU', label: 'SKU' },
            { key: 'productName', label: 'Product' },
            { key: 'category', label: 'Category' },
            { key: 'cost', label: 'Cost', render: v => fmt(v) },
            { key: 'msrp', label: 'MSRP', render: v => fmt(v) },
            { key: 'quantityOnHand', label: 'QOH' },
            { key: 'status', label: 'Status', render: v => { const s = PRODUCT_STATUSES[v] || { label: v, color: 'gray' }; return <Badge color={s.color} label={s.label} /> }},
          ]}
          rows={products}
          emptyMessage="No products yet."
        />
      </Card>

      {/* Documents */}
      <Card padding={false} className="mb-6">
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <FileText size={16} className="text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900">Documents ({documents.length})</h3>
        </div>
        <Table
          columns={[
            { key: 'fileName', label: 'File' },
            { key: 'documentType', label: 'Type' },
            { key: 'uploadedBy', label: 'Uploaded By' },
            { key: 'uploadDate', label: 'Date', render: v => fmtDate(v) },
          ]}
          rows={documents}
          emptyMessage="No documents yet."
        />
      </Card>

      {/* Payments */}
      <Card padding={false}>
        <div className="px-5 py-4 border-b border-gray-100 flex items-center gap-2">
          <DollarSign size={16} className="text-gray-400" />
          <h3 className="text-sm font-semibold text-gray-900">Payments ({payments.length})</h3>
        </div>
        <Table
          columns={[
            { key: 'paymentPeriod', label: 'Period' },
            { key: 'amountEarned', label: 'Earned', render: v => fmt(v) },
            { key: 'amountPaid', label: 'Paid', render: v => v ? fmt(v) : '—' },
            { key: 'paymentDate', label: 'Date', render: v => fmtDate(v) },
            { key: 'paymentStatus', label: 'Status', render: v => <Badge color={v === 'paid' ? 'green' : v === 'approved' ? 'blue' : 'amber'} label={v} /> },
          ]}
          rows={payments}
          emptyMessage="No payments yet."
        />
      </Card>
    </div>
  )
}
