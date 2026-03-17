import { useState, useRef } from 'react'
import { useApp } from '../../context/AppContext'
import { Card, Badge, Button, Table, PageHeader, Modal, Input, Select, fmt, EmptyState } from '../../components/ui'
import { Upload, Download, Package, CheckCircle, AlertCircle, FileText, Plus } from 'lucide-react'
import { PRODUCT_STATUSES } from '../../data/mockData'
import * as XLSX from 'xlsx'

function validateRows(rawRows) {
  const required = ['vendor_sku', 'product_name', 'cost', 'msrp', 'quantity_on_hand']
  const rows = []
  const errors = []
  rawRows.forEach((row, i) => {
    const rowNum = i + 2 // 1-indexed + header row
    if (!row.vendor_sku) { errors.push(`Row ${rowNum}: missing vendor_sku`); return }
    if (!row.product_name) { errors.push(`Row ${rowNum}: missing product_name`); return }
    if (isNaN(parseFloat(row.cost))) { errors.push(`Row ${rowNum}: invalid cost "${row.cost}"`); return }
    if (isNaN(parseFloat(row.msrp))) { errors.push(`Row ${rowNum}: invalid msrp "${row.msrp}"`); return }
    if (isNaN(parseInt(row.quantity_on_hand))) { errors.push(`Row ${rowNum}: invalid quantity_on_hand "${row.quantity_on_hand}"`); return }
    rows.push(row)
  })
  return { rows, errors }
}

function parseCSV(text) {
  const lines = text.trim().split('\n')
  if (lines.length < 2) return { rows: [], errors: ['File appears to be empty'] }
  const headers = lines[0].split(',').map(h => h.trim().toLowerCase().replace(/\s+/g, '_'))
  const required = ['vendor_sku', 'product_name', 'cost', 'msrp', 'quantity_on_hand']
  const missing = required.filter(r => !headers.includes(r))
  if (missing.length > 0) {
    return { rows: [], errors: [`Missing required columns: ${missing.join(', ')}`] }
  }
  const rawRows = []
  for (let i = 1; i < lines.length; i++) {
    const vals = lines[i].split(',').map(v => v.trim().replace(/^"|"$/g, ''))
    const row = {}
    headers.forEach((h, idx) => { row[h] = vals[idx] || '' })
    rawRows.push(row)
  }
  return validateRows(rawRows)
}

function parseXLSX(buffer) {
  try {
    const wb = XLSX.read(buffer, { type: 'array' })
    const sheet = wb.Sheets[wb.SheetNames[0]]
    const jsonRows = XLSX.utils.sheet_to_json(sheet, { defval: '' })
    if (jsonRows.length === 0) return { rows: [], errors: ['File appears to be empty'] }
    // Normalize headers to snake_case
    const rawRows = jsonRows.map(row => {
      const normalized = {}
      Object.keys(row).forEach(k => {
        normalized[k.trim().toLowerCase().replace(/\s+/g, '_')] = row[k]
      })
      return normalized
    })
    const required = ['vendor_sku', 'product_name', 'cost', 'msrp', 'quantity_on_hand']
    const firstRowKeys = Object.keys(rawRows[0])
    const missing = required.filter(r => !firstRowKeys.includes(r))
    if (missing.length > 0) {
      return { rows: [], errors: [`Missing required columns: ${missing.join(', ')}`] }
    }
    return validateRows(rawRows)
  } catch (err) {
    return { rows: [], errors: [`Failed to parse XLSX file: ${err.message}`] }
  }
}

const TEMPLATE_CSV = `vendor_sku,product_name,description,category,cost,msrp,map,quantity_on_hand,upc,image_url
ACM-NEW-001,Sample Product,Product description here,Category,25.00,59.99,54.99,100,012345600099,https://example.com/image.jpg`

export default function Catalog() {
  const { currentVendor, getProductsByVendor, addProducts, importLogs, addImportLog, currentUser } = useApp()
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [importModal, setImportModal] = useState(false)
  const [importResult, setImportResult] = useState(null)
  const [importing, setImporting] = useState(false)
  const fileRef = useRef(null)

  const products = getProductsByVendor(currentVendor.id)

  const filtered = products.filter(p => {
    const matchSearch = !search || p.productName.toLowerCase().includes(search.toLowerCase()) || p.vendorSKU.toLowerCase().includes(search.toLowerCase())
    const matchStatus = statusFilter === 'all' || p.status === statusFilter
    return matchSearch && matchStatus
  })

  const handleFileUpload = (e) => {
    const file = e.target.files[0]
    if (!file) return
    setImporting(true)
    const isXLSX = file.name.endsWith('.xlsx') || file.name.endsWith('.xls')
    const reader = new FileReader()
    reader.onload = (ev) => {
      const { rows, errors } = isXLSX
        ? parseXLSX(ev.target.result)
        : parseCSV(ev.target.result)
      setImporting(false)

      const log = {
        id: `imp${Date.now()}`,
        vendorId: currentVendor.id,
        vendorName: currentVendor.companyName,
        fileName: file.name,
        importType: 'catalog',
        status: errors.length === 0 ? 'success' : rows.length > 0 ? 'partial' : 'failed',
        rowsProcessed: rows.length,
        rowsFailed: errors.length,
        errorSummary: errors.length > 0 ? errors.slice(0, 3).join(' | ') : null,
        uploadedBy: currentUser.name,
        uploadDate: new Date().toISOString().split('T')[0],
      }
      addImportLog(log)

      if (rows.length > 0) {
        const newProducts = rows.map((r, i) => ({
          id: `p_new_${Date.now()}_${i}`,
          vendorId: currentVendor.id,
          vendorSKU: r.vendor_sku,
          internalSKU: '',
          upc: r.upc || '',
          productName: r.product_name,
          description: r.description || '',
          category: r.category || 'Uncategorized',
          cost: parseFloat(r.cost),
          msrp: parseFloat(r.msrp),
          map: r.map ? parseFloat(r.map) : null,
          quantityOnHand: parseInt(r.quantity_on_hand),
          imageUrl: r.image_url || '',
          channelAvailability: [],
          status: 'pending_review',
          lastUpdated: new Date().toISOString().split('T')[0],
        }))
        addProducts(newProducts)
      }

      setImportResult({ rows, errors, fileName: file.name, log })
    }
    if (isXLSX) {
      reader.readAsArrayBuffer(file)
    } else {
      reader.readAsText(file)
    }
    e.target.value = ''
  }

  const downloadTemplate = () => {
    const blob = new Blob([TEMPLATE_CSV], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = 'senditures_catalog_template.csv'; a.click()
    URL.revokeObjectURL(url)
  }

  const exportCatalog = () => {
    const headers = ['vendor_sku', 'internal_sku', 'upc', 'product_name', 'description', 'category', 'cost', 'msrp', 'map', 'quantity_on_hand', 'status', 'last_updated']
    const rows = products.map(p => [
      p.vendorSKU, p.internalSKU, p.upc, p.productName, p.description,
      p.category, p.cost, p.msrp, p.map || '', p.quantityOnHand, p.status, p.lastUpdated
    ])
    const csv = [headers, ...rows].map(r => r.map(v => `"${v}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url; a.download = `${currentVendor.brandName}_catalog_export.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  const columns = [
    { key: 'vendorSKU', label: 'SKU' },
    { key: 'productName', label: 'Product Name', render: (v, row) => (
      <div>
        <p className="font-medium text-gray-900">{v}</p>
        <p className="text-gray-400 text-xs">{row.category}</p>
      </div>
    )},
    { key: 'cost', label: 'Cost', render: v => fmt(v) },
    { key: 'msrp', label: 'MSRP', render: v => fmt(v) },
    { key: 'map', label: 'MAP', render: v => v ? fmt(v) : '—' },
    { key: 'quantityOnHand', label: 'QOH', render: v => (
      <span className={v === 0 ? 'text-red-600 font-semibold' : 'text-gray-700'}>{v}</span>
    )},
    { key: 'status', label: 'Status', render: v => {
      const s = PRODUCT_STATUSES[v] || { label: v, color: 'gray' }
      return <Badge color={s.color} label={s.label} />
    }},
    { key: 'lastUpdated', label: 'Updated', render: v => <span className="text-gray-400">{v}</span> },
  ]

  return (
    <div>
      <PageHeader
        title="Catalog & Inventory"
        subtitle={`${products.length} products · ${products.filter(p => p.status === 'active').length} active`}
        actions={
          <>
            <Button variant="secondary" size="sm" onClick={downloadTemplate}>
              <Download size={14} /> Template
            </Button>
            <Button variant="secondary" size="sm" onClick={exportCatalog}>
              <Download size={14} /> Export CSV
            </Button>
            <Button size="sm" onClick={() => { setImportResult(null); setImportModal(true) }}>
              <Upload size={14} /> Upload Catalog
            </Button>
          </>
        }
      />

      {/* Filters */}
      <Card className="mb-4" padding={false}>
        <div className="px-4 py-3 flex flex-col sm:flex-row gap-3">
          <input
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search by product name or SKU..."
            className="flex-1 px-3 py-1.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
          />
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
        </div>
      </Card>

      {/* Table */}
      <Card padding={false}>
        <Table columns={columns} rows={filtered} emptyMessage="No products match your filters." />
      </Card>

      {/* Import modal */}
      <Modal open={importModal} onClose={() => setImportModal(false)} title="Upload Catalog / Inventory" maxWidth="max-w-xl">
        {!importResult ? (
          <div>
            <p className="text-sm text-gray-600 mb-4">Upload a CSV file to add or update your product catalog. Rows with errors will be skipped — successful rows are imported immediately.</p>
            <div
              className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-brand-400 transition-colors cursor-pointer"
              onClick={() => fileRef.current?.click()}
            >
              <Upload size={24} className="mx-auto text-gray-400 mb-2" />
              <p className="text-sm font-medium text-gray-700">Click to choose a CSV file</p>
              <p className="text-xs text-gray-400 mt-1">Accepted: .csv, .xlsx</p>
              <input ref={fileRef} type="file" accept=".csv,.xlsx" className="hidden" onChange={handleFileUpload} />
            </div>
            <div className="mt-4 p-3 bg-gray-50 rounded-lg">
              <p className="text-xs font-semibold text-gray-600 mb-1">Required columns:</p>
              <p className="text-xs text-gray-500 font-mono">vendor_sku, product_name, cost, msrp, quantity_on_hand</p>
            </div>
            <div className="mt-3 flex justify-end">
              <Button variant="ghost" size="sm" onClick={downloadTemplate}>
                <Download size={13} /> Download Template
              </Button>
            </div>
          </div>
        ) : (
          <div>
            <div className={`flex items-center gap-3 p-4 rounded-xl mb-4 ${
              importResult.log.status === 'success' ? 'bg-green-50' : importResult.log.status === 'partial' ? 'bg-amber-50' : 'bg-red-50'
            }`}>
              {importResult.log.status === 'success'
                ? <CheckCircle size={20} className="text-green-600" />
                : <AlertCircle size={20} className={importResult.log.status === 'partial' ? 'text-amber-600' : 'text-red-600'} />}
              <div>
                <p className="text-sm font-semibold text-gray-900">{importResult.fileName}</p>
                <p className="text-xs text-gray-600">{importResult.log.rowsProcessed} rows imported · {importResult.log.rowsFailed} failed</p>
              </div>
            </div>
            {importResult.errors.length > 0 && (
              <div className="mb-4">
                <p className="text-xs font-semibold text-red-600 mb-2">Errors ({importResult.errors.length})</p>
                <div className="space-y-1 max-h-40 overflow-y-auto">
                  {importResult.errors.map((e, i) => (
                    <p key={i} className="text-xs text-red-700 bg-red-50 px-2 py-1 rounded">{e}</p>
                  ))}
                </div>
              </div>
            )}
            <div className="flex gap-2 justify-end">
              <Button variant="secondary" size="sm" onClick={() => setImportResult(null)}>Upload Another</Button>
              <Button size="sm" onClick={() => setImportModal(false)}>Done</Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}
