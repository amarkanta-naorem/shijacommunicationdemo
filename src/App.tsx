import { useState, useMemo } from 'react';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import Products from './pages/Products';
import StockIn from './pages/StockIn';
import MaintenanceList from './pages/MaintenanceList';
import Checklist from './pages/Checklist';
import FuelPage from './pages/FuelPage';
import CurrentStock from './pages/CurrentStock';
import Reports from './pages/Reports';
import UserManagement from './pages/UserManagement';
import Categories from './pages/Categories';
import Suppliers from './pages/Suppliers';
import InventoryHistory from './pages/InventoryHistory';
import LowStock from './pages/LowStock';
import MaintenanceCalendar from './pages/MaintenanceCalendar';
import FuelStock from './pages/FuelStock';
import RolesPage from './pages/RolesPage';
import Settings from './pages/Settings';
import ReportDateRange from './pages/ReportDateRange';
import ReportProductWise from './pages/ReportProductWise';
import ReportSupplierWise from './pages/ReportSupplierWise';
import ReportMaintenance from './pages/ReportMaintenance';
import ReportFuel from './pages/ReportFuel';
import Header from './components/Header';
import { Search, MoreHorizontal, ChevronDown } from 'lucide-react';
import { stockOutTransactions, maintenanceJobs, generators } from './data/mockData';
import Badge, { statusBadge } from './components/Badge';

function StockOut() {
  const [search, setSearch] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [workOrder, setWorkOrder] = useState('');
  const filtered = stockOutTransactions.filter(t =>
    t.product.toLowerCase().includes(search.toLowerCase())
  );

  const { pmWorkOrders, cmWorkOrders } = useMemo(() => {
    const pm = maintenanceJobs.filter(j => j.type === 'PM');
    const cm = maintenanceJobs.filter(j => j.type === 'CM');
    return { pmWorkOrders: pm, cmWorkOrders: cm };
  }, []);

  if (showForm) return (
    <div className="flex flex-col h-full">
      <Header title="New Stock Out" breadcrumbs={[{ label: 'Inventory' }, { label: 'Stock Out' }, { label: 'Issue Material' }]}
        secondaryActions={[{ label: 'Cancel', onClick: () => setShowForm(false) }]}
        primaryAction={{ label: 'Issue', onClick: () => setShowForm(false) }} />
      <div className="flex-1 overflow-y-auto p-6" style={{ background: '#F8FAFC' }}>
        <div className="bg-white rounded-xl border p-6" style={{ borderColor: '#E2E8F0' }}>
          <div className="text-sm font-semibold mb-4" style={{ color: '#0F172A' }}>Issue Material</div>
          <div className="grid grid-cols-2 gap-4">
            {[
              { label: 'Product', type: 'search', placeholder: 'Select Product' },
              { label: 'Issued To', type: 'text', placeholder: 'Full name' },
              { label: 'Department', type: 'text', placeholder: 'e.g. Maintenance' },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs font-medium block mb-1.5" style={{ color: '#475569' }}>{f.label}</label>
                <input type={f.type === 'search' ? 'text' : f.type} placeholder={f.placeholder || `Select ${f.label}`}
                  className="w-full text-sm border rounded-lg px-3 py-2 outline-none" style={{ borderColor: '#E2E8F0' }} />
              </div>
            ))}
            <div>
              <label className="text-xs font-medium block mb-1.5" style={{ color: '#475569' }}>Work Order</label>
              <div className="relative w-full">
                <select
                  value={workOrder}
                  onChange={(e) => setWorkOrder(e.target.value)}
                  className="relative w-full appearance-none text-sm border rounded-lg px-3 py-2 pr-10 outline-none"
                  style={{ borderColor: "#E2E8F0", background: "#fff" }}
                >
                  <option value="">Select Work Order</option>

                  <optgroup label="Preventive (PM)">
                    {pmWorkOrders.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.id} — {j.generator} — {j.scheduledDate}
                      </option>
                    ))}
                  </optgroup>

                  <optgroup label="Complaint (CM)">
                    {cmWorkOrders.map((j) => (
                      <option key={j.id} value={j.id}>
                        {j.id} — {j.generator} — {j.scheduledDate}
                      </option>
                    ))}
                  </optgroup>
                </select>

                <ChevronDown
                  size={16}
                  className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500"
                />
              </div>
            </div>
            {[
              { label: 'Quantity', type: 'number', placeholder: '0' },
              { label: 'Date', type: 'date' },
            ].map(f => (
              <div key={f.label}>
                <label className="text-xs font-medium block mb-1.5" style={{ color: '#475569' }}>{f.label}</label>
                <input type={f.type === 'search' ? 'text' : f.type} placeholder={f.placeholder || `Select ${f.label}`}
                  className="w-full text-sm border rounded-lg px-3 py-2 outline-none" style={{ borderColor: '#E2E8F0' }} />
              </div>
            ))}
          </div>
          <div className="mt-4 p-3 rounded-lg" style={{ background: '#F8FAFC', border: '1px solid #E2E8F0' }}>
            <div className="text-xs" style={{ color: '#64748B' }}>Current Stock: <span className="font-semibold" style={{ color: '#16A34A' }}>12 Pcs</span> available</div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="flex flex-col h-full">
      <Header title="Stock Out" breadcrumbs={[{ label: 'Inventory' }, { label: 'Stock Out' }]}
        primaryAction={{ label: 'Issue Material', onClick: () => setShowForm(true) }}
        secondaryActions={[{ label: 'Export', onClick: () => {} }]} />
      <div className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
        <div className="px-6 py-4">
          <div className="bg-white rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
            <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: '#F1F5F9' }}>
              <div className="flex items-center gap-2 flex-1 rounded-lg px-3 py-2 border" style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}>
                <Search size={14} style={{ color: '#94A3B8' }} />
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search..."
                  className="bg-transparent text-sm outline-none flex-1" />
              </div>
            </div>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  {['Issue ID', 'Date', 'Product', 'Part Number', 'Qty', 'Unit Price', 'Total', 'Issued To', 'Purpose', 'Department', 'Status'].map(h => (
                    <th key={h} className="px-3 py-3 text-left font-semibold" style={{ color: '#64748B' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id} className="border-t hover:bg-blue-50/30" style={{ borderColor: '#F1F5F9' }}>
                    <td className="px-3 py-3 font-mono" style={{ color: '#DC2626' }}>{t.id}</td>
                    <td className="px-3 py-3" style={{ color: '#475569' }}>{t.date}</td>
                    <td className="px-3 py-3 font-medium" style={{ color: '#0F172A' }}>{t.product}</td>
                    <td className="px-3 py-3 font-mono" style={{ color: '#64748B' }}>{t.sku}</td>
                    <td className="px-3 py-3 font-semibold" style={{ color: '#DC2626' }}>-{t.qty}</td>
                    <td className="px-3 py-3" style={{ color: '#475569' }}>₹{t.unitPrice}</td>
                    <td className="px-3 py-3 font-semibold" style={{ color: '#0F172A' }}>₹{t.total.toLocaleString()}</td>
                    <td className="px-3 py-3" style={{ color: '#475569' }}>{t.issuedTo}</td>
                    <td className="px-3 py-3" style={{ color: '#64748B' }}>{t.purpose}</td>
                    <td className="px-3 py-3" style={{ color: '#475569' }}>{t.department}</td>
                    <td className="px-3 py-3"><Badge label={t.status} variant="success" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function WorkOrders({ onNavigate }: { onNavigate: (p: string) => void }) {
  return (
    <div className="flex flex-col h-full">
      <Header title="Work Orders" breadcrumbs={[{ label: 'Maintenance' }, { label: 'Work Orders' }]}
        primaryAction={{ label: 'New Work Order', onClick: () => {} }} />
      <div className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
        <div className="px-6 py-4">
          <div className="bg-white rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
            <table className="w-full text-xs">
              <thead>
                <tr style={{ background: '#F8FAFC' }}>
                  {['WO #', 'Type', 'Generator', 'Site', 'Technician', 'Date', 'Run Hrs', 'Priority', 'Status', ''].map(h => (
                    <th key={h} className="px-3 py-3 text-left font-semibold" style={{ color: '#64748B' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {maintenanceJobs.map(j => (
                  <tr key={j.id} className="border-t hover:bg-blue-50/30 cursor-pointer" style={{ borderColor: '#F1F5F9' }}
                    onClick={() => onNavigate('checklist')}>
                    <td className="px-3 py-3 font-mono" style={{ color: '#2563EB' }}>{j.id}</td>
                    <td className="px-3 py-3"><Badge label={j.type} variant={j.type === 'PM' ? 'info' : 'warning'} /></td>
                    <td className="px-3 py-3 font-medium" style={{ color: '#0F172A' }}>{j.generator}</td>
                    <td className="px-3 py-3" style={{ color: '#64748B' }}>{j.site}</td>
                    <td className="px-3 py-3" style={{ color: '#475569' }}>{j.technician}</td>
                    <td className="px-3 py-3" style={{ color: '#475569' }}>{j.scheduledDate}</td>
                    <td className="px-3 py-3 font-mono" style={{ color: '#64748B' }}>{j.runningHours.toLocaleString()}</td>
                    <td className="px-3 py-3">{statusBadge(j.priority)}</td>
                    <td className="px-3 py-3">{statusBadge(j.status)}</td>
                    <td className="px-3 py-3"><button onClick={e => e.stopPropagation()}><MoreHorizontal size={14} style={{ color: '#94A3B8' }} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}

function Generators() {
  return (
    <div className="flex flex-col h-full">
      <Header title="Generators" breadcrumbs={[{ label: 'Assets' }, { label: 'Generators' }]}
        primaryAction={{ label: 'Add Generator', onClick: () => {} }} />
      <div className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
        <div className="px-6 py-4">
          <div className="grid grid-cols-3 gap-4">
            {generators.map(g => (
              <div key={g.id} className="bg-white rounded-xl border p-5" style={{ borderColor: '#E2E8F0', boxShadow: '0 1px 3px rgba(0,0,0,0.04)' }}>
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <div className="text-sm font-semibold" style={{ color: '#0F172A' }}>{g.id}</div>
                    <div className="text-xs" style={{ color: '#64748B' }}>{g.model}</div>
                  </div>
                  {statusBadge(g.status)}
                </div>
                <div className="text-xs mb-3" style={{ color: '#94A3B8' }}>{g.site}</div>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div><span style={{ color: '#94A3B8' }}>Run Hours</span><br /><span className="font-semibold font-mono" style={{ color: '#0F172A' }}>{g.runHours.toLocaleString()} h</span></div>
                  <div><span style={{ color: '#94A3B8' }}>Last PM</span><br /><span className="font-semibold" style={{ color: '#0F172A' }}>{g.lastPM}</span></div>
                  <div className="col-span-2"><span style={{ color: '#94A3B8' }}>Next PM Due</span><br />
                    <span className="font-semibold" style={{ color: g.nextPM <= '2025-07-31' ? '#DC2626' : '#16A34A' }}>{g.nextPM}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function GenericPage({ title, breadcrumb }: { title: string; breadcrumb: string }) {
  return (
    <div className="flex flex-col h-full">
      <Header title={title} breadcrumbs={[{ label: breadcrumb }, { label: title }]} />
      <div className="flex-1 flex items-center justify-center" style={{ background: '#F8FAFC' }}>
        <div className="text-center">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: '#F1F5F9' }}>
            <Search size={24} style={{ color: '#CBD5E1' }} />
          </div>
          <div className="text-sm font-medium" style={{ color: '#0F172A' }}>{title}</div>
          <div className="text-xs mt-1" style={{ color: '#94A3B8' }}>This module is ready for data</div>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [page, setPage] = useState('dashboard');

  const renderPage = () => {
    switch (page) {
      case 'dashboard': return <Dashboard onNavigate={setPage} />;
      case 'products': return <Products onNavigate={setPage} />;
      case 'stock-in': return <StockIn />;
      case 'stock-out': return <StockOut />;
      case 'current-stock': return <CurrentStock />;
      case 'preventive-maintenance': return <MaintenanceList type="PM" onNavigate={setPage} />;
      case 'complaint-maintenance': return <MaintenanceList type="CM" onNavigate={setPage} />;
      case 'checklist': return <Checklist onNavigate={setPage} />;
      case 'work-orders': return <WorkOrders onNavigate={setPage} />;
      case 'fuel-in': return <FuelPage view="in" />;
      case 'fuel-out': return <FuelPage view="out" />;
      case 'fuel-history': return <FuelPage view="history" />;
      case 'report-overall':
      case 'reports': return <Reports />;
      case 'report-date': return <ReportDateRange />;
      case 'report-product': return <ReportProductWise />;
      case 'report-supplier': return <ReportSupplierWise />;
      case 'report-maintenance': return <ReportMaintenance />;
      case 'report-fuel': return <ReportFuel />;
      case 'users': return <UserManagement />;
      case 'categories': return <Categories />;
      case 'suppliers': return <Suppliers />;
      case 'inventory-history': return <InventoryHistory />;
      case 'low-stock': return <LowStock />;
      case 'calendar': return <MaintenanceCalendar />;
      case 'diesel': return <FuelStock fuel="diesel" />;
      case 'sk': return <FuelStock fuel="sk" />;
      case 'roles': return <RolesPage />;
      case 'settings': return <Settings />;
      default: return <GenericPage title={page} breadcrumb="Shija Communication" />;
    }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#F8FAFC' }}>
      <Sidebar activePage={page} onNavigate={setPage} />
      <main className="flex-1 flex flex-col overflow-hidden">
        {renderPage()}
      </main>
    </div>
  );
}
