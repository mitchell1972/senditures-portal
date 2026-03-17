import { useState, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import { Card, Badge, Button, Table, PageHeader, Modal, fmtDate } from '../../components/ui'
import { Upload, FileText, Download } from 'lucide-react'

const DOC_TYPES_ADMIN = [
  'Remittance Statement', 'Payment Document', 'Sales Statement',
  'Agreement / Notice', 'General',
]

export default function AdminDocuments() {
  const { documents, vendors, addDocument, currentUser } = useApp()
  const [vendorFilter, setVendorFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [uploadModal, setUploadModal] = useState(false)
  const [docType, setDocType] = useState(DOC_TYPES_ADMIN[0])
  const [targetVendor, setTargetVendor] = useState('')
  const [notes, setNotes] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)
  const fileRef = useRef(null)

  const getVendorName = id => vendors.find(v => v.id === id)?.companyName || id

  const filtered = documents.filter(d => {
    const matchVendor = vendorFilter === 'all' || d.vendorId === vendorFilter
    const matchType = typeFilter === 'all' || d.documentType === typeFilter
    return matchVendor && matchType
  })

  const docTypes = [...new Set(documents.map(d => d.documentType))]

  const handleUpload = () => {
    if (!selectedFile || !targetVendor) return
    addDocument({
      id: `doc_${Date.now()}`,
      vendorId: targetVendor,
      fileName: selectedFile.name,
      documentType: docType,
      uploadedBy: currentUser.name,
      uploadedByRole: 'internal_admin',
      uploadDate: new Date().toISOString().split('T')[0],
      fileSize: `${(selectedFile.size / 1024).toFixed(0)} KB`,
      notes,
    })
    setUploadModal(false)
    setSelectedFile(null)
    setNotes('')
    setDocType(DOC_TYPES_ADMIN[0])
    setTargetVendor('')
  }

  const columns = [
    {
      key: 'fileName', label: 'File Name', render: (v, row) => (
        <div className="flex items-center gap-2.5">
          <FileText size={15} className="text-gray-400 flex-shrink-0" />
          <div>
            <p className="text-sm font-medium text-gray-900">{v}</p>
            {row.notes && <p className="text-xs text-gray-400">{row.notes}</p>}
          </div>
        </div>
      )
    },
    { key: 'documentType', label: 'Type' },
    {
      key: 'vendorId', label: 'Vendor', render: v => (
        <span className="text-sm text-gray-700">{getVendorName(v)}</span>
      )
    },
    {
      key: 'uploadedByRole', label: 'Source', render: (v) => (
        <Badge color={v === 'internal_admin' ? 'blue' : 'gray'} label={v === 'internal_admin' ? 'Senditures' : 'Vendor'} />
      )
    },
    { key: 'uploadedBy', label: 'Uploaded By' },
    { key: 'uploadDate', label: 'Date', render: v => fmtDate(v) },
    { key: 'fileSize', label: 'Size' },
    {
      key: 'id', label: '', render: () => (
        <button className="text-xs text-brand-600 hover:text-brand-800 flex items-center gap-1">
          <Download size={12} /> Download
        </button>
      )
    },
  ]

  return (
    <div>
      <PageHeader
        title="Documents"
        subtitle="All vendor documents and Senditures uploads"
        actions={
          <Button size="sm" onClick={() => setUploadModal(true)}>
            <Upload size={14} /> Upload to Vendor
          </Button>
        }
      />

      <Card className="mb-4" padding={false}>
        <div className="px-4 py-3 flex flex-col sm:flex-row gap-3">
          <select value={vendorFilter} onChange={e => setVendorFilter(e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="all">All Vendors</option>
            {vendors.map(v => <option key={v.id} value={v.id}>{v.companyName}</option>)}
          </select>
          <select value={typeFilter} onChange={e => setTypeFilter(e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="all">All Types</option>
            {docTypes.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>
      </Card>

      <Card padding={false}>
        <Table columns={columns} rows={filtered} emptyMessage="No documents found." />
      </Card>

      <Modal open={uploadModal} onClose={() => setUploadModal(false)} title="Upload Document to Vendor">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Vendor *</label>
            <select value={targetVendor} onChange={e => setTargetVendor(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
              <option value="">Select vendor...</option>
              {vendors.map(v => <option key={v.id} value={v.id}>{v.companyName}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Document Type</label>
            <select value={docType} onChange={e => setDocType(e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
              {DOC_TYPES_ADMIN.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div
            className={`border-2 border-dashed rounded-lg p-5 text-center cursor-pointer hover:border-brand-400 transition-colors ${selectedFile ? 'border-brand-400 bg-brand-50' : 'border-gray-300'}`}
            onClick={() => fileRef.current?.click()}
          >
            {selectedFile
              ? <p className="text-sm text-brand-700 font-medium">{selectedFile.name}</p>
              : <><Upload size={18} className="mx-auto text-gray-400 mb-1" /><p className="text-sm text-gray-600">Click to select file</p></>
            }
            <input ref={fileRef} type="file" className="hidden" onChange={e => setSelectedFile(e.target.files[0])} />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea value={notes} onChange={e => setNotes(e.target.value)} rows={2} className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" placeholder="Optional notes..." />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="secondary" onClick={() => setUploadModal(false)}>Cancel</Button>
            <Button onClick={handleUpload} disabled={!selectedFile || !targetVendor}>Upload</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
