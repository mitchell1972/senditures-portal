import { useNavigate } from 'react-router-dom'
import { useApp } from '../context/AppContext'
import { Building2, ShieldCheck, User } from 'lucide-react'

const demoAccounts = [
  {
    id: 'u001',
    label: 'Vendor User',
    name: 'Sarah Chen',
    company: 'Acme Outdoors Co.',
    email: 'vendor@demo.com',
    description: 'View dashboard, upload catalog, manage documents, see payments and notifications.',
    icon: User,
    color: 'border-brand-200 hover:border-brand-400 hover:bg-brand-50',
    iconColor: 'bg-brand-100 text-brand-600',
    redirectTo: '/dashboard',
  },
  {
    id: 'u002',
    label: 'Vendor Admin',
    name: 'Mike Torres',
    company: 'Acme Outdoors Co.',
    email: 'admin@demo.com',
    description: 'Everything a Vendor User can do, plus manage company users and settings.',
    icon: Building2,
    color: 'border-indigo-200 hover:border-indigo-400 hover:bg-indigo-50',
    iconColor: 'bg-indigo-100 text-indigo-600',
    redirectTo: '/dashboard',
  },
  {
    id: 'u004',
    label: 'Internal Admin',
    name: 'Alex Rivera',
    company: 'Senditures',
    email: 'ops@senditures.com',
    description: 'Approve vendors, manage all products and documents, send notifications, review imports.',
    icon: ShieldCheck,
    color: 'border-emerald-200 hover:border-emerald-400 hover:bg-emerald-50',
    iconColor: 'bg-emerald-100 text-emerald-600',
    redirectTo: '/admin/vendors',
  },
]

export default function Login() {
  const { login } = useApp()
  const navigate = useNavigate()

  const handleLogin = (account) => {
    login(account.id)
    navigate(account.redirectTo)
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      {/* Logo */}
      <div className="flex items-center gap-3 mb-10">
        <div className="w-10 h-10 rounded-xl bg-brand-600 flex items-center justify-center text-white font-bold text-lg shadow-md">S</div>
        <div>
          <p className="text-lg font-bold text-gray-900 leading-none">Senditures</p>
          <p className="text-xs text-gray-400 mt-0.5">Vendor Portal</p>
        </div>
      </div>

      <div className="w-full max-w-3xl">
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1>
          <p className="mt-2 text-sm text-gray-500">Select a demo account to explore the portal</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {demoAccounts.map((account) => {
            const Icon = account.icon
            return (
              <button
                key={account.id}
                onClick={() => handleLogin(account)}
                className={`bg-white rounded-xl border-2 p-5 text-left transition-all duration-150 shadow-sm hover:shadow-md ${account.color}`}
              >
                <div className={`w-10 h-10 rounded-lg flex items-center justify-center mb-4 ${account.iconColor}`}>
                  <Icon size={20} />
                </div>
                <div className="mb-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wider text-gray-400">{account.label}</span>
                  <h3 className="text-sm font-bold text-gray-900 mt-0.5">{account.name}</h3>
                  <p className="text-xs text-gray-500">{account.company}</p>
                </div>
                <p className="text-xs text-gray-600 leading-relaxed">{account.description}</p>
                <div className="mt-4 pt-3 border-t border-gray-100">
                  <p className="text-[10px] text-gray-400 font-mono">{account.email}</p>
                </div>
              </button>
            )
          })}
        </div>

        <p className="text-center text-xs text-gray-400 mt-8">
          This is a prototype MVP — all data is simulated for demonstration purposes.
        </p>
      </div>
    </div>
  )
}
