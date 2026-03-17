import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Card, Badge, Table, PageHeader, MetricCard, fmtDate } from '../../components/ui'
import { Upload, CheckCircle, AlertTriangle, XCircle, FileText } from 'lucide-react'
import { IMPORT_STATUSES } from '../../data/mockData'

export default function ImportLog() {
  const { importLogs, vendors } = useApp()
  const [statusFilter, setStatusFilter] = useState('all')
  const [vendorFilter, setVendorFilter] = useState('all')
  const [expanded, setExpanded] = useState(null)

  const getVendorName = id => vendors.find(v => v.id === id)?.companyName || id

  const filtered = importLogs.filter(l => {
    const matchStatus = statusFilter === 'all' || l.status === statusFilter
    const matchVendor = vendorFilter === 'all' || l.vendorId === vendorFilter
    return matchStatus && matchVendor
  })

  const counts = {
    success: importLogs.filter(l => l.status === 'success').length,
    partial: importLogs.filter(l => l.status === 'partial').length,
    failed: importLogs.filter(l => l.status === 'failed').length,
  }

  const columns = [
    {
      key: 'fileName', label: 'File', render: (v, row) => (
        <div className="flex items-center gap-2">
          <FileText size={14} className="text-gray-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">{v}</p>
            <p className="text-xs text-gray-400 capitalize">{row.importType} import</p>
          </div>
        </div>
      )
    },
    { key: 'vendorId', label: 'Vendor', render: v => <span className="text-sm text-gray-700">{getVendorName(v)}</span> },
    {
      key: 'status', label: 'Status', render: v => {
        const s = IMPORT_STATUSES[v] || { label: v, color: 'gray' }
        return <Badge color={s.color} label={s.label} />
      }
    },
    { key: 'rowsProcessed', label: 'Imported', render: v => <span className="text-green-700 font-semibold">{v}</span> },
    { key: 'rowsFailed', label: 'Failed', render: v => <span className={v > 0 ? 'text-red-600 font-semibold' : 'text-gray-400'}>{v}</span> },
    { key: 'uploadedBy', label: 'Uploaded By' },
    { key: 'uploadDate', label: 'Date', render: v => fmtDate(v) },
    {
      key: 'errorSummary', label: 'Errors', render: (v, row) => v ? (
        <button
          onClick={() => setExpanded(expanded === row.id ? null : row.id)}
          className="text-xs text-red-600 hover:text-red-800 font-medium"
        >
          {expanded === row.id ? 'Hide' : 'View errors'}
        </button>
      ) : <span className="text-gray-300 text-xs">—</span>
    },
  ]

  return (
    <div>
      <PageHeader title="Import Log" subtitle="Review file import results and errors" />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <MetricCard label="Successful Imports" value={counts.success} icon={CheckCircle} color="green" />
        <MetricCard label="Partial Imports" value={counts.partial} icon={AlertTriangle} color="amber" />
        <MetricCard label="Failed Imports" value={counts.failed} icon={XCircle} color="red" />
      </div>

      <Card className="mb-4" padding={false}>
        <div className="px-4 py-3 flex gap-3">
          <select value={vendorFilter} onChange={e => setVendorFilter(e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="all">All Vendors</option>
            {vendors.map(v => <option key={v.id} value={v.id}>{v.companyName}</option>)}
          </select>
          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="all">All Statuses</option>
            {Object.entries(IMPORT_STATUSES).map(([k, v]) => <option key={k} value={k}>{v.label}</option>)}
          </select>
        </div>
      </Card>

      <Card padding={false}>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr className="bg-gray-50">
                {columns.map(col => (
                  <th key={col.key + col.label} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider whitespace-nowrap">
                    {col.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-4 py-10 text-center text-sm text-gray-400">No import logs found.</td>
                </tr>
              ) : filtered.map(row => (
                <>
                  <tr key={row.id} className="hover:bg-gray-50">
                    {columns.map(col => (
                      <td key={col.key + col.label} className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">
                        {col.render ? col.render(row[col.key], row) : row[col.key]}
                      </td>
                    ))}
                  </tr>
                  {expanded === row.id && row.errorSummary && (
                    <tr key={`${row.id}-errors`} className="bg-red-50">
                      <td colSpan={columns.length} className="px-6 py-3">
                        <div className="text-xs text-red-700 font-medium mb-1">Error Details:</div>
                        <div className="space-y-1">
                          {row.errorSummary.split(' | ').map((e, i) => (
                            <div key={i} className="text-xs text-red-600 bg-red-100 px-2 py-1 rounded">{e}</div>
                          ))}
                        </div>
                      </td>
                    </tr>
                  )}
                </>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
