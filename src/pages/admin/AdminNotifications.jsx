import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Card, Badge, Button, Table, PageHeader, Modal, fmtDate } from '../../components/ui'
import { Bell, Send, Plus } from 'lucide-react'
import { NOTIFICATION_TYPES } from '../../data/mockData'

const TYPE_COLORS = {
  inventory_reminder: 'amber',
  missing_docs: 'red',
  payout_posted: 'green',
  catalog_issue: 'orange',
  general_announcement: 'blue',
}

export default function AdminNotifications() {
  const { notifications, vendors, sendNotification } = useApp()
  const [composeModal, setComposeModal] = useState(false)
  const [form, setForm] = useState({ title: '', message: '', type: 'general_announcement', vendorId: '', allVendors: false })
  const [vendorFilter, setVendorFilter] = useState('all')

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))
  const getVendorName = id => id ? (vendors.find(v => v.id === id)?.companyName || id) : '—'

  const filtered = vendorFilter === 'all'
    ? notifications
    : notifications.filter(n => n.allVendors || n.vendorId === vendorFilter)

  const handleSend = () => {
    sendNotification({
      vendorId: form.allVendors ? null : form.vendorId || null,
      allVendors: form.allVendors,
      title: form.title,
      message: form.message,
      type: form.type,
    })
    setComposeModal(false)
    setForm({ title: '', message: '', type: 'general_announcement', vendorId: '', allVendors: false })
  }

  const columns = [
    {
      key: 'title', label: 'Notification', render: (v, row) => (
        <div>
          <p className="text-sm font-medium text-gray-900">{v}</p>
          <p className="text-xs text-gray-400 truncate max-w-sm">{row.message}</p>
        </div>
      )
    },
    {
      key: 'type', label: 'Type', render: v => (
        <Badge color={TYPE_COLORS[v] || 'gray'} label={NOTIFICATION_TYPES[v] || v} />
      )
    },
    {
      key: 'vendorId', label: 'Recipient', render: (v, row) => (
        <span className="text-sm text-gray-600">
          {row.allVendors ? <Badge color="blue" label="All Vendors" /> : getVendorName(v)}
        </span>
      )
    },
    { key: 'createdBy', label: 'Sent By' },
    { key: 'createdDate', label: 'Date', render: v => fmtDate(v) },
    {
      key: 'read', label: 'Status', render: v => (
        <Badge color={v ? 'gray' : 'green'} label={v ? 'Read' : 'Unread'} />
      )
    },
  ]

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle="Send and manage vendor notifications"
        actions={
          <Button size="sm" onClick={() => setComposeModal(true)}>
            <Send size={14} /> Send Notification
          </Button>
        }
      />

      <Card className="mb-4" padding={false}>
        <div className="px-4 py-3 flex gap-3">
          <select value={vendorFilter} onChange={e => setVendorFilter(e.target.value)} className="px-3 py-1.5 border border-gray-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-brand-500">
            <option value="all">All Recipients</option>
            {vendors.map(v => <option key={v.id} value={v.id}>{v.companyName}</option>)}
          </select>
        </div>
      </Card>

      <Card padding={false}>
        <Table columns={columns} rows={filtered} emptyMessage="No notifications sent yet." />
      </Card>

      {/* Compose modal */}
      <Modal open={composeModal} onClose={() => setComposeModal(false)} title="Send Notification" maxWidth="max-w-lg">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Recipient *</label>
            <div className="flex items-center gap-3 mb-2">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={form.allVendors}
                  onChange={e => set('allVendors', e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm text-gray-700">Send to all vendors</span>
              </label>
            </div>
            {!form.allVendors && (
              <select value={form.vendorId} onChange={e => set('vendorId', e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
                <option value="">Select vendor...</option>
                {vendors.map(v => <option key={v.id} value={v.id}>{v.companyName}</option>)}
              </select>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
            <select value={form.type} onChange={e => set('type', e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white">
              {Object.entries(NOTIFICATION_TYPES).map(([k, v]) => <option key={k} value={k}>{v}</option>)}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
            <input value={form.title} onChange={e => set('title', e.target.value)} className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500" placeholder="Notification title" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Message *</label>
            <textarea value={form.message} onChange={e => set('message', e.target.value)} rows={4} className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none" placeholder="Write your message here..." />
          </div>

          <div className="flex gap-2 justify-end pt-2">
            <Button variant="secondary" onClick={() => setComposeModal(false)}>Cancel</Button>
            <Button onClick={handleSend} disabled={!form.title || !form.message || (!form.allVendors && !form.vendorId)}>
              <Send size={14} /> Send
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
