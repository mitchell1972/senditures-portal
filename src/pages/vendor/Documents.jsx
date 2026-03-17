import { useState, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import { Card, Badge, Button, Table, PageHeader, Modal, Select, fmtDate, EmptyState } from '../../components/ui'
import { Upload, FileText, Download, Plus } from 'lucide-react'

const DOC_TYPES_VENDOR = [
  'Product Catalog', 'Inventory Update', 'Price Sheet',
  'Compliance / Insurance', 'W-9 / Tax Form', 'General',
]

const TYPE_COLORS = {
  'Remittance Statement': 'blue',
  'Payment Document': 'green',
  'Sales Statement': 'green',
  'Agreement / Notice': 'indigo',
  'W-9 / Tax Form': 'purple',
  'Compliance / Insurance': 'amber',
  'Product Catalog': 'brand',
  'Inventory Update': 'brand',
  'Price Sheet': 'brand',
  'General': 'gray',
}

const colorMap = {
  blue: 'bg-blue-100 text-blue-700',
  green: 'bg-green-100 text-green-700',
  amber: 'bg-amber-100 text-amber-700',
  brand: 'bg-brand-100 text-brand-700',
  gray: 'bg-gray-100 text-gray-600',
  purple: 'bg-purple-100 text-purple-700',
  indigo: 'bg-indigo-100 text-indigo-700',
}

export default function Documents() {
  const { currentVendor, getDocumentsByVendor, addDocument, currentUser } = useApp()
  const [uploadModal, setUploadModal] = useState(false)
  const [filter, setFilter] = useState('all')
  const [docType, setDocType] = useState(DOC_TYPES_VENDOR[0])
  const [notes, setNotes] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const fileRef = useRef(null)

  const docs = getDocumentsByVendor(currentVendor.id)
  const filtered = filter === 'all' ? docs : docs.filter(d => {
    if (filter === 'from_senditures') return d.uploadedByRole === 'internal_admin'
    if (filter === 'uploaded_by_me') return d.uploadedByRole !== 'internal_admin'
    return true
  })

  const handleUpload = () => {
    if (!selectedFile) return
    const doc = {
      id: `doc_${Date.now()}`,
      vendorId: currentVendor.id,
      fileName: selectedFile.name,
      documentType: docType,
      uploadedBy: currentUser.name,
      uploadedByRole: currentUser.role,
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: `${(selectedFile.size / 1024).toFixed(0)} KB`,
      notes,
    }
    addDocument(doc)
    setUploadModal(false)
    setSelectedFile(null)
    setNotes('')
    setDocType(DOC_TYPES_VENDOR[0])
  }

  const columns = [
    {
      key: 'fileName', label: 'File Name', render: (v, row) => (
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 bg-gray-100 rounded flex items-center justify-center flex-shrink-0">
            <FileText size={14} className="text-gray-500" />
          </div>
          <div>
            <p className="text-sm font-medium text-gray-900">{v}</p>
            {row.notes && <p className="text-xs text-gray-400 truncate max-w-xs">{row.notes}</p>}
          </div>
        </div>
      )
    },
    {
      key: 'documentType', label: 'Type', render: v => {
        const color = TYPE_COLORS[v] || 'gray'
        return <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${colorMap[color] || colorMap.gray}`}>{v}</span>
      }
    },
    { key: 'uploadedBy', label: 'Uploaded By', render: (v, row) => (
      <div>
        <p className="text-sm text-gray-700">{v}</p>
        <p className="text-xs text-gray-400">{row.uploadedByRole === 'internal_admin' ? 'Senditures' : 'Vendor'}</p>
      </div>
    )},
    { key: 'uploadDate', label: 'Date', render: v => fmtDate(v) },
    { key: 'fileSize', label: 'Size' },
    {
      key: 'id', label: '', render: () => (
        <button className="text-xs text-brand-600 hover:text-brand-800 flex items-center gap-1">
          <Download size={13} /> Download
        </button>
      )
    },
  ]

  return (
    <div>
      <PageHeader
        title="Documents"
        subtitle="Files shared between you and the Senditures team"
        actions={
          <Button size="sm" onClick={() => setUploadModal(true)}>
            <Upload size={14} /> Upload Document
          </Button>
        }
      />

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {[
          { key: 'all', label: 'All Documents' },
          { key: 'from_senditures', label: 'From Senditures' },
          { key: 'uploaded_by_me', label: 'Uploaded by You' },
        ].map(tab => (
          <button
            key={tab.key}
            onClick={() => setFilter(tab.key)}
            className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-colors ${filter === tab.key ? 'bg-brand-600 text-white' : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'}`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <Card padding={false}>
        {filtered.length === 0
          ? <EmptyState icon={FileText} title="No documents" message="Upload your first document or wait for Senditures to share files with you." action={<Button size="sm" onClick={() => setUploadModal(true)}><Plus size={14} /> Upload Document</Button>} />
          : <Table columns={columns} rows={filtered} />
        }
      </Card>

      {/* Upload modal */}
      <Modal open={uploadModal} onClose={() => setUploadModal(false)} title="Upload Document">
        <div className="space-y-4">
          <div
            className="border-2 border-dashed border-gray-300 rounded-xl p-6 text-center cursor-pointer hover:border-brand-400 transition-colors"
            onClick={() => fileRef.current?.click()}
          >
            {selectedFile ? (
              <div className="flex items-center justify-center gap-2 text-sm text-brand-600">
                <FileText size={16} />
                <span className="font-medium">{selectedFile.name}</span>
                <span className="text-gray-400">({(selectedFile.size / 1024).toFixed(0)} KB)</span>
              </div>
            ) : (
              <>
                <Upload size={22} className="mx-auto text-gray-400 mb-2" />
                <p className="text-sm text-gray-700">Click to select a file</p>
                <p className="text-xs text-gray-400 mt-1">PDF, CSV, XLSX, or images</p>
              </>
            )}
            <input ref={fileRef} type="file" className="hidden" onChange={e => setSelectedFile(e.target.files[0])} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
            <select
              value={docType}
              onChange={e => setDocType(e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              {DOC_TYPES_VENDOR.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes (optional)</label>
            <textarea
              value={notes}
              onChange={e => setNotes(e.target.value)}
              rows={2}
              placeholder="Any notes about this document..."
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
            />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="secondary" onClick={() => setUploadModal(false)}>Cancel</Button>
            <Button onClick={handleUpload} disabled={!selectedFile}>Upload</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
