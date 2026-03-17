// ─── USERS ────────────────────────────────────────────────────────────────────
export const users = [
  {
    id: 'u001',
    name: 'Sarah Chen',
    email: 'vendor@demo.com',
    role: 'vendor_user',
    vendorId: 'v001',
    active: true,
  },
  {
    id: 'u002',
    name: 'Mike Torres',
    email: 'admin@demo.com',
    role: 'vendor_admin',
    vendorId: 'v001',
    active: true,
  },
  {
    id: 'u003',
    name: 'Jordan Lee',
    email: 'vendor2@demo.com',
    role: 'vendor_user',
    vendorId: 'v003',
    active: true,
  },
  {
    id: 'u004',
    name: 'Alex Rivera',
    email: 'ops@senditures.com',
    role: 'internal_admin',
    vendorId: null,
    active: true,
  },
]

// ─── VENDORS ──────────────────────────────────────────────────────────────────
export const vendors = [
  {
    id: 'v001',
    companyName: 'Acme Outdoors Co.',
    brandName: 'Acme',
    contactName: 'Sarah Chen',
    contactEmail: 'sarah@acmeoutdoors.com',
    phone: '(303) 555-2345',
    website: 'www.acmeoutdoors.com',
    address: '123 Gear Lane, Boulder, CO 80301',
    taxId: '82-1234567',
    paymentDetails: 'ACH – Bank of America ****4521',
    onboardingStatus: 'approved',
    createdDate: '2024-11-10',
    approvedDate: '2024-11-18',
    users: ['u001', 'u002'],
  },
  {
    id: 'v002',
    companyName: 'FreshScents LLC',
    brandName: 'FreshScents',
    contactName: 'Priya Patel',
    contactEmail: 'priya@freshscents.com',
    phone: '(415) 555-9812',
    website: 'www.freshscents.com',
    address: '88 Aroma Ave, San Francisco, CA 94107',
    taxId: '91-9876543',
    paymentDetails: 'ACH – Chase ****8810',
    onboardingStatus: 'pending_review',
    createdDate: '2025-02-01',
    approvedDate: null,
    users: [],
  },
  {
    id: 'v003',
    companyName: 'TechGear Pro Inc.',
    brandName: 'TechGear',
    contactName: 'Jordan Lee',
    contactEmail: 'jordan@techgearpro.com',
    phone: '(512) 555-6677',
    website: 'www.techgearpro.com',
    address: '400 Innovation Blvd, Austin, TX 78701',
    taxId: '74-4561230',
    paymentDetails: 'ACH – Wells Fargo ****3301',
    onboardingStatus: 'approved',
    createdDate: '2024-12-05',
    approvedDate: '2024-12-12',
    users: ['u003'],
  },
  {
    id: 'v004',
    companyName: 'Bloom Beauty Group',
    brandName: 'Bloom',
    contactName: 'Camille Dubois',
    contactEmail: 'camille@bloombeauty.com',
    phone: '(212) 555-4400',
    website: 'www.bloombeauty.com',
    address: '55 Fifth Ave, New York, NY 10003',
    taxId: '',
    paymentDetails: '',
    onboardingStatus: 'incomplete',
    createdDate: '2025-01-20',
    approvedDate: null,
    users: [],
  },
  {
    id: 'v005',
    companyName: 'NatureFit Nutrition',
    brandName: 'NatureFit',
    contactName: 'Derek Hall',
    contactEmail: 'derek@naturefit.com',
    phone: '(720) 555-1188',
    website: 'www.naturefit.com',
    address: '7 Health Way, Denver, CO 80203',
    taxId: '84-7654321',
    paymentDetails: 'ACH – Citi ****7722',
    onboardingStatus: 'submitted',
    createdDate: '2025-03-01',
    approvedDate: null,
    users: [],
  },
]

// ─── PRODUCTS ─────────────────────────────────────────────────────────────────
export const products = [
  // Acme Outdoors
  { id: 'p001', vendorId: 'v001', vendorSKU: 'ACM-TN-001', internalSKU: 'SND-10041', upc: '012345600001', productName: 'Trail Navigator Backpack 45L', description: 'Durable 45L hiking backpack with frame support', category: 'Backpacks', cost: 48.00, msrp: 119.99, map: 99.99, quantityOnHand: 312, imageUrl: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=400', channelAvailability: ['Amazon', 'Website', 'Wholesale'], status: 'active', lastUpdated: '2025-02-14' },
  { id: 'p002', vendorId: 'v001', vendorSKU: 'ACM-TN-002', internalSKU: 'SND-10042', upc: '012345600002', productName: 'Summit Sleeping Bag -10°F', description: 'Mummy-style sleeping bag rated to -10°F', category: 'Sleeping Gear', cost: 62.00, msrp: 159.99, map: 139.99, quantityOnHand: 88, imageUrl: 'https://images.unsplash.com/photo-1504851149312-7a075b496cc7?w=400', channelAvailability: ['Amazon', 'Website'], status: 'active', lastUpdated: '2025-02-14' },
  { id: 'p003', vendorId: 'v001', vendorSKU: 'ACM-TN-003', internalSKU: 'SND-10043', upc: '012345600003', productName: 'Ultralight Trekking Poles (Pair)', description: 'Carbon fiber trekking poles, collapsible', category: 'Accessories', cost: 28.00, msrp: 74.99, map: 64.99, quantityOnHand: 0, imageUrl: 'https://images.unsplash.com/photo-1551632436-cbf8dd35adfa?w=400', channelAvailability: ['Amazon'], status: 'out_of_stock', lastUpdated: '2025-01-30' },
  { id: 'p004', vendorId: 'v001', vendorSKU: 'ACM-TN-004', internalSKU: 'SND-10044', upc: '012345600004', productName: 'Hydration Pack 2L', description: '2L water reservoir hydration backpack', category: 'Backpacks', cost: 22.00, msrp: 54.99, map: 49.99, quantityOnHand: 204, imageUrl: '', channelAvailability: ['Amazon', 'Website', 'Wholesale'], status: 'active', lastUpdated: '2025-02-20' },
  { id: 'p005', vendorId: 'v001', vendorSKU: 'ACM-TN-005', internalSKU: 'SND-10045', upc: '012345600005', productName: 'Waterproof Camp Lantern', description: 'LED lantern, 500 lumens, IPX6 waterproof', category: 'Lighting', cost: 14.50, msrp: 39.99, map: 34.99, quantityOnHand: 155, imageUrl: '', channelAvailability: ['Amazon', 'Website'], status: 'active', lastUpdated: '2025-02-14' },
  { id: 'p006', vendorId: 'v001', vendorSKU: 'ACM-TN-006', internalSKU: '', upc: '', productName: 'All-Weather Base Layer Set', description: 'Merino wool base layer, top + bottom', category: 'Apparel', cost: 38.00, msrp: 99.99, map: 89.99, quantityOnHand: 60, imageUrl: '', channelAvailability: [], status: 'pending_review', lastUpdated: '2025-03-05' },
  { id: 'p007', vendorId: 'v001', vendorSKU: 'ACM-TN-007', internalSKU: 'SND-10047', upc: '012345600007', productName: 'Bear Canister 700ci', description: 'Lightweight bear-resistant food canister', category: 'Accessories', cost: 31.00, msrp: 79.99, map: 69.99, quantityOnHand: 42, imageUrl: '', channelAvailability: ['Amazon'], status: 'active', lastUpdated: '2025-01-15' },
  { id: 'p008', vendorId: 'v001', vendorSKU: 'ACM-TN-008', internalSKU: 'SND-10048', upc: '012345600008', productName: 'Compact First Aid Kit', description: '100-piece wilderness first aid kit', category: 'Safety', cost: 12.00, msrp: 34.99, map: 29.99, quantityOnHand: 290, imageUrl: '', channelAvailability: ['Amazon', 'Website', 'Wholesale'], status: 'active', lastUpdated: '2025-02-14' },
  { id: 'p009', vendorId: 'v001', vendorSKU: 'ACM-TN-009', internalSKU: 'SND-10049', upc: '012345600009', productName: 'Titanium Camp Cookset', description: '4-piece titanium pot and pan set', category: 'Cooking', cost: 44.00, msrp: 109.99, map: 94.99, quantityOnHand: 0, imageUrl: '', channelAvailability: ['Amazon'], status: 'discontinued', lastUpdated: '2024-12-01' },
  { id: 'p010', vendorId: 'v001', vendorSKU: 'ACM-TN-010', internalSKU: '', upc: '', productName: 'Solar Charging Panel 21W', description: 'Foldable 21W solar charger for devices', category: 'Electronics', cost: 29.00, msrp: 74.99, map: null, quantityOnHand: 75, imageUrl: '', channelAvailability: [], status: 'draft', lastUpdated: '2025-03-10' },
  // TechGear Pro
  { id: 'p011', vendorId: 'v003', vendorSKU: 'TGP-HW-001', internalSKU: 'SND-20011', upc: '098765400001', productName: 'ProTrack GPS Watch', description: 'Multi-sport GPS watch with HR monitoring', category: 'Wearables', cost: 95.00, msrp: 249.99, map: 219.99, quantityOnHand: 180, imageUrl: '', channelAvailability: ['Amazon', 'Website'], status: 'active', lastUpdated: '2025-02-01' },
  { id: 'p012', vendorId: 'v003', vendorSKU: 'TGP-HW-002', internalSKU: 'SND-20012', upc: '098765400002', productName: 'Wireless Earbuds Sport', description: 'IPX7 waterproof wireless earbuds', category: 'Audio', cost: 32.00, msrp: 89.99, map: 79.99, quantityOnHand: 340, imageUrl: '', channelAvailability: ['Amazon', 'Website', 'Wholesale'], status: 'active', lastUpdated: '2025-02-01' },
  { id: 'p013', vendorId: 'v003', vendorSKU: 'TGP-HW-003', internalSKU: 'SND-20013', upc: '098765400003', productName: 'Portable Power Bank 26800mAh', description: '26800mAh power bank, 65W PD charging', category: 'Accessories', cost: 28.00, msrp: 69.99, map: 59.99, quantityOnHand: 0, imageUrl: '', channelAvailability: ['Amazon'], status: 'out_of_stock', lastUpdated: '2025-01-20' },
  { id: 'p014', vendorId: 'v003', vendorSKU: 'TGP-HW-004', internalSKU: 'SND-20014', upc: '098765400004', productName: 'Smart Scale with App Sync', description: 'Bluetooth body composition scale', category: 'Health', cost: 21.00, msrp: 54.99, map: 44.99, quantityOnHand: 220, imageUrl: '', channelAvailability: ['Amazon', 'Website'], status: 'active', lastUpdated: '2025-02-08' },
  { id: 'p015', vendorId: 'v003', vendorSKU: 'TGP-HW-005', internalSKU: '', upc: '', productName: 'Noise-Cancelling Headphones', description: 'Over-ear ANC headphones, 40hr battery', category: 'Audio', cost: 58.00, msrp: 149.99, map: 129.99, quantityOnHand: 90, imageUrl: '', channelAvailability: [], status: 'pending_review', lastUpdated: '2025-03-08' },
]

// ─── SALES RECORDS ────────────────────────────────────────────────────────────
export const salesRecords = [
  { id: 's001', vendorId: 'v001', productId: 'p001', channel: 'Amazon', unitsSold: 42, vendorCostAmount: 2016.00, salePeriod: '2025-01' },
  { id: 's002', vendorId: 'v001', productId: 'p002', channel: 'Amazon', unitsSold: 18, vendorCostAmount: 1116.00, salePeriod: '2025-01' },
  { id: 's003', vendorId: 'v001', productId: 'p004', channel: 'Amazon', unitsSold: 55, vendorCostAmount: 1210.00, salePeriod: '2025-01' },
  { id: 's004', vendorId: 'v001', productId: 'p005', channel: 'Website', unitsSold: 30, vendorCostAmount: 435.00, salePeriod: '2025-01' },
  { id: 's005', vendorId: 'v001', productId: 'p001', channel: 'Amazon', unitsSold: 61, vendorCostAmount: 2928.00, salePeriod: '2025-02' },
  { id: 's006', vendorId: 'v001', productId: 'p002', channel: 'Website', unitsSold: 22, vendorCostAmount: 1364.00, salePeriod: '2025-02' },
  { id: 's007', vendorId: 'v001', productId: 'p004', channel: 'Wholesale', unitsSold: 80, vendorCostAmount: 1760.00, salePeriod: '2025-02' },
  { id: 's008', vendorId: 'v001', productId: 'p008', channel: 'Amazon', unitsSold: 110, vendorCostAmount: 1320.00, salePeriod: '2025-02' },
  { id: 's009', vendorId: 'v001', productId: 'p001', channel: 'Wholesale', unitsSold: 35, vendorCostAmount: 1680.00, salePeriod: '2025-03' },
  { id: 's010', vendorId: 'v001', productId: 'p005', channel: 'Amazon', unitsSold: 48, vendorCostAmount: 696.00, salePeriod: '2025-03' },
  { id: 's011', vendorId: 'v003', productId: 'p011', channel: 'Amazon', unitsSold: 24, vendorCostAmount: 2280.00, salePeriod: '2025-02' },
  { id: 's012', vendorId: 'v003', productId: 'p012', channel: 'Website', unitsSold: 67, vendorCostAmount: 2144.00, salePeriod: '2025-02' },
  { id: 's013', vendorId: 'v003', productId: 'p014', channel: 'Amazon', unitsSold: 38, vendorCostAmount: 798.00, salePeriod: '2025-03' },
]

// ─── PAYMENT RECORDS ──────────────────────────────────────────────────────────
export const paymentRecords = [
  { id: 'pay001', vendorId: 'v001', paymentPeriod: 'November 2024', amountEarned: 8240.00, adjustments: -120.00, amountApproved: 8120.00, amountPaid: 8120.00, paymentDate: '2024-12-15', paymentStatus: 'paid', referenceNumber: 'REF-2024-1115', documentId: 'doc004' },
  { id: 'pay002', vendorId: 'v001', paymentPeriod: 'December 2024', amountEarned: 10580.00, adjustments: 0, amountApproved: 10580.00, amountPaid: 10580.00, paymentDate: '2025-01-15', paymentStatus: 'paid', referenceNumber: 'REF-2025-0115', documentId: 'doc005' },
  { id: 'pay003', vendorId: 'v001', paymentPeriod: 'January 2025', amountEarned: 6761.00, adjustments: -45.00, amountApproved: 6716.00, amountPaid: 6716.00, paymentDate: '2025-02-15', paymentStatus: 'paid', referenceNumber: 'REF-2025-0215', documentId: 'doc006' },
  { id: 'pay004', vendorId: 'v001', paymentPeriod: 'February 2025', amountEarned: 8372.00, adjustments: 0, amountApproved: 8372.00, amountPaid: 8372.00, paymentDate: '2025-03-15', paymentStatus: 'paid', referenceNumber: 'REF-2025-0315', documentId: 'doc007' },
  { id: 'pay005', vendorId: 'v001', paymentPeriod: 'March 2025', amountEarned: 2376.00, adjustments: 0, amountApproved: 2376.00, amountPaid: null, paymentDate: null, paymentStatus: 'approved', referenceNumber: 'REF-2025-0415', documentId: null },
  { id: 'pay006', vendorId: 'v003', paymentPeriod: 'February 2025', amountEarned: 5222.00, adjustments: -200.00, amountApproved: 5022.00, amountPaid: 5022.00, paymentDate: '2025-03-15', paymentStatus: 'paid', referenceNumber: 'REF-2025-TGP-02', documentId: 'doc010' },
  { id: 'pay007', vendorId: 'v003', paymentPeriod: 'March 2025', amountEarned: 798.00, adjustments: 0, amountApproved: null, amountPaid: null, paymentDate: null, paymentStatus: 'pending', referenceNumber: null, documentId: null },
]

// ─── DOCUMENTS ────────────────────────────────────────────────────────────────
export const documents = [
  { id: 'doc001', vendorId: 'v001', fileName: 'Acme_W9_2024.pdf', documentType: 'W-9 / Tax Form', uploadedBy: 'Sarah Chen', uploadedByRole: 'vendor_user', uploadDate: '2024-11-10', fileSize: '245 KB', notes: 'W-9 for 2024 tax year' },
  { id: 'doc002', vendorId: 'v001', fileName: 'Acme_Insurance_COI_2025.pdf', documentType: 'Compliance / Insurance', uploadedBy: 'Mike Torres', uploadedByRole: 'vendor_admin', uploadDate: '2024-11-12', fileSize: '1.2 MB', notes: 'Certificate of insurance, valid through Dec 2025' },
  { id: 'doc003', vendorId: 'v001', fileName: 'Acme_Catalog_Q1_2025.xlsx', documentType: 'Product Catalog', uploadedBy: 'Sarah Chen', uploadedByRole: 'vendor_user', uploadDate: '2025-01-05', fileSize: '88 KB', notes: 'Q1 2025 product catalog' },
  { id: 'doc004', vendorId: 'v001', fileName: 'Senditures_Remittance_Nov2024.pdf', documentType: 'Remittance Statement', uploadedBy: 'Alex Rivera', uploadedByRole: 'internal_admin', uploadDate: '2024-12-15', fileSize: '180 KB', notes: 'November 2024 payment remittance' },
  { id: 'doc005', vendorId: 'v001', fileName: 'Senditures_Remittance_Dec2024.pdf', documentType: 'Remittance Statement', uploadedBy: 'Alex Rivera', uploadedByRole: 'internal_admin', uploadDate: '2025-01-15', fileSize: '192 KB', notes: 'December 2024 payment remittance' },
  { id: 'doc006', vendorId: 'v001', fileName: 'Senditures_Remittance_Jan2025.pdf', documentType: 'Remittance Statement', uploadedBy: 'Alex Rivera', uploadedByRole: 'internal_admin', uploadDate: '2025-02-15', fileSize: '175 KB', notes: 'January 2025 payment remittance' },
  { id: 'doc007', vendorId: 'v001', fileName: 'Senditures_Remittance_Feb2025.pdf', documentType: 'Remittance Statement', uploadedBy: 'Alex Rivera', uploadedByRole: 'internal_admin', uploadDate: '2025-03-15', fileSize: '201 KB', notes: 'February 2025 payment remittance' },
  { id: 'doc008', vendorId: 'v001', fileName: 'Vendor_Agreement_Acme_2024.pdf', documentType: 'Agreement / Notice', uploadedBy: 'Alex Rivera', uploadedByRole: 'internal_admin', uploadDate: '2024-11-18', fileSize: '320 KB', notes: 'Signed vendor agreement' },
  { id: 'doc009', vendorId: 'v002', fileName: 'FreshScents_W9_2025.pdf', documentType: 'W-9 / Tax Form', uploadedBy: 'Priya Patel', uploadedByRole: 'vendor_user', uploadDate: '2025-02-01', fileSize: '230 KB', notes: '' },
  { id: 'doc010', vendorId: 'v003', fileName: 'Senditures_Remittance_Feb2025_TGP.pdf', documentType: 'Remittance Statement', uploadedBy: 'Alex Rivera', uploadedByRole: 'internal_admin', uploadDate: '2025-03-15', fileSize: '155 KB', notes: 'February 2025 remittance for TechGear' },
]

// ─── NOTIFICATIONS ────────────────────────────────────────────────────────────
export const notifications = [
  { id: 'n001', vendorId: 'v001', allVendors: false, title: 'February Payment Posted', message: 'Your February 2025 payment of $8,372.00 has been approved and is scheduled for deposit on March 15. Please check the Payments section for your remittance statement.', type: 'payout_posted', createdBy: 'Alex Rivera', createdDate: '2025-03-14', read: true },
  { id: 'n002', vendorId: 'v001', allVendors: false, title: 'Inventory Update Reminder', message: 'Please update your inventory quantities in the Catalog section. We noticed several products may be out of date based on recent sales activity.', type: 'inventory_reminder', createdBy: 'Alex Rivera', createdDate: '2025-03-10', read: false },
  { id: 'n003', vendorId: null, allVendors: true, title: 'Spring 2025 Catalog Deadline', message: 'All vendors: please submit your Spring 2025 product catalogs and updated price sheets by March 31, 2025. Use the Catalog section to upload your files.', type: 'general_announcement', createdBy: 'Alex Rivera', createdDate: '2025-03-05', read: false },
  { id: 'n004', vendorId: 'v001', allVendors: false, title: 'Catalog Issue – Correction Needed', message: 'Your recent catalog upload flagged 2 items with missing required fields (UPC and Internal SKU). Please review and re-upload a corrected file.', type: 'catalog_issue', createdBy: 'Alex Rivera', createdDate: '2025-02-28', read: true },
  { id: 'n005', vendorId: null, allVendors: true, title: 'Portal Maintenance Notice', message: 'The vendor portal will be unavailable for scheduled maintenance on Sunday, March 16 from 2–4 AM EST. We apologize for any inconvenience.', type: 'general_announcement', createdBy: 'Alex Rivera', createdDate: '2025-03-13', read: true },
  { id: 'n006', vendorId: 'v003', allVendors: false, title: 'January Payment Posted', message: 'Your February 2025 payment of $5,022.00 has been posted. See the Payments tab for your remittance document.', type: 'payout_posted', createdBy: 'Alex Rivera', createdDate: '2025-03-15', read: false },
]

// ─── IMPORT LOGS ──────────────────────────────────────────────────────────────
export const importLogs = [
  { id: 'imp001', vendorId: 'v001', vendorName: 'Acme Outdoors Co.', fileName: 'acme_catalog_march2025.csv', importType: 'catalog', status: 'success', rowsProcessed: 10, rowsFailed: 0, errorSummary: null, uploadedBy: 'Sarah Chen', uploadDate: '2025-03-10' },
  { id: 'imp002', vendorId: 'v001', vendorName: 'Acme Outdoors Co.', fileName: 'acme_inventory_update_feb.csv', importType: 'inventory', status: 'partial', rowsProcessed: 8, rowsFailed: 2, errorSummary: 'Row 4: missing required field "cost". Row 7: duplicate SKU "ACM-TN-003" already exists.', uploadedBy: 'Sarah Chen', uploadDate: '2025-02-28' },
  { id: 'imp003', vendorId: 'v003', vendorName: 'TechGear Pro Inc.', fileName: 'techgear_q1_catalog.csv', importType: 'catalog', status: 'success', rowsProcessed: 5, rowsFailed: 0, errorSummary: null, uploadedBy: 'Jordan Lee', uploadDate: '2025-03-08' },
  { id: 'imp004', vendorId: 'v001', vendorName: 'Acme Outdoors Co.', fileName: 'acme_catalog_v2_bad.csv', importType: 'catalog', status: 'failed', rowsProcessed: 0, rowsFailed: 6, errorSummary: 'Invalid file format. Column headers do not match required template. Expected: vendor_sku, product_name, cost, msrp, quantity_on_hand.', uploadedBy: 'Mike Torres', uploadDate: '2025-01-22' },
]

// ─── HELPERS ──────────────────────────────────────────────────────────────────
export const ONBOARDING_STATUSES = {
  draft: { label: 'Draft', color: 'gray' },
  submitted: { label: 'Submitted', color: 'blue' },
  pending_review: { label: 'Pending Review', color: 'amber' },
  approved: { label: 'Approved', color: 'green' },
  rejected: { label: 'Rejected', color: 'red' },
  incomplete: { label: 'Incomplete', color: 'orange' },
}

export const PRODUCT_STATUSES = {
  draft: { label: 'Draft', color: 'gray' },
  pending_review: { label: 'Pending Review', color: 'amber' },
  active: { label: 'Active', color: 'green' },
  out_of_stock: { label: 'Out of Stock', color: 'red' },
  discontinued: { label: 'Discontinued', color: 'slate' },
  rejected: { label: 'Rejected', color: 'red' },
}

export const PAYMENT_STATUSES = {
  pending: { label: 'Pending', color: 'amber' },
  approved: { label: 'Approved', color: 'blue' },
  paid: { label: 'Paid', color: 'green' },
  on_hold: { label: 'On Hold', color: 'orange' },
}

export const NOTIFICATION_TYPES = {
  inventory_reminder: 'Inventory Reminder',
  missing_docs: 'Missing Documents',
  payout_posted: 'Payout Posted',
  catalog_issue: 'Catalog Issue',
  general_announcement: 'General Announcement',
}

export const IMPORT_STATUSES = {
  success: { label: 'Success', color: 'green' },
  partial: { label: 'Partial', color: 'amber' },
  failed: { label: 'Failed', color: 'red' },
}
