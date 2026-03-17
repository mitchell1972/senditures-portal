import { useState } from 'react'
import { useApp } from '../../context/AppContext'
import { Card, Badge, Button, Table, PageHeader, Modal, Input, Select } from '../../components/ui'
import { Users, Plus, UserCheck, UserX, Edit2 } from 'lucide-react'

export default function TeamManagement() {
  const { currentUser, currentVendor, getUsersByVendor, addUser, updateUser, deactivateUser } = useApp()
  const [addModal, setAddModal] = useState(false)
  const [editModal, setEditModal] = useState(null)
  const [form, setForm] = useState({ name: '', email: '', role: 'vendor_user' })

  const teamUsers = getUsersByVendor(currentVendor.id)
  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))

  const handleAdd = () => {
    if (!form.name || !form.email) return
    addUser({
      name: form.name,
      email: form.email,
      role: form.role,
      vendorId: currentVendor.id,
    })
    setAddModal(false)
    setForm({ name: '', email: '', role: 'vendor_user' })
  }

  const handleEdit = () => {
    if (!editModal) return
    updateUser(editModal.id, { name: form.name, email: form.email, role: form.role })
    setEditModal(null)
    setForm({ name: '', email: '', role: 'vendor_user' })
  }

  const openEdit = (user) => {
    setForm({ name: user.name, email: user.email, role: user.role })
    setEditModal(user)
  }

  const columns = [
    {
      key: 'name', label: 'Name', render: (v, row) => (
        <div>
          <p className="font-medium text-gray-900">{v}</p>
          <p className="text-xs text-gray-400">{row.email}</p>
        </div>
      )
    },
    {
      key: 'role', label: 'Role', render: v => (
        <Badge
          color={v === 'vendor_admin' ? 'blue' : 'gray'}
          label={v === 'vendor_admin' ? 'Admin' : 'User'}
        />
      )
    },
    {
      key: 'active', label: 'Status', render: v => (
        <Badge color={v ? 'green' : 'red'} label={v ? 'Active' : 'Inactive'} />
      )
    },
    {
      key: 'id', label: 'Actions', render: (v, row) => (
        <div className="flex items-center gap-1.5">
          <Button size="sm" variant="ghost" onClick={() => openEdit(row)}>
            <Edit2 size={13} />
          </Button>
          {row.active && row.id !== currentUser.id && (
            <Button size="sm" variant="danger" onClick={() => deactivateUser(v)}>
              <UserX size={13} />
            </Button>
          )}
        </div>
      )
    },
  ]

  return (
    <div>
      <PageHeader
        title="Team Management"
        subtitle={`Manage users for ${currentVendor.companyName}`}
        actions={
          <Button size="sm" onClick={() => { setForm({ name: '', email: '', role: 'vendor_user' }); setAddModal(true) }}>
            <Plus size={14} /> Add User
          </Button>
        }
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-brand-50 flex items-center justify-center">
              <Users size={18} className="text-brand-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{teamUsers.length}</p>
              <p className="text-xs text-gray-500">Total Users</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center">
              <UserCheck size={18} className="text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{teamUsers.filter(u => u.active).length}</p>
              <p className="text-xs text-gray-500">Active</p>
            </div>
          </div>
        </Card>
        <Card>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center">
              <Users size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{teamUsers.filter(u => u.role === 'vendor_admin').length}</p>
              <p className="text-xs text-gray-500">Admins</p>
            </div>
          </div>
        </Card>
      </div>

      <Card padding={false}>
        <Table columns={columns} rows={teamUsers} emptyMessage="No team members yet." />
      </Card>

      {/* Add User Modal */}
      <Modal open={addModal} onClose={() => setAddModal(false)} title="Add Team Member" maxWidth="max-w-md">
        <div className="space-y-3">
          <Input label="Full Name *" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith" />
          <Input label="Email Address *" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@company.com" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={form.role}
              onChange={e => set('role', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="vendor_user">Vendor User</option>
              <option value="vendor_admin">Vendor Admin</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="secondary" onClick={() => setAddModal(false)}>Cancel</Button>
            <Button onClick={handleAdd} disabled={!form.name || !form.email}>Add User</Button>
          </div>
        </div>
      </Modal>

      {/* Edit User Modal */}
      <Modal open={!!editModal} onClose={() => setEditModal(null)} title="Edit Team Member" maxWidth="max-w-md">
        <div className="space-y-3">
          <Input label="Full Name *" value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith" />
          <Input label="Email Address *" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@company.com" />
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
            <select
              value={form.role}
              onChange={e => set('role', e.target.value)}
              className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
            >
              <option value="vendor_user">Vendor User</option>
              <option value="vendor_admin">Vendor Admin</option>
            </select>
          </div>
          <div className="flex gap-2 justify-end pt-2">
            <Button variant="secondary" onClick={() => setEditModal(null)}>Cancel</Button>
            <Button onClick={handleEdit} disabled={!form.name || !form.email}>Save Changes</Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}
