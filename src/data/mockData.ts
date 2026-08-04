export { products } from './productData';
export type { Product } from '../types/product';

export const stockInTransactions = [
  { id: 'SI-2025-001', date: '2025-07-28', product: 'Oil Filter - Mahindra 25kVA', sku: 'OFL-M25', qty: 20, unitPrice: 450, total: 9000, supplier: 'Mahindra', invoiceNo: 'INV-MH-4521', receivedBy: 'Rajesh Kumar', status: 'Completed' },
  { id: 'SI-2025-002', date: '2025-07-26', product: 'Engine Oil 15W40 - 5L', sku: 'EOL-15W', qty: 50, unitPrice: 320, total: 16000, supplier: 'TMTL', invoiceNo: 'INV-TM-1892', receivedBy: 'Suresh M.', status: 'Completed' },
  { id: 'SI-2025-003', date: '2025-07-25', product: 'Fuel Filter - TMTL 30kVA', sku: 'FFL-T30', qty: 10, unitPrice: 380, total: 3800, supplier: 'TMTL', invoiceNo: 'INV-TM-1891', receivedBy: 'Rajesh Kumar', status: 'Completed' },
  { id: 'SI-2025-004', date: '2025-07-22', product: 'Battery 12V 150Ah', sku: 'BAT-12V', qty: 3, unitPrice: 8500, total: 25500, supplier: 'Mahindra', invoiceNo: 'INV-MH-4508', receivedBy: 'Suresh M.', status: 'Completed' },
  { id: 'SI-2025-005', date: '2025-07-20', product: 'Coolant - 5L', sku: 'CLT-5L', qty: 30, unitPrice: 180, total: 5400, supplier: 'Mahindra', invoiceNo: 'INV-MH-4490', receivedBy: 'Rajesh Kumar', status: 'Completed' },
];

export const stockOutTransactions = [
  { id: 'SO-2025-001', date: '2025-07-29', product: 'Oil Filter - Mahindra 25kVA', sku: 'OFL-M25', qty: 2, unitPrice: 450, total: 900, issuedTo: 'Amit Verma', purpose: 'PM - Gen #G12', department: 'Operations', status: 'Issued' },
  { id: 'SO-2025-002', date: '2025-07-29', product: 'Engine Oil 15W40 - 5L', sku: 'EOL-15W', qty: 5, unitPrice: 320, total: 1600, issuedTo: 'Vikram Singh', purpose: 'PM - Gen #G08', department: 'Maintenance', status: 'Issued' },
  { id: 'SO-2025-003', date: '2025-07-27', product: 'Fuel Filter - TMTL 30kVA', sku: 'FFL-T30', qty: 3, unitPrice: 380, total: 1140, issuedTo: 'Manoj P.', purpose: 'CM - Gen #G03', department: 'Maintenance', status: 'Issued' },
  { id: 'SO-2025-004', date: '2025-07-26', product: 'V-Belt Set - 3PK885', sku: 'VBL-3PK', qty: 1, unitPrice: 750, total: 750, issuedTo: 'Amit Verma', purpose: 'CM - Gen #G15', department: 'Operations', status: 'Issued' },
  { id: 'SO-2025-005', date: '2025-07-24', product: 'Battery 12V 150Ah', sku: 'BAT-12V', qty: 1, unitPrice: 8500, total: 8500, issuedTo: 'Suresh M.', purpose: 'CM - Emergency', department: 'Maintenance', status: 'Issued' },
];

export const maintenanceJobs = [
  { id: 'WO-2025-089', type: 'PM', generator: 'DG-G12 (Mahindra 25kVA)', site: 'Site A - Block 3', technician: 'Amit Verma', scheduledDate: '2025-07-30', status: 'Scheduled', priority: 'Normal', runningHours: 2400 },
  { id: 'WO-2025-088', type: 'CM', generator: 'DG-G08 (TMTL 30kVA)', site: 'Site B - Block 1', technician: 'Vikram Singh', scheduledDate: '2025-07-29', status: 'In Progress', priority: 'High', runningHours: 3100, complaint: 'Overheating - Coolant level low' },
  { id: 'WO-2025-087', type: 'PM', generator: 'DG-G03 (Mahindra 15kVA)', site: 'Site A - Block 1', technician: 'Manoj P.', scheduledDate: '2025-07-28', status: 'Completed', priority: 'Normal', runningHours: 1800 },
  { id: 'WO-2025-086', type: 'CM', generator: 'DG-G15 (TMTL 25kVA)', site: 'Site C - Block 2', technician: 'Amit Verma', scheduledDate: '2025-07-27', status: 'Completed', priority: 'Critical', runningHours: 4200, complaint: 'Starting failure - Belt broken' },
  { id: 'WO-2025-085', type: 'PM', generator: 'DG-G21 (Mahindra 30kVA)', site: 'Site B - Block 3', technician: 'Vikram Singh', scheduledDate: '2025-07-25', status: 'Completed', priority: 'Normal', runningHours: 600 },
  { id: 'WO-2025-084', type: 'CM', generator: 'DG-G05 (TMTL 15kVA)', site: 'Site A - Block 2', technician: 'Manoj P.', scheduledDate: '2025-07-31', status: 'Scheduled', priority: 'High', runningHours: 2900, complaint: 'Oil pressure warning light' },
];

export const fuelTransactions = [
  { id: 'FI-2025-042', type: 'in', fuelType: 'Diesel', date: '2025-07-28', supplier: 'Bharat Petroleum', invoiceQty: 1000, actualQty: 995, lossQty: 5, tankBefore: 120, tankAfter: 1115, receivedBy: 'Rajesh Kumar', invoiceNo: 'BP-INV-8821', remarks: 'Regular monthly supply' },
  { id: 'FO-2025-061', type: 'out', fuelType: 'Diesel', date: '2025-07-29', qty: 50, issuedTo: 'Amit Verma', department: 'Maintenance', machine: 'DG-G12', stockBefore: 1115, stockAfter: 1065, remarks: 'PM operation' },
  { id: 'FO-2025-062', type: 'out', fuelType: 'Diesel', date: '2025-07-29', qty: 30, issuedTo: 'Vikram Singh', department: 'Maintenance', machine: 'DG-G08', stockBefore: 1065, stockAfter: 1035, remarks: 'Emergency CM run' },
  { id: 'FI-2025-041', type: 'in', fuelType: 'S/K', date: '2025-07-25', supplier: 'Indian Oil', invoiceQty: 200, actualQty: 198, lossQty: 2, tankBefore: 45, tankAfter: 243, receivedBy: 'Suresh M.', invoiceNo: 'IO-INV-3341', remarks: '' },
  { id: 'FO-2025-060', type: 'out', fuelType: 'S/K', date: '2025-07-26', qty: 20, issuedTo: 'Manoj P.', department: 'Operations', machine: 'Vehicle-04', stockBefore: 243, stockAfter: 223, remarks: '' },
];

export const inventoryTrend = [
  { month: 'Feb', stockIn: 42000, stockOut: 31000 },
  { month: 'Mar', stockIn: 38000, stockOut: 35000 },
  { month: 'Apr', stockIn: 55000, stockOut: 42000 },
  { month: 'May', stockIn: 48000, stockOut: 39000 },
  { month: 'Jun', stockIn: 62000, stockOut: 51000 },
  { month: 'Jul', stockIn: 59800, stockOut: 48000 },
];

export const fuelTrend = [
  { month: 'Feb', fuelIn: 2800, fuelOut: 2450, loss: 18 },
  { month: 'Mar', fuelIn: 3100, fuelOut: 2820, loss: 22 },
  { month: 'Apr', fuelIn: 2950, fuelOut: 2710, loss: 15 },
  { month: 'May', fuelIn: 3400, fuelOut: 3180, loss: 28 },
  { month: 'Jun', fuelIn: 3200, fuelOut: 2960, loss: 19 },
  { month: 'Jul', fuelIn: 1995, fuelOut: 1380, loss: 7 },
];

export const maintenanceStats = [
  { month: 'Feb', pm: 12, cm: 5 },
  { month: 'Mar', pm: 14, cm: 8 },
  { month: 'Apr', pm: 11, cm: 4 },
  { month: 'May', pm: 16, cm: 9 },
  { month: 'Jun', pm: 13, cm: 6 },
  { month: 'Jul', pm: 9, cm: 4 },
];

export const supplierContribution = [
  { name: 'Mahindra', value: 62, amount: 148000 },
  { name: 'TMTL', value: 38, amount: 91200 },
];

export const checklistItems = [
  { id: 'C01', component: 'Oil Filter', action: 'Inspect & Replace if due', category: 'Engine' },
  { id: 'C02', component: 'Fuel Filter', action: 'Inspect & Clean', category: 'Fuel System' },
  { id: 'C03', component: 'Air Filter', action: 'Clean or Replace', category: 'Air System' },
  { id: 'C04', component: 'Engine Oil', action: 'Check Level & Quality', category: 'Engine' },
  { id: 'C05', component: 'Battery Terminals', action: 'Inspect & Clean', category: 'Electrical' },
  { id: 'C06', component: 'Radiator', action: 'Check Coolant Level', category: 'Cooling' },
  { id: 'C07', component: 'Cooling System', action: 'Inspect Hoses & Clamps', category: 'Cooling' },
  { id: 'C08', component: 'Alternator', action: 'Check Output Voltage', category: 'Electrical' },
  { id: 'C09', component: 'Electrical Connections', action: 'Inspect & Tighten', category: 'Electrical' },
  { id: 'C10', component: 'Fuel System', action: 'Check for Leaks', category: 'Fuel System' },
  { id: 'C11', component: 'Performance Parameters', action: 'Record & Verify', category: 'Performance' },
  { id: 'C12', component: 'V-Belt / Alternator Belt', action: 'Check Tension', category: 'Engine' },
];

export const alerts = [
  { id: 1, type: 'low_stock', severity: 'warning', message: 'Fuel Filter (FFL-T30) below minimum stock', time: '2h ago', product: 'Fuel Filter - TMTL 30kVA' },
  { id: 2, type: 'low_stock', severity: 'danger', message: 'Alternator Belt (ALT-BLT) critically low — 1 unit remaining', time: '4h ago', product: 'Alternator Belt' },
  { id: 3, type: 'maintenance_due', severity: 'warning', message: 'DG-G12 PM scheduled for today — not yet started', time: '6h ago', generator: 'DG-G12' },
  { id: 4, type: 'fuel_threshold', severity: 'info', message: 'Diesel stock 1,035L — approaching reorder threshold', time: '1d ago' },
  { id: 5, type: 'cm_assigned', severity: 'info', message: 'WO-2025-084 assigned to Manoj P. — Oil pressure warning', time: '1d ago' },
];

export const generators = [
  { id: 'DG-G01', model: 'Mahindra 15kVA', site: 'Site A - Block 1', status: 'Running', lastPM: '2025-06-15', nextPM: '2025-09-15', runHours: 2240 },
  { id: 'DG-G03', model: 'Mahindra 15kVA', site: 'Site A - Block 1', status: 'Running', lastPM: '2025-07-28', nextPM: '2025-10-28', runHours: 1800 },
  { id: 'DG-G05', model: 'TMTL 15kVA', site: 'Site A - Block 2', status: 'Under Maintenance', lastPM: '2025-04-10', nextPM: '2025-07-10', runHours: 2900 },
  { id: 'DG-G08', model: 'TMTL 30kVA', site: 'Site B - Block 1', status: 'Under Maintenance', lastPM: '2025-05-20', nextPM: '2025-08-20', runHours: 3100 },
  { id: 'DG-G12', model: 'Mahindra 25kVA', site: 'Site A - Block 3', status: 'Running', lastPM: '2025-04-30', nextPM: '2025-07-30', runHours: 2400 },
  { id: 'DG-G15', model: 'TMTL 25kVA', site: 'Site C - Block 2', status: 'Running', lastPM: '2025-07-27', nextPM: '2025-10-27', runHours: 4200 },
  { id: 'DG-G21', model: 'Mahindra 30kVA', site: 'Site B - Block 3', status: 'Running', lastPM: '2025-07-25', nextPM: '2025-10-25', runHours: 600 },
];

// ---------------------------------------------------------------------------
// Categories
// ---------------------------------------------------------------------------
export const categories = [
  { id: 'PM', name: 'Preventive Maintenance', description: 'Scheduled maintenance spares for generator PM services', color: '#2563EB', bg: '#EFF6FF' },
  { id: 'CM', name: 'Complaint Maintenance', description: 'Breakdown repair parts for complaint maintenance jobs', color: '#D97706', bg: '#FEF3C7' },
  { id: 'General', name: 'General & Consumables', description: 'Common consumables and miscellaneous store items', color: '#64748B', bg: '#F1F5F9' },
];

// ---------------------------------------------------------------------------
// Suppliers
// ---------------------------------------------------------------------------
export const suppliers = [
  { id: 'SUP-001', name: 'Mahindra', type: 'Equipment', contactPerson: 'Rakesh Sharma', phone: '+91 98765 43210', email: 'sales@mahindra.com', location: 'Mumbai, MH', itemsSupplied: 5, totalValue: 148000, status: 'Active', leadTime: '5–7 days', lastOrder: '2025-07-28' },
  { id: 'SUP-002', name: 'TMTL', type: 'Equipment', contactPerson: 'Kavita Rao', phone: '+91 91234 56780', email: 'orders@tmtl.com', location: 'Pune, MH', itemsSupplied: 5, totalValue: 91200, status: 'Active', leadTime: '3–5 days', lastOrder: '2025-07-26' },
  { id: 'SUP-003', name: 'Bharat Petroleum', type: 'Fuel', contactPerson: 'Santosh Iyer', phone: '+91 90000 12345', email: 'b2b@bharatpetroleum.in', location: 'Guwahati, AS', itemsSupplied: 1, totalValue: 90000, status: 'Active', leadTime: 'Dispatch 24h', lastOrder: '2025-07-28' },
  { id: 'SUP-004', name: 'Indian Oil', type: 'Fuel', contactPerson: 'Dipankar Bora', phone: '+91 98765 00112', email: 'dms@iocl.co.in', location: 'Silchar, AS', itemsSupplied: 1, totalValue: 14000, status: 'Active', leadTime: 'Dispatch 24h', lastOrder: '2025-07-25' },
];

// ---------------------------------------------------------------------------
// Inventory History (combined ledger)
// ---------------------------------------------------------------------------
export const inventoryHistory = [
  ...stockInTransactions.map(t => ({ id: t.id, type: 'in' as const, date: t.date, time: '09:14 AM', product: t.product, sku: t.sku, qty: t.qty, unitPrice: t.unitPrice, total: t.total, party: t.supplier, ref: t.invoiceNo, person: t.receivedBy, status: t.status })),
  ...stockOutTransactions.map(t => ({ id: t.id, type: 'out' as const, date: t.date, time: '10:32 AM', product: t.product, sku: t.sku, qty: t.qty, unitPrice: t.unitPrice, total: t.total, party: t.issuedTo, ref: t.purpose, person: t.issuedTo, status: t.status })),
].sort((a, b) => `${b.date} ${b.time}`.localeCompare(`${a.date} ${a.time}`));

// ---------------------------------------------------------------------------
// Fuel stock tanks
// ---------------------------------------------------------------------------
export const fuelStock = [
  { id: 'diesel', name: 'Diesel', tankCapacity: 2000, currentStock: 1035, reorderLevel: 800, criticalLevel: 400, unit: 'L', status: 'Normal', color: '#7C3AED', bg: '#F3E8FF', lastUpdated: '2025-07-29 02:20 PM' },
  { id: 'sk', name: 'S/K', tankCapacity: 500, currentStock: 223, reorderLevel: 100, criticalLevel: 50, unit: 'L', status: 'Normal', color: '#0891B2', bg: '#ECFEFF', lastUpdated: '2025-07-26 11:00 AM' },
];

// ---------------------------------------------------------------------------
// Maintenance calendar events
// ---------------------------------------------------------------------------
export const calendarEvents = [
  ...maintenanceJobs.map(j => ({ id: j.id, date: j.scheduledDate, title: j.generator.split('(')[0].trim(), generator: j.generator, type: j.type, status: j.status, site: j.site, technician: j.technician })),
  { id: 'WO-2025-083', date: '2025-07-22', title: 'DG-G18', generator: 'DG-G18 (Mahindra 25kVA)', type: 'PM', status: 'Completed', site: 'Site C - Block 1', technician: 'Manoj P.' },
  { id: 'WO-2025-082', date: '2025-07-18', title: 'DG-G02', generator: 'DG-G02 (TMTL 15kVA)', type: 'CM', status: 'Completed', site: 'Site A - Block 2', technician: 'Vikram Singh' },
  { id: 'WO-2025-081', date: '2025-07-14', title: 'DG-G10', generator: 'DG-G10 (Mahindra 30kVA)', type: 'PM', status: 'Completed', site: 'Site B - Block 2', technician: 'Amit Verma' },
  { id: 'WO-2025-080', date: '2025-07-09', title: 'DG-G07', generator: 'DG-G07 (TMTL 20kVA)', type: 'PM', status: 'Completed', site: 'Site A - Block 3', technician: 'Manoj P.' },
  { id: 'WO-2025-079', date: '2025-07-06', title: 'DG-G14', generator: 'DG-G14 (Mahindra 15kVA)', type: 'CM', status: 'Completed', site: 'Site C - Block 2', technician: 'Vikram Singh' },
  { id: 'WO-2025-078', date: '2025-07-02', title: 'DG-G04', generator: 'DG-G04 (TMTL 25kVA)', type: 'PM', status: 'Completed', site: 'Site B - Block 1', technician: 'Amit Verma' },
];

// ---------------------------------------------------------------------------
// Role permissions matrix
// ---------------------------------------------------------------------------
export const permissionRoles = ['Administrator', 'Operations Manager', 'Store Keeper', 'Maintenance Engineer', 'Field Technician', 'Viewer'];

export const rolePermissions = [
  { module: 'Dashboard', roles: { Administrator: 'full', 'Operations Manager': 'full', 'Store Keeper': 'view', 'Maintenance Engineer': 'view', 'Field Technician': 'view', Viewer: 'view' } },
  { module: 'Inventory', roles: { Administrator: 'full', 'Operations Manager': 'view', 'Store Keeper': 'full', 'Maintenance Engineer': 'none', 'Field Technician': 'none', Viewer: 'view' } },
  { module: 'Maintenance', roles: { Administrator: 'full', 'Operations Manager': 'view', 'Store Keeper': 'none', 'Maintenance Engineer': 'full', 'Field Technician': 'edit', Viewer: 'view' } },
  { module: 'Fuel', roles: { Administrator: 'full', 'Operations Manager': 'edit', 'Store Keeper': 'edit', 'Maintenance Engineer': 'none', 'Field Technician': 'none', Viewer: 'view' } },
  { module: 'Reports', roles: { Administrator: 'full', 'Operations Manager': 'full', 'Store Keeper': 'view', 'Maintenance Engineer': 'view', 'Field Technician': 'none', Viewer: 'view' } },
  { module: 'Administration', roles: { Administrator: 'full', 'Operations Manager': 'none', 'Store Keeper': 'none', 'Maintenance Engineer': 'none', 'Field Technician': 'none', Viewer: 'none' } },
];
