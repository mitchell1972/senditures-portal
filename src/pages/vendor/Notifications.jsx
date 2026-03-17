import { useApp } from '../../context/AppContext'
import { Card, Badge, PageHeader, fmtDate } from '../../components/ui'
import { Bell, CheckCheck } from 'lucide-react'
import { NOTIFICATION_TYPES } from '../../data/mockData'

const TYPE_COLORS = {
  inventory_reminder: 'amber',
  missing_docs: 'red',
  payout_posted: 'green',
  catalog_issue: 'orange',
  general_announcement: 'blue',
}

export default function Notifications() {
  const { currentUser, currentVendor, getNotificationsForVendor, markNotificationRead } = useApp()

  const notifs = getNotificationsForVendor(currentVendor.id)
  const unread = notifs.filter(n => !n.read).length

  const markAllRead = () => {
    notifs.filter(n => !n.read).forEach(n => markNotificationRead(n.id))
  }

  return (
    <div>
      <PageHeader
        title="Notifications"
        subtitle={unread > 0 ? `${unread} unread` : 'All caught up'}
        actions={
          unread > 0 && (
            <button onClick={markAllRead} className="text-sm text-brand-600 hover:text-brand-800 flex items-center gap-1.5 font-medium">
              <CheckCheck size={15} /> Mark all read
            </button>
          )
        }
      />

      {notifs.length === 0 ? (
        <Card>
          <div className="flex flex-col items-center py-12 text-center">
            <Bell size={28} className="text-gray-300 mb-3" />
            <p className="text-sm text-gray-500">No notifications yet.</p>
          </div>
        </Card>
      ) : (
        <div className="space-y-3">
          {notifs.map(n => (
            <div
              key={n.id}
              className={`bg-white rounded-xl border p-5 cursor-pointer transition-colors ${
                n.read ? 'border-gray-200' : 'border-brand-200 bg-brand-50/30'
              }`}
              onClick={() => !n.read && markNotificationRead(n.id)}
            >
              <div className="flex items-start gap-3">
                <div className={`mt-0.5 w-2 h-2 rounded-full flex-shrink-0 ${n.read ? 'bg-transparent' : 'bg-brand-500'}`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-4 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className={`text-sm font-semibold ${n.read ? 'text-gray-800' : 'text-gray-900'}`}>{n.title}</h3>
                      <Badge
                        color={TYPE_COLORS[n.type] || 'gray'}
                        label={NOTIFICATION_TYPES[n.type] || n.type}
                      />
                      {n.allVendors && <Badge color="gray" label="All Vendors" />}
                    </div>
                    <span className="text-xs text-gray-400 flex-shrink-0">{fmtDate(n.createdDate)}</span>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 leading-relaxed">{n.message}</p>
                  <p className="mt-2 text-xs text-gray-400">Sent by {n.createdBy}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
