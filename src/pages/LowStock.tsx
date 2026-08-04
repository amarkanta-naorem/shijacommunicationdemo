import { useState } from 'react';
import { Search, AlertTriangle, PackagePlus, Package, MoreHorizontal, ShieldCheck } from 'lucide-react';
import Header from '../components/Header';
import Badge, { statusBadge } from '../components/Badge';
import { products, suppliers } from '../data/mockData';

function warrantyStatus(p: any) {
  const w = p.warranty;
  if (!w || (!w.durationMonths && !w.durationYears)) return null;
  const today = new Date().toISOString().slice(0, 10);
  const end = w.extendedUntil && w.isExtended ? w.extendedUntil : w.endDate;
  if (end && end < today) return { active: false, end };
  return { active: true, end };
}

export default function LowStock() {
  const [search, setSearch] = useState('');
  const [severity, setSeverity] = useState('All');

  const lowStock = products.filter(p => p.currentStock < p.minStock);
  const critical = lowStock.filter(p => p.currentStock <= 1);

  const severities = ['All', 'Critical', 'Warning'];

  const filtered = lowStock.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.sku.toLowerCase().includes(search.toLowerCase());
    const isCrit = p.currentStock <= 1;
    const matchSev = severity === 'All' || (severity === 'Critical' && isCrit) || (severity === 'Warning' && !isCrit);
    return matchSearch && matchSev;
  });

  const supplierFor = (name: string) => suppliers.find(s => s.name === name);

  return (
    <div className="flex flex-col h-full">
      <Header
        title="Low Stock Alerts"
        breadcrumbs={[{ label: 'Inventory' }, { label: 'Low Stock' }]}
        primaryAction={{ label: 'Create PO', onClick: () => {} }}
        secondaryActions={[{ label: 'Export', onClick: () => {} }]}
        badge={{ label: `${lowStock.length} alerts`, color: '#DC2626' }}
      />

      <div className="flex-1 overflow-y-auto" style={{ background: '#F8FAFC' }}>
        <div className="px-6 py-4">
          {/* Stats */}
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { label: 'Low Stock Items', value: lowStock.length, sub: 'Below minimum threshold', color: '#D97706', bg: '#FEF3C7', icon: <AlertTriangle size={16} /> },
              { label: 'Critical', value: critical.length, sub: '1 or fewer units left', color: '#DC2626', bg: '#FEE2E2', icon: <AlertTriangle size={16} /> },
              { label: 'Recommended Orders', value: lowStock.length, sub: 'To restore min. stock', color: '#2563EB', bg: '#EFF6FF', icon: <PackagePlus size={16} /> },
            ].map((s, i) => (
              <div key={i} className="bg-white rounded-xl border px-5 py-4 flex items-center justify-between" style={{ borderColor: '#E2E8F0' }}>
                <div>
                  <div className="text-2xl font-bold" style={{ color: s.color }}>{s.value}</div>
                  <div className="text-xs" style={{ color: '#94A3B8' }}>{s.label}</div>
                  <div className="text-xs mt-1" style={{ color: '#CBD5E1' }}>{s.sub}</div>
                </div>
                <div className="w-10 h-10 rounded-lg flex items-center justify-center" style={{ background: s.bg }}>
                  {s.icon}
                </div>
              </div>
            ))}
          </div>

          <div className="bg-white rounded-xl border" style={{ borderColor: '#E2E8F0' }}>
            {/* Filters */}
            <div className="flex flex-wrap items-center gap-3 px-4 py-3 border-b" style={{ borderColor: '#F1F5F9' }}>
              <div className="flex items-center gap-2 flex-1 min-w-50 rounded-lg px-3 py-2 border" style={{ borderColor: '#E2E8F0', background: '#F8FAFC' }}>
                <Search size={14} style={{ color: '#94A3B8' }} />
                <input value={search} onChange={e => setSearch(e.target.value)}
                  placeholder="Search product or Part Number..." className="bg-transparent text-sm outline-none flex-1" />
              </div>
              <div className="flex items-center gap-1">
                {severities.map(s => (
                  <button key={s} onClick={() => setSeverity(s)}
                    className="text-xs px-3 py-1.5 rounded-lg font-medium transition-colors"
                    style={{ background: severity === s ? '#2563EB' : '#F1F5F9', color: severity === s ? 'white' : '#64748B' }}>
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs">
                <thead>
                  <tr style={{ background: '#F8FAFC' }}>
                    {['Part Number', 'Product', 'Supplier', 'Current Stock', 'Min Stock', 'To Reorder', 'Severity', 'Est. Value', 'Contact', ''].map(h => (
                      <th key={h} className="px-3 py-3 text-left font-semibold whitespace-nowrap" style={{ color: '#64748B' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map(p => {
                    const isCritical = p.currentStock <= 1;
                    const need = p.minStock * 2 - p.currentStock;
                    const sup = supplierFor(p.supplier);
                    return (
                      <tr key={p.id} className="border-t hover:bg-blue-50/30" style={{ borderColor: '#F1F5F9' }}>
                        <td className="px-3 py-3 font-mono" style={{ color: '#64748B' }}>{p.sku}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-1.5">
                            <div className="font-medium" style={{ color: '#0F172A' }}>{p.name}</div>
                            {warrantyStatus(p) && (
                              <span title={`Warranty ${warrantyStatus(p)!.active ? 'active' : 'expired'} — ends ${warrantyStatus(p)!.end}`}
                                style={{ color: warrantyStatus(p)!.active ? '#16A34A' : '#DC2626', display: 'inline-flex' }}>
                                <ShieldCheck size={12} />
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-3 py-3" style={{ color: '#475569' }}>{p.supplier}</td>
                        <td className="px-3 py-3">
                          <span className="font-bold text-sm" style={{ color: isCritical ? '#DC2626' : '#D97706' }}>{p.currentStock}</span>
                          <span className="text-xs" style={{ color: '#94A3B8' }}> {p.unit}</span>
                        </td>
                        <td className="px-3 py-3" style={{ color: '#475569' }}>{p.minStock}</td>
                        <td className="px-3 py-3 font-semibold" style={{ color: '#2563EB' }}>{need} {p.unit}</td>
                        <td className="px-3 py-3">
                          {isCritical ? <Badge label="Critical" variant="danger" /> : <Badge label="Warning" variant="warning" />}
                        </td>
                        <td className="px-3 py-3 font-semibold" style={{ color: '#0F172A' }}>₹{(p.unitPrice * need).toLocaleString()}</td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-semibold text-white" style={{ background: sup?.type === 'Fuel' ? '#0891B2' : '#2563EB' }}>
                              {sup?.contactPerson.split(' ').map(n => n[0]).join('').slice(0, 2)}
                            </div>
                            <div>
                              <div className="text-xs" style={{ color: '#0F172A' }}>{sup?.contactPerson}</div>
                              <div className="text-[10px]" style={{ color: '#94A3B8' }}>{sup?.phone}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <button className="p-1 rounded hover:bg-gray-100">
                            <MoreHorizontal size={15} style={{ color: '#94A3B8' }} />
                          </button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {filtered.length === 0 && (
              <div className="flex flex-col items-center justify-center py-16">
                <div className="w-14 h-14 rounded-2xl flex items-center justify-center mb-3" style={{ background: '#DCFCE7' }}>
                  <Package size={24} style={{ color: '#16A34A' }} />
                </div>
                <div className="text-sm font-medium" style={{ color: '#0F172A' }}>No low stock items</div>
                <div className="text-xs mt-1" style={{ color: '#94A3B8' }}>All products are above their minimum threshold</div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

