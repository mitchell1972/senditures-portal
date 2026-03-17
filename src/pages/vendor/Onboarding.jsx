import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useApp } from '../../context/AppContext'
import { Button, Input, Card } from '../../components/ui'
import { CheckCircle, ChevronRight, ChevronLeft, Building2, User, CreditCard, FileText, Upload } from 'lucide-react'

const STEPS = [
  { id: 1, label: 'Company Info', icon: Building2 },
  { id: 2, label: 'Contact', icon: User },
  { id: 3, label: 'Payment', icon: CreditCard },
  { id: 4, label: 'Documents', icon: Upload },
  { id: 5, label: 'Review', icon: CheckCircle },
]

export default function Onboarding() {
  const { currentVendor, updateVendorStatus } = useApp()
  const navigate = useNavigate()
  const [step, setStep] = useState(1)
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({
    companyName: currentVendor?.companyName || '',
    brandName: currentVendor?.brandName || '',
    website: currentVendor?.website || '',
    address: currentVendor?.address || '',
    taxId: currentVendor?.taxId || '',
    contactName: currentVendor?.contactName || '',
    email: currentVendor?.contactEmail || '',
    phone: currentVendor?.phone || '',
    paymentMethod: currentVendor?.paymentDetails || '',
    agreedTerms: false,
  })
  const [files, setFiles] = useState({ w9: null, insurance: null, catalog: null, priceSheet: null })

  const set = (k, v) => setForm(prev => ({ ...prev, [k]: v }))
  const setFile = (k, f) => setFiles(prev => ({ ...prev, [k]: f }))

  const handleSubmit = () => {
    updateVendorStatus(currentVendor.id, 'submitted')
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mb-4">
          <CheckCircle size={28} className="text-green-600" />
        </div>
        <h2 className="text-xl font-bold text-gray-900">Application Submitted!</h2>
        <p className="mt-2 text-sm text-gray-500 max-w-sm">
          Your onboarding application has been submitted to the Senditures team for review.
          You'll receive a notification once your account is approved.
        </p>
        <Button className="mt-6" onClick={() => navigate('/dashboard')}>Go to Dashboard</Button>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-8">
        <h1 className="text-xl font-bold text-gray-900">Vendor Onboarding</h1>
        <p className="mt-1 text-sm text-gray-500">Complete all steps to submit your application to Senditures.</p>
      </div>

      {/* Step indicator */}
      <div className="flex items-center mb-8">
        {STEPS.map((s, i) => {
          const Icon = s.icon
          const isActive = step === s.id
          const isDone = step > s.id
          return (
            <div key={s.id} className="flex items-center flex-1 last:flex-none">
              <div className="flex flex-col items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                  isDone ? 'bg-green-500 text-white' : isActive ? 'bg-brand-600 text-white' : 'bg-gray-200 text-gray-500'
                }`}>
                  {isDone ? <CheckCircle size={16} /> : <Icon size={15} />}
                </div>
                <span className={`mt-1 text-[10px] font-medium ${isActive ? 'text-brand-600' : 'text-gray-400'}`}>{s.label}</span>
              </div>
              {i < STEPS.length - 1 && (
                <div className={`flex-1 h-0.5 mx-2 mb-4 ${isDone ? 'bg-green-400' : 'bg-gray-200'}`} />
              )}
            </div>
          )
        })}
      </div>

      <Card>
        {/* Step 1: Company Info */}
        {step === 1 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Company Information</h2>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Company Name *" value={form.companyName} onChange={e => set('companyName', e.target.value)} placeholder="Acme Corp" />
              <Input label="Brand Name *" value={form.brandName} onChange={e => set('brandName', e.target.value)} placeholder="Acme" />
            </div>
            <Input label="Website" value={form.website} onChange={e => set('website', e.target.value)} placeholder="www.example.com" />
            <Input label="Business Address *" value={form.address} onChange={e => set('address', e.target.value)} placeholder="123 Main St, City, ST 00000" />
            <Input label="Tax ID / EIN *" value={form.taxId} onChange={e => set('taxId', e.target.value)} placeholder="XX-XXXXXXX" />
          </div>
        )}

        {/* Step 2: Contact */}
        {step === 2 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Primary Contact</h2>
            <Input label="Contact Name *" value={form.contactName} onChange={e => set('contactName', e.target.value)} placeholder="Jane Smith" />
            <Input label="Email Address *" type="email" value={form.email} onChange={e => set('email', e.target.value)} placeholder="jane@company.com" />
            <Input label="Phone Number" value={form.phone} onChange={e => set('phone', e.target.value)} placeholder="(555) 000-0000" />
          </div>
        )}

        {/* Step 3: Payment */}
        {step === 3 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Payment Information</h2>
            <p className="text-sm text-gray-500">Enter your preferred payment method for receiving payouts from Senditures.</p>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Payment Method</label>
              <select
                value={form.paymentMethod.includes('ACH') ? 'ACH' : form.paymentMethod.includes('Check') ? 'Check' : 'Wire'}
                onChange={e => set('paymentMethod', e.target.value)}
                className="block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 bg-white"
              >
                <option value="ACH">ACH Bank Transfer</option>
                <option value="Check">Check by Mail</option>
                <option value="Wire">Wire Transfer</option>
              </select>
            </div>
            <Input label="Bank / Routing Details" value={form.paymentMethod} onChange={e => set('paymentMethod', e.target.value)} placeholder="Bank name, account last 4 digits" />
            <div className="p-3 bg-amber-50 border border-amber-100 rounded-lg text-xs text-amber-700">
              Payment details are for demo purposes only and are not stored or transmitted.
            </div>
          </div>
        )}

        {/* Step 4: Documents */}
        {step === 4 && (
          <div className="space-y-4">
            <h2 className="text-base font-semibold text-gray-900 mb-4">File Uploads</h2>
            {[
              { key: 'w9', label: 'W-9 or Tax Form *', hint: 'PDF required' },
              { key: 'insurance', label: 'Insurance / Compliance Docs', hint: 'PDF if applicable' },
              { key: 'catalog', label: 'Product Catalog File', hint: 'CSV, XLSX, or PDF' },
              { key: 'priceSheet', label: 'Price Sheet', hint: 'CSV, XLSX, or PDF' },
            ].map(({ key, label, hint }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
                <div
                  className={`border-2 border-dashed rounded-lg p-3 flex items-center gap-3 cursor-pointer hover:border-brand-400 transition-colors ${files[key] ? 'border-brand-400 bg-brand-50' : 'border-gray-300'}`}
                  onClick={() => document.getElementById(`file_${key}`)?.click()}
                >
                  <Upload size={16} className={files[key] ? 'text-brand-600' : 'text-gray-400'} />
                  <div>
                    <p className="text-sm text-gray-700">{files[key]?.name || 'Choose file...'}</p>
                    <p className="text-xs text-gray-400">{hint}</p>
                  </div>
                  <input id={`file_${key}`} type="file" className="hidden" onChange={e => setFile(key, e.target.files[0])} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Step 5: Review */}
        {step === 5 && (
          <div className="space-y-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Review & Submit</h2>
            {[
              { label: 'Company', value: `${form.companyName} · ${form.brandName}` },
              { label: 'Address', value: form.address },
              { label: 'Tax ID', value: form.taxId },
              { label: 'Contact', value: `${form.contactName} · ${form.email}` },
              { label: 'Phone', value: form.phone },
              { label: 'Payment Method', value: form.paymentMethod },
            ].map(({ label, value }) => (
              <div key={label} className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-xs font-semibold text-gray-500 uppercase tracking-wide">{label}</span>
                <span className="text-sm text-gray-800">{value || '—'}</span>
              </div>
            ))}
            <div className="mt-4 flex items-start gap-2">
              <input
                id="terms"
                type="checkbox"
                checked={form.agreedTerms}
                onChange={e => set('agreedTerms', e.target.checked)}
                className="mt-0.5 rounded border-gray-300"
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to Senditures' vendor terms and conditions, and certify the information above is accurate.
              </label>
            </div>
          </div>
        )}

        {/* Navigation */}
        <div className="flex justify-between mt-6 pt-4 border-t border-gray-100">
          <Button variant="secondary" onClick={() => setStep(s => s - 1)} disabled={step === 1}>
            <ChevronLeft size={16} /> Back
          </Button>
          {step < 5 ? (
            <Button onClick={() => setStep(s => s + 1)}>
              Next <ChevronRight size={16} />
            </Button>
          ) : (
            <Button onClick={handleSubmit} disabled={!form.agreedTerms}>
              Submit Application <ChevronRight size={16} />
            </Button>
          )}
        </div>
      </Card>
    </div>
  )
}
